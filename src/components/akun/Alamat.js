import * as React from 'react';
import {ToastAndroid} from 'react-native';
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
  Avatar,
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

export default class Alamat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      iduser: '-',
      cari: '',
      refresh: new Date(),
    };
  }

  async componentDidMount() {
    this.props.navigation.setOptions({
      headerRight: () => (
        <Button
          variant="ghost"
          colorScheme="success"
          size="sm"
          onPress={() => this.tambahAlamat()}>
          Tambah Alamat
        </Button>
      ),
    });

    let iduser = await AsyncStorage.getItem('id');
    this.setState({iduser: iduser});
  }

  pilihAlamat = id => {
    console.log(
      `${BASE_URL()}/order/alamat/${this.props.route.params.idorder}`,
    );
    axios
      .put(
        `${BASE_URL()}/order/alamat/${this.props.route.params.idorder}`,
        QueryString.stringify({id_alamat: id}),
      )
      .then(() => {
        AsyncStorage.setItem('refreshKeranjang', 'Iya');
        this.props.navigation.goBack();
      });
  };

  hapusAlamat = id => {
    this.alert.show(
      {message: 'Anda yakin ingin menghapus data ini ?'},
      async () => {
        await axios.delete(`${BASE_URL()}/alamat/${id}`).then(e => {
          this.refreshData();
        });
      },
    );
  };

  refreshData = () => {
    this.setState({refresh: new Date()});
  };

  editAlamat = id => {
    this.props.navigation.navigate('FormAlamat', {
      idalamat: id,
      refreshData: this.refreshData,
    });
  };
  tambahAlamat = () => {
    this.props.navigation.navigate('FormAlamat', {
      refreshData: this.refreshData,
    });
  };

  daftarAlamat = () => (
    <Resource
      url={`${BASE_URL()}/alamat/user/${this.state.iduser}?cari=${encodeURI(
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
                placeholder="Cari Alamat"
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
              flex={1}
              data={data.data}
              renderItem={({item, index}) => (
                <Box
                  my={1}
                  mx={1}
                  shadow={4}
                  rounded={5}
                  py={4}
                  bg="white"
                  px={4}>
                  <Text bold={true}>{item.nama}</Text>
                  <Text fontSize="sm" color="grey" mt={1}>
                    {item.no_telp}
                  </Text>
                  <Text fontSize="sm" color="grey" mt={1}>
                    {item.detail}
                  </Text>
                  {this.props.route.params && (
                    <Button
                      size="sm"
                      onPress={() => {
                        if (this.props.route.params.selected != item.id) {
                          this.pilihAlamat(item.id);
                        }
                      }}
                      mt={3}
                      colorScheme="success"
                      variant={
                        this.props.route.params.selected == item.id
                          ? 'solid'
                          : 'outline'
                      }>
                      {this.props.route.params.selected == item.id
                        ? 'Alamat dipilih'
                        : 'Pilih Alamat'}
                    </Button>
                  )}
                  {!this.props.route.params && (
                    <HStack space="2">
                      <Button
                        size="sm"
                        onPress={() => this.editAlamat(item.id)}
                        flex={1}
                        mt={3}
                        variant="outline">
                        Ubah Alamat
                      </Button>
                      <Button
                        size="sm"
                        mt={3}
                        onPress={() => this.hapusAlamat(item.id)}
                        colorScheme="danger"
                        variant="outline">
                        Hapus Alamat
                      </Button>
                    </HStack>
                  )}
                </Box>
              )}
              refreshing={false}
              onRefresh={() => {
                refetch();
              }}
            />
          </>
        );
      }}
    </Resource>
  );

  render() {
    const {iduser} = this.state;
    return (
      <NativeBaseProvider>
        <AlertYesNoV2 ref={ref => (this.alert = ref)} />

        <Box flex={1} paddingX={4} bg="white" pb={8}>
          {iduser != '-' && this.daftarAlamat()}
        </Box>
      </NativeBaseProvider>
    );
  }
}
