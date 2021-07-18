import * as React from 'react';
import {
  NativeBaseProvider,
  Box,
  Heading,
  VStack,
  FormControl,
  Input,
  Button,
  ScrollView,
  Select,
  Avatar,
  Pressable,
} from 'native-base';
import {BASE_URL, theme} from '../../utilitas/Config';
import axios from 'axios';
import {errMsg} from '../../utilitas/Function';
import QueryString from 'qs';
import AsyncStorage from '@react-native-community/async-storage';
import AlertOkV2 from './../universal/AlertOkV2';
import Resource from './../universal/Resource';
import Loading from './../universal/Loading';
import {launchImageLibrary} from 'react-native-image-picker';

export default class Shop extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: {},
      form: {},
      jenis: [],
      kota: '',
      kecamatan: '',
      daerah: '',
      id_mechant: '',
      loading: false,
      loadingData: false,
      foto_merchant: 'https://puprpkpp.riau.go.id/asset/img/default-image.png',
    };
  }
  handleChoosePhoto() {
    launchImageLibrary({noData: true}, response => {
      // console.log(response);
      if (response.assets) {
        this.setState({foto_merchant: response.assets[0]});
      }
    });
  }

  componentDidMount() {
    this.loadDataShop();
  }

  async loadDataShop() {
    let id_merchant = await AsyncStorage.getItem('id_merchant');
    if (id_merchant) {
      this.setState({loadingData: true, id_mechant: id_merchant});
      axios
        .get(`${BASE_URL()}/shop/${id_merchant}`)
        .then(async ({data}) => {
          this.setState({loadingData: false});
          const {data: value} = data;
          let dataToko = {
            namaToko: value.nama_toko,
            jenis_toko: value.jenis_toko,
            alamatToko: value.alamat_toko,
            lat_toko: value.lat_toko,
            long_toko: value.long_toko,
            provinsi: value.provinsi,
            kota: value.kota,
            kecamatan: value.kecamatan,
            kodepos: value.kodepos,
          };

          this.setState({
            form: dataToko,
            foto_merchant:
              BASE_URL() +
              '/image/merchant/' +
              value.foto_merchant +
              '?' +
              new Date(),
            kota: value.idprovinsi,
            kecamatan: value.idkota,
            daerah: value.kecamatan,
          });
        })
        .catch(e => {
          this.setState({loadingData: false});
          this.alert.show({
            message: errMsg('Buat Toko'),
          });
        });
    }
  }

  validate = () => {
    const {form, kota, kecamatan, daerah} = this.state;
    let error;
    if (!form.namaToko) {
      error = {...error, namaToko: 'Nama Toko harus diisi'};
    }
    if (!form.alamatToko) {
      error = {...error, alamatToko: 'Alamat Toko harus diisi'};
    }
    if (!form.kodepos) {
      error = {...error, kodepos: 'Kode Pos Toko harus diisi'};
    }
    if (!form.jenis_toko) {
      error = {...error, jenis_toko: 'Jenis Toko harus diisi'};
    }
    if (kota == '') {
      error = {...error, provinsi: 'Provinsi harus diisi'};
    } else if (kecamatan == '') {
      error = {...error, kota: 'Kota harus diisi'};
    } else if (daerah == '') {
      error = {...error, kecamatan: 'Kecamatan harus diisi'};
    }
    this.setState({error: error ?? {}});
    if (error) {
      return;
    }
    this.simpan();
  };

  simpan = async () => {
    const {form, kota, kecamatan} = this.state;
    this.setState({loading: true});
    let id = await AsyncStorage.getItem('id');

    axios
      .post(
        `${BASE_URL()}/user/shop/${id}`,
        QueryString.stringify({
          nama_toko: form.namaToko,
          jenis_toko: form.jenis_toko,
          alamat_toko: form.alamatToko,
          lat_toko: '0',
          long_toko: '0',
          provinsi: form.provinsi,
          kota: form.kota,
          kecamatan: form.kecamatan,
          kodepos: form.kodepos,
          idprovinsi: kota,
          idkota: kecamatan,
        }),
      )
      .then(async ({data}) => {
        this.setState({loading: false});
        if (data.status) {
          const {data: value} = data;

          if (value.id_merchant) {
            this.setState({id_mechant: value.id_merchant.toString()});
            AsyncStorage.setItem('id_merchant', value.id_merchant.toString());
          }
          if (this.state.foto_merchant.uri) {
            this.uploadFoto();
          }

          this.props.navigation.reset({
            index: 0,
            routes: [{name: 'Dashboard'}],
          });
        }
      })
      .catch(e => {
        this.setState({loading: false});
        this.alert.show({
          message: errMsg('Buat Toko'),
        });
      });
  };

  uploadFoto = () => {
    let data = new FormData();
    let photo = this.state.foto_merchant;
    data.append('foto_merchant', {
      name: photo.fileName,
      type: photo.type,
      uri: Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.uri,
    });
    console.log(`${BASE_URL()}/fotomerchant/${this.state.id_mechant}`);
    axios
      .post(`${BASE_URL()}/user/fotomerchant/${this.state.id_mechant}`, data)
      .then(async ({data}) => {
        console.log(data);
      })
      .catch(e => {
        console.warn(e);
      });
    return data;
  };

  optionProvince() {
    return (
      <Resource url="https://dev.farizdotid.com/api/daerahindonesia/provinsi">
        {({loading, error, payload: data, refetch}) => {
          return (
            <FormControl
              isInvalid={'provinsi' in this.state.error}
              isDisabled={loading || error}>
              <FormControl.Label
                _text={{
                  color: 'muted.700',
                  fontSize: 'sm',
                  fontWeight: 600,
                }}>
                Provinsi
              </FormControl.Label>
              <Select
                selectedValue={this.state.form.provinsi}
                onValueChange={val => {
                  let idprovinsi = data.provinsi.find(function (e) {
                    return e.nama == val;
                  });

                  if (this.state.kota != idprovinsi.id.toString()) {
                    this.setState({kecamatan: ''});
                  }
                  this.setState({
                    form: {...this.state.form, provinsi: val},
                    kota: idprovinsi.id.toString(),
                  });
                }}>
                {!loading && !error ? (
                  data.provinsi.map(e => (
                    <Select.Item key={e.id} value={e.nama} label={e.nama} />
                  ))
                ) : (
                  <></>
                )}
              </Select>
            </FormControl>
          );
        }}
      </Resource>
    );
  }

  optionCity() {
    return (
      <Resource
        url={
          'https://dev.farizdotid.com/api/daerahindonesia/kota?id_provinsi=' +
          this.state.kota
        }>
        {({loading, error, payload: data, refetch}) => {
          return (
            <FormControl
              isInvalid={'kota' in this.state.error}
              isDisabled={loading || this.state.kota == '' || error}>
              <FormControl.Label
                _text={{
                  color: 'muted.700',
                  fontSize: 'sm',
                  fontWeight: 600,
                }}>
                Kota
              </FormControl.Label>
              <Select
                selectedValue={this.state.form.kota}
                onValueChange={val => {
                  let idcity = data.kota_kabupaten.find(e => e.nama == val);
                  if (this.state.kecamatan != idcity.id) {
                    this.setState({daerah: ''});
                  }
                  this.setState({
                    form: {...this.state.form, kota: val},
                    kecamatan: idcity.id,
                  });
                }}>
                {!loading && !error && this.state.kota != '' ? (
                  data.kota_kabupaten.map(e => (
                    <Select.Item key={e.nama} value={e.nama} label={e.nama} />
                  ))
                ) : (
                  <></>
                )}
              </Select>
            </FormControl>
          );
        }}
      </Resource>
    );
  }

  optionSubCity() {
    return (
      <Resource
        url={
          'https://dev.farizdotid.com/api/daerahindonesia/kecamatan?id_kota=' +
          this.state.kecamatan
        }>
        {({loading, error, payload: data, refetch}) => {
          return (
            <FormControl
              isInvalid={'kecamatan' in this.state.error}
              isDisabled={loading || error || this.state.kecamatan == ''}>
              <FormControl.Label
                _text={{
                  color: 'muted.700',
                  fontSize: 'sm',
                  fontWeight: 600,
                }}>
                Kecamatan
              </FormControl.Label>
              <Select
                selectedValue={this.state.form.kecamatan}
                onValueChange={val => {
                  this.setState({
                    form: {...this.state.form, kecamatan: val},
                    daerah: val,
                  });
                }}>
                {!loading && !error && this.state.kecamatan != '' ? (
                  data.kecamatan.map(e => (
                    <Select.Item key={e.nama} value={e.nama} label={e.nama} />
                  ))
                ) : (
                  <></>
                )}
              </Select>
            </FormControl>
          );
        }}
      </Resource>
    );
  }

  optionJenisToko() {
    return (
      <Resource url={BASE_URL() + '/jenis'}>
        {({loading, error, payload: data, refetch}) => {
          return (
            <FormControl
              isInvalid={'jenis_toko' in this.state.error}
              isDisabled={loading || error}>
              <FormControl.Label
                _text={{
                  color: 'muted.700',
                  fontSize: 'sm',
                  fontWeight: 600,
                }}>
                Jenis Toko
              </FormControl.Label>
              <Select
                selectedValue={this.state.form.jenis_toko}
                onValueChange={val => {
                  this.setState({
                    form: {...this.state.form, jenis_toko: val},
                  });
                }}>
                {!loading && !error ? (
                  data.data.map(e => (
                    <Select.Item key={e.id} value={e.id} label={e.jenis} />
                  ))
                ) : (
                  <></>
                )}
              </Select>
            </FormControl>
          );
        }}
      </Resource>
    );
  }

  render() {
    const {error, form, loading, loadingData, id_merchant, foto_merchant} =
      this.state;
    return (
      <NativeBaseProvider>
        <AlertOkV2 ref={ref => (this.alert = ref)} />
        <Loading isVisible={loadingData} />
        <ScrollView>
          <Box flex={1} p={2} w="90%" mx="auto" pb={8}>
            <Heading size="lg" color={theme.primary}>
              {id_merchant != '' ? 'Ubah Profil Toko' : 'Buat Toko'}
            </Heading>

            <VStack space={4} mt={5}>
              <Pressable onPress={() => this.handleChoosePhoto()}>
                <Avatar
                  source={{
                    uri: foto_merchant.uri ? foto_merchant.uri : foto_merchant,
                  }}
                  alignSelf={{base: 'center'}}
                  size="xl">
                  Upload
                </Avatar>
              </Pressable>
              <FormControl isRequired isInvalid={'namaToko' in error}>
                <FormControl.Label
                  _text={{color: 'muted.700', fontSize: 'sm', fontWeight: 600}}>
                  Nama Toko
                </FormControl.Label>
                <Input
                  onChangeText={val => {
                    this.setState({form: {...this.state.form, namaToko: val}});
                  }}
                  value={form.namaToko}
                />

                <FormControl.ErrorMessage
                  _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>
                  {error.namaToko}
                </FormControl.ErrorMessage>
              </FormControl>
              <FormControl isRequired isInvalid={'alamatToko' in error}>
                <FormControl.Label
                  _text={{color: 'muted.700', fontSize: 'sm', fontWeight: 600}}>
                  Alamat Toko
                </FormControl.Label>
                <Input
                  onChangeText={val => {
                    this.setState({
                      form: {...this.state.form, alamatToko: val},
                    });
                  }}
                  value={form.alamatToko}
                />

                <FormControl.ErrorMessage
                  _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>
                  {error.alamatToko}
                </FormControl.ErrorMessage>
              </FormControl>
              <FormControl isRequired isInvalid={'kodepos' in error}>
                <FormControl.Label
                  _text={{color: 'muted.700', fontSize: 'sm', fontWeight: 600}}>
                  Kode Pos Toko
                </FormControl.Label>
                <Input
                  onChangeText={val => {
                    this.setState({
                      form: {...this.state.form, kodepos: val},
                    });
                  }}
                  value={form.kodepos}
                />

                <FormControl.ErrorMessage
                  _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>
                  {error.kodepos}
                </FormControl.ErrorMessage>
              </FormControl>
              {this.optionJenisToko()}
              {this.optionProvince()}
              {this.optionCity()}
              {this.optionSubCity()}
              <VStack space={1}>
                <Button
                  isLoading={loading}
                  isLoadingText="Proses"
                  onPress={this.validate}
                  bgColor={theme.primary}
                  _text={{color: 'white'}}>
                  Simpan
                </Button>
              </VStack>
            </VStack>
          </Box>
        </ScrollView>
      </NativeBaseProvider>
    );
  }
}
