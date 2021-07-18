import React, {Component} from 'react';
import {Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {NativeBaseProvider} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Home from './Home';
import Feed from './Feed';
import Keranjang from './Keranjang';
import Akun from './Akun';
import Login from './Login';
import {theme} from '../../utilitas/Config';
import AsyncStorage from '@react-native-community/async-storage';

const Tab = createMaterialBottomTabNavigator();

export default class Index extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userToken: null,
    };
  }

  componentDidMount() {
    // Cek login
    this.loginCek();
  }

  loginCek = async () => {
    let userToken = await AsyncStorage.getItem('token');
    this.setState({userToken});
  };

  render() {
    const {userToken} = this.state;
    return (
      <Tab.Navigator
        activeColor={theme.primary}
        inactiveColor={'#444'}
        shifting={true}
        barStyle={{backgroundColor: '#fff'}}
        initialRouteName="Akun">
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarIcon: ({focused, color}) => {
              // console.warn({focused,color})
              return <Ionicons name="md-home" color={color} size={24} />;
            },
          }}
        />
        <Tab.Screen
          name="Feed"
          component={Feed}
          options={{
            tabBarIcon: ({focused, color}) => {
              // console.warn({focused,color})
              return <Ionicons name="md-sync" color={color} size={24} />;
            },
          }}
        />
        <Tab.Screen
          name="Keranjang"
          component={Keranjang}
          options={{
            tabBarIcon: ({focused, color}) => {
              // console.warn({focused,color})
              return <Ionicons name="md-cart" color={color} size={24} />;
            },
          }}
        />
        {userToken ? (
          <Tab.Screen
            name="Akun"
            component={Akun}
            options={{
              tabBarIcon: ({focused, color}) => {
                // console.warn({focused,color})
                return <Ionicons name="md-person" color={color} size={24} />;
              },
            }}
          />
        ) : (
          <Tab.Screen
            name="Login"
            component={Login}
            options={{
              tabBarIcon: ({focused, color}) => {
                // console.warn({focused,color})
                return <Ionicons name="md-enter" color={color} size={24} />;
              },
            }}
          />
        )}
      </Tab.Navigator>
    );
  }
}
