import React, {Component} from 'react';
import {Text, View, ActivityIndicator} from 'react-native';
import {theme} from '../../utilitas/Config';

export default class FooterLoading extends Component {
  static defaultProps = {
    color: theme.primary,
    size: 50,
    full: false,
  };
  render() {
    const {color, size, full} = this.props;
    return (
      <View
        style={{
          flex: full ? 1 : 0,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <ActivityIndicator size={size} color={color} />
      </View>
    );
  }
}
