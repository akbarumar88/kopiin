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
  Button,
} from 'native-base';
import {Dimensions} from 'react-native';
import Resource from './../universal/Resource';
import {BASE_URL} from './../../utilitas/Config';

export default class DetailProduk extends Component {
  constructor(props) {
    super(props);

    this.state = {
      varian: 0,
    };
  }

  render() {
    const urlGambar = `${BASE_URL()}/image/barang/`;
    const urlToko = `${BASE_URL()}/image/merchant/`;
    return (
      <NativeBaseProvider>
        <Box flex={1}>
          {/* <Box>
            <Text>Ini Header Gan</Text>
          </Box> */}
          <ScrollView px={2} flex={1} nestedScrollEnabled>
            <Resource
              url={`${BASE_URL()}/barang/${this.props.route.params.idproduk}`}>
              {({loading, error, payload: data, refetch}) => {
                if (loading) {
                  return (
                    <Box flex={1}>
                      <Spinner color="green" />
                    </Box>
                  );
                }

                return (
                  <>
                    <Box
                      bg="white"
                      height={Dimensions.get('screen').height * 0.25}>
                      <Image
                        flex={1}
                        style={{
                          resizeMode: 'contain',
                        }}
                        source={{
                          uri: urlGambar + data.data.foto_barang,
                        }}
                      />
                    </Box>
                    <Box bg="white" mt={2} py={4} px={3}>
                      <Text bold fontSize={20}>
                        {data.data.harga}
                      </Text>
                      <Text fontSize={14}>{data.data.nama}</Text>
                    </Box>
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

                    {data.data.varian?.length > 0 && (
                      <Box bg="white" mt={2} py={4} px={3}>
                        <Text bold={true}>Pilih Variasi</Text>
                        <FlatList
                          mt={2}
                          data={data.data.varian}
                          numColumns={4}
                          keyExtractor={(item, index) => index}
                          renderItem={({item}) => {
                            return (
                              <Pressable
                                onPress={() => {
                                  this.setState({varian: item.id});
                                  console.log(this.state.varian);
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
                          Berat
                        </Text>
                        <Text fontSize={14} flex={1}>
                          {data.data.berat} gram
                        </Text>
                      </HStack>
                      <Divider />
                      <Text mt={4}>{data.data.deskripsi}</Text>
                    </Box>
                  </>
                );
              }}
            </Resource>
          </ScrollView>
          <Box px={3} pb={2}>
            <Button colorScheme="success">Masukkan Keranjang</Button>
          </Box>
        </Box>
      </NativeBaseProvider>
    );
  }
}
