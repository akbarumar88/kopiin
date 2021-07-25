import * as React from 'react';
import {ToastAndroid, Dimensions} from 'react-native';
import {
  NativeBaseProvider,
  Box,
  Heading,
  VStack,
  FormControl,
  Input,
  Button,
  ScrollView,
  HStack,
  Image,
  Text,
  FlatList,
} from 'native-base';
import {BASE_URL, theme} from '../../utilitas/Config';
import axios from 'axios';
import {errMsg} from '../../utilitas/Function';
import QueryString from 'qs';
import AsyncStorage from '@react-native-community/async-storage';
import AlertOkV2 from './../universal/AlertOkV2';
import Resource from './../universal/Resource';
import Loading from './../universal/Loading';
import AlertYesNoV2 from './../universal/AlertYesNoV2';

export default class MyProduk extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      idmerchant: '-',
      cari: '',
      refresh: new Date(),
    };
  }

  async componentDidMount() {
    this.props.navigation.setOptions({
      title: 'Barang ku',
      headerRight: () => (
        <Button
          variant="ghost"
          colorScheme="success"
          size="sm"
          onPress={() => this.tambahBarang()}>
          Tambah
        </Button>
      ),
    });

    let idmerchant = await AsyncStorage.getItem('id_merchant');
    this.setState({idmerchant: idmerchant});
  }

  hapusBarang = id => {
    this.dialog.show(
      {message: 'Anda yakin ingin menghapus data ini ?'},
      async () => {
        await axios
          .delete(`${BASE_URL()}/barang/${id}`)
          .then(({data}) => {
            if (data.status) {
              this.refreshData();
            } else {
              this.alert.show({message: 'Produk sedang dipakai'});
            }
          })
          .catch(e => {
            this.alert.show({message: 'Produk sedang dipakai'});
          });
      },
    );
  };

  refreshData = () => {
    this.setState({refresh: new Date()});
  };

  editBarang = id => {
    this.props.navigation.navigate('FormProduk', {
      idproduk: id,
      refreshData: this.refreshData,
    });
  };
  tambahBarang = () => {
    this.props.navigation.navigate('FormProduk', {
      refreshData: this.refreshData,
    });
  };

  daftarBarang = () => (
    <Resource
      url={`${BASE_URL()}/barang/shop/${this.state.idmerchant}?cari=${encodeURI(
        this.state.cari,
      )}`}
      params={{refresh: this.state.refresh}}>
      {({loading, error, payload: data, refetch}) => {
        const {cari} = this.state;
        return (
          <>
            <Loading isVisible={loading} />
            <FormControl>
              <Input
                keyboardType="web-search"
                mt={3}
                mb={2}
                tyoe
                onSubmitEditing={e => {
                  this.setState({cari: e.nativeEvent.text});
                }}
                placeholder="Cari Barang"
                bg="whitesmoke"
              />
            </FormControl>
            {data.data?.length == 0 && !loading && (
              <Text mt={10} color="grey" alignSelf={{base: 'center'}}>
                Tidak ada Data
              </Text>
            )}
            <FlatList
              mt={2}
              mb={4}
              py={1}
              data={data.data}
              renderItem={({item, index}) => (
                <Box
                  my={1}
                  mb={3}
                  mx={1}
                  shadow={4}
                  rounded={5}
                  py={4}
                  bg="white"
                  px={4}>
                  <Image
                    my={1}
                    alt="gambar"
                    alignSelf={{base: 'center'}}
                    source={{
                      uri: item.foto_barang
                        ? `${BASE_URL()}/image/barang/${
                            item.foto_barang
                          }?time=${new Date()}`
                        : 'https://www.pixsy.com/wp-content/uploads/2021/04/ben-sweet-2LowviVHZ-E-unsplash-1.jpeg',
                    }}
                    size={Dimensions.get('screen').width * 0.18}
                  />
                  <Text bold={true}>{item.nama}</Text>
                  <Text fontSize="sm" color="grey" mt={1}>
                    {'Harga : ' + item.harga}
                  </Text>
                  <Text fontSize="sm" color="grey" mt={1}>
                    {'Stok : ' + item.stok}
                  </Text>
                  {this.props.route.params && (
                    <Button
                      size="sm"
                      mt={3}
                      onPress={() => {
                        this.props.route.params.pilih(item);
                        this.props.navigation.goBack();
                      }}
                      colorScheme="primary"
                      variant="outline">
                      Pilih Barang
                    </Button>
                  )}
                  {!this.props.route.params && (
                    <HStack space="2">
                      <Button
                        size="sm"
                        onPress={() => this.editBarang(item.id)}
                        flex={1}
                        mt={3}
                        variant="outline">
                        Ubah Barang
                      </Button>
                      <Button
                        size="sm"
                        mt={3}
                        onPress={() => this.hapusBarang(item.id)}
                        colorScheme="danger"
                        variant="outline">
                        Hapus Barang
                      </Button>
                    </HStack>
                  )}
                </Box>
              )}
            />
          </>
        );
      }}
    </Resource>
  );

  render() {
    const {idmerchant} = this.state;
    return (
      <NativeBaseProvider>
        <AlertYesNoV2 ref={ref => (this.dialog = ref)} />
        <AlertOkV2 ref={ref => (this.alert = ref)} />
        <Box flex={1} paddingX={4} bg="white" pb={8}>
          <VStack space={1} mt={2} mb={5}>
            {idmerchant != '-' && this.daftarBarang()}
          </VStack>
        </Box>
      </NativeBaseProvider>
    );
  }
}
