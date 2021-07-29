import {
  NativeBaseProvider,
  FormControl,
  Input,
  Button,
  Icon,
  HStack,
  Box,
  Text,
  VStack,
  FlatList,
  useDisclose,
  Actionsheet,
  Fab,
  Divider,
  Pressable,
} from 'native-base';

import * as React from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ImageLoad from '../universal/ImageLoad';
import {Dimensions, Linking} from 'react-native';
import Resource from './../universal/Resource';
import AsyncStorage from '@react-native-community/async-storage';
import {BASE_URL} from './../../utilitas/Config';
import FooterLoading from './../universal/FooterLoading';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import EmptyCart from './../universal/EmptyCart';
import AlertYesNoV2 from '../universal/AlertYesNoV2';

export default class LaporanTransaksiUser extends React.Component {
  constructor(props) {
    super(props);
    this.setFilterStatus = this.setFilterStatus.bind(this);
    this.state = {
      cari: '',
      pencarian: '',
      tglAwal: moment(new Date()).format('YYYY-MM-DD'),
      tglAkhir: moment(new Date()).format('YYYY-MM-DD'),
      showAwal: false,
      showAkhir: false,
      hasMoreOrder: false,
      id: '',
      initialLoading: true,
      limit: 10,
      statusorder: '',
      refresh: new Date(),
    };
  }

  setFilterStatus(status) {
    this.setState({statusOrder: status});
  }

  async componentDidMount() {
    let user = await AsyncStorage.getItem('id');
    console.log(user);
    this.setState({
      id: user,
      initialLoading: false,
    });
  }

  render() {
    const {
      initialLoading,
      id,
      limit,
      tglAwal,
      tglAkhir,
      statusOrder,
      pencarian,
    } = this.state;
    return (
      <NativeBaseProvider>
        <AlertYesNoV2 ref={ref => (this.dialog = ref)} />
        <Box bg="white" flex={1} pt={2}>
          <FilterTransaksi filter={this.setFilterStatus} />
          {this.searchBox()}
          {this.dateBox()}
          {!initialLoading && (
            <Resource
              url={`${BASE_URL()}/order/user/${id}`}
              params={{
                limit,
                cari: pencarian,
                startdate: tglAwal,
                enddate: tglAkhir,
                status: statusOrder,
              }}>
              {({loading, error, payload: data, refetch, fetchMore}) => {
                if (loading) {
                  return (
                    <Box flex={1} justifyContent="center">
                      <FooterLoading full />
                    </Box>
                  );
                }
                if (!data.data.length) {
                  return (
                    <EmptyCart
                      title="Data tidak ditemukan"
                      description="Data yang anda cari tidak ditemukan, Coba cari kata kunci yang lain."
                      icon={
                        <Icon
                          as={MaterialCommunityIcons}
                          name="file-search"
                          size="lg"
                          color="#555"
                        />
                      }
                      refreshButton
                      onRefresh={refetch}
                    />
                  );
                }

                let nextOffset = data.data.length;
                return (
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    data={[...data.data]}
                    flex={1}
                    keyExtractor={(item, index) => item.id}
                    refreshing={false}
                    onRefresh={() => {
                      this.setState({hasMoreOrder: true});
                      refetch();
                    }}
                    renderItem={({item}) => this.itemOrder(item)}
                    onContentSizeChange={() => {
                      if (data.data.length == 0) {
                        this.setState({hasMoreOrder: false});
                      }
                    }}
                    onEndReachedThreshold={0.01}
                    onEndReached={({distanceFromEnd}) => {
                      if (data.data.length) {
                        fetchMore(
                          {offset: nextOffset},
                          (newPayload, oldPayload) => {
                            // console.warn(newPayload);
                            if (newPayload.data < limit) {
                              this.setState({hasMoreOrder: false});
                            }
                            return {
                              ...oldPayload,
                              data: [...oldPayload.data, ...newPayload.data],
                            };
                          },
                        );
                      }
                    }}
                    ListFooterComponent={
                      this.state.hasMoreOrder ? <FooterLoading /> : null
                    }
                  />
                );
              }}
            </Resource>
          )}
        </Box>
      </NativeBaseProvider>
    );
  }

  getStatus = code => {
    let statusOrder = '';
    switch (code) {
      case -1:
        statusOrder = 'Pesanan dibatalkan';
        break;

      case 1:
        statusOrder = 'Menunggu Konfirmasi';
        break;
      case 2:
        statusOrder = 'Pesanan Ditolak';
        break;
      case 3:
        statusOrder = 'Pesanan Diterima';
        break;
      case 4:
        statusOrder = 'Siap Diantar';
        break;
      case 5:
        statusOrder = 'Sedang Diantar';
        break;
      case 6:
        statusOrder = 'Sudah Diantar';
        break;
      case 7:
        statusOrder = 'Pesanan Selesai';
        break;
    }
    return statusOrder;
  };

  batalOrder = id => {
    this.dialog.show(
      {message: 'Anda yakin untuk membatalkan pesanan ini ?'},
      async () => {
        setLoadingAksi(true);
        axios
          .put(`${BASE_URL()}/order/batalkan/${id}`)
          .then(({data}) => {
            this.setState({refresh: new Date()});
          })
          .catch(e => {});
      },
    );
  };

  getAksiOrder = (code, telp, id) => {
    return (
      <HStack mt={3} space={2} px={4}>
        <SheetAksiOrder telp={telp} />
        {code == 1 && (
          <Button
            size="sm"
            colorScheme="danger"
            _text={{color: 'white'}}
            onPress={() => this.batalOrder(id)}
            flex={1}>
            Batalkan Pesanan
          </Button>
        )}
        {code == 6 && (
          <Button
            size="sm"
            colorScheme="success"
            _text={{color: 'white'}}
            onPress={() => {}}
            flex={1}>
            Selesai Pesanan
          </Button>
        )}
      </HStack>
    );
  };

  itemOrder = item => {
    const widthImage = 0.15 * Dimensions.get('window').width;
    const image = BASE_URL() + '/image/merchant/' + item.foto_merchant;
    return (
      <Pressable
        onPress={() =>
          this.props.navigation.navigate('DetailTransaksi', {
            idorder: item.id,
          })
        }>
        <Box py={2} mt={4}>
          <HStack space={3}>
            <ImageLoad
              round={widthImage / 4}
              url={image}
              w={widthImage}
              h={widthImage}
              mx={3}
            />
            <VStack>
              <Text fontSize="xs" color="#0000FF">
                {item.no_faktur}
              </Text>
              <Text fontSize="xs" color="grey">
                {moment(item.tgl_order).format('DD MMMM yyyy')}
              </Text>
              <Text>{item.nama_toko}</Text>
              <Text fontSize="xs" color="grey">
                {this.getStatus(item.status)}
              </Text>
            </VStack>
          </HStack>
          {this.getAksiOrder(item.status, item.no_telp)}
          <Divider my={2} />
        </Box>
      </Pressable>
    );
  };

  dateBox = () => {
    const {tglAkhir, tglAwal, showAwal, showAkhir} = this.state;
    return (
      <>
        <HStack px={3} alignItems="center" mt={2}>
          <Button
            flex={1}
            size="sm"
            variant="outline"
            onPress={() => {
              this.setState({showAwal: true});
            }}>
            {tglAwal}
          </Button>
          <Text fontSize="lg" mx={2}>
            -
          </Text>
          <Button
            flex={1}
            size="sm"
            variant="outline"
            onPress={() => {
              this.setState({showAkhir: true});
            }}>
            {tglAkhir}
          </Button>
        </HStack>
        {showAwal && (
          <DateTimePicker
            testID="dateTimePicker"
            value={new Date(tglAwal)}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              const currentDate = selectedDate || tglAwal;

              this.setState({
                tglAwal: moment(currentDate).format('YYYY-MM-DD'),
                showAwal: false,
              });
            }}
          />
        )}
        {showAkhir && (
          <DateTimePicker
            testID="dateTimePicker"
            value={new Date(tglAkhir)}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              const currentDate = selectedDate || tglAkhir;

              this.setState({
                tglAkhir: moment(currentDate).format('YYYY-MM-DD'),
                showAkhir: false,
              });
            }}
          />
        )}
      </>
    );
  };

  searchBox = () => (
    <FormControl px={4} my={2}>
      <Input
        size="sm"
        fontSize="sm"
        placeholder="Cari Faktur atau Nama Toko"
        value={this.state.cari}
        onChangeText={e => this.setState({cari: e})}
        onSubmitEditing={e => this.refreshPencarian()}
        InputRightElement={
          <Icon
            onPress={() => this.refreshPencarian()}
            size="md"
            mr={2}
            as={<MaterialCommunityIcons name="magnify" />}
          />
        }
      />
    </FormControl>
  );

  refreshPencarian = () => {
    if (this.state.cari !== this.state.pencarian) {
      this.setState({pencarian: this.state.cari});
    }
  };
}

export function FilterTransaksi({filter}) {
  const {isOpen, onOpen, onClose} = useDisclose();

  const [filterStatus, setFilterStatus] = React.useState('');
  const [buttonSelected, setButtonSelected] = React.useState([]);
  const [status, setState] = React.useState([
    {id: -1, status: 'Pesanan dibatalkan'},
    {id: 1, status: 'Menunggu Konfirmasi'},
    {id: 2, status: 'Pesanan Ditolak'},
    {id: 3, status: 'Pesanan Diterima'},
    {id: 4, status: 'Siap Diantar'},
    {id: 5, status: 'Sedang Diantar'},
    {id: 6, status: 'Sudah Diantar'},
    {id: 7, status: 'Pesanan Selesai'},
  ]);
  function refresh() {
    let field = '';
    if (buttonSelected.length > 0) {
      field = buttonSelected.join('_');
      field += '_';
    }

    filter(field);
  }

  function aksi(status) {
    let items = buttonSelected;
    if (!items.includes(status)) {
      items.push(status);
      console.log(items);
      console.log('oke');
    } else {
      items.splice(items.indexOf(status), 1); //deleting
    }
    setButtonSelected([...items]);
  }

  return (
    <>
      <Fab
        position="absolute"
        size="lg"
        onPress={onOpen}
        icon={
          <Icon
            color="white"
            as={<MaterialCommunityIcons name="filter" />}
            size={4}
          />
        }
      />

      <Actionsheet
        isOpen={isOpen}
        onClose={() => {
          onClose();
          // refresh();
        }}>
        <Actionsheet.Content pb={4} alignItems="flex-start">
          <Text bold mb={2} mx={3}>
            Filter
          </Text>
          <HStack space={2} pr={2} flexWrap="wrap">
            {status.map(item => (
              <Button
                mb={2}
                variant={buttonSelected.includes(item.id) ? 'solid' : 'outline'}
                onPress={() => aksi(item.id)}
                size="sm">
                {item.status}
              </Button>
            ))}
          </HStack>
          <HStack mt={2}>
            <Button
              onPress={() => {
                onClose();
                refresh();
              }}
              size="sm"
              flex={1}
              colorScheme="success">
              Terapkan
            </Button>
          </HStack>
        </Actionsheet.Content>
      </Actionsheet>
    </>
  );
}

export function SheetAksiOrder({telp}) {
  const {isOpen, onOpen, onClose} = useDisclose();

  return (
    <>
      <Button size="sm" onPress={onOpen} flex={1}>
        Tanya Penjual
      </Button>

      <Actionsheet
        isOpen={isOpen}
        onClose={() => {
          onClose();
          // refresh();
        }}>
        <Actionsheet.Content pb={4} alignItems="flex-start">
          <Text bold mb={2} mx={3}>
            Hubungi Penjual
          </Text>
          <Actionsheet.Item
            py={3}
            my={0}
            onPress={() => {
              Linking.openURL('https://api.whatsapp.com/send?phone=' + telp);
              onClose();
            }}
            startIcon={
              <Icon
                color="green"
                as={<FontAwesome5 name="whatsapp" light />}
                mr={3}
              />
            }>
            Whatsapp
          </Actionsheet.Item>
          <Actionsheet.Item
            py={3}
            my={0}
            onPress={() => {
              Linking.openURL('smsto:' + telp);
              onClose();
            }}
            startIcon={
              <Icon
                color="black"
                as={<FontAwesome5 name="sms" light />}
                mr={3}
              />
            }>
            SMS
          </Actionsheet.Item>
          <Actionsheet.Item
            py={3}
            my={0}
            onPress={() => {
              Linking.openURL('tel:' + telp);
              onClose();
            }}
            startIcon={
              <Icon
                color="blue"
                as={<FontAwesome5 name="phone" light />}
                mr={3}
              />
            }>
            Telepon
          </Actionsheet.Item>
        </Actionsheet.Content>
      </Actionsheet>
    </>
  );
}
