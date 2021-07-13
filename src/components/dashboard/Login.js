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
import {BASE_URL, theme} from '../../utilitas/Config';
import axios from 'axios';
import {ToastAndroid} from 'react-native';
import {errMsg} from '../../utilitas/Function';
import AlertOkV2 from '../universal/AlertOkV2';
import QueryString from 'qs';
import AsyncStorage from '@react-native-community/async-storage';

export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loggingIn: false,
      error: {},
      form: {},
      showpass: false,
    };
  }

  validate = () => {
    const {form} = this.state;
    let error;
    if (!form.username) {
      error = {...error, username: 'Username/E-mail harus diisi'};
    }

    if (!form.pass) {
      error = {...error, pass: 'Password harus diisi'};
    } else if (form.pass.length < 8) {
      error = {...error, pass: 'Password harus minimal 8 karakter'};
    }

    this.setState({error: error ?? {}});
    if (error) {
      return;
    }
    this.login();
  };

  login = () => {
    const {form} = this.state;
    this.setState({loggingIn: true});
    axios
      .post(
        `${BASE_URL()}/auth/login`,
        QueryString.stringify({
          username: form.username,
          password: form.pass,
        }),
      )
      .then(async ({data}) => {
        this.setState({loggingIn: false});
        if (!data.status) {
          this.alert.show({
            message: errMsg('Login'),
          });
          return;
        }
        ToastAndroid.show(
          'Login Berhasil, anda akan diarahkan ke halaman home.',
          ToastAndroid.SHORT,
        );
        const {data: user} = data;

        let sessionData = [
          ['nama', user.nama_lengkap],
          ['username', user.username],
          ['email', user.email],
          ['notelp', user.no_telp],
          ['id', user.id.toString()],
          ['token', data.token],
        ];
        // console.warn(sessionData)
        await AsyncStorage.multiSet(sessionData);
        this.props.navigation.reset({index: 0, routes: [{name: 'Dashboard'}]});
      })
      .catch(e => {
        this.setState({loggingIn: false});
        this.alert.show({
          message: e.response?.data?.errorMessage ?? errMsg('Login (e)'),
        });
        console.warn(e.response?.data ?? e.message);
      });
  };

  render() {
    const {loggingIn, error, showpass} = this.state;
    return (
      <NativeBaseProvider>
        <AlertOkV2 ref={ref => (this.alert = ref)} />
        <ScrollView>
          <Box flex={1} p={8} bg="white">
            <Heading size="lg" color={theme.primary}>
              Selamat Datang
            </Heading>
            <Heading color="muted.400" size="xs">
              Masuk untuk melanjutkan!
            </Heading>

            <VStack space={3} mt={5}>
              <FormControl isRequired isInvalid={'username' in error}>
                <FormControl.Label
                  _text={{color: 'muted.700', fontSize: 'sm', fontWeight: 600}}>
                  Username/E-mail
                </FormControl.Label>
                <Input
                  onSubmitEditing={() => {
                    this.ipass.focus();
                  }}
                  onChangeText={val => {
                    this.setState({form: {...this.state.form, username: val}});
                  }}
                  autoCapitalize="none"
                />

                <FormControl.ErrorMessage
                  _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>
                  {error.username}
                </FormControl.ErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={'pass' in error} mb={5}>
                <FormControl.Label
                  _text={{color: 'muted.700', fontSize: 'sm', fontWeight: 600}}>
                  Password
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

              <VStack space={2}>
                <Button
                  onPress={this.validate}
                  isLoading={loggingIn}
                  bgColor={theme.primary}
                  _text={{color: 'white'}}>
                  Login
                </Button>

                {/* <Button
                  mt={1}
                  onPress={this.googleSignIn}
                  isLoadingText={'login gan'}
                  isLoading={loggingIn}
                  bgColor={'red.600'}
                  _text={{color: 'white'}}
                  startIcon={<Icon as={MaterialCommunityIcons} name="google" size={5} />}>
                  Login Dengan Google
                </Button> */}
              </VStack>

              <HStack justifyContent="center">
                <Text fontSize="sm" color="muted.700" fontWeight={400}>
                  Pengguna baru?.{' '}
                </Text>
                <Link
                  onPress={_ => {
                    this.props.navigation.navigate('Register');
                  }}
                  _text={{color: theme.primary, bold: true, fontSize: 'sm'}}>
                  Daftar
                </Link>
              </HStack>
            </VStack>
          </Box>
        </ScrollView>
      </NativeBaseProvider>
    );
  }
}
