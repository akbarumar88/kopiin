import * as React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  NativeBaseProvider,
  Box,
  Text,
  Heading,
  VStack,
  FormControl,
  Input,
  Link,
  Button,
  Icon,
  IconButton,
  HStack,
  Divider,
  ScrollView,
} from 'native-base';
import {BASE_URL, OAUTH_CLIENT_ID, theme} from '../../utilitas/Config';
import axios from 'axios';
import {ToastAndroid, ActivityIndicator} from 'react-native';
import Modal from 'react-native-modal';
import {errMsg} from '../../utilitas/Function';
import AlertOkV2 from '../universal/AlertOkV2';
import Loading from '../universal/Loading';
import QueryString from 'qs';
import AsyncStorage from '@react-native-community/async-storage';

export default class UbahPasssword extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loggingIn: false,
      error: {},
      form: {},
      showoldpass: false,
      showpass: false,
      showpass2: false,
      loadingEmail: false,
    };
  }

  componentDidMount() {}

  async componentWillUnmount() {}

  validate = () => {
    const {form} = this.state;
    let error;

    if (!form.old_pass) {
      error = {...error, old_pass: 'Password lama harus diisi'};
    }
    if (!form.pass) {
      error = {...error, pass: 'Password baru harus diisi'};
    } else if (form.pass.length < 8) {
      error = {...error, pass: 'Password  baru harus minimal 8 karakter'};
    } else if (form.pass == form.old_pass) {
      error = {
        ...error,
        pass: 'Password  baru tidak boleh sama dengan password lama',
      };
    }
    if (!form.pass2) {
      error = {...error, pass2: 'Konfirmasi Password harus diisi'};
    } else if (form.pass != form.pass2) {
      error = {...error, pass2: 'Konfirmasi Password Tidak Sama'};
    }

    this.setState({error: error ?? {}});
    if (error) {
      return;
    }
    this.ubahPass();
  };

  ubahPass = async () => {
    const {form} = this.state;
    this.setState({loggingIn: true});
    let id = await AsyncStorage.getItem('id');
    axios
      .put(
        `${BASE_URL()}/user/password/${id}`,
        QueryString.stringify({
          old_password: form.old_pass,
          password: form.pass,
        }),
      )
      .then(async ({data}) => {
        this.setState({loggingIn: false});
        if (!data.status) {
          this.alert.show({
            message: errMsg('ubah Pass'),
          });
          return;
        }
        ToastAndroid.show('Password berhasil diubah', ToastAndroid.SHORT);

        this.props.navigation.reset({index: 0, routes: [{name: 'Dashboard'}]});
      })
      .catch(e => {
        this.setState({loggingIn: false});
        this.alert.show({
          message: e.response?.data?.errorMessage ?? errMsg('Login (e)'),
        });
      });
  };

  render() {
    const {loggingIn, error, showpass, showoldpass, showpass2, loadingEmail} =
      this.state;
    return (
      <NativeBaseProvider>
        <Loading isVisible={loadingEmail} />
        <AlertOkV2 ref={ref => (this.alert = ref)} />
        <ScrollView>
          <Box flex={1} p={8} bg="white">
            <Heading size="lg" color={theme.primary}>
              Ubah Password
            </Heading>
            <Heading color="muted.400" size="xs">
              Ubah password akun anda
            </Heading>

            <VStack space={4} mt={5}>
              <FormControl isRequired isInvalid={'old_pass' in error} mb={5}>
                <FormControl.Label
                  _text={{color: 'muted.700', fontSize: 'sm', fontWeight: 600}}>
                  Password Lama
                </FormControl.Label>
                <Input
                  ref={ref => (this.iold_pass = ref)}
                  onChangeText={val => {
                    this.setState({form: {...this.state.form, old_pass: val}});
                  }}
                  onSubmitEditing={() => {}}
                  InputRightElement={
                    <IconButton
                      onPress={_ => this.setState({showoldpass: !showoldpass})}
                      variant="unstyled"
                      startIcon={
                        <Icon
                          as={
                            <MaterialCommunityIcons
                              name={showoldpass ? 'eye-off' : 'eye'}
                            />
                          }
                          color="muted.700"
                          size="sm"
                        />
                      }
                    />
                  }
                  type={showoldpass ? 'text' : 'password'}
                />
                <FormControl.ErrorMessage
                  _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>
                  {error.old_pass}
                </FormControl.ErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={'pass' in error} mb={5}>
                <FormControl.Label
                  _text={{color: 'muted.700', fontSize: 'sm', fontWeight: 600}}>
                  Password Baru
                </FormControl.Label>
                <Input
                  ref={ref => (this.ipass = ref)}
                  onChangeText={val => {
                    this.setState({form: {...this.state.form, pass: val}});
                  }}
                  onSubmitEditing={() => {}}
                  InputRightElement={
                    <IconButton
                      onPress={_ => this.setState({showpass: !showpass})}
                      variant="unstyled"
                      startIcon={
                        <Icon
                          as={
                            <MaterialCommunityIcons
                              name={showpass ? 'eye-off' : 'eye'}
                            />
                          }
                          color="muted.700"
                          size="sm"
                        />
                      }
                    />
                  }
                  type={showpass ? 'text' : 'password'}
                />
                <FormControl.ErrorMessage
                  _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>
                  {error.pass}
                </FormControl.ErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={'pass2' in error} mb={5}>
                <FormControl.Label
                  _text={{color: 'muted.700', fontSize: 'sm', fontWeight: 600}}>
                  Konfirmasi Password
                </FormControl.Label>
                <Input
                  ref={ref => (this.ipass2 = ref)}
                  onChangeText={val => {
                    this.setState({form: {...this.state.form, pass2: val}});
                  }}
                  onSubmitEditing={() => {}}
                  InputRightElement={
                    <IconButton
                      onPress={_ => this.setState({showpass2: !showpass2})}
                      variant="unstyled"
                      startIcon={
                        <Icon
                          as={
                            <MaterialCommunityIcons
                              name={showpass2 ? 'eye-off' : 'eye'}
                            />
                          }
                          color="muted.700"
                          size="sm"
                        />
                      }
                    />
                  }
                  type={showpass2 ? 'text' : 'password'}
                />
                <FormControl.ErrorMessage
                  _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>
                  {error.pass2}
                </FormControl.ErrorMessage>
              </FormControl>

              <VStack space={2}>
                <Button
                  onPress={this.validate}
                  isLoading={loggingIn}
                  bgColor={theme.primary}
                  _text={{color: 'white'}}>
                  Ubah Password
                </Button>
              </VStack>
            </VStack>
          </Box>
        </ScrollView>
      </NativeBaseProvider>
    );
  }
}
