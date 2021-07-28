import React, {Component} from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Ionicons';
import {Button, Text} from 'native-base';
import {theme} from '../../utilitas/Config';

/**
 * Empty Cart Penjualan Offline
 *
 * @version 1.0.0
 * @author [Akbar Umar](https://github.com/akbarumar88)
 */

export default class EmptyCart extends Component {
  static propTypes = {
    /**
     * Gambarnya.
     * @since Version 1.0.0
     */
    image: PropTypes.number,
    /**
     * Judul empty cart.
     * @since Version 1.0.0
     */
    title: PropTypes.string,
    /**
     * Deskripsi empty cart.
     * @since Version 1.0.0
     */
    description: PropTypes.string,
    icon: PropTypes.any,
  };

  static defaultProps = {
    image: null,
    title: 'Keranjang belanja anda kosong',
    description:
      'Cari obat di kolom pencarian untuk menambahkan obat ke keranjang anda',
    icon: (
      <Icon
        style={{fontSize: 100, color: '#ccc', marginBottom: 8}}
        name={'md-cart'}
      />
    ),
    backgroundColor: '#fff',
    refreshButton: false,
    onRefresh: () => {},
  };

  render() {
    const {props} = this;
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
          paddingHorizontal: 16,
          paddingBottom: 64,
          overflow: 'hidden',
          backgroundColor: props.backgroundColor,
        }}>
        {/* <Image
          source={props.image}
          style={{ width: 100, height: 100, marginBottom: 24 }}
        /> */}
        {props.icon}
        <Text style={{color: '#444', fontWeight: 'bold', fontSize: 18}}>
          {props.title}
        </Text>
        <Text
          style={{
            color: '#555',
            textAlign: 'center',
            fontSize: 14,
            marginTop: 8,
          }}>
          {props.description}
        </Text>
        {props.refreshButton ? (
          <Button _text={{fontWeight: 'bold'}} variant="ghost" onPress={() => props.onRefresh()}>
              Refresh
          </Button>
        ) : null}
      </View>
    );
  }
}
