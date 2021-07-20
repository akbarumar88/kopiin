import * as React from 'react';
import {Dimensions} from 'react-native';
import {
  NativeBaseProvider,
  Box,
  Pressable,
  VStack,
  FormControl,
  Input,
  Button,
  ScrollView,
  Select,
  TextArea,
  Image,
  Text,
} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {theme} from '../../utilitas/Config';
import {BASE_URL} from '../../utilitas/Config';
import axios from 'axios';
import QueryString from 'qs';
import AsyncStorage from '@react-native-community/async-storage';
import AlertOkV2 from '../universal/AlertOkV2';
import {errMsg} from '../../utilitas/Function';
import Resource from './../universal/Resource';
import AlertYesNoV2 from './../universal/AlertYesNoV2';
import Loading from './../universal/Loading';
import {launchImageLibrary} from 'react-native-image-picker';
export default class FormProduk extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loggingIn: false,
      error: {},
      form: {},
      kategori: [],
      variasi: [],
      loading: false,
      foto_barang: 'https://puprpkpp.riau.go.id/asset/img/default-image.png',
    };
  }

  componentDidMount() {
    if (this.props.route.params.idproduk) {
      this.getDataproduk();
      this.props.navigation.setOptions({title: 'Edit Produk'});
    }
  }

  getDataproduk = () => {
    this.setState({loading: true});
    axios
      .get(BASE_URL() + '/barang/' + this.props.route.params.idproduk)
      .then(async ({data}) => {
        this.setState({
          loading: false,
          form: {
            kategori: data.data.id_kategori,
            nama: data.data.nama,
            deskripsi: data.data.deskripsi,
            harga: data.data.harga.toString(),
            berat: data.data.berat.toString(),
            stok: data.data.stok.toString(),
          },
          foto_barang: data.data.foto_barang
            ? `${BASE_URL()}/image/barang/${
                data.data.foto_barang
              }?time=${new Date()}`
            : 'https://puprpkpp.riau.go.id/asset/img/default-image.png',
          variasi: data.data.varian,
        });
      })
      .catch(e => {
        console.warn(e);
        this.setState({loading: false});
      });
  };

  handleChoosePhoto() {
    launchImageLibrary({noData: true}, response => {
      if (response.assets) {
        this.setState({foto_barang: response.assets[0]});
      }
    });
  }

  uploadFoto = id => {
    let data = new FormData();
    let photo = this.state.foto_barang;
    data.append('foto_barang', {
      name: photo.fileName,
      type: photo.type,
      uri: Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.uri,
    });

    axios
      .post(`${BASE_URL()}/barang/foto/${id}`, data)
      .then(async ({data}) => {})
      .catch(e => {
        this.alert.show({
          message: 'Terjadi Kesalahan saat Upload Foto',
        });
      });
    return data;
  };

  validate = async () => {
    const {form, variasi, foto_barang} = this.state;
    let error;
    if (!this.props.route.params.idproduk) {
      if (!foto_barang.uri) {
        error = {...error, foto: 'Foto Barang harus diisi'};
      }
    }
    if (!form.nama) {
      error = {...error, nama: 'Nama Barang harus diisi'};
    }
    if (!form.harga) {
      error = {...error, harga: 'Harga Barang harus diisi'};
    }
    if (!form.berat) {
      error = {...error, berat: 'Berat Barang harus diisi'};
    }
    if (!form.stok) {
      error = {...error, stok: 'Stok Barang harus diisi'};
    }
    if (!form.deskripsi) {
      error = {...error, deskripsi: 'Deskripsi Barang harus diisi'};
    }

    variasi.map(e => {
      if (!e.nama_varian) {
        error = {...error, variasi: 'Varian Barang harus diisi'};
      }
    });

    this.setState({error: error ?? {}});
    if (error) {
      return;
    }
    if (this.props.route.params.idproduk) {
      this.ubah();
    } else {
      this.simpan();
    }
  };

  ubah = async () => {
    this.setState({loggingIn: true});
    const {form, variasi, foto_barang} = this.state;
    let id = await AsyncStorage.getItem('id_merchant');
    axios
      .put(
        `${BASE_URL()}/barang/${this.props.route.params.idproduk}`,
        JSON.stringify({
          id_merchant: id,
          id_kategori: form.kategori,
          nama: form.nama,
          deskripsi: form.deskripsi,
          harga: form.harga,
          berat: form.berat,
          varian: variasi,
          stok: form.stok,
        }),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      .then(async ({data}) => {
        this.setState({loggingIn: false});
        if (data.status) {
          if (foto_barang.uri) {
            await this.uploadFoto(this.props.route.params.idproduk);
          }
          this.props.route.params.refreshData();
          this.props.navigation.goBack();
        }
      })
      .catch(e => {
        this.setState({loggingIn: false});
        this.alert.show({
          message: errMsg('Tambah Produk'),
        });
      });
  };

  simpan = async () => {
    this.setState({loggingIn: true});
    const {form, variasi} = this.state;
    let id = await AsyncStorage.getItem('id_merchant');
    axios
      .post(
        `${BASE_URL()}/barang`,
        JSON.stringify({
          id_merchant: id,
          id_kategori: form.kategori,
          nama: form.nama,
          deskripsi: form.deskripsi,
          harga: form.harga,
          berat: form.berat,
          varian: variasi,
          stok: form.stok,
        }),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      .then(async ({data}) => {
        this.setState({loggingIn: false});
        if (data.status) {
          await this.uploadFoto(data.data.idbarang.toString());
          this.props.route.params.refreshData();
          this.props.navigation.goBack();
        }
      })
      .catch(e => {
        this.setState({loggingIn: false});
        this.alert.show({
          message: errMsg('Tambah Produk'),
        });
      });
  };

  tambahVarian = () => {
    this.setState({
      variasi: [...this.state.variasi, {id: new Date(), nama_varian: ''}],
    });
  };

  deleteVarian = (item, index) => {
    if (typeof item.id == 'number') {
      this.dialog.show(
        {message: 'Anda yakin ingin menghapus varian ini ?'},
        async () => {
          await axios.delete(`${BASE_URL()}/varian/${item.id}`).then(e => {
            this.deleteByIndex(index);
          });
        },
      );
    } else {
      this.deleteByIndex(index);
    }
  };

  deleteByIndex = index => {
    this.setState({
      variasi: [
        ...this.state.variasi.slice(0, index),
        ...this.state.variasi.slice(index + 1),
      ],
    });
  };

  optionKategori() {
    return (
      <Resource url={BASE_URL() + '/kategori'}>
        {({loading, error, payload: data, refetch}) => {
          return (
            <FormControl
              isRequired
              isInvalid={'kategori' in this.state.error}
              isDisabled={loading || error}>
              <FormControl.Label
                _text={{
                  color: 'muted.700',
                  fontSize: 'sm',
                  fontWeight: 600,
                }}>
                Kategori Barang
              </FormControl.Label>
              <Select
                selectedValue={this.state.form.kategori}
                onValueChange={val => {
                  this.setState({
                    form: {...this.state.form, kategori: val},
                  });
                }}>
                {!loading && !error ? (
                  data.data.map(e => (
                    <Select.Item
                      key={e.id}
                      value={e.id}
                      label={e.nama_kategori}
                    />
                  ))
                ) : (
                  <></>
                )}
              </Select>
            </FormControl>
          );
        }}
      </Resource>
    );
  }
  render() {
    const {error, form, loggingIn, loading, foto_barang} = this.state;
    return (
      <NativeBaseProvider>
        <ScrollView>
          <Loading isVisible={loading} />
          <AlertOkV2 ref={ref => (this.alert = ref)} />
          <AlertYesNoV2 ref={ref => (this.dialog = ref)} />
          <Box flex={1} p={2} bg="white" px={8} pb={8}>
            <VStack space={4} mt={5}>
              <Text fontSize="md">Foto Produk</Text>
              <Pressable
                onPress={() => this.handleChoosePhoto()}
                alignSelf={{base: 'center'}}>
                <Image
                  alt="gambar_produk"
                  source={{
                    uri: foto_barang.uri ? foto_barang.uri : foto_barang,
                  }}
                  size={Dimensions.get('window').width * 0.3}
                />
              </Pressable>
              <Text fontSize="xs" style={{color: 'red'}}>
                {error.foto}
              </Text>

              <FormControl isRequired isInvalid={'nama' in error}>
                <FormControl.Label
                  _text={{color: 'muted.700', fontSize: 'sm', fontWeight: 600}}>
                  Nama Barang
                </FormControl.Label>
                <Input
                  ref={ref => (this.inama = ref)}
                  onSubmitEditing={() => {
                    this.ideskripsi.focus();
                  }}
                  onChangeText={val => {
                    this.setState({
                      form: {...this.state.form, nama: val},
                    });
                  }}
                  value={form.nama}
                />

                <FormControl.ErrorMessage
                  _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>
                  {error.nama}
                </FormControl.ErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={'deskripsi' in error}>
                <FormControl.Label
                  _text={{color: 'muted.700', fontSize: 'sm', fontWeight: 600}}>
                  Deskripsi Barang
                </FormControl.Label>
                <TextArea
                  textAlignVertical="top"
                  ref={ref => (this.ideskripsi = ref)}
                  onSubmitEditing={() => {
                    this.iharga.focus();
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
                  ref={ref => (this.iharga = ref)}
                  onSubmitEditing={() => {
                    this.istok.focus();
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

              <FormControl isRequired isInvalid={'stok' in error}>
                <FormControl.Label
                  _text={{color: 'muted.700', fontSize: 'sm', fontWeight: 600}}>
                  Stok
                </FormControl.Label>
                <Input
                  keyboardType="number-pad"
                  ref={ref => (this.istok = ref)}
                  onSubmitEditing={() => {
                    this.iberat.focus();
                  }}
                  onChangeText={val => {
                    this.setState({
                      form: {...this.state.form, stok: val},
                    });
                  }}
                  value={form.stok}
                />

                <FormControl.ErrorMessage
                  _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>
                  {error.stok}
                </FormControl.ErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={'berat' in error}>
                <FormControl.Label
                  _text={{color: 'muted.700', fontSize: 'sm', fontWeight: 600}}>
                  Berat
                </FormControl.Label>
                <Input
                  keyboardType="number-pad"
                  ref={ref => (this.iberat = ref)}
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

              {this.optionKategori()}

              <FormControl isInvalid={'variasi' in error}>
                {this.state.variasi.map((e, index) => (
                  <Input
                    value={this.state.variasi[index].nama_varian}
                    mt={2}
                    onChangeText={e => {
                      let data = this.state.variasi.slice();
                      data[index].nama_varian = e;
                      this.setState({variasi: data});
                    }}
                    type={'text'}
                    InputRightElement={
                      <Button
                        ml={1}
                        onPress={() => {
                          this.deleteVarian(e, index);
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
                  this.tambahVarian();
                }}
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
