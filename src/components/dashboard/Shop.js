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
} from 'native-base';
import {BASE_URL, theme} from '../../utilitas/Config';
import axios from 'axios';
import {errMsg} from '../../utilitas/Function';
import QueryString from 'qs';

import AsyncStorage from '@react-native-community/async-storage';
import AlertOkV2 from './../universal/AlertOkV2';

export default class Shop extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: {},
      form: {},
      jenis: [],
      loading: false,
    };
  }

  componentDidMount() {
    this.getJenisToko();
  }

  getJenisToko = () => {
    this.setState({loading: true});
    fetch(BASE_URL() + '/jenis').then(res => {
      res.json().then(e => {
        this.setState({jenis: e.data, loading: false});
        this.setState({form: {...this.state.form, jenis: e.data[0].id}});
      });
    });
  };

  validate = () => {
    const {form} = this.state;
    let error;
    if (!form.namaToko) {
      error = {...error, namaToko: 'Nama Toko harus diisi'};
    }

    this.setState({error: error ?? {}});
    if (error) {
      return;
    }
    this.simpan();
  };

  simpan = async () => {
    const {form} = this.state;
    this.setState({loading: true});
    let id = await AsyncStorage.getItem('id');
    console.log(`${BASE_URL()}/user/shop/${id}`);
    axios
      .put(
        `${BASE_URL()}/user/shop/${id}`,
        JSON.stringify({
          nama_toko: form.namaToko,
          jenis_toko: form.jenis,
        }),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      .then(async ({data}) => {
        this.setState({loading: false});
        if (data.status) {
          const {data: value} = data;
          let sessionData = [
            ['jenistoko', value.jenis_toko.toString()],
            ['namatoko', value.nama_toko],
          ];
          AsyncStorage.multiSet(sessionData);
          this.props.navigation.reset({
            index: 0,
            routes: [{name: 'Dashboard'}],
          });
        }
      })
      .catch(e => {
        this.setState({loading: false});
        this.alert.show({
          message: errMsg('Buat Toko'),
        });
      });
  };

  render() {
    const {error, form, loading} = this.state;
    return (
      <NativeBaseProvider>
        <AlertOkV2 ref={ref => (this.alert = ref)} />
        <ScrollView>
          <Box flex={1} p={2} w="90%" mx="auto" pb={8}>
            <Heading size="lg" color={theme.primary}>
              Buat Toko
            </Heading>

            <VStack space={4} mt={5}>
              <FormControl isRequired isInvalid={'namaToko' in error}>
                <FormControl.Label
                  _text={{color: 'muted.700', fontSize: 'sm', fontWeight: 600}}>
                  Nama Toko
                </FormControl.Label>
                <Input
                  onSubmitEditing={() => {
                    this.inama.focus();
                  }}
                  onChangeText={val => {
                    this.setState({form: {...this.state.form, namaToko: val}});
                  }}
                  value={form.namaToko}
                />

                <FormControl.ErrorMessage
                  _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>
                  {error.namaToko}
                </FormControl.ErrorMessage>
              </FormControl>

              <FormControl>
                <FormControl.Label
                  _text={{color: 'muted.700', fontSize: 'sm', fontWeight: 600}}>
                  Jenis Toko
                </FormControl.Label>
                <Select
                  selectedValue={this.state.form.jenis}
                  onValueChange={val => {
                    this.setState({form: {...this.state.form, jenis: val}});
                  }}>
                  {this.state.jenis.map(e => (
                    <Select.Item key={e.id} value={e.id} label={e.jenis} />
                  ))}
                </Select>
              </FormControl>

              <VStack space={1}>
                <Button
                  isLoading={loading}
                  isLoadingText="Proses"
                  onPress={this.validate}
                  bgColor={theme.primary}
                  _text={{color: 'white'}}>
                  Simpan
                </Button>
              </VStack>
            </VStack>
          </Box>
        </ScrollView>
      </NativeBaseProvider>
    );
  }
}
