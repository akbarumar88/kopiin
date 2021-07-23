import React, {Component} from 'react';
import {Dimensions, View, StatusBar} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  ScrollView,
  NativeBaseProvider,
  Box,
  FormControl,
  Input,
  Icon,
  Pressable,
  Spinner,
  Tabs,
  Text,
  FlatList,
  Image,
} from 'native-base';
import {toCurrency} from '../../utilitas/Function';
import Resource from './../universal/Resource';
import {BASE_URL, theme} from './../../utilitas/Config';
import {TabView, TabBar, SceneMap} from 'react-native-tab-view';
import FooterLoading from '../universal/FooterLoading';
import ImageLoad from './../universal/ImageLoad';

export default class HasilPencarian extends Component {
  defaultStoreAvatar =
    'https://cdn.icon-icons.com/icons2/1706/PNG/512/3986701-online-shop-store-store-icon_112278.png';
  defaultProductAvatar =
    'https://cdn.iconscout.com/icon/free/png-512/box-with-stuff-2349406-1955397.png';

  constructor(props) {
    super(props);

    this.state = {
      cari: this.props.route.params.cari,
      pencarian: this.props.route.params.cari,
      tabIndex: 0,
      tabRoutes: [
        {key: 'barang', title: 'Barang'},
        {key: 'toko', title: 'Toko'},
      ],
      limit: 4,
      hasMoreProduct: true,
      hasMoreShop: true,
    };
  }

  render() {
    const {tabIndex, tabRoutes} = this.state;
    return (
      <NativeBaseProvider>
        <Box flex={1} pt={3} bg="white">
          {this.searchBox()}
          {/* <Tabs flex={1} mt={4} colorScheme="amber" isFitted> */}
          {/* Tab Heading */}
          {/* <Tabs.Bar>
              <Tabs.Tab>Barang</Tabs.Tab>
              <Tabs.Tab>Toko</Tabs.Tab>
            </Tabs.Bar> */}

          {/* Tab View */}
          {/* <Tabs.Views flex={1}>
              <Tabs.View flex={1}>{this.listProduct()}</Tabs.View>
              <Tabs.View flex={1}>{this.listToko()}</Tabs.View>
            </Tabs.Views>
          </Tabs> */}
          <TabView
            lazy
            navigationState={{index: tabIndex, routes: tabRoutes}}
            renderScene={SceneMap({
              barang: this.listProduct,
              toko: this.listShop,
            })}
            renderTabBar={props => (
              <TabBar
                {...props}
                indicatorStyle={{backgroundColor: theme.primary}}
                style={{backgroundColor: '#fff'}}
                labelStyle={{fontWeight: 'bold'}}
                activeColor={theme.primary}
                inactiveColor={'gray'}
              />
            )}
            onIndexChange={i => {
              this.setState({tabIndex: i});
            }}
            initialLayout={{width: Dimensions.get('window').width}}
            style={{marginTop: 0}}
            swipeEnabled
          />
        </Box>
      </NativeBaseProvider>
    );
  }

  listProduct = () => {
    const {pencarian, limit} = this.state;
    const urlGambar = `${BASE_URL()}/image/barang/`;

    const imgWidth = (Dimensions.get('screen').width * 0.5) / 2;
    return (
      <Resource
        url={`${BASE_URL()}/barang`}
        params={{
          cari: pencarian,
          limit,
        }}>
        {({loading, error, payload: data, refetch, fetchMore}) => {
          if (loading) {
            return (
              <Box flex={1} justifyContent="center">
                <FooterLoading full />
              </Box>
            );
          }
          let nextOffset = data.data.length;
          return (
            <FlatList
              numColumns={2}
              horizontal={false}
              flex={1}
              data={[...data.data]}
              keyExtractor={(item, index) => item.id}
              showsVerticalScrollIndicator={false}
              renderItem={({item, index}) => (
                <Pressable
                  onPress={() => this.showDetailProduk(item.id)}
                  flex={0.5}>
                  <Box
                    bgColor="coolGray.100"
                    mx={1}
                    key={index}
                    borderRadius={20}
                    pb={4}
                    mb={1}
                    alignItems="center">
                    <ImageLoad
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
                      url={urlGambar + item.foto_barang + '?' + new Date()}
                      alt={item.nama}
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
              refreshing={false}
              onRefresh={() => {
                this.setState({hasMoreProduct: true});
                refetch();
              }}
              onEndReached={() => {
                fetchMore({offset: nextOffset}, (newPayload, oldPayload) => {
                  // console.warn(newPayload);
                  if (newPayload.data < limit) {
                    this.setState({hasMoreProduct: false});
                  }
                  return {
                    ...oldPayload,
                    data: [...oldPayload.data, ...newPayload.data],
                  };
                });
              }}
              ListFooterComponent={
                this.state.hasMoreProduct ? <FooterLoading /> : null
              }
            />
          );
        }}
      </Resource>
    );
  };

  listShop = () => {
    const {pencarian, limit} = this.state;
    const urlGambar = `${BASE_URL()}/image/merchant/`;

    const imgWidth = (Dimensions.get('screen').width * 0.5) / 2;
    return (
      <Resource
        url={`${BASE_URL()}/shop`}
        params={{
          cari: pencarian,
          limit,
        }}>
        {({loading, error, payload: data, refetch, fetchMore}) => {
          if (loading) {
            return (
              <Box flex={1} justifyContent="center">
                <FooterLoading full />
              </Box>
            );
          }
          let nextOffset = data.data.length;

          return (
            <FlatList
              numColumns={2}
              horizontal={false}
              flex={1}
              data={[...data.data]}
              keyExtractor={(item, index) => item.id}
              showsVerticalScrollIndicator={false}
              renderItem={({item, index}) => (
                <Pressable
                  onPress={() => {
                    this.props.navigation.navigate('DetailToko', {
                      idtoko: item.id,
                    });
                  }}
                  flex={0.5}>
                  <Box
                    bgColor="coolGray.100"
                    mx={1}
                    key={index}
                    borderRadius={20}
                    pb={4}
                    mb={1}
                    alignItems="center">
                    <ImageLoad
                      alignSelf="center"
                      resizeMode="contain"
                      mt={2}
                      mb={2}
                      style={[
                        {width: imgWidth, height: imgWidth},
                        {
                          borderTopLeftRadius: 10,
                          borderTopRightRadius: 10,
                        },
                      ]}
                      onError={() => {}}
                      url={urlGambar + item.foto_merchant + '?' + new Date()}
                      alt={item.nama_toko}
                    />
                    <Text fontSize="sm" isTruncated>
                      {item.nama_toko}
                    </Text>
                    <Text fontSize="xs" bold color="grey">
                      {item.alamat_toko}
                    </Text>
                  </Box>
                </Pressable>
              )}
              refreshing={false}
              onRefresh={() => {
                this.setState({hasMoreShop: true});
                refetch();
              }}
              onEndReached={() => {
                fetchMore({offset: nextOffset}, (newPayload, oldPayload) => {
                  if (newPayload.data.length < limit) {
                    this.setState({hasMoreShop: false});
                  }
                  return {
                    ...oldPayload,
                    data: [...oldPayload.data, ...newPayload.data],
                  };
                });
              }}
              ListFooterComponent={
                this.state.hasMoreShop ? <FooterLoading /> : null
              }
            />
          );
        }}
      </Resource>
    );
  };

  showDetailProduk = id => {
    this.props.navigation.navigate('DetailProduk', {idproduk: id});
  };

  searchBox = () => (
    <FormControl px={4}>
      <Input
        placeholder="Cari"
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
