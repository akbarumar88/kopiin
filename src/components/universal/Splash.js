import React, {Component} from 'react';
import {View} from 'react-native';
import {NativeBaseProvider, Box, Row, Text, Image} from 'native-base';
import Geolocation from '@react-native-community/geolocation';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import AsyncStorage from '@react-native-community/async-storage';
import Logo from '../../res/img/logo.png';
export default class Splash extends Component {
  async componentDidMount() {
    await this.setMyPosition();
    setTimeout(() => {
      // this.props.navigation.navigate('Dashboard');
      this.props.navigation.reset({index: 0, routes: [{name: 'Dashboard'}]});
    }, 1100);

    // this.props.navigation.reset({index: 0, routes: [{name: 'Dashboard'}]});
  }

  setMyPosition = async () => {
    await Geolocation.getCurrentPosition(
      async position => {
        const {setPosition} = this.props;

        // await setPosition(position.coords)
        // console.warn(position.coords)
        AsyncStorage.multiSet([
          ['lat', position.coords.latitude.toString()],
          ['long', position.coords.longitude.toString()],
        ]);
        this.setState({gpsstate: 'done'});
        // SET_POSITION(position.coords)
      },
      async error => {
        const {setPosition} = this.props;
        await setPosition('dimatikan');
        this.turnGPSON();
      },
      {
        timeout: 30000,
        maximumAge: 2000,
      },
    );
  };

  turnGPSON() {
    RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
      interval: 10000,
      fastInterval: 5000,
    })
      .then(async data => {
        this.setState({gpsstate: 'dihidupkan'});
        await this.setMyPosition();
      })
      .catch(err => {
        this.setState({gpsstate: 'ditolak'});
      });
  }

  render() {
    return (
      <NativeBaseProvider>
        <Box bg="#794112" flex={1} justifyContent="center" alignItems="center">
          <Image w={100} h={100} source={Logo} />
        </Box>
      </NativeBaseProvider>
    );
  }
}
