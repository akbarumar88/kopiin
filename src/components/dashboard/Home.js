import React, {Component} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  Alert,
  ToastAndroid,
  Dimensions,
  RefreshControl,
  NativeAppEventEmitter,
} from 'react-native';
import {
  NativeBaseProvider,
  Box,
  Text,
  Heading,
  VStack,
  FormControl,
  Input,
  Link,
  Button,
  Icon,
  IconButton,
  HStack,
  Divider,
  ScrollView,
  useToast,
  Pressable,
  Image,
  Center,
} from 'native-base';
import {BASE_URL, OAUTH_CLIENT_ID, theme} from '../../utilitas/Config';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';
import auth from '@react-native-firebase/auth';
import axios from 'axios';
import QueryString from 'qs';
import AlertOkV2 from '../universal/AlertOkV2';
import Loading from '../universal/Loading';
import {errMsg} from '../../utilitas/Function';
import AsyncStorage from '@react-native-community/async-storage';
import Resource from '../universal/Resource';
import {MerchantShimmer, BarangShimmer} from '../universal/Placeholder';

export default class Home extends Component {
  defaultStoreAvatar =
    'https://cdn.icon-icons.com/icons2/1706/PNG/512/3986701-online-shop-store-store-icon_112278.png';
  defaultProductAvatar =
    'https://cdn.iconscout.com/icon/free/png-512/box-with-stuff-2349406-1955397.png';

  constructor(props) {
    super(props);

    this.state = {
      refresh: 1,
    };
  }

  render() {
    return (
      <NativeBaseProvider>
        <Box bgColor={'#ff0000'} flex={1}>
          {/* <Box>
            <Text>Ini Header Gan</Text>
          </Box> */}
          <ScrollView
            paddingX={4}
            paddingY={4}
            backgroundColor={'#fff'}
            nestedScrollEnabled
            refreshControl={
              <RefreshControl
                refreshing={false}
                onRefresh={() => {
                  this.setState(s => ({refresh: s.refresh + 1}));
                }}
              />
            }>
            <Box>
              {this.searchBox()}
              <Text bold>Toko / Kedai Terdekat</Text>
              {this.listToko()}
              <Text bold>Mungkin anda suka</Text>
              {this.listBarang()}
            </Box>
          </ScrollView>
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
    return (
      <Resource
        url={`${BASE_URL()}/dashboard/shop`}
        params={{refresh: this.state.refresh}}>
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
              <HStack my={4}>
                {data.data.map(
                  (
                    {
                      nama_toko,
                      alamat_toko,
                      jenis,
                      foto = this.defaultStoreAvatar,
                      jarak = 0,
                      foto_merchant
                    },
                    index,
                  ) => {
                    let imgWidth = Dimensions.get('window').width / 7;
                    let itemWidth = Dimensions.get('window').width / 3.5;
                    return (
                      <Pressable
                        alignItems="flex-start"
                        bgColor="coolGray.100"
                        _pressed={{backgroundColor: 'coolGray.300'}}
                        p={2}
                        mr={2}
                        key={index}
                        w={itemWidth}
                        borderRadius={8}
                        onPress={() => {}}>
                        {/* <View style={[{width}, style.wCardApotek, marginLeft]}> */}
                        <Image
                          alignSelf="center"
                          resizeMode="contain"
                          style={[
                            {width: imgWidth, height: imgWidth},
                            {
                              borderTopLeftRadius: 10,
                              borderTopRightRadius: 10,
                            },
                          ]}
                          source={{
                            uri: `${BASE_URL()}/image/merchant/${foto_merchant}?${new Date()}`,
                          }}
                          alt={nama_toko}
                        />

                        <Box px={0}>
                          <Text fontSize="sm" isTruncated>
                            {nama_toko}
                          </Text>
                          <Text fontSize="xs" bold color="grey">
                            {alamat_toko}
                          </Text>
                          <Text fontSize="xs" color="grey">
                            {jarak} KM dari lokasi anda.
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
                    nama,
                    deskripsi,
                    harga,
                    nama_toko,
                    alamat_toko,
                    jenis,
                    foto = this.defaultProductAvatar,
                    jarak,
                  },
                  index,
                ) => {
                  let imgWidth = Dimensions.get('window').width / 7;
                  let itemWidth = Dimensions.get('window').width / 3.5;
                  return (
                    <Pressable
                      alignItems="flex-start"
                      bgColor="coolGray.100"
                      _pressed={{backgroundColor: 'coolGray.300'}}
                      p={2}
                      mr={2}
                      mb={2}
                      key={index}
                      w={itemWidth}
                      borderRadius={8}
                      onPress={() => {}}>
                      {/* <View style={[{width}, style.wCardApotek, marginLeft]}> */}
                      <Image
                        alignSelf="center"
                        resizeMode="contain"
                        style={[
                          {width: imgWidth, height: imgWidth},
                          {
                            borderTopLeftRadius: 10,
                            borderTopRightRadius: 10,
                          },
                        ]}
                        source={{
                          uri: foto,
                        }}
                        alt={nama}
                      />

                      <Box px={0}>
                        <Text fontSize="sm" isTruncated>
                          {nama}
                        </Text>
                        <Text fontSize="xs" bold color="grey">
                          {deskripsi}
                        </Text>
                        <Text fontSize="xs" color="grey">
                          {harga}
                        </Text>
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
