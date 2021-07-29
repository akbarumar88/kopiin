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
} from 'native-base';

import * as React from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ImageLoad from '../universal/ImageLoad';
import {Dimensions, Linking, Pressable} from 'react-native';
import Resource from '../universal/Resource';
import AsyncStorage from '@react-native-community/async-storage';
import {BASE_URL} from '../../utilitas/Config';
import FooterLoading from '../universal/FooterLoading';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import EmptyCart from './../universal/EmptyCart';
import axios from 'axios';
import {Modal} from 'react-native-modal';
import AlertYesNoV2 from '../universal/AlertYesNoV2';

export default class LaporanTransaksiToko extends React.Component {
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
    };
  }

  setFilterStatus(status) {
    this.setState({statusOrder: status});
  }

  async componentDidMount() {
    let user = await AsyncStorage.getItem('id_merchant');

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
              url={`${BASE_URL()}/order/shop/${id}`}
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
                    renderItem={({item}) => (
                      <ItemOrder
                        item={item}
                        dialog={this.dialog}
                        navigation={this.props.navigation}
                      />
                    )}
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
        placeholder="Cari Faktur atau Nama Pelanggan"
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

function FilterTransaksi({filter}) {
  const {isOpen, onOpen, onClose} = useDisclose();

  const [filterStatus, setFilterStatus] = React.useState('');
  const [buttonSelected, setButtonSelected] = React.useState([]);
  const [status, setState] = React.useState([
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

function SheetAksiOrder({telp}) {
  const {isOpen, onOpen, onClose} = useDisclose();

  return (
    <>
      <Button size="sm" onPress={onOpen} flex={1}>
        Tanya Pembeli
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

const ItemOrder = ({navigation, item, dialog}) => {
  const [status, setStatus] = React.useState(item.status);
  const [loadingAksi, setLoadingAksi] = React.useState(false);
  const getStatus = code => {
    let statusOrder = '';
    switch (code) {
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

  const terimaOrder = () => {
    dialog.show(
      {message: 'Anda yakin ingin menerima pesanan ini ?'},
      async () => {
        setLoadingAksi(true);
        axios
          .put(`${BASE_URL()}/order/terima/${item.id}`)
          .then(({data}) => {
            setStatus(3);
            setLoadingAksi(false);
          })
          .catch(e => {
            setLoadingAksi(false);
          });
      },
    );
  };

  const siapAntarOrder = () => {
    dialog.show(
      {message: 'Anda yakin ingin siap mengantar pesanan ini ?'},
      async () => {
        setLoadingAksi(true);
        axios
          .put(`${BASE_URL()}/order/siapantar/${item.id}`)
          .then(({data}) => {
            setStatus(4);
            setLoadingAksi(false);
          })
          .catch(e => {
            setLoadingAksi(false);
          });
      },
    );
  };

  const simulasi = () => {
    let statusPesanan = 'Sedang Diantar';
    let apiAksi = 'antar';
    switch (status) {
      case 5:
        statusPesanan = 'Sudah Diantar';
        apiAksi = 'sudahantar';
        break;
      case 6:
        statusPesanan = 'Selesai';
        apiAksi = 'selesai';
        break;
    }

    dialog.show(
      {
        message: `Anda yakin ingin merubah status pesanan ini menjadi ${statusPesanan} (Simulasi) ?`,
      },
      async () => {
        setLoadingAksi(true);
        axios
          .put(`${BASE_URL()}/order/${apiAksi}/${item.id}`)
          .then(({data}) => {
            setStatus(status + 1);
            setLoadingAksi(false);
          })
          .catch(e => {
            setLoadingAksi(false);
          });
      },
    );
  };

  const getAksiOrder = (code, telp) => {
    return (
      <VStack mt={3} space={1} px={4}>
        <SheetAksiOrder telp={telp} />
        {code == 1 && (
          <HStack space={2}>
            <Button
              size="sm"
              isLoading={loadingAksi}
              isLoadingText="Loading..."
              colorScheme="success"
              _text={{color: 'white'}}
              onPress={() => terimaOrder()}
              flex={1}>
              Terima Pesanan
            </Button>
            <Button
              size="sm"
              isLoading={loadingAksi}
              isLoadingText="Loading..."
              colorScheme="danger"
              _text={{color: 'white'}}
              onPress={() => {}}
              flex={1}>
              Tolak Pesanan
            </Button>
          </HStack>
        )}
        {code == 3 && (
          <Button
            size="sm"
            isLoading={loadingAksi}
            isLoadingText="Loading..."
            colorScheme="success"
            _text={{color: 'white'}}
            onPress={() => {
              siapAntarOrder();
            }}
            flex={1}>
            Siap Diantar
          </Button>
        )}
        {code > 3 && code <= 6 && (
          <Button
            size="sm"
            isLoading={loadingAksi}
            isLoadingText="Loading..."
            colorScheme="success"
            _text={{color: 'white'}}
            onPress={() => {
              simulasi();
            }}
            flex={1}>
            {'Ubah ' + getStatus(status + 1)}
          </Button>
        )}
      </VStack>
    );
  };
  const widthImage = 0.15 * Dimensions.get('window').width;
  const image = BASE_URL() + '/image/user/' + item.foto_user;
  return (
    <Pressable
      flex={1}
      onPress={() =>
        navigation.navigate('DetailTransaksi', {
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
          <VStack flex={1}>
            <Text fontSize="xs" color="#0000FF">
              {item.no_faktur}
            </Text>
            <Text fontSize="xs" color="grey">
              {moment(item.tgl_order).format('DD MMMM yyyy')}
            </Text>
            <Text flex={1}>{item.nama_lengkap}</Text>
            <Text fontSize="xs" color="grey">
              {getStatus(status)}
            </Text>
          </VStack>
        </HStack>
        {getAksiOrder(status, item.no_telp)}
        <Divider my={2} />
      </Box>
    </Pressable>
  );
};
