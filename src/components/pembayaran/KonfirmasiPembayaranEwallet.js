import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  TouchableNativeFeedback,
  BackHandler,
  TextInput,
} from 'react-native';
import {
  Container,
  Content,
  Text,
  Box,
  ScrollView,
  StatusBar,
  FormControl,
  Input,
} from 'native-base';
// import { ProgressDialog } from "../../Config/Template/Dialogs"
// Form Component
import {OutlinedTextField} from 'react-native-material-textfield';
import moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'firebase';
import Axios from 'axios';
import qs from 'qs';
import {NavigationActions, StackActions} from '@react-navigation/native';
import Loading from '../universal/Loading';
import {toCurrency} from '../../utilitas/Function';
import {BASE_URL} from '../../utilitas/Config';
import AlertOkV2 from '../universal/AlertOkV2';
import {TextInput as MaterialTextInput} from 'react-native-paper';

class KonfirmasiPembayaranEwallet extends Component {
  constructor(props) {
    super(props);

    const metode = props.route.params.metode;
    const total_biaya = props.route.params.total_biaya;
    const reference_id = props.route.params.reference_id;

    const colorMap = {
      ovo: '#4d3394',
      dana: '#1287e3',
      linkaja: '#e92024',
      
    };
    const prosedurMap = {
      ovo: [
        'Pastikan anda sudah menginstall aplikasi OVO',
        'Inputkan No. Telepon yang sudah terdaftar pada aplikasi OVO anda',
        "Klik 'Bayar dengan OVO'",
        'Pembayaran akan diproses',
        'Anda akan menerima notifikasi terkait pembayaran OVO atau Buka aplikasi OVO secara manual',
        'Klik notifikasi tersebut untuk melakukan pembayaran',
        'Ikuti instruksi selanjutnya',
        'Jika anda tidak menyelesaikan pembayaran dalam jangka waktu yang ditentukan, pembayaran akan secara otomatis dibatalkan',
      ],
      dana: [
        'Anda akan diarahkan ke halaman DANA untuk menyelesaikan pembayaran',
        'Anda akan diminta untuk menginputkan No. Telepon, PIN akun DANA dan verifikasi OTP',
        'Maka akan ditampilkan informasi rincian pembayaran',
        'Lanjutkan proses pembayaran',
        'Ikuti instruksi selanjutnya',
        'Jika anda tidak menyelesaikan pembayaran dalam jangka waktu yang ditentukan, pembayaran akan secara otomatis dibatalkan',
      ],
      linkaja: [
        'Inputkan No. Telepon yang sudah terdaftar pada aplikasi LinkAja anda',
        "Klik 'Bayar dengan LinkAja'",
        'Anda akan diarahkan ke halaman LinkAja untuk menyelesaikan pembayaran',
        'Anda akan diminta untuk menginputkan PIN akun LinkAja dan verifikasi OTP',
        'Lanjutkan proses pembayaran',
        'Ikuti instruksi selanjutnya',
        'Jika anda tidak menyelesaikan pembayaran dalam jangka waktu yang ditentukan, pembayaran akan secara otomatis dibatalkan',
      ],
    };

    this.state = {
      metode,
      total_biaya: Math.ceil(total_biaya),
      // total biaya sebelum pembulatan ke atas
      total_biaya_ori: total_biaya,
      reference_id,
      mainColor: colorMap[metode],
      prosedur: prosedurMap[metode],
      notelp: '',
      webViewVisible: true,
      checkout_url: 'https://www.google.com',
      error: {}
    };
    props.navigation.setOptions({
      headerStyle: {backgroundColor: this.state.mainColor},
      headerTintColor: '#fff',
    });
  }

  async componentDidMount() {
    setTimeout(() => {
      this.inotelp?.focus()
    })
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.goBack();
      return true;
    });

    const uid = await AsyncStorage.getItem('uid');
    this.setState({uid});
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  render() {
    const {metode, total_biaya, reference_id, mainColor, prosedur,error} = this.state;

    return (
      <Box style={s.Container} flex={1}>
        <StatusBar backgroundColor={mainColor} />
        <Loading isVisible={this.state.loading} message="Loading..." />

        <AlertOkV2 ref={ref => (this.alert = ref)} />
        <ScrollView>
          <View style={{padding: 12}}>
            <Text
              fontFamily=""
              style={{
                fontSize: 18,
                marginBottom: 4,
              }}
              >
              Cara Pembayaran
            </Text>
            <View>
              {prosedur.map((step, i) => {
                return (
                  <View
                    key={i}
                    style={{
                      paddingVertical: 6,
                      flexDirection: 'row',
                      backgroundColor: '#fff',
                    }}>
                    <Text fontWeight="" style={{marginRight: 8, color: '#444'}}>
                      {i + 1}.
                    </Text>
                    <Text  style={{flex: 1}} >{step}</Text>
                  </View>
                );
              })}
            </View>

            {/* Input no. telp (OVO) */}
            {metode == 'ovo' || metode == 'linkaja' ? (
              <>
                <View style={{marginTop: 12}} />
                {/* <OutlinedTextField
                  tintColor={mainColor}
                  label="No. Telepon"
                  keyboardType="number-pad"
                  onChangeText={notelp => {
                    this.setState({notelp});
                  }}
                /> */}
                {/* <MaterialTextInput
                  mode="outlined"
                  label="No. Telepon"
                  outlineColor={mainColor}
                  underlineColor={mainColor}
                  selectionColor={mainColor}
                  value={this.state.notelp}
                  onChangeText={notelp => this.setState({notelp})}
                  keyboardType="numeric"
                  render={props => {
                    return <TextInput {...props} keyboardType="number-pad" />;
                  }}
                /> */}
                <FormControl isRequired isInvalid={'username' in error}>
                  <FormControl.Label
                    _text={{
                      color: 'muted.700',
                      fontSize: 'sm',
                      fontWeight: 600,
                    }}>
                    No. Telepon
                  </FormControl.Label>
                  <Input
                    ref={ref => this.inotelp=ref}
                    borderWidth={2}
                    // borderColor={mainColor}
                    _focus={{borderColor:mainColor}}
                    onSubmitEditing={() => {
                    //   this.ipass.focus();
                    }}
                    onChangeText={notelp => {
                      this.setState({
                        notelp
                      });
                    }}
                    keyboardType="numeric"
                  />

                  <FormControl.ErrorMessage
                    _text={{
                      fontSize: 'xs',
                      color: 'error.500',
                      fontWeight: 500,
                    }}>
                    {error.notelp}
                  </FormControl.ErrorMessage>
                </FormControl>
              </>
            ) : null}
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={{padding: 12}}>
          <View id="detail-faktur" style={{marginBottom: 12}}>
            <View style={s.spaceBetween}>
              <Text>Jumlah Pembayaran</Text>
              <Text
                style={{fontSize: 20, color: mainColor, fontWeight: 'bold'}}>
                Rp {toCurrency(total_biaya, 2)}
              </Text>
            </View>

            <View style={s.spaceBetween}>
              <Text>Order ID</Text>
              <Text>{reference_id}</Text>
            </View>
          </View>

          <View id="btn-bayar">
            <TouchableNativeFeedback
              onPress={() => {
                switch (metode) {
                  case 'ovo':
                    this.checkoutOVO();
                    break;

                  case 'dana':
                    this.checkoutDana();
                    break;

                  case 'linkaja':
                    this.checkoutLinkAja();
                    break;
                }
              }}>
              <View
                style={{
                  backgroundColor: mainColor,
                  paddingVertical: 10,
                  borderRadius: 5,
                }}>
                <Text style={{color: '#fff', textAlign: 'center'}}>
                  Bayar dengan {metode.toUpperCase()}
                </Text>
              </View>
            </TouchableNativeFeedback>
          </View>
        </View>
      </Box>
    );
  }

  checkoutOVO = async () => {
    const {notelp, total_biaya, reference_id} = this.state;

    if (!notelp) {
      this.alert.show({
        title: 'Peringatan',
        message: 'Harap isi field No. Telepon',
      });
      return;
    }

    this.setState({loading: true});
    try {
      let {data: res} = await Axios.post(
        `${BASE_URL()}/mob-payment-keranjang/checkout-ovo`,
        qs.stringify({
          reference_id: `${reference_id}-${moment().format('HHmmss')}`,
          total: total_biaya,
          notelp,
        }),
      );
      this.setState({loading: false});

      if (res.status == 0) {
        throw new Error('Terjadi kesalahan saat checkout OVO (status 0)');
      }

      this.navigateToLapTransaksi();
    } catch (e) {
      this.setState({loading: false});
      this.alert.show({title: 'Terjadi Kesalahan', message: e.message});
    }
  };

  checkoutDana = async () => {
    let {total_biaya, reference_id} = this.state;

    this.setState({loading: true});
    try {
      let {data: res} = await Axios.post(
        `${BASE_URL()}/mob-payment-keranjang/checkout-dana`,
        qs.stringify({
          reference_id: `${reference_id}-${moment().format('HHmmss')}`,
          total: total_biaya,
        }),
      );
      const db = firebase.app('VMART').database();
      // Update ordsudahbayar jadi 0
      await db
        .ref('tra_penjualan')
        .child(reference_id)
        .update({pjsudahbayar: 0});

      this.setState({loading: false});

      if (res.status == 0) {
        throw new Error('Terjadi kesalahan saat checkout Dana (status 0)');
      }

      let {checkout_url} = res;
      // console.warn(checkout_url); return
      this.goToWebView(checkout_url);
    } catch (e) {
      this.setState({loading: false});
      this.alert.show({title: 'Terjadi Kesalahan', message: e.message});
    }
  };

  checkoutLinkAja = async () => {
    let {total_biaya, reference_id, notelp} = this.state;

    if (!notelp) {
      this.alert.show({
        title: 'Peringatan',
        message: 'Harap isi field No. Telepon',
      });
      return;
    }

    this.setState({loading: true});
    try {
      let {data: res} = await Axios.post(
        `${BASE_URL()}/mob-payment-keranjang/checkout-linkaja`,
        qs.stringify({
          reference_id: `${reference_id}-${moment().format('HHmmss')}`,
          total: total_biaya,
          notelp,
        }),
      );
      const db = firebase.app('VMART').database();
      // Update ordsudahbayar jadi 0
      await db
        .ref('tra_penjualan')
        .child(reference_id)
        .update({pjsudahbayar: 0});

      this.setState({loading: false});

      if (res.status == 0) {
        throw new Error('Terjadi kesalahan saat checkout LinkAja (status 0)');
      }

      let {checkout_url} = res;
      // console.warn(checkout_url)
      this.goToWebView(checkout_url);
    } catch (e) {
      this.setState({loading: false});
      this.alert.show({title: 'Terjadi Kesalahan', message: e.message});
    }
  };

  goToWebView = checkout_url => {
    const {reference_id} = this.state;
    this.props.navigation.navigate('EwalletWebview', {
      checkout_url,
      reference_id,
    });
  };

  navigateToLapTransaksi = _ => {
    const resetAction = StackActions.reset({
      index: 1,
      actions: [
        NavigationActions.navigate({
          routeName: 'Home',
          action: NavigationActions.navigate({
            routeName: 'tabKeranjang',
          }),
        }),
        NavigationActions.navigate({
          routeName: 'LaporanTransaksi',
          params: {},
        }),
      ],
    });
    this.props.navigation.dispatch(resetAction);
  };
}

const s = StyleSheet.create({
  Card: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: 'white',
    marginBottom: 12,
    // Shadow
  },
  Container: {
    backgroundColor: '#fff',
  },
  spaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default KonfirmasiPembayaranEwallet;
