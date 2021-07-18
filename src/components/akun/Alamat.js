import * as React from 'react';
import {ToastAndroid} from 'react-native';
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
  Avatar,
  Pressable,
} from 'native-base';
import {BASE_URL, theme} from '../../utilitas/Config';
import axios from 'axios';
import {errMsg} from '../../utilitas/Function';
import QueryString from 'qs';
import AsyncStorage from '@react-native-community/async-storage';
import AlertOkV2 from './../universal/AlertOkV2';
import Resource from './../universal/Resource';
import Loading from './../universal/Loading';

export default class Alamat extends React.Component {
  constructor(props) {
    super(props);
  }

  tambahAlamat = () => {
    this.props.navigation.navigate('FormAlamat');
  };

  render() {
    return (
      <NativeBaseProvider>
        <AlertOkV2 ref={ref => (this.alert = ref)} />

        <ScrollView>
          <Box flex={1} paddingX={8} pt={5} pb={8} bg="white">
            <Heading size="lg" color={theme.primary}>
              Daftar Alamat
            </Heading>

            <VStack space={4} mt={5}>
              <VStack space={1}>
                <Button
                  onPress={this.tambahAlamat}
                  bgColor={theme.primary}
                  _text={{color: 'white', fontWeight: 'bold'}}>
                  Tambah Alamat
                </Button>
              </VStack>
            </VStack>
          </Box>
        </ScrollView>
      </NativeBaseProvider>
    );
  }
}
