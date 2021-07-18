import * as React from 'react';
import {
  NativeBaseProvider,
  Box,
  Heading,
  VStack,
  FormControl,
  Input,
  Button,
  ScrollView,
  Select,
  TextArea,
  Icon,
} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {theme} from '../../utilitas/Config';
import {BASE_URL} from './../../utilitas/Config';
import axios from 'axios';
import QueryString from 'qs';
import AsyncStorage from '@react-native-community/async-storage';
export default class MyProduk extends React.Component {
  tambahProduk = () => {
    this.props.navigation.navigate('AddProduct');
  };
  render() {
    return (
      <NativeBaseProvider>
        <ScrollView bg="#fff">
          <Box flex={1} p={2} w="90%" mx="auto" pb={8}>
            <VStack space={2}>
              <VStack space={1}>
                <Button
                  onPress={this.tambahProduk}
                  bgColor={theme.primary}
                  _text={{color: 'white'}}>
                  Tambah Produk
                </Button>
              </VStack>
            </VStack>
          </Box>
        </ScrollView>
      </NativeBaseProvider>
    );
  }
}
