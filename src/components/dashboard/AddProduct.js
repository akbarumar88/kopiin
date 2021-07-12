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
} from 'native-base';
import {theme} from '../../utilitas/Config';
import {BASE_URL} from './../../utilitas/Config';
export default class AddProduct extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: {},
      form: {},
      kategori: [],
      variasi: [],
    };
  }

  componentDidMount() {
    fetch(BASE_URL() + '/kategori').then(res => {
      res.json().then(e => {
        this.setState({kategori: e.data});

        this.setState({form: {...this.state.form, kategori: e.data[0].id}});
      });
    });
  }

  async componentWillUnmount() {}

  validate = () => {
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

  simpan = () => {};

  render() {
    const {error, form} = this.state;
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
                        colorScheme="danger">
                        Hapus
                      </Button>
                    }
                    key={index}
                    placeholder={'Variasi ' + (index + 1)}
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
                _text={{color: 'white'}}>
                Tambah Variasi
              </Button>

              <VStack space={1}>
                <Button
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
