import {
  NativeBaseProvider,
  FormControl,
  Input,
  Button,
  Icon,
  HStack,
  Box,
  Text,
  VStack,
  FlatList,
  useDisclose,
  Actionsheet,
  Fab,
  Divider,
  ScrollView,
  Stack,
  Checkbox,
} from 'native-base';

import * as React from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ImageLoad from '../universal/ImageLoad';
import {Dimensions, Linking, ToastAndroid} from 'react-native';
import Resource from '../universal/Resource';
import AsyncStorage from '@react-native-community/async-storage';
import {BASE_URL} from '../../utilitas/Config';
import FooterLoading from '../universal/FooterLoading';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import EmptyCart from './../universal/EmptyCart';
import {toCurrency} from '../../utilitas/Function';
import {alignItems} from 'styled-system';
import Axios from 'axios';

class HeaderTransaksi extends React.Component {
  render() {
    const {data} = this.props;
    return (
      <Stack space={1} py={2}>
        <Text sub>Nama Toko</Text>
        <Text fontSize="sm" bold color="green">
          {data.nama_toko}
        </Text>
        <Divider my={1} />
        <Text sub>Alamat Toko</Text>
        <Text fontSize="sm" bold color="green">
          {data.alamat_toko}
        </Text>
        <Divider my={1} />
      </Stack>
    );
  }
}

class DaftarKurir extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      kurir: this.props.data.kurir.map(a => a.kodekurir),
    };
  }
  render() {
    const {data} = this.props;

    const {kurir} = this.state;
    return (
      <Stack space={1} mt={2} py={2}>
        <Text bold>Daftar Kurir yang tersedia</Text>
        <Resource url={`${BASE_URL()}/kurir`}>
          {({loading, error, payload: item, refetch, fetchMore}) => {
            if (loading) {
              return <FooterLoading full />;
            } else if (error) {
              return <></>;
            }
            return (
              <FlatList
                alignItems="flex-start"
                px={2}
                data={item.data}
                renderItem={({item}) => (
                  <Checkbox
                    onChange={value => {
                      if (value) {
                        kurir.push(item.kodekurir);
                      } else {
                        kurir.splice(kurir.indexOf(item.kodekurir), 1);
                      }
                      this.props.setKurir(kurir);
                      this.setState({
                        kurir: kurir,
                      });
                    }}
                    isChecked={kurir.includes(item.kodekurir)}
                    size="sm"
                    mt={2}
                    value={item.kodekurir}>
                    {item.kurir}
                  </Checkbox>
                )}
              />
            );
          }}
        </Resource>
      </Stack>
    );
  }
}

class ItemKurir extends React.Component {
  render() {
    const {data} = this.props;
    return <Checkbox />;
  }
}

export default class SettingKurir extends React.Component {
  constructor(props) {
    super(props);
    this.setKurir = this.setKurir.bind(this);
    this.state = {
      kurir: [],
      merchant: null,
      loading: false,
    };
  }

  async componentDidMount() {
    let idmerchant = await AsyncStorage.getItem('id_merchant');
    this.setState({merchant: idmerchant});
  }

  setKurir(kurir) {
    this.setState({
      kurir: kurir,
    });
  }

  simpanData() {
    if (this.state.kurir.length == 0) {
      ToastAndroid.show('Pilih Salah Satu Kurir', ToastAndroid.SHORT);
      return;
    }
    this.setState({loading: true});
    let data = {
      id_merchant: this.state.merchant,
      kodekurir: this.state.kurir,
    };
    Axios.post(`${BASE_URL()}/kurir`, JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(({data}) => {
        ToastAndroid.show('Data Berhasil disimpan', ToastAndroid.SHORT);
        this.setState({loading: false});
      })
      .catch(e => {
        ToastAndroid.show(
          'Terjadi kesalahan saat menyimpan',
          ToastAndroid.SHORT,
        );
        this.setState({loading: false});
      });
  }

  render() {
    const {kurir, merchant} = this.state;
    return (
      <NativeBaseProvider>
        <Box bg="white" px={2} flex={1}>
          {merchant && (
            <Resource url={`${BASE_URL()}/kurir/shop/${merchant}`}>
              {({loading, error, payload: data, refetch, fetchMore}) => {
                if (loading) {
                  return <FooterLoading full />;
                } else if (error) {
                  return <></>;
                }
                return (
                  <FlatList
                    flex={1}
                    refreshing={false}
                    onRefresh={() => {
                      refetch();
                    }}
                    ListFooterComponent={() => (
                      <Button
                        isLoading={this.state.loading}
                        isLoadingText="Proses"
                        onPress={() => this.simpanData()}
                        mt={5}
                        m={3}>
                        Simpan
                      </Button>
                    )}
                    data={[data?.data]}
                    mx={2}
                    renderItem={({item}) => (
                      <>
                        {/* Header */}
                        <HeaderTransaksi data={item} />
                        <DaftarKurir setKurir={this.setKurir} data={item} />
                      </>
                    )}
                  />
                );
              }}
            </Resource>
          )}
        </Box>
      </NativeBaseProvider>
    );
  }
}
