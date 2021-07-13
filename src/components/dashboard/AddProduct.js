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
export default class AddProduct extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loggingIn: false,
      error: {},
      form: {},
      kategori: [],
      variasi: [],
    };
  }

  componentDidMount() {
    this.getKategori();
  }

  getKategori = () => {
    fetch(BASE_URL() + '/kategori').then(res => {
      res.json().then(e => {
        this.setState({kategori: e.data});
        this.setState({form: {...this.state.form, kategori: e.data[0].id}});
      });
    });
  };

  async componentWillUnmount() {}

  validate = async () => {
    const {form, variasi} = this.state;
    let error;
    if (!form.namaBarang) {
      error = {...error, namaBarang: 'Nama Barang harus diisi'};
    }
    if (!form.harga) {
      error = {...error, harga: 'Harga Barang harus diisi'};
    }
    if (!form.berat) {
      error = {...error, berat: 'Berat Barang harus diisi'};
    }
    if (!form.deskripsi) {
      error = {...error, deskripsi: 'Deskripsi Barang harus diisi'};
    }

    variasi.map(e => {
      if (!e) {
        error = {...error, variasi: 'Variasi Barang harus diisi'};
      }
    });

    this.setState({error: error ?? {}});
    if (error) {
      return;
    }
    this.simpan();
  };

  simpan = () => {
    this.setState({loggingIn: true});
    const {form, variasi} = this.state;

    axios
      .post(
        `${BASE_URL()}/barang`,
        JSON.stringify({
          id_merchant: '3',
          id_kategori: form.kategori,
          nama: form.namaBarang,
          deskripsi: form.deskripsi,
          harga: form.harga,
          berat: form.berat,
          varian: variasi,
        }),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      .then(async ({data}) => {
        this.setState({loggingIn: false});
        if (!data.status) {
          console.log('Salah');
        } else {
          console.log('Benar');
        }
      });
  };

  render() {
    const {error, form, loggingIn} = this.state;
    return (
      <NativeBaseProvider>
        <ScrollView>
          <Box flex={1} p={2} w="90%" mx="auto" pb={8}>
            <Heading size="lg" color={theme.primary}>
              Buat Barang
            </Heading>

            <VStack space={4} mt={5}>
              <FormControl isRequired isInvalid={'namaBarang' in error}>
                <FormControl.Label
                  _text={{color: 'muted.700', fontSize: 'sm', fontWeight: 600}}>
                  Nama Barang
                </FormControl.Label>
                <Input
                  onSubmitEditing={() => {
                    this.inama.focus();
                  }}
                  onChangeText={val => {
                    this.setState({
                      form: {...this.state.form, namaBarang: val},
                    });
                  }}
                  value={form.namaBarang}
                />

                <FormControl.ErrorMessage
                  _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>
                  {error.namaBarang}
                </FormControl.ErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={'deskripsi' in error}>
                <FormControl.Label
                  _text={{color: 'muted.700', fontSize: 'sm', fontWeight: 600}}>
                  Deskripsi Barang
                </FormControl.Label>
                <TextArea
                  onSubmitEditing={() => {
                    this.inama.focus();
                  }}
                  onChangeText={val => {
                    this.setState({
                      form: {...this.state.form, deskripsi: val},
                    });
                  }}
                  numberOfLines={4}
                  value={form.deskripsi}
                />

                <FormControl.ErrorMessage
                  _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>
                  {error.deskripsi}
                </FormControl.ErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={'harga' in error}>
                <FormControl.Label
                  _text={{color: 'muted.700', fontSize: 'sm', fontWeight: 600}}>
                  Harga
                </FormControl.Label>
                <Input
                  keyboardType="number-pad"
                  onSubmitEditing={() => {
                    this.inama.focus();
                  }}
                  onChangeText={val => {
                    this.setState({
                      form: {...this.state.form, harga: val},
                    });
                  }}
                  value={form.harga}
                />

                <FormControl.ErrorMessage
                  _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>
                  {error.harga}
                </FormControl.ErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={'berat' in error}>
                <FormControl.Label
                  _text={{color: 'muted.700', fontSize: 'sm', fontWeight: 600}}>
                  Berat
                </FormControl.Label>
                <Input
                  keyboardType="number-pad"
                  onSubmitEditing={() => {
                    this.inama.focus();
                  }}
                  onChangeText={val => {
                    this.setState({
                      form: {...this.state.form, berat: val},
                    });
                  }}
                  value={form.berat}
                />

                <FormControl.ErrorMessage
                  _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>
                  {error.berat}
                </FormControl.ErrorMessage>
              </FormControl>

              <FormControl>
                <FormControl.Label
                  _text={{color: 'muted.700', fontSize: 'sm', fontWeight: 600}}>
                  Kategori Barang
                </FormControl.Label>
                <Select
                  selectedValue={this.state.form.kategori}
                  onValueChange={val => {
                    this.setState({form: {...this.state.form, kategori: val}});
                  }}>
                  {this.state.kategori.map(e => (
                    <Select.Item
                      key={e.id}
                      value={e.id}
                      label={e.nama_kategori}
                    />
                  ))}
                </Select>
              </FormControl>

              <FormControl isInvalid={'variasi' in error}>
                {this.state.variasi.map((e, index) => (
                  <Input
                    value={this.state.variasi[index]}
                    mt={2}
                    onChangeText={e => {
                      let data = this.state.variasi.slice();
                      data[index] = e;
                      this.setState({variasi: data});
                    }}
                    type={'text'}
                    InputRightElement={
                      <Button
                        ml={1}
                        onPress={e => {
                          this.setState({
                            variasi: [
                              ...this.state.variasi.slice(0, index),
                              ...this.state.variasi.slice(index + 1),
                            ],
                          });
                        }}
                        roundedLeft={0}
                        roundedRight="md"
                        endIcon={<Ionicons name="trash" color="white" />}
                        colorScheme="danger"></Button>
                    }
                    key={index}
                    placeholder={'Varian ' + (index + 1)}
                  />
                ))}
                <FormControl.ErrorMessage
                  _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>
                  {error.variasi}
                </FormControl.ErrorMessage>
              </FormControl>
              <Button
                onPress={() => {
                  this.setState({variasi: [...this.state.variasi, '']});
                }}
                isLoading={loggingIn}
                isLoadingText="Proses penyimpanan"
                _text={{color: 'white'}}>
                Tambah Varian
              </Button>

              <VStack space={1}>
                <Button
                  isLoading={loggingIn}
                  isLoadingText="Proses penyimpanan"
                  onPress={this.validate}
                  bgColor={theme.primary}
                  _text={{color: 'white'}}>
                  Lanjutkan
                </Button>
              </VStack>
            </VStack>
          </Box>
        </ScrollView>
      </NativeBaseProvider>
    );
  }
}
