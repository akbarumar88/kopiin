/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';

import Splash from './src/components/universal/Splash';
import {
  NativeBaseProvider,
  Button,
  Input,
  FormControl,
  Icon,
} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Home from './src/components/dashboard/Home';
import Feed from './src/components/dashboard/Feed';
import Keranjang from './src/components/dashboard/Keranjang';
import Akun from './src/components/dashboard/Akun';
import Login from './src/components/dashboard/Login';
import Register from './src/components/dashboard/Register';
import Profil from './src/components/akun/Profil';
import Dashboard from './src/components/dashboard/Index';
import {theme} from './src/utilitas/Config';
import AsyncStorage from '@react-native-community/async-storage';

import PilihLokasi from './src/components/akun/PilihLokasi';
import Shop from './src/components/dashboard/Shop';
import FormProduk from './src/components/akun/FormProduk';
import MyProduk from './src/components/akun/MyProduk';
import UbahPasssword from './src/components/akun/UbahPassword';

import FormAlamat from './src/components/akun/FormAlamat';
import Alamat from './src/components/akun/Alamat';
import PilihAlamat from './src/components/order/PilihAlamat';

import HasilPencarian from './src/components/dashboard/HasilPencarian';
import Pencarian from './src/components/dashboard/Pencarian';
import DetailProduk from './src/components/dashboard/DetailProduk';
import DetailToko from './src/components/dashboard/DetailToko';
import UbahKeranjang from './src/components/dashboard/UbahKeranjang';

import PembayaranStack from './src/components/pembayaran/PembayaranStack';

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      userToken: null,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({loading: false});
    }, 1000);
  }

  render() {
    const {loading, userToken} = this.state;
    return (
      <NativeBaseProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Splash"
            screenOptions={{headerShown: true}}>
            <Stack.Screen
              name="Splash"
              component={Splash}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Dashboard"
              component={Dashboard}
              options={{headerShown: false}}
            />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="Profil" component={Profil} />
            <Stack.Screen name="UbahKeranjang" component={UbahKeranjang} options={{title:'Ubah Keranjang'}} />
            <Stack.Screen
              name="UbahPassword"
              component={UbahPasssword}
              options={{title: 'Ubah Password'}}
            />
            <Stack.Screen
              name="FormProduk"
              options={{title: 'Tambah Produk'}}
              component={FormProduk}
            />
            <Stack.Screen
              options={{
                title: 'Pencarian',
              }}
              name="Search"
              component={Pencarian}
            />
            <Stack.Screen name="DetailProduk" component={DetailProduk} />
            <Stack.Screen name="DetailToko" component={DetailToko} />
            <Stack.Screen
              options={{
                title: 'Hasil Pencarian',
              }}
              initialParams={{cari: ''}}
              name="SearchResult"
              component={HasilPencarian}
            />
            <Stack.Screen
              options={{title: 'Profil Toko'}}
              name="Shop"
              component={Shop}
            />
            <Stack.Screen
              options={{title: 'Pilih Lokasi', headerShown: false}}
              name="PilihLokasi"
              component={PilihLokasi}
            />
            <Stack.Screen name="MyProduk" component={MyProduk} />
            <Stack.Screen
              name="FormAlamat"
              options={{title: 'Tambah Alamat'}}
              component={FormAlamat}
            />
            <Stack.Screen name="Alamat" component={Alamat} />
            <Stack.Screen name="PilihAlamat" component={PilihAlamat} />
            <Stack.Screen name="PembayaranStack" component={PembayaranStack} />
          </Stack.Navigator>
        </NavigationContainer>
      </NativeBaseProvider>
    );
  }

  bottomNavigation = () => {};

  splashScreen = () => {
    return;
  };
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
