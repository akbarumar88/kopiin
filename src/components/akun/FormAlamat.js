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

export default class FormAlamat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: {},
      form: {},
      jenis: [],
      kota: '',
      kecamatan: '',
      daerah: '',

      loading: false,
      loadingData: false,
    };
  }

  componentDidMount() {
    if (this.props.route.params) {
      this.setDataAlamat();
    }
  }

  setDataAlamat = () => {
    this.setState({loadingData: true});
    axios
      .get(`${BASE_URL()}/alamat/${this.props.route.params.idalamat}`)
      .then(async ({data}) => {
        this.setState({
          loadingData: false,
          form: data.data,
          kota: data.data.idprovinsi,
          kecamatan: data.data.idkota,
          daerah: data.data.kecamatan,
        });
      })
      .catch(e => {
        this.setState({
          loadingData: false,
        });
        this.alert.show({
          message: errMsg('Buat Toko'),
        });
      });
  };

  validate = () => {
    const {form, kota, kecamatan, daerah} = this.state;
    let error;
    if (!form.nama) {
      error = {...error, nama: 'Nama harus diisi'};
    } else if (form.nama.length < 5) {
      error = {...error, nama: 'Nama harus lebih dari 5 huruf'};
    }
    if (!form.detail) {
      error = {...error, detail: 'Alamat harus diisi'};
    } else if (form.detail.length < 5) {
      error = {...error, detail: 'Alamat harus lebih dari 5 huruf'};
    }
    if (!form.no_telp) {
      error = {...error, no_telp: 'No Telp harus diisi'};
    } else if (form.no_telp.length < 9) {
      error = {...error, no_telp: 'No Telp harus lebih dari 9 Digit'};
    }
    if (!form.kodepos) {
      error = {...error, kodepos: 'Kode Pos harus diisi'};
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
    if (this.props.route.params) {
      this.updateData();
    } else {
      this.simpanData();
    }
  };

  simpanData = async () => {
    const {form, kota, kecamatan} = this.state;
    this.setState({loading: true});
    let id = await AsyncStorage.getItem('id');

    axios
      .post(
        `${BASE_URL()}/alamat`,
        QueryString.stringify({
          id_user: id,
          nama: form.nama,
          detail: form.detail,
          provinsi: form.provinsi,
          kota: form.kota,
          kecamatan: form.kecamatan,
          kodepos: form.kodepos,
          no_telp: form.no_telp,
          latitude: 0.0,
          longitude: 0.0,
          idprovinsi: kota,
          idkota: kecamatan,
        }),
      )
      .then(async ({data}) => {
        this.setState({loading: false});
        if (data.status) {
          const {data: value} = data;

          ToastAndroid.show(
            'Berhasil ubah profil. Data anda telah disimpan.',
            ToastAndroid.SHORT,
          );
          // this.props.navigation.goBack();
        }
      })
      .catch(e => {
        console.warn(e);
        this.setState({loading: false});
        this.alert.show({
          message: errMsg('Buat Toko'),
        });
      });
  };
  updateData = async () => {
    const {form, kota, kecamatan} = this.state;
    this.setState({loading: true});
    let id = await AsyncStorage.getItem('id');

    axios
      .put(
        `${BASE_URL()}/alamat/${this.props.route.params.idalamat}`,
        QueryString.stringify({
          id_user: id,
          nama: form.nama,
          detail: form.detail,
          provinsi: form.provinsi,
          kota: form.kota,
          kecamatan: form.kecamatan,
          kodepos: form.kodepos,
          no_telp: form.no_telp,
          latitude: 0.0,
          longitude: 0.0,
          idprovinsi: kota,
          idkota: kecamatan,
        }),
      )
      .then(async ({data}) => {
        this.setState({loading: false});
        if (data.status) {
          const {data: value} = data;

          ToastAndroid.show(
            'Berhasil ubah profil. Data anda telah disimpan.',
            ToastAndroid.SHORT,
          );
          // this.props.navigation.goBack();
        }
      })
      .catch(e => {
        console.warn(e);
        this.setState({loading: false});
        this.alert.show({
          message: errMsg('Buat Toko'),
        });
      });
  };

  optionProvince() {
    return (
      <Resource url="https://dev.farizdotid.com/api/daerahindonesia/provinsi">
        {({loading, error, payload: data, refetch}) => {
          return (
            <FormControl
              isRequired
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
                ref={ref => (this.iprovinsi = ref)}
                onSubmitEditing={() => this.ikota.focus()}
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
              isRequired
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
                ref={ref => (this.ikota = ref)}
                onSubmitEditing={() => this.ikecamatan.focus()}
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
              isRequired
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
                ref={ref => (this.ikecamatan = ref)}
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

  render() {
    const {error, form, loading, loadingData} = this.state;
    return (
      <NativeBaseProvider>
        <AlertOkV2 ref={ref => (this.alert = ref)} />
        <Loading isVisible={loadingData} />
        <ScrollView>
          <Box flex={1} paddingX={8} pt={5} pb={8} bg="white">
            <Heading size="lg" color={theme.primary}>
              {this.props.route.params ? 'Edit Alamat' : 'Tambah Alamat'}
            </Heading>

            <VStack space={4} mt={5}>
              <FormControl isRequired isInvalid={'nama' in error}>
                <FormControl.Label
                  _text={{color: 'muted.700', fontSize: 'sm', fontWeight: 600}}>
                  Nama
                </FormControl.Label>
                <Input
                  onSubmitEditing={() => {
                    this.ino_telp.focus();
                  }}
                  onChangeText={val => {
                    this.setState({form: {...this.state.form, nama: val}});
                  }}
                  value={form.nama}
                />

                <FormControl.ErrorMessage
                  _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>
                  {error.nama}
                </FormControl.ErrorMessage>
              </FormControl>
              <FormControl isRequired isInvalid={'no_telp' in error}>
                <FormControl.Label
                  _text={{color: 'muted.700', fontSize: 'sm', fontWeight: 600}}>
                  No Telepon
                </FormControl.Label>
                <Input
                  ref={ref => (this.ino_telp = ref)}
                  onSubmitEditing={() => this.idetail.focus()}
                  keyboardType="number-pad"
                  onChangeText={val => {
                    this.setState({
                      form: {...this.state.form, no_telp: val},
                    });
                  }}
                  value={form.no_telp}
                />

                <FormControl.ErrorMessage
                  _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>
                  {error.no_telp}
                </FormControl.ErrorMessage>
              </FormControl>
              <FormControl isRequired isInvalid={'detail' in error}>
                <FormControl.Label
                  _text={{color: 'muted.700', fontSize: 'sm', fontWeight: 600}}>
                  Detail Alamat
                </FormControl.Label>
                <Input
                  ref={ref => (this.idetail = ref)}
                  onSubmitEditing={() => {
                    this.ikodepos.focus();
                  }}
                  onChangeText={val => {
                    this.setState({
                      form: {...this.state.form, detail: val},
                    });
                  }}
                  value={form.detail}
                />

                <FormControl.ErrorMessage
                  _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>
                  {error.detail}
                </FormControl.ErrorMessage>
              </FormControl>
              <FormControl isRequired isInvalid={'kodepos' in error}>
                <FormControl.Label
                  _text={{color: 'muted.700', fontSize: 'sm', fontWeight: 600}}>
                  Kode Pos
                </FormControl.Label>
                <Input
                  ref={ref => (this.ikodepos = ref)}
                  onSubmitEditing={() => this.iprovinsi.focus()}
                  keyboardType="number-pad"
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

              {this.optionProvince()}
              {this.optionCity()}
              {this.optionSubCity()}
              <VStack space={1}>
                <Button
                  isLoading={loading}
                  isLoadingText="Proses"
                  onPress={this.validate}
                  bgColor={theme.primary}
                  _text={{color: 'white', fontWeight: 'bold'}}>
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
