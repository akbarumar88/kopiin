import React, {Component} from 'react';
import {
  Dimensions,
  StyleSheet,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import AlertYesNoV2 from '../universal/AlertYesNoV2';
import ImageLoad from './../universal/ImageLoad';
import {
  Checkbox,
  NativeBaseProvider,
  Box,
  Text,
  FlatList,
  Divider,
  HStack,
  VStack,
  Button,
  HamburgerIcon,
  IconButton,
  Icon,
  Pressable,
  Menu,
  Actionsheet,
  ScrollView,
} from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Resource from './../universal/Resource';
import {BASE_URL, BITESHIP_KEY, theme} from './../../utilitas/Config';
import {toCurrency} from './../../utilitas/Function';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import Sheet from 'react-native-raw-bottom-sheet';
import FooterLoading from '../universal/FooterLoading';

export default class ItemKeranjang extends Component {
  constructor(props) {
    super(props);

    this.state = {
      kurirVisible: false,
      listOngkir: [],
      loadingLoadKurir: false,
    };
  }

  render = () => {
    const {
      cartData,
      orderIndex,
      item,
      item: {shipping},
    } = this.props;

    // console.warn(shipping);
    return (
      <Box ml={2} bg="white" flex={1} my={2}>
        <AlertYesNoV2 ref={ref => (this.alert = ref)} />
        <VStack space={2}>
          <HStack mb={2}>
            <Checkbox
              aria-label={orderIndex + 'a'}
              isChecked={cartData[orderIndex]?.selected || false}
              value="success"
              color={theme.primary}
              _text={{fontWeight: 'bold'}}
              onChange={state => {
                cartData[orderIndex].selected = state;

                this.props.setParentState({
                  cartData: cartData,
                });
              }}>
              {item.nama_toko}
            </Checkbox>
            <Box flex={1}></Box>
            <Menu
              mr={2}
              trigger={triggerProps => {
                return (
                  <Pressable
                    accessibilityLabel="More options menu"
                    {...triggerProps}>
                    <HamburgerIcon size="sm" fontSize="sm" />
                  </Pressable>
                );
              }}>
              <Menu.Item
                _text={{padding: 0}}
                onPress={() =>
                  this.props.navigation.navigate('UbahKeranjang', {
                    idorder: item.id,
                  })
                }>
                Edit
              </Menu.Item>
              <Menu.Item onPress={() => this.deleteOrder(item.id)}>
                Hapus
              </Menu.Item>
            </Menu>
          </HStack>

          {/* Item Keranjang */}
          <FlatList
            data={item.orderdetail}
            renderItem={({item, index}) => {
              return this.detailList(item, index, orderIndex);
            }}
          />
          {/* Footer */}
          <Text fontSize="sm" bold>
            Alamat Pengiriman
          </Text>
          <HStack alignItems="center">
            <VStack flex={1} mr={2}>
              <Text fontSize="sm">{item.nama}</Text>
              <Text
                color="grey"
                fontSize="xs">{`${item.detail} , ${item.kecamatan} , ${item.kota} , ${item.provinsi}`}</Text>
              <Text color="grey" fontSize="xs">
                {item.no_telp}
              </Text>
            </VStack>
            <VStack>
              <Button
                size="sm"
                onPress={() => {
                  this.props.navigation.navigate('PilihAlamat', {
                    idorder: item.id,
                    selected: item.id_alamat,
                  });
                }}>
                Ubah
              </Button>
            </VStack>
          </HStack>
          <Divider />

          {/* Metode Pengiriman */}
          <HStack alignItems="center">
            <VStack flex={1}>
              {shipping ? (
                <>
                  <Text bold fontSize="sm">
                    {shipping.kurir} {shipping.service}
                  </Text>
                  <Text fontSize="sm">Rp {toCurrency(shipping.biaya)}</Text>
                </>
              ) : (
                <Text bold fontSize="sm">
                  Pilih Pengiriman
                </Text>
              )}
            </VStack>
            <VStack>
              <Button
                size="sm"
                onPress={() => {
                  this.sheetKurir.open();
                  if (!this.state.listOngkir.length)
                    this.loadOngkosKurirOnline();
                }}>
                Ubah
              </Button>
            </VStack>
          </HStack>
          <Divider />
          {/* Total */}
          <HStack alignItems="center">
            <Text flex={1} bold>
              Total
            </Text>
            <Text mb={3} bold>
              Rp{' '}
              {toCurrency(
                cartData[orderIndex]
                  ? this.getSubTotal(orderIndex)
                  : item?.orderdetail.reduce(
                      (sub, item) => sub + parseInt(item.harga),
                      0,
                    ),
              )}
            </Text>
          </HStack>
        </VStack>

        {this.listKurirOnline()}
      </Box>
    );
  };

  //Produk
  detailList = (item, index, orderIndex) => {
    const {cartData} = this.props;
    const imgWidth = Dimensions.get('screen').width * 0.175;
    const urlGambar = `${BASE_URL()}/image/barang/`;
    return (
      <HStack mb={2} space={3}>
        <IconButton
          colorScheme="danger"
          onPress={() => this.deleteItem(item.id)}
          startIcon={
            <Icon
              as={<MaterialCommunityIcons name="delete" />}
              color="red"
              size="sm"
            />
          }
        />
        <Pressable
          onPress={() =>
            this.props.navigation.navigate('DetailProduk', {
              idproduk: item.id_barang,
            })
          }>
          <HStack mb={2} space={3}>
            <ImageLoad
              style={{
                resizeMode: 'contain',
                alignSelf: 'center',
              }}
              w={imgWidth}
              h={imgWidth}
              url={urlGambar + item.foto_barang}
            />

            <VStack>
              <Text fontSize="sm" bold>
                {item.nama}
              </Text>
              {item.varian != '-' && (
                <Text fontSize="xs">Varian : {item.varian}</Text>
              )}
              <Text color="grey" bold>
                {toCurrency(item.harga)}
              </Text>
              <Text color="grey" fontSize="sm">
                x {item.jumlah}
              </Text>
            </VStack>
          </HStack>
        </Pressable>
      </HStack>
    );
  };

  listKurirOnline = () => {
    const {stgkirim, listOngkir, loading, kurirVisible, loadingLoadKurir} =
      this.state;
    // const {
    //   data: {listKurir = []},
    // } = this.props;

    return (
      <>
        <Sheet
          ref={ref => {
            this.sheetKurir = ref;
          }}
          height={450}
          closeOnDragDown={false}
          duration={250}
          customStyles={{
            container: {},
          }}>
          <View style={{paddingVertical: 16, backgroundColor: '', flex: 1}}>
            <Text
              style={[s.teksTebal, {marginBottom: 16, paddingHorizontal: 16}]}>
              Metode Pengiriman
            </Text>

            {(() => {
              if (loadingLoadKurir) {
                return <FooterLoading full />;
              }

              return (
                <ScrollView>
                  {listOngkir.map((courier, index) => {
                    let {
                      courier_name: namaKurir,
                      courier_code: kodeKurir,
                      costs,
                    } = courier;
                    return (
                      <React.Fragment key={index}>
                        <TouchableWithoutFeedback>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              paddingRight: 16,
                              paddingLeft: 16,
                              paddingVertical: 12,
                            }}>
                            <Text style={[s.teksTebal, {fontSize: 14}]}>
                              {namaKurir}
                            </Text>
                          </View>
                        </TouchableWithoutFeedback>

                        {costs.length ? (
                          costs.map((cost, index) => {
                            let {
                              description,
                              duration: estimasi,
                              price: biaya,
                              courier_code,
                              courier_service_code,
                              courier_service_name,
                            } = cost;

                            return (
                              <Pressable
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  paddingRight: 16,
                                  paddingLeft: 32,
                                  paddingVertical: 12,
                                }}
                                _pressed={{backgroundColor: 'coolGray.200'}}
                                key={index}
                                onPress={() => {
                                  this.sheetKurir.close();

                                  let dataPengiriman = {
                                    jenis: 'kirim',
                                    biaya,
                                    estimasi,
                                    kurir: namaKurir,
                                    service: courier_service_name,
                                    courier_code,
                                    courier_service_code,
                                  };
                                  let {item: current, orderIndex} = this.props;

                                  this.props.updateQuery(oldPayload => {
                                    let cartData = [...oldPayload.data];
                                    // console.warn(cartData);
                                    cartData[orderIndex] = {
                                      ...current,
                                      shipping: dataPengiriman,
                                    };

                                    // this.props.setParentState({cartData})
                                    return {
                                      ...oldPayload,
                                      data: cartData,
                                    };
                                    // this.props.setParentState({cartData})
                                  });

                                  // alert(JSON.stringify(dataPengiriman))
                                  // this._pilihPengiriman(dataPengiriman);
                                }}>
                                <View>
                                  <Text
                                    style={[
                                      s.teksTebal,
                                      {
                                        fontSize: 14,
                                      },
                                    ]}>
                                    {courier_service_name} ({estimasi})
                                  </Text>
                                  <Text
                                    style={[
                                      s.teks,
                                      {
                                        fontSize: 12,
                                      },
                                    ]}>
                                    Rp. {toCurrency(biaya)}{' '}
                                  </Text>
                                </View>
                              </Pressable>
                            );
                          })
                        ) : (
                          <View
                            style={{
                              paddingLeft: 16,
                            }}>
                            <Text
                              style={{
                                color: '#aaa',
                              }}>
                              ( Tidak Tersedia )
                            </Text>
                          </View>
                        )}
                      </React.Fragment>
                    );
                  })}
                </ScrollView>
              );
            })()}
          </View>
        </Sheet>
        <View style={{marginBottom: 12}} />
      </>
    );
  };

  loadOngkosKurirOnline = async () => {
    const {
      alamat,
      alamat_apotek,
      orderdetail,
      lat_toko,
      long_toko,
      lat_user,
      long_user,
    } = this.props.item;
    // const {
    //   data: { listKurir = [],  }
    // } = this.props
    let listKurir = [
      {ong_kode: 'sicepat'},
      {ong_kode: 'jne'},
      {ong_kode: 'pos'},
    ];
    // console.warn(orderdetail); return
    // console.warn('kurir', listKurir.toString());
    this.setState({loadingLoadKurir: true});
    try {
      let description;
      description = orderdetail.map(itemDetail => itemDetail.nama).join(', ');
      let item = {
        name: 'Item Barang',
        description,
      };
      let params = {
        origin_latitude: lat_toko,
        origin_longitude: long_toko,
        destination_latitude: lat_user,
        destination_longitude: long_user,
        couriers: listKurir.map(itemKurir => itemKurir.ong_kode).toString(),
        items: [item],
      };
      // console.warn(params);
      const BASE = 'https://api.biteship.com';
      let {data: res} = await axios.post(`${BASE}/v1/rates/couriers`, params, {
        headers: {
          Authorization: `Bearer ${BITESHIP_KEY()}`,
        },
      });

      this.setState({loadingLoadKurir: false});

      let list_courier = res.pricing.map(item => item.courier_code); // Ambil kode kurir
      list_courier = list_courier.filter(
        (item, i, self) => self.indexOf(item) == i,
      ); // Distinct array
      // Mapping Ongkir
      let listOngkir = list_courier.map(courier_code => {
        // Ambil sesuai courier_code
        let listCosts = res.pricing.filter(
          item => item.courier_code == courier_code,
        );
        // Markup Harga
        let markup = listKurir.find(item => item.ong_kode == courier_code);
        listCosts = listCosts.map(cost => {
          return {...cost, price: cost.price + 0};
        });
        return {
          courier_name: listCosts[0].courier_name,
          courier_code,
          costs: listCosts,
        };
      });
      // console.warn(listOngkir)
      this.setState({listOngkir});
    } catch (e) {
      this.setState({loadingLoadKurir: false});
      console.warn('Error gan', e.response?.data ?? e.message);
    }
  };

  deleteOrder = id => {
    this.alert.show(
      {message: 'Apakah Anda yakin ingin menghapus data ini ?'},
      async () => {
        await axios.delete(`${BASE_URL()}/order/${id}`).then(e => {});
        this.setState({paramrefresh: new Date()});
      },
    );
  };

  deleteItem = id => {
    this.alert.show(
      {message: 'Apakah Anda yakin ingin menghapus data ini ?'},
      async () => {
        this.setState({paramrefresh: new Date()});
        await axios.delete(`${BASE_URL()}/orderdetail/${id}`).then(e => {});
        this.props.refetchKeranjang();
      },
    );
  };

  getSubTotal = orderIndex => {
    const {
      cartData,
      item: {shipping},
    } = this.props;
    let totalDetail = cartData[orderIndex].orderdetail.reduce(
      (sub, item) => sub + parseInt(item.harga) * parseInt(item.jumlah),
      0,
    );
    return totalDetail + (shipping?.biaya ?? 0);
  };
}

const s = StyleSheet.create({
  teks: {
    color: '#555',
  },
  teksTebal: {
    color: '#555',
    fontWeight: 'bold',
  },
  teksPutih: {
    color: '#fff',
  },
  teksPutihTebal: {
    color: '#fff',
    fontWeight: 'bold',
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 0,
    backgroundColor: 'white',
  },
});
