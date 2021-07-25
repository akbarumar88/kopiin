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
import Resource from './../universal/Resource';
import Loading from './../universal/Loading';
import AlertOkV2 from './../universal/AlertOkV2';
import AlertYesNoV2 from './../universal/AlertYesNoV2';
import FooterLoading from '../universal/FooterLoading';

export default class Alamat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      iduser: '-',
      cari: '',
      refresh: new Date(),
      loading: false,
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

  setAlamatDefault = id => {
    this.setState({loading: true});
    axios
      .put(
        `${BASE_URL()}/alamat/default/${id}`,
        QueryString.stringify({id_user: this.state.iduser}),
      )
      .then(res => {
        this.setState({loading: false});
        this.refreshData();
      })
      .catch(e => {
        this.setState({loading: false});
        this.alertOk.show({
          message:
            e.response?.data?.errorMessage ?? errMsg('Set Alamat Default'),
        });
      });
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
        if (loading) {
          return <FooterLoading full />;
        } else if (error) {
          return <Text>{error.message}</Text>;
        }
        const {cari} = this.state;
        return (
          <>
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
              renderItem={({item, index}) => this.itemAlamat(item, index)}
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

  itemAlamat = (item, index) => {
    let alamatDefault = item.flagdefault == 1;
    let condProps = alamatDefault
      ? {
          borderWidth: 1,
          borderColor: theme.primary,
          backgroundColor: `${theme.primary}11`,
        }
      : {borderWidth: 1, borderColor: 'coolGray.200', backgroundColor: `#fff`};
    return (
      <Box my={1} mx={1} rounded={5} py={4} bg="white" px={4} {...condProps}>
        {alamatDefault ? <Text bold color="coolGray.500" fontSize="xs">Alamat Utama</Text> : null}
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
              this.props.route.params.selected == item.id ? 'solid' : 'outline'
            }>
            {this.props.route.params.selected == item.id
              ? 'Alamat dipilih'
              : 'Pilih Alamat'}
          </Button>
        )}
        {!this.props.route.params && (
          <VStack>
            <HStack space="2">
              <Button
                size="sm"
                onPress={() => this.editAlamat(item.id)}
                flex={1}
                mt={3}
                variant={alamatDefault ? 'solid' : 'outline'}>
                Ubah Alamat
              </Button>
              {!alamatDefault ? (
                <Button
                  size="sm"
                  mt={3}
                  onPress={() => this.hapusAlamat(item.id)}
                  colorScheme="danger"
                  variant={alamatDefault ? 'solid' : 'outline'}>
                  Hapus Alamat
                </Button>
              ) : null}
            </HStack>
            <Button
              size="sm"
              mt={3}
              onPress={() => this.setAlamatDefault(item.id)}
              colorScheme={alamatDefault ? 'coolGray' : 'primary'}
              variant={alamatDefault ? 'outline' : 'solid'}
              disabled={alamatDefault}>
              {alamatDefault ? 'Alamat Default' : 'Jadikan Default'}
            </Button>
          </VStack>
        )}
      </Box>
    );
  };

  render() {
    const {iduser, loading} = this.state;
    return (
      <NativeBaseProvider>
        <Loading isVisible={loading} />
        <AlertYesNoV2 ref={ref => (this.alert = ref)} />
        <AlertOkV2 ref={ref => (this.alertOk = ref)} />

        <Box flex={1} paddingX={4} bg="white" pb={8}>
          {iduser != '-' && this.daftarAlamat()}
        </Box>
      </NativeBaseProvider>
    );
  }
}
