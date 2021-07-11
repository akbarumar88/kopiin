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
import Dashboard from './src/components/dashboard/Index';
import {theme} from './src/utilitas/Config';
import AsyncStorage from '@react-native-community/async-storage';

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
    // Cek login
    this.loginCek();
  }

  loginCek = async () => {
    let userToken = await AsyncStorage.getItem('userToken');
    this.setState({userToken});
  };

  render() {
    const {loading, userToken} = this.state;
    return (
      <NativeBaseProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Splash" screenOptions={{headerShown:true}}>
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
