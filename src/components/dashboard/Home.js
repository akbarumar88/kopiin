import React, {Component} from 'react';
import {Text, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default class Home extends Component {
  render() {
    return (
      <View>
        <Text> Hello, this is home Component. </Text>
        <Ionicons name="md-home" color="#000" size={26} />
      </View>
    );
  }
}
