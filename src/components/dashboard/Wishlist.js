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
  HStack,
  Tabs,
  Text,
  FlatList,
  Image,
  VStack,
} from 'native-base';
import {toCurrency} from '../../utilitas/Function';
import Resource from '../universal/Resource';
import {BASE_URL, theme} from '../../utilitas/Config';
import {TabView, TabBar, SceneMap} from 'react-native-tab-view';
import FooterLoading from '../universal/FooterLoading';
import ImageLoad from '../universal/ImageLoad';
import EmptyCart from './../universal/EmptyCart';

export default class Wishlist extends Component {
  defaultStoreAvatar =
    'https://cdn.icon-icons.com/icons2/1706/PNG/512/3986701-online-shop-store-store-icon_112278.png';
  defaultProductAvatar =
    'https://cdn.iconscout.com/icon/free/png-512/box-with-stuff-2349406-1955397.png';

  constructor(props) {
    super(props);

    this.state = {
      cari: '',
      pencarian: '',

      limit: 4,
      hasMoreProduct: true,
    };
  }

  render() {
    return (
      <NativeBaseProvider>
        <Box flex={1} pt={3} bg="white">
          {this.searchBox()}
          {this.listProduct()}
        </Box>
      </NativeBaseProvider>
    );
  }

  listProduct = () => {
    const {pencarian, limit} = this.state;
    const urlGambar = `${BASE_URL()}/image/barang/`;

    const imgWidth = (Dimensions.get('screen').width * 0.85) / 2;
    return (
      <Resource
        url={`${BASE_URL()}/wishlist/3`}
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
          } else if (error && this.state.hasMoreProduct) {
            this.setState({hasMoreProduct: false});
          }
          if (!data.data?.length) {
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
              numColumns={2}
              horizontal={false}
              flex={1}
              px={2}
              data={[...data.data]}
              onContentSizeChange={() => {
                if (data.data.length == 0) {
                  this.setState({hasMoreProduct: false});
                }
              }}
              keyExtractor={(item, index) => item.id}
              showsVerticalScrollIndicator={false}
              renderItem={({item, index}) => (
                <Pressable
                  onPress={() => this.showDetailProduk(item.id_barang)}
                  flex={0.5}>
                  <Box
                    bgColor="white"
                    mx={1}
                    key={index}
                    borderRadius={8}
                    shadow={3}
                    pb={4}
                    my={1}
                    alignItems="center">
                    <ImageLoad
                      alignSelf="center"
                      resizeMode="contain"
                      mt={2}
                      mb={2}
                      onError={() => {}}
                      style={[{width: imgWidth, height: imgWidth}]}
                      url={urlGambar + item.foto_barang + '?' + new Date()}
                      alt={item.nama}
                    />
                    <Box flex={1} px={2}>
                      <Text textAlign="left" fontSize="sm" isTruncated mx={1}>
                        {item.nama}
                      </Text>

                      <Text fontSize="xs" isTruncated mx={1} bold color="grey">
                        {item.deskripsi}
                      </Text>
                      <HStack px={1} alignItems="center">
                        <Text fontSize="xs" isTruncated>
                          {item.rating}
                        </Text>
                        <Icon
                          color="orange"
                          size="xs"
                          as={<MaterialCommunityIcons name="star" />}
                        />
                        <Text color="grey" fontSize="xs" isTruncated>
                          {' | '} Terjual {item.terjual}
                        </Text>
                      </HStack>
                      <Text fontSize="xs" isTruncated mx={1} color="grey">
                        Rp.{toCurrency(item.harga)}
                      </Text>
                      <Text fontSize="xs" isTruncated mx={1}>
                        {item.kota}
                      </Text>
                    </Box>
                  </Box>
                </Pressable>
              )}
              refreshing={false}
              onRefresh={() => {
                this.setState({hasMoreProduct: true});
                refetch();
              }}
              onEndReachedThreshold={0.01}
              onEndReached={() => {
                if (data.data.length) {
                  fetchMore({offset: nextOffset}, (newPayload, oldPayload) => {
                    if (newPayload.data < limit) {
                      this.setState({hasMoreProduct: false});
                    }
                    return {
                      ...oldPayload,
                      data: [...oldPayload.data, ...newPayload.data],
                    };
                  });
                }
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
  showDetailProduk = id => {
    this.props.navigation.navigate('DetailProduk', {idproduk: id});
  };

  searchBox = () => (
    <FormControl px={4} mb={2}>
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
