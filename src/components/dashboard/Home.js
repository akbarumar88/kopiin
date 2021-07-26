import React, {Component} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Dimensions, RefreshControl} from 'react-native';
import {
  NativeBaseProvider,
  Box,
  Text,
  FormControl,
  Input,
  Icon,
  HStack,
  ScrollView,
  Pressable,
  Image,
  FlatList,
} from 'native-base';
import {BASE_URL} from '../../utilitas/Config';
import {errMsg, toCurrency} from '../../utilitas/Function';
import AsyncStorage from '@react-native-community/async-storage';
import Resource from '../universal/Resource';
import {MerchantShimmer, BarangShimmer} from '../universal/Placeholder';
import ImageLoad from './../universal/ImageLoad';

export default class Home extends Component {
  defaultStoreAvatar =
    'https://cdn.icon-icons.com/icons2/1706/PNG/512/3986701-online-shop-store-store-icon_112278.png';
  defaultProductAvatar =
    'https://cdn.iconscout.com/icon/free/png-512/box-with-stuff-2349406-1955397.png';

  constructor(props) {
    super(props);

    this.state = {
      refresh: 1,
      lat: 0,
      long: 0,
      initialLoading: true,
    };
  }

  async componentDidMount() {
    let lat = await AsyncStorage.getItem('lat');
    let long = await AsyncStorage.getItem('long');
    this.setState({lat, long, initialLoading: false});
  }

  render() {
    const {initialLoading} = this.state;
    return (
      <NativeBaseProvider>
        <Box bgColor={'#ff0000'} flex={1}>
          {/* <Box>
            <Text>Ini Header Gan</Text>
          </Box> */}
          <FlatList
            paddingX={4}
            paddingY={4}
            backgroundColor={'#fff'}
            refreshControl={
              <RefreshControl
                refreshing={false}
                onRefresh={() => {
                  this.setState(s => ({refresh: s.refresh + 1}));
                }}
              />
            }
            ListHeaderComponent={
              <>
                {!initialLoading ? (
                  <Box>
                    {this.searchBox()}
                    <Text bold>Toko / Kedai Terdekat</Text>
                    {this.listToko()}
                    <Text bold>Mungkin anda suka</Text>
                    {this.listBarang()}
                  </Box>
                ) : null}
              </>
            }
          />
        </Box>
      </NativeBaseProvider>
    );
  }

  searchBox = () => (
    <Pressable onPress={() => this.bukaPencarian()}>
      <FormControl isReadOnly={true} mt={5} mb={10}>
        <Input
          placeholder="Cari"
          InputRightElement={
            <Icon
              size="md"
              mr={2}
              as={<MaterialCommunityIcons name="magnify" />}
            />
          }
        />
      </FormControl>
    </Pressable>
  );

  listToko = () => {
    const {lat, long} = this.state;
    // console.warn(lat,long)
    return (
      <Resource
        url={`${BASE_URL()}/dashboard/shop`}
        params={{refresh: this.state.refresh, lat, long}}>
        {({loading, error, payload: data, refetch}) => {
          if (loading) {
            return <MerchantShimmer />;
          } else if (error) {
            return <Text>{errMsg('Load Merchant')}</Text>;
          } else if (!data.status) {
            return <Text>{errMsg('Load Merchant')}</Text>;
          }

          return (
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              <HStack my={4} alignItems="flex-start">
                {data.data.map(
                  (
                    {
                      nama_toko,
                      alamat_toko,
                      jenis,
                      foto_merchant,
                      distance = 0,
                      kota,
                      id,
                    },
                    index,
                  ) => {
                    kota = kota.split(/\s/)[1];
                    let imgWidth = Dimensions.get('screen').width / 4;
                    let itemWidth = Dimensions.get('screen').width / 3.5;
                    return (
                      <Pressable
                        shadow={3}
                        alignItems="flex-start"
                        bgColor="#fff"
                        _pressed={{backgroundColor: 'coolGray.200'}}
                        p={2}
                        mr={3}
                        key={index}
                        w={itemWidth}
                        borderRadius={8}
                        onPress={() => {
                          this.props.navigation.navigate('DetailToko', {
                            idtoko: id,
                          });
                        }}>
                        {/* <View style={[{width}, style.wCardApotek, marginLeft]}> */}
                        <ImageLoad
                          mb={2}
                          alignSelf="center"
                          resizeMode="cover"
                          style={[
                            {width: imgWidth, height: imgWidth},
                            {
                              borderTopLeftRadius: 8,
                              borderTopRightRadius: 8,
                            },
                          ]}
                          url={`${BASE_URL()}/image/merchant/${foto_merchant}?${new Date()}`}
                          alt={nama_toko}
                        />

                        <Box px={0}>
                          <Text fontSize="sm" isTruncated>
                            {nama_toko}
                          </Text>
                          <Text fontSize="xs" bold color="grey">
                            {kota}
                          </Text>
                          <Text fontSize="xs" color="grey">
                            {(() => {
                              if (distance) {
                                if (distance > 20) {
                                  return 
                                } else {
                                  return `${distance?.toFixed(1)} KM dari lokasi anda.`
                                }
                              } else {
                                return '?? KM dari lokasi anda.'
                              }
                            })()}
                          </Text>
                        </Box>
                        {/* </View> */}
                      </Pressable>
                    );
                  },
                )}
              </HStack>
            </ScrollView>
          );
        }}
      </Resource>
    );
  };

  listBarang = () => {
    return (
      <Resource
        url={`${BASE_URL()}/dashboard/product`}
        params={{refresh: this.state.refresh}}>
        {({loading, error, payload: data, refetch}) => {
          if (loading) {
            return <BarangShimmer />;
          } else if (error) {
            return <Text>{errMsg('Load Barang')}</Text>;
          } else if (!data.status) {
            return <Text>{errMsg('Load Barang')}</Text>;
          }

          return (
            <HStack my={4} flexWrap="wrap">
              {data.data.map(
                (
                  {
                    id,
                    nama,
                    deskripsi,
                    harga,
                    nama_toko,
                    alamat_toko,
                    jenis,
                    foto_barang = this.defaultProductAvatar,
                    jarak,
                    kota,
                    rating = 0,
                    terjual = 0,
                  },
                  index,
                ) => {
                  kota = kota.split(/\s/)[1];
                  let imgWidth = Dimensions.get('screen').width / 4;
                  let itemWidth = Dimensions.get('screen').width / 3.7;
                  let isMiddle = index % 3 == 1;
                  let isFirst = index % 3 == 0;
                  let isLast = index % 3 == 2;
                  return (
                    <Pressable
                      alignItems="flex-start"
                      bgColor="#fff"
                      _pressed={{backgroundColor: 'coolGray.200'}}
                      p={2}
                      mb={3}
                      mx={isMiddle ? 3 : 0}
                      ml={isFirst ? 1 : isLast ? 0 : 3}
                      key={index}
                      w={itemWidth}
                      borderRadius={8}
                      shadow={3}
                      onPress={() => {
                        this.props.navigation.navigate('DetailProduk', {
                          idproduk: id,
                        });
                      }}>
                      {/* <View style={[{width}, style.wCardApotek, marginLeft]}> */}
                      <ImageLoad
                        alignSelf="center"
                        resizeMode="contain"
                        style={[
                          {width: imgWidth, height: imgWidth},
                          {
                            borderTopLeftRadius: 10,
                            borderTopRightRadius: 10,
                          },
                        ]}
                        url={`${BASE_URL()}/image/barang/${foto_barang}?${new Date()}`}
                        alt={nama}
                        mb={2}
                      />

                      <Box px={0}>
                        <Text fontSize="sm" isTruncated>
                          {nama}
                        </Text>
                        <Text fontSize="xs" bold color="grey">
                          {kota}
                        </Text>
                        <Text fontSize="xs" color="grey">
                          Rp {toCurrency(harga)}
                        </Text>
                        {terjual > 0 ? (
                          <HStack alignItems="center" mt={1}>
                            <Icon
                              as={Ionicons}
                              name="star"
                              size={'xs'}
                              color="orange"
                              mr={1}
                            />
                            <Text fontSize="xs" color="grey">
                              {rating} | Terjual {terjual}
                            </Text>
                          </HStack>
                        ) : null}
                      </Box>
                      {/* </View> */}
                    </Pressable>
                  );
                },
              )}
            </HStack>
          );
        }}
      </Resource>
    );
  };

  bukaPencarian = () => {
    this.props.navigation.navigate('Search');
  };
}
