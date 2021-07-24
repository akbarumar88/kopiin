import React, {Component} from 'react';
import {
  NativeBaseProvider,
  FlatList,
  VStack,
  HStack,
  Text,
  Button,
  Input,
  Spinner,
  Box,
} from 'native-base';
import ImageLoad from './../universal/ImageLoad';
import {Dimensions, TextInput, ToastAndroid} from 'react-native';
import Resource from './../universal/Resource';
import {BASE_URL} from './../../utilitas/Config';
import {toCurrency} from './../../utilitas/Function';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
export default class UbahKeranjang extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dataDetail: [],
      errors: [],
    };
  }

  simpanDetail = async () => {
    const {dataDetail} = this.state;
    await axios.post(
      BASE_URL() + '/orderdetail/v2',
      JSON.stringify(dataDetail),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    AsyncStorage.setItem('refreshKeranjang', 'Oke');
    this.props.navigation.goBack();
  };

  validation = () => {
    const {dataDetail} = this.state;
    let validated = true;
    dataDetail.some(item => {
      if (isNaN(parseInt(item.jumlah.toString()))) {
        ToastAndroid.show(
          'Isi jumlah ' + item.nama + ' dengan benar',
          ToastAndroid.SHORT,
        );
        validated = false;
        return true;
      }
    });
    if (validated) {
      this.simpanDetail();
    }
  };

  itemRender = (item, index) => {
    const {dataDetail} = this.state;
    const imageWidth = Dimensions.get('window').width * 0.15;
    const urlGambar = `${BASE_URL()}/image/barang/`;
    return (
      <Box mx={2} my={1} p={4} bg="white" flex={1}>
        <HStack mb={2} space={2} alignItems="center">
          <ImageLoad
            w={imageWidth}
            h={imageWidth}
            url={urlGambar + item.foto_barang}
          />

          <VStack>
            <Text bold>{item.nama}</Text>
            <Text fontSize="md" color="red">
              {toCurrency(item.harga)}
            </Text>
          </VStack>
        </HStack>
        <HStack>
          <Button
            onPress={() => {
              if (dataDetail[index].jumlah > 1) {
                dataDetail[index].jumlah--;
                this.setState({dataDetail: dataDetail});
              } else if (isNaN(parseInt(dataDetail[index].jumlah.toString))) {
                dataDetail[index].jumlah = 1;
                this.setState({dataDetail: dataDetail});
              }
            }}
            size="sm"
            _text={{color: 'white'}}
            colorScheme="danger">
            -
          </Button>
          <TextInput
            keyboardType="number-pad"
            value={dataDetail[index]?.jumlah?.toString()}
            onChangeText={e => {
              dataDetail[index].jumlah = isNaN(parseInt(e))
                ? ''
                : parseInt(e) <= 0
                ? 1
                : parseInt(e);
              this.setState({dataDetail: dataDetail});
            }}
            style={{
              paddingVertical: 0,
              paddingHorizontal: 10,
              textAlign: 'center',
            }}
          />
          <Button
            onPress={() => {
              if (isNaN(parseInt(dataDetail[index].jumlah.toString()))) {
                dataDetail[index].jumlah = 1;
              } else {
                dataDetail[index].jumlah++;
              }
              this.setState({dataDetail: dataDetail});
            }}
            size="sm">
            +
          </Button>
        </HStack>
        <HStack mb={2}>
          <Input
            flex={1}
            variant="underlined"
            value={dataDetail[index]?.keterangan}
            onChangeText={e => {
              dataDetail[index].keterangan = e;
              this.setState({
                dataDetail: dataDetail,
              });
            }}
            placeholder="Tulis Catatan"
          />
        </HStack>
      </Box>
    );
  };

  render() {
    return (
      <NativeBaseProvider>
        <Resource
          url={`${BASE_URL()}/orderdetail/orders/${
            this.props.route.params.idorder
          }`}>
          {({loading, error, payload: data, refetch, fetchMore}) => {
            const {dataDetail} = this.state;

            if (loading) {
              return (
                <Box flex={1}>
                  <Spinner color="green" />
                </Box>
              );
            } else if (!loading && dataDetail != data.data) {
              this.setState({
                dataDetail: data.data,
              });
            }

            return (
              <FlatList
                flex={1}
                data={loading ? [] : data.data}
                renderItem={({item, index}) => this.itemRender(item, index)}
              />
            );
          }}
        </Resource>

        <Button
          m={3}
          onPress={() => {
            this.validation();
          }}>
          Simpan
        </Button>
      </NativeBaseProvider>
    );
  }
}
