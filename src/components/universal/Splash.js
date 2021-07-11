import React, {Component} from 'react';
import {View} from 'react-native';
import {NativeBaseProvider, Box, Row, Text} from 'native-base';

export default class Splash extends Component {
  componentDidMount() {
    setTimeout(() => {
      // this.props.navigation.navigate('Dashboard');
      this.props.navigation.reset({index: 0, routes: [{name: 'Dashboard'}]});
    }, 1000);
  }

  render() {
    return (
      <NativeBaseProvider>
        <Box bg="#794112" flex={1} justifyContent="center" alignItems="center">
          <Text color="white" fontSize={32}>
            Ini Splash Screen
          </Text>
        </Box>
      </NativeBaseProvider>
    );
  }
}
