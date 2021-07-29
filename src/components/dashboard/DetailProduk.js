import React, {Component} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  NativeBaseProvider,
  Box,
  FlatList,
  Spinner,
  Pressable,
  Text,
  Image,
  ScrollView,
  HStack,
  Divider,
  Avatar,
  Icon,
  Button,
} from 'native-base';
import {Dimensions, ToastAndroid, Alert} from 'react-native';
import Resource from './../universal/Resource';
import {BASE_URL} from './../../utilitas/Config';
import {toCurrency, errMsg} from '../../utilitas/Function';
import AsyncStorage from '@react-native-community/async-storage';
import QueryString from 'qs';
import axios from 'axios';
import AlertOkV2 from './../universal/AlertOkV2';
import ImageLoad from './../universal/ImageLoad';
import FooterLoading from '../universal/FooterLoading';
import Loading from './../universal/Loading';
import AlertYesNoV2 from './../universal/AlertYesNoV2';
export default class DetailProduk extends Component {
  constructor(props) {
    super(props);

    this.state = {
      varian: undefined,
      dataProduk: [],
      loading: false,
      loadingDialog: false,
      loadingWishlist: false,
      refresh: new Date(),
      iduser: false,
    };
  }

  async componentDidMount() {
    let id = await AsyncStorage.getItem('id');
    this.setState({iduser: id});
  }
  saveWishList = state => {
    // console.warn(state)
    this.setState({loadingWishlist: true});
    axios
      .post(
        `${BASE_URL()}/wishlist`,
        QueryString.stringify({
          id_barang: this.state.dataProduk.id,
          id_user: this.state.iduser,
          liked: state,
        }),
      )
      .then(() => {
        ToastAndroid.show(
          `Wishlist berhasil di${state ? 'tambahkan' : 'hapus'}`,
          ToastAndroid.SHORT,
        );
        this.setState({loadingWishlist: false});
        this.setWishlist(!state);
      })
      .catch(() => {
        this.setState({loadingWishlist: false});
      })
      .catch(() => {});
  };

  setWishlist = state => {
    console.log('oke');
    this.props.navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={() => {
            if (!state) {
              this.dialog.show(
                {
                  message:
                    'Anda yakin ingin menghapus produk ini dari wishlist ?',
                },
                () => {
                  this.saveWishList(state);
                },
              );
            } else {
              this.saveWishList(state);
            }
          }}>
          <Icon
            as={
              <MaterialCommunityIcons
                name={state ? 'heart-outline' : 'heart'}
              />
            }
            color={state ? 'grey' : 'red'}
            size="md"
            mr={4}
          />
        </Pressable>
      ),
    });
  };

  showAlert = () => {
    AsyncStorage.setItem('refreshKeranjang', 'IYA');
    Alert.alert(
      'Berhasil',
      'Berhasil dimasukkan keranjang',
      [
        {
          text: 'Lanjutkan Belanja',

          style: 'default',
        },
        {
          text: 'Bayar',
          onPress: () => {
            this.props.navigation.navigate('Keranjang');
          },
          style: 'default',
        },
      ],
      {
        cancelable: true,
      },
    );
  };

  tambahKeranjang = async () => {
    if (!this.state.varian && this.state.dataProduk.varian.length > 0) {
      ToastAndroid.show('Pilih variasi terlebih dahulu', ToastAndroid.SHORT);
    } else {
      this.setState({loading: true});
      let id = await AsyncStorage.getItem('id');
      if (!id) {
        this.alert.show(
          {message: 'Silakan melakukan login terlebih dahulu.'},
          () => {
            this.props.navigation.navigate('Login');
          },
        );
      }
      let body = QueryString.stringify({
        id_user: id,
        id_merchant: this.state.dataProduk.id_merchant,
        id_varian: this.state.varian,
        id_barang: this.state.dataProduk.id,
        harga: this.state.dataProduk.harga,
        jumlah: 1,
      });
      axios
        .post(`${BASE_URL()}/orderdetail`, body)
        .then(async ({data}) => {
          this.setState({loading: false});
          if (data.status) {
            this.showAlert();
            // ToastAndroid.show(
            //   'Berhasil dimasukkan keranjang',
            //   ToastAndroid.SHORT,
            // );
          }
        })
        .catch(e => {
          this.setState({loading: false});

          this.alert.show(
            {
              message:
                e.response?.data?.errorMessage ?? errMsg('Tambah Keranjang'),
            },
            () => {
              if (e.response.data?.code == 'NO_ADDRESS') {
                this.props.navigation.navigate('FormAlamat', {});
              }
            },
          );
        });
    }
  };

  listProdukTerkait = dataProduk => {
    const urlGambar = `${BASE_URL()}/image/barang/`;

    const imgWidth = (Dimensions.get('screen').width * 0.85) / 2;
    return (
      <Box py={3} mt={2} px={3} bg="white">
        <Text mt={2} bold={true}>
          Produk Terkait
        </Text>
        <FlatList
          flex={1}
          mt={2}
          horizontal={true}
          data={dataProduk}
          keyExtractor={(item, index) => item.id + 'idproduk'}
          showsVerticalScrollIndicator={false}
          renderItem={({item, index}) => (
            <Pressable
              onPress={() => {
                this.props.navigation.push('DetailProduk', {
                  idproduk: item.id,
                });
              }}>
              <Box
                bgColor="white"
                shadow={3}
                mx={1}
                key={index}
                borderRadius={8}
                pb={4}
                my={2}
                alignItems="center">
                <Image
                  alignSelf="center"
                  resizeMode="contain"
                  mt={2}
                  mb={2}
                  onError={() => {}}
                  style={[
                    {width: imgWidth, height: imgWidth},
                    {
                      borderTopLeftRadius: 10,
                      borderTopRightRadius: 10,
                    },
                  ]}
                  alt={item.nama}
                  source={{
                    uri: item.foto_barang
                      ? urlGambar +
                        item.foto_barang +
                        '?url=' +
                        this.state.refresh
                      : this.defaultProductAvatar,
                  }}
                />
                <Text fontSize="sm" isTruncated>
                  {item.nama}
                </Text>
                <Text fontSize="xs" bold color="grey">
                  {item.deskripsi}
                </Text>
                <Text fontSize="xs" color="grey">
                  Rp.{toCurrency(item.harga)}
                </Text>
              </Box>
            </Pressable>
          )}
        />
      </Box>
    );
  };

  render() {
    const urlGambar = `${BASE_URL()}/image/barang/`;
    const urlToko = `${BASE_URL()}/image/merchant/`;
    const {loadingDialog} = this.state;
    return (
      <NativeBaseProvider>
        <AlertYesNoV2 ref={ref => (this.dialog = ref)} />
        <AlertOkV2 ref={ref => (this.alert = ref)} />
        <Loading isVisible={loadingDialog} />
        <Box flex={1}>
          {this.state.iduser && (
            <Resource
              url={`${BASE_URL()}/barang/${this.props.route.params.idproduk}`}
              params={{iduser: this.state.iduser}}>
              {({loading, error, payload: data, refetch}) => {
                if (loading) {
                  return <FooterLoading full />;
                }

                if (this.state.dataProduk != data.data) {
                  this.setState({dataProduk: data.data});
                  this.setWishlist(data.data?.wishlist == 0);
                }

                return (
                  <FlatList
                    flex={1}
                    keyExtractor={item => item + 'parent'}
                    data={[1]}
                    renderItem={() => {
                      return (
                        <>
                          <Box
                            bg="white"
                            height={Dimensions.get('screen').height * 0.25}>
                            <ImageLoad
                              flex={1}
                              style={{
                                resizeMode: 'contain',
                              }}
                              url={
                                urlGambar +
                                data.data.foto_barang +
                                '?date=' +
                                this.state.refresh
                              }
                              alt={data.data.nama}
                            />
                          </Box>
                          <Box bg="white" mt={2} py={4} px={3}>
                            <Text bold fontSize={20}>
                              Rp.{toCurrency(data.data.harga)}
                            </Text>
                            <Text fontSize={14}>{data.data.nama}</Text>
                          </Box>
                          <Pressable
                            onPress={() => {
                              this.props.navigation.navigate('DetailToko', {
                                idtoko: data.data.id_merchant,
                              });
                            }}>
                            <Box bg="white" mt={2} py={4} px={3}>
                              <HStack alignItems="center">
                                <Avatar
                                  mr={4}
                                  source={{
                                    uri: urlToko + data.data.foto_merchant,
                                  }}
                                  alt={data.data.nama_toko}
                                />
                                <Text bold={true}>{data.data.nama_toko}</Text>
                              </HStack>
                            </Box>
                          </Pressable>

                          {data.data.varian?.length > 0 && (
                            <Box bg="white" mt={2} py={4} px={3}>
                              <Text bold={true}>Pilih Variasi</Text>
                              <FlatList
                                mt={2}
                                data={data.data.varian}
                                numColumns={4}
                                keyExtractor={(item, index) =>
                                  item.id + 'varian'
                                }
                                renderItem={({item}) => {
                                  return (
                                    <Pressable
                                      onPress={() => {
                                        this.setState({varian: item.id});
                                      }}>
                                      <Box
                                        py={3}
                                        px={4}
                                        rounded={10}
                                        bgColor={
                                          item.id == this.state.varian
                                            ? '#007bff'
                                            : 'grey'
                                        }
                                        mx={1}
                                        my={1}>
                                        <Text fontSize={13} color="white">
                                          {item.nama_varian}
                                        </Text>
                                      </Box>
                                    </Pressable>
                                  );
                                }}
                              />
                            </Box>
                          )}
                          <Box bg="white" mt={2} py={4} px={3} pb={8}>
                            <Text bold={true}>Detail Produk</Text>
                            <HStack space={1} mt={4} mb={2}>
                              <Text fontSize={14} flex={1}>
                                Berat :
                              </Text>
                              <Text fontSize={14} flex={1}>
                                {data.data.berat} gram
                              </Text>
                            </HStack>
                            <Divider />
                            <HStack space={1} mt={2} mb={2}>
                              <Text fontSize={14} flex={1}>
                                Tersedia :
                              </Text>
                              <Text fontSize={14} flex={1}>
                                {data.data.stok}
                              </Text>
                            </HStack>
                            <Divider />
                            <Text mt={4}>{data.data.deskripsi}</Text>
                          </Box>

                          {data.data?.terkait?.length > 0 &&
                            this.listProdukTerkait(data.data?.terkait)}
                        </>
                      );
                    }}
                    refreshing={false}
                    onRefresh={() => {
                      refetch();
                    }}
                  />
                );
              }}
            </Resource>
          )}
          <Box bg="white">
            <Button
              mx={3}
              mb={3}
              isLoading={this.state.loading}
              isLoadingText="Proses"
              onPress={() => this.tambahKeranjang()}
              colorScheme="success">
              Masukkan Keranjang
            </Button>
          </Box>
        </Box>
      </NativeBaseProvider>
    );
  }
}
