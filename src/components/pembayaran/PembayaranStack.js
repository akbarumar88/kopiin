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

import {
  NativeBaseProvider,
  Button,
  Input,
  FormControl,
  Icon,
} from 'native-base';

import MetodePembayaran from './MetodePembayaran';
import KonfirmasiPembayaranEwallet from './KonfirmasiPembayaranEwallet';

const Stack = createStackNavigator();

export default class PembayaranStack extends Component {
  render() {
    return (
      <NativeBaseProvider>
        <Stack.Navigator
          initialRouteName="MetodePembayaran"
          screenOptions={{headerShown: true}}>
          <Stack.Screen
            name="MetodePembayaran"
            component={MetodePembayaran}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="KonfirmasiPembayaranEwallet"
            component={KonfirmasiPembayaranEwallet}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NativeBaseProvider>
    );
  }
}
