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
import {NativeBaseProvider} from 'native-base';
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
import AddProduct from './src/components/dashboard/AddProduct';
import MyProduk from './src/components/dashboard/MyProduk';
import UbahPasssword from './src/components/akun/UbahPassword';

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
            initialRouteName="Shop"
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
            <Stack.Screen
              name="UbahPassword"
              component={UbahPasssword}
              options={{title: 'Ubah Password'}}
            />
            <Stack.Screen
              name="AddProduct"
              options={{title: 'Tambah Produk'}}
              component={AddProduct}
            />

            <Stack.Screen
              options={{title: 'Profil Toko'}}
              name="Shop"
              component={Shop}
            />
            <Stack.Screen
              options={{title: 'Pilih Lokasi',headerShown:false}}
              name="PilihLokasi"
              component={PilihLokasi}
            />
            <Stack.Screen name="MyProduk" component={MyProduk} />
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
