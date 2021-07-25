import React, {Component} from 'react';
import {StyleSheet,  TouchableWithoutFeedback, View} from 'react-native';
import AlertOkV2 from '../universal/AlertOkV2';
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
  Switch
} from 'native-base';
import Loading from '../universal/Loading';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {toCurrency} from '../../utilitas/Function';
import { theme } from '../../utilitas/Config';

export default class MetodePembayaran extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      vpayOn: false,
      saldoVPay: 0,
      min_pembayaran: {
        gopay: 0,
        ovo: 0,
        dana: 0,
        linkaja: 0,
      },

      // Inputan Password
      modalPasswordVisible: false,
      inputPassword: '',
      method: '',
      errorVerifMessage: '',
    };
  }

  render() {
    const {vpayOn, saldoVPay} = this.state;
    const total = this.getGrandTotal();

    // Perhitungan VPay
    let vpayTerpakai = 0;
    if (saldoVPay < total) {
      // Jika saldo kurang dari total, maka gunakan semua saldo
      vpayTerpakai = saldoVPay;
    } else {
      // Jika saldo lebih dari/sama dengan total, gunakan saldo sebanyak totalnya
      vpayTerpakai = total;
    }
    let tagihan = vpayOn ? total - vpayTerpakai : total;
    return (
      <>
        <AlertOkV2 ref={ref => (this.alert = ref)} />

        <Box>
          <Loading isVisible={this.state.loading} message="Loading..." />

          <ScrollView>
            {/* Kasih Wrapper agar warna space marginnya abu2 */}
            <View style={[{backgroundColor: '#f5f5f5'}]}>
              <View style={[s.Card]}>
                {vpayOn ? this.infoPenggunaanVPay() : null}

                <View style={[s.spaceBetween]}>
                  <Text
                    style={{
                      color: '#555',
                      fontSize: 18,
                      fontWeight: 'bold',
                      fontFamily: 'sans-serif-light',
                    }}>
                    Total Tagihan
                  </Text>
                  <Text
                    style={{
                      color: 'amber',
                      fontSize: 22,
                      fontWeight: 'bold',
                      fontFamily: 'sans-serif-light',
                    }}>
                    Rp {toCurrency(tagihan, 2)}
                  </Text>
                </View>
              </View>

              <View style={[s.Card, s.spaceBetween]}>
                <View style={[{flexDirection: 'row', alignItems: 'center'}]}>
                  <Image
                    source={{
                      uri: 'http://signaltronik.com/assets/blog/cek_saldo_emoney1.png',
                    }}
                    resizeMode="contain"
                    style={{width: 40, height: 40}}
                    alt={'e-money'}
                  />
                  <View style={{marginLeft: 16}}>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        fontFamily: 'sans-serif-light',
                        color: '#555',
                        fontSize: 18,
                      }}>
                      Gunakan Saldo VPay
                    </Text>
                    <Text>Saldo VPay Rp {toCurrency(saldoVPay, 2)}</Text>
                  </View>
                </View>
                <Switch
                  trackColor={{false: '#ccc', true: theme.primary}}
                  thumbColor={'#f4f3f4'}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={this.toggleSwitch}
                  value={vpayOn}
                />
              </View>

              <View style={[s.Card, {marginBottom: 0}]}>
                {/* List Metode Pembayaran (jika VPay off atau VPay on namun ada sisa tagihan) */}
                {!vpayOn || tagihan > 0
                  ? this.listMetodePembayaran(tagihan)
                  : null}

                {/* Tampil tombol bayar jika VPay meng-cover */}
                {vpayOn && tagihan == 0 ? (
                  <TouchableNativeFeedback
                    id="btn-bayar"
                    onPress={_ => {
                      this.openModalPassword('vpay');
                    }}>
                    <View
                      style={{
                        backgroundColor: 'amber',
                        paddingVertical: 12,
                        borderRadius: 5,
                        marginTop: 16,
                      }}>
                      <Text
                        id="btn-bayar"
                        style={{
                          color: 'white',
                          textAlign: 'center',
                        }}>
                        Bayar
                      </Text>
                    </View>
                  </TouchableNativeFeedback>
                ) : null}
              </View>
            </View>
          </ScrollView>
        </Box>
      </>
    );
  }

  infoPenggunaanVPay = () => {
    const {saldoVPay} = this.state;
    const total = this.getGrandTotal();

    // Perhitungan VPay
    let vpayTerpakai = 0;
    if (saldoVPay < total) {
      // Jika saldo kurang dari total, maka gunakan semua saldo
      vpayTerpakai = saldoVPay;
    } else {
      // Jika saldo lebih dari/sama dengan total, gunakan saldo sebanyak totalnya
      vpayTerpakai = total;
    }
    let sisaSaldo = saldoVPay - vpayTerpakai;
    let tagihan = total - vpayTerpakai;
    return (
      <>
        <View
          style={[
            s.spaceBetween,
            {
              marginBottom: 4,
            },
          ]}>
          <Text
            style={{
              color: '#555',
              fontWeight: 'bold',
              fontFamily: 'sans-serif-light',
              fontSize: 15,
            }}>
            Saldo VPay Terpakai
          </Text>
          <Text
            style={{
              color: '#555',
              fontWeight: 'bold',
              fontFamily: 'sans-serif-light',
              fontSize: 15,
            }}>
            - {toCurrency(vpayTerpakai, 2)}
          </Text>
        </View>

        <View style={[s.spaceBetween, {marginBottom: 4}]}>
          <Text
            style={{
              color: '#555',
              fontSize: 15,
              fontWeight: 'bold',
              fontFamily: 'sans-serif-light',
            }}>
            Sisa Saldo
          </Text>
          <Text
            style={{
              color: '#555',
              fontSize: 15,
              fontWeight: 'bold',
              fontFamily: 'sans-serif-light',
            }}>
            Rp {toCurrency(sisaSaldo, 2)}
          </Text>
        </View>
      </>
    );
  };

  listMetodePembayaran = tagihan => {
    const {vpayOn, min_pembayaran} = this.state;
    return (
      <>
        <PaymentMethod
          name="OVO"
          image={require('./img/ovo.png')}
          onPress={async () => {
            if (tagihan < min_pembayaran.ovo) {
              this.alert.show({
                message: `Minimal pembayaran OVO harus Rp ${toCurrency(
                  min_pembayaran.ovo,
                  2,
                )}`,
              });
              return;
            }

            // let {reference_id} = await this.generateFaktur(0);
            let reference_id = 'KP21072400001'
            this.konfirmasiPembayaran('ovo', tagihan, reference_id);
          }}
        />
        <PaymentMethod
          name="DANA"
          image={require('./img/dana.png')}
          onPress={async () => {
            if (tagihan < min_pembayaran.dana) {
              this.alert.show({
                message: `Minimal pembayaran DANA harus Rp ${toCurrency(
                  min_pembayaran.dana,
                  2,
                )}`,
              });
              return;
            }

            // let {reference_id} = await this.generateFaktur(0);
            let reference_id = 'KP21072400001'
            this.konfirmasiPembayaran('dana', tagihan, reference_id);
          }}
        />
        <PaymentMethod
          name="LinkAja"
          image={require('./img/linkaja.png')}
          onPress={async () => {
            if (tagihan < min_pembayaran.linkaja) {
              this.alert.show({
                message: `Minimal pembayaran LinkAja harus Rp ${toCurrency(
                  min_pembayaran.linkaja,
                  2,
                )}`,
              });
              return;
            }

            // let {reference_id} = await this.generateFaktur(0);
            let reference_id = 'KP21072400001'
            this.konfirmasiPembayaran('linkaja', tagihan, reference_id);
          }}
        />
      </>
    );
  };

  konfirmasiPembayaran = (metode, total_biaya, reference_id) => {
    this.props.navigation.navigate('KonfirmasiPembayaranEwallet', {
      metode,
      total_biaya,
      reference_id,
    });
  };

  getGrandTotal = () => {
    return 10000;
  };
}

let PaymentMethod = ({name, image, onPress}) => {
  return (
    <Pressable
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      paddingY={4}
      borderBottomWidth={1}
      borderBottomColor="#f5f5f5"
      onPress={onPress}>
      <HStack style={{alignItems: 'center'}}>
        <Image
          alt={name}
          source={image}
          resizeMode="contain"
          style={{width: 40, height: 40, borderRadius: 5}}
        />
        <Text style={{marginLeft: 16}}>{name}</Text>
      </HStack>
      <FontAwesome5Icon name="caret-right" size={20} color="#999" />
    </Pressable>
  );
};

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
