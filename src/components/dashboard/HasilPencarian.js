import React, {Component, useState} from 'react';
import {Dimensions} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  ScrollView,
  NativeBaseProvider,
  Box,
  FormControl,
  Input,
  Icon,
  Pressable,
  HStack,
  Text,
  FlatList,
  Divider,
  Button,
  useDisclose,
  Actionsheet,
} from 'native-base';
import {toCurrency} from '../../utilitas/Function';
import Resource from './../universal/Resource';
import {BASE_URL, theme} from './../../utilitas/Config';
import {TabView, TabBar, SceneMap} from 'react-native-tab-view';
import FooterLoading from '../universal/FooterLoading';
import ImageLoad from './../universal/ImageLoad';
import EmptyCart from '../universal/EmptyCart';

export function ActionStatus({sorting}) {
  const {isOpen, onOpen, onClose} = useDisclose();
  const [filterRating, setfilterRating] = useState(false);
  const [filterKategori, setfilterKategori] = useState('');
  const [sortingTemp, setSortingTemp] = useState('uploadSort');
  function refresh() {
    let field = '';
    let type = 'ASC';
    switch (sortingTemp) {
      case 'uploadSort':
        field = 'created_at';
        type = 'DESC';
        break;
      case 'highPriceSort':
        field = 'harga';
        type = 'DESC';
        break;
      case 'lowPriceSort':
        field = 'harga';
        type = 'ASC';
        break;
    }
    let minimRating = 0;
    if (filterRating) {
      minimRating = 4;
    }
    sorting(field, type, minimRating, filterKategori);
  }
  return (
    <>
      <Button rounded={0} mb={1} onPress={onOpen}>
        Filter
      </Button>

      <Actionsheet
        isOpen={isOpen}
        onClose={() => {
          onClose();
          refresh();
        }}>
        <Actionsheet.Content pb={4} alignItems="flex-start">
          <Text bold mb={2} mx={3}>
            Urutkan
          </Text>
          <ScrollView horizontal={true}>
            <HStack space={2}>
              <Button
                variant={sortingTemp == 'uploadSort' ? 'solid' : 'outline'}
                onPress={() => setSortingTemp('uploadSort')}
                size="sm">
                Barang Terbaru
              </Button>
              <Button
                variant={sortingTemp == 'highPriceSort' ? 'solid' : 'outline'}
                onPress={() => setSortingTemp('highPriceSort')}
                size="sm">
                Harga Tertinggi
              </Button>
              <Button
                variant={sortingTemp == 'lowPriceSort' ? 'solid' : 'outline'}
                onPress={() => setSortingTemp('lowPriceSort')}
                size="sm">
                Harga Terendah
              </Button>
            </HStack>
          </ScrollView>
          <Divider mt={4} mb={2} />
          <Text bold mx={3} mb={2}>
            Rating
          </Text>
          <Button
            mb={3}
            onPress={() => {
              setfilterRating(!filterRating);
            }}
            variant={filterRating ? 'solid' : 'outline'}
            size="sm">
            Rating 4
          </Button>
          <Divider mt={4} mb={2} />
          <Resource url={`${BASE_URL()}/kategori`}>
            {({loading, error, payload: data, refetch, fetchMore}) => {
              if (loading) {
                return <FooterLoading />;
              }
              return (
                <>
                  <Text bold mx={3} mb={2}>
                    Kategori
                  </Text>
                  <FlatList
                    horizontal={true}
                    data={data.data}
                    renderItem={({item}) => (
                      <Button
                        mb={3}
                        mr={2}
                        onPress={() => {
                          if (filterKategori == item.id) {
                            setfilterKategori('');
                          } else {
                            setfilterKategori(item.id);
                          }
                        }}
                        variant={
                          filterKategori == item.id ? 'solid' : 'outline'
                        }
                        size="sm">
                        {item.nama_kategori}
                      </Button>
                    )}
                  />
                </>
              );
            }}
          </Resource>
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
export default class HasilPencarian extends Component {
  defaultStoreAvatar =
    'https://cdn.icon-icons.com/icons2/1706/PNG/512/3986701-online-shop-store-store-icon_112278.png';
  defaultProductAvatar =
    'https://cdn.iconscout.com/icon/free/png-512/box-with-stuff-2349406-1955397.png';

  constructor(props) {
    super(props);
    this.setSorting = this.setSorting.bind(this);
    this.state = {
      cari: this.props.route.params.cari,
      pencarian: this.props.route.params.cari,
      tabIndex: 0,
      tabRoutes: [
        {key: 'barang', title: 'Barang'},
        {key: 'toko', title: 'Toko'},
      ],
      limit: 10,
      hasMoreProduct: true,
      hasMoreShop: true,
      sorting: 'created_at',
      orderby: 'DESC',
      rating: 0,
      kategori: null,
    };
  }

  setSorting(sorting, orderby = 'ASC', rating = false, kategori = null) {
    let minimalRating = 0;
    if (rating) {
      minimalRating = 4;
    }
    this.setState({
      sorting: sorting,
      orderby: orderby,
      rating: minimalRating,
      kategori: kategori,
    });
  }

  render() {
    const {tabIndex, tabRoutes} = this.state;
    return (
      <NativeBaseProvider>
        <Box flex={1} pt={3} bg="white">
          {this.searchBox()}

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
    const {pencarian, limit, sorting, orderby, rating, kategori} = this.state;
    const urlGambar = `${BASE_URL()}/image/barang/`;

    const imgWidth = (Dimensions.get('screen').width * 0.5) / 2;
    return (
      <>
        <ActionStatus sorting={this.setSorting} />
        <Resource
          url={`${BASE_URL()}/barang`}
          params={{
            cari: pencarian,
            limit,
            orderby: sorting,
            sort: orderby,
            rating: rating,
            kategori: kategori,
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
                />
              );
            }
            let nextOffset = data.data.length;
            return (
              <>
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
                    fetchMore(
                      {offset: nextOffset},
                      (newPayload, oldPayload) => {
                        // console.warn(newPayload);
                        if (newPayload.data < limit) {
                          this.setState({hasMoreProduct: false});
                        }
                        return {
                          ...oldPayload,
                          data: [...oldPayload.data, ...newPayload.data],
                        };
                      },
                    );
                  }}
                  ListFooterComponent={
                    this.state.hasMoreProduct ? <FooterLoading /> : null
                  }
                />
              </>
            );
          }}
        </Resource>
      </>
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
              />
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
