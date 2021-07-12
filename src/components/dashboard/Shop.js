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

export default class Shop extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: {},
      form: {},
      jenis: [],
    };
  }

  componentDidMount() {
    fetch(BASE_URL() + '/jenis').then(res => {
      res.json().then(e => {
        this.setState({jenis: e.data});
        this.setState({form: {...this.state.form, jenis: e.data[0].id}});
      });
    });
  }

  async componentWillUnmount() {}

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

  simpan = () => {};

  render() {
    const {error, form} = this.state;
    return (
      <NativeBaseProvider>
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
