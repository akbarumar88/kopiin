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
  Input,
  VStack,
  Avatar,
  Button,
  Icon,
  FormControl,
  Divider,
} from 'native-base';
import {Dimensions, Linking} from 'react-native';
import Resource from '../universal/Resource';
import {BASE_URL, theme} from '../../utilitas/Config';
import {toCurrency} from '../../utilitas/Function';
import {TabView, TabBar, SceneMap} from 'react-native-tab-view';
import FooterLoading from '../universal/FooterLoading';
export default class DetailToko extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cari: '',
      pencarian: '',
      tabIndex: 0,
      tabRoutes: [{key: 'barang', title: 'Barang'}],
    };
  }

  openMaps = (lat, long) => {
    Linking.openURL(`http://www.google.com/maps/place/${lat},${long}`);
  };

  searchBox = () => (
    <FormControl mt={5} px={5}>
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

  listProduct = () => {
    const {pencarian} = this.state;
    const urlGambar = `${BASE_URL()}/image/barang/`;

    const imgWidth = (Dimensions.get('screen').width * 0.5) / 2;
    return (
      <Box bgColor="white" flex={1}>
        {this.searchBox()}
        <Resource
          url={
            `${BASE_URL()}/barang/shop/${
              this.props.route.params.idtoko
            }/?cari=` + encodeURI(pencarian)
          }>
          {({loading, error, payload: data, refetch}) => {
            if (loading) {
              return (
                <FooterLoading full />
              );
            }

            return (
              <FlatList
                numColumns={1}
                horizontal={false}
                flex={1}
                mt={1}
                mx={3}
                data={[...data.data]}
                keyExtractor={(item, index) => item.id}
                showsVerticalScrollIndicator={false}
                renderItem={({item, index}) => (
                  <Pressable
                    mt={3}
                    onPress={() => {
                      this.props.navigation.navigate('DetailProduk', {
                        idproduk: item.id,
                      });
                    }}
                    flex={0.5}>
                    <Box
                      mx={1}
                      key={index}
                      pb={4}
                      mb={1}
                      px={4}
                      flexDirection="row"
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
                        source={{
                          uri: urlGambar + item.foto_barang,
                        }}
                        alt={item.nama}
                      />
                      <VStack ml={3}>
                        <Text fontSize="sm" bold={true} isTruncated>
                          {item.nama}
                        </Text>
                        <HStack alignItems="center" mt={1} pr={2}>
                          <Icon
                            mr={1}
                            size="xs"
                            color="orange"
                            as={<MaterialCommunityIcons name="star" />}
                          />
                          <Text sub={true}>{item.rating}</Text>
                        </HStack>
                        <Text fontSize="xs" bold color="grey">
                          {item.deskripsi}
                        </Text>
                        <Text fontSize="xs" color="grey">
                          Rp.{toCurrency(item.harga)}
                        </Text>
                      </VStack>
                    </Box>
                    <Divider />
                  </Pressable>
                )}
              />
            );
          }}
        </Resource>
      </Box>
    );
  };

  tabToko = () => {
    const {tabIndex, tabRoutes} = this.state;
    return (
      <TabView
        lazy
        navigationState={{index: tabIndex, routes: tabRoutes}}
        renderScene={SceneMap({
          barang: this.listProduct,
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
      />
    );
  };

  render() {
    const urlToko = `${BASE_URL()}/image/merchant/`;
    return (
      <NativeBaseProvider>
        <Box flex={1}>
          <Resource
            url={`${BASE_URL()}/shop/${this.props.route.params.idtoko}`}>
            {({loading, error, payload: data, refetch}) => {
              if (loading) {
                return (
                  <FooterLoading full />
                );
              } else {
              }

              return (
                <>
                  <Box bg="white" my={2} py={4} px={3}>
                    <HStack alignItems="center">
                      <Avatar
                        mr={4}
                        source={{
                          uri: urlToko + data.data.foto_merchant,
                        }}
                        alt={data.data.nama_toko}
                      />
                      <VStack flex={1}>
                        <Text ml={2} bold={true}>
                          {data.data.nama_toko}
                        </Text>
                        <Pressable
                          onPress={() => {
                            this.openMaps(
                              data.data.lat_toko,
                              data.data.long_toko,
                            );
                          }}>
                          <HStack alignItems="center" mt={1} pr={2}>
                            <Icon
                              mr={1}
                              size="xs"
                              as={<MaterialCommunityIcons name="map-marker" />}
                            />
                            <Text fontSize="xs">
                              {data.data.alamat_toko +
                                ', ' +
                                data.data.kecamatan +
                                ', ' +
                                data.data.kota +
                                ', ' +
                                data.data.provinsi}
                            </Text>
                          </HStack>
                        </Pressable>
                        <Pressable
                          onPress={() =>
                            Linking.openURL(`tel:${data.data.no_telp}`)
                          }>
                          <HStack alignItems="center" mt={1} pr={2}>
                            <Icon
                              mr={1}
                              size="xs"
                              as={<MaterialCommunityIcons name="phone" />}
                            />

                            <Text fontSize="xs">{data.data.no_telp}</Text>
                          </HStack>
                        </Pressable>
                        <VStack mx={3}>
                          <Button
                            onPress={() =>
                              Linking.openURL(`tel:${data.data.no_telp}`)
                            }
                            size="xs"
                            mt={2}>
                            Hubungi Toko
                          </Button>
                          <Button
                            size="xs"
                            onPress={() => {
                              this.openMaps(
                                data.data.lat_toko,
                                data.data.long_toko,
                              );
                            }}
                            mt={1}>
                            Kunjungi Toko
                          </Button>
                        </VStack>
                      </VStack>
                    </HStack>
                    <HStack mt={1}>
                      <HStack alignItems="center" mt={1} pr={2}>
                        <Icon
                          mr={1}
                          size="xs"
                          as={<MaterialCommunityIcons name="star" />}
                        />
                        <Text sub={true}>{data.data.rating}</Text>
                      </HStack>
                      <HStack alignItems="center" mt={1} pr={2}>
                        <Icon
                          mr={1}
                          size="xs"
                          as={<MaterialCommunityIcons name="cart" />}
                        />
                        <Text sub={true}>{data.data.jumlahbeli}</Text>
                      </HStack>
                      <HStack alignItems="center" mt={1} pr={2}>
                        <Icon
                          mr={1}
                          size="xs"
                          as={<MaterialCommunityIcons name="message-draw" />}
                        />
                        <Text sub={true}>{data.data.jumlahulasan}</Text>
                      </HStack>
                    </HStack>
                  </Box>
                  {this.tabToko()}
                </>
              );
            }}
          </Resource>
        </Box>
      </NativeBaseProvider>
    );
  }
}
