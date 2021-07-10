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
import {theme} from './src/utilitas/Config';

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({loading: false});
    }, 1000);
  }
  render() {
    const {loading} = this.state;
    return (
      <NativeBaseProvider>
        <NavigationContainer>
          <Tab.Navigator
            activeColor={theme.primary}
            inactiveColor={'#444'}
            barStyle={{backgroundColor: '#fff'}}>
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
          </Tab.Navigator>
          {/* <Stack.Navigator initialRouteName="Splash">
            {loading ? (
              <Stack.Screen
                component={Splash}
                name="Splash"
                options={{headerShown: false}}
              />
            ) : (
              <Stack.Screen component={Home} name={'Home'} options={{}} />
            )}
          </Stack.Navigator> */}
        </NavigationContainer>
      </NativeBaseProvider>
    );
  }
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
