import * as React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  NativeBaseProvider,
  Box,
  Text,
  Heading,
  VStack,
  Pressable,
  FormControl,
  Input,
  Link,
  Button,
  Icon,
  IconButton,
  HStack,
  Divider,
  ScrollView,
} from 'native-base';
import {theme} from '../../utilitas/Config';
import {Alert} from 'react-native';
import AlertYesNoV2 from '../universal/AlertYesNoV2';
import AsyncStorage from '@react-native-community/async-storage';

export default class Akun extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id_merchant: null,
    };
  }

  async cekToko() {
    let id_merchant = await AsyncStorage.getItem('id_merchant');
    this.setState({id_merchant: id_merchant});
  }

  componentDidMount() {
    this.cekToko();
  }

  render() {
    const {id_merchant} = this.state;
    return (
      <NativeBaseProvider>
        <AlertYesNoV2 ref={ref => (this.alert = ref)} />
        <ScrollView>
          <Box flex={1} p={8} bg="white">
            <Heading size="lg" color={theme.primary} mb={4}>
              Akun Saya
            </Heading>

            <VStack>
              <Pressable
                paddingY={2}
                onPress={() => this.profil()}
                borderBottomWidth={0.5}>
                <Text bold>Profil</Text>
                <Text fontSize="sm">Data diri, Alamat, dan Keamanan Akun</Text>
              </Pressable>
              <Pressable
                paddingY={2}
                onPress={() => this.ubahPasssword()}
                borderBottomWidth={0.5}>
                <Text bold>Ubah Password</Text>
                <Text fontSize="sm">Ubah Password dari akun anda</Text>
              </Pressable>
              {!id_merchant ? (
                <Pressable
                  paddingY={2}
                  onPress={() => this.makeShop()}
                  borderBottomWidth={0.5}>
                  <Text bold>Buat Toko</Text>
                  <Text fontSize="sm">Buka Toko Baru</Text>
                </Pressable>
              ) : (
                <Pressable
                  paddingY={2}
                  onPress={() => this.myListProduk()}
                  borderBottomWidth={0.5}>
                  <Text bold>Daftar Produk</Text>
                  <Text fontSize="sm">Produk di toko saya</Text>
                </Pressable>
              )}

              <Pressable
                paddingY={2}
                onPress={() => this.logout()}
                borderBottomWidth={0.5}>
                <Text bold>Keluar</Text>
                <Text fontSize="sm">Keluar dari akun anda.</Text>
              </Pressable>
            </VStack>
          </Box>
        </ScrollView>
      </NativeBaseProvider>
    );
  }

  profil = () => {
    this.props.navigation.navigate('Profil');
  };

  ubahPasssword = () => {
    this.props.navigation.navigate('UbahPassword');
  };
  makeShop = () => {
    this.props.navigation.navigate('Shop');
  };
  myListProduk = () => {
    this.props.navigation.navigate('MyProduk');
  };
  logout = () => {
    this.alert.show({message: 'Anda yakin ingin keluar?'}, async () => {
      let sessionData = [
        ['nama', ''],
        ['username', ''],
        ['email', ''],
        ['notelp', ''],
        ['token', ''],
      ];
      await AsyncStorage.multiSet(sessionData);
      this.props.navigation.reset({index: 0, routes: [{name: 'Dashboard'}]});
    });
  };
}
