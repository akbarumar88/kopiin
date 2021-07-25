import * as React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Alert, ToastAndroid} from 'react-native';
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
  useToast,
} from 'native-base';
import {BASE_URL, OAUTH_CLIENT_ID, theme} from '../../utilitas/Config';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';
import auth from '@react-native-firebase/auth';
import axios from 'axios';
import QueryString from 'qs';
import AlertOkV2 from '../universal/AlertOkV2';
import {errMsg} from '../../utilitas/Function';
import AsyncStorage from '@react-native-community/async-storage';

class Register extends React.Component {
  constructor(props) {
    super(props);

    const {email, nama, username} = props.route.params;
    this.state = {
      loggingIn: false,
      error: {},
      form: {
        email,
        nama,
        username,
      },
      showpass: false,
      showkonfpass: false,
    };
  }

  componentDidMount() {
    GoogleSignin.configure({
      webClientId: OAUTH_CLIENT_ID, // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: false, // if you want to access Google API on behalf of the user FROM YOUR SERVER
    });
  }

  async componentWillUnmount() {
    if (await GoogleSignin.isSignedIn()) {
      // Logout Google Account, agar tidak auto signed-in
      this.signOutGoogle();
    }
  }

  signOutGoogle = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
    } catch (error) {
      Alert.alert('Terjadi kesalahan saat logout... ', error.toString());
    }
  };

  validate = () => {
    const {form} = this.state;
    let error;
    if (!form.username) {
      error = {...error, username: 'Username harus diisi'};
    }
    if (!form.nama) {
      error = {...error, nama: 'Nama harus diisi'};
    }

    if (!form.notelp) {
      error = {...error, notelp: 'No.telopon harus diisi'};
    } else if (form.notelp.length < 9) {
      error = {...error, notelp: 'No. telepon terlalu pendek'};
    } else if (
      !form.notelp.match(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/)
    ) {
      error = {...error, notelp: 'No. telepon tidak valid'};
    }

    if (!form.pass) {
      error = {...error, pass: 'Password harus diisi'};
    } else if (form.pass.length < 8) {
      error = {...error, pass: 'Password harus minimal 8 karakter'};
    }

    if (!form.konfpass) {
      error = {...error, konfpass: 'Konfirmasi Password harus diisi'};
    } else if (form.konfpass !== form.pass) {
      error = {...error, konfpass: 'Konfirmasi Password tidak sama'};
    }

    if (!form.email) {
      error = {...error, email: 'Email harus diisi'};
    } else if (
      !form.email.match(
        /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
      )
    ) {
      error = {...error, email: 'Format Email tidak valid'};
    }

    this.setState({error: error ?? {}});
    if (error) {
      return;
    }
    this.register();
  };

  register = () => {
    const {form} = this.state;
    this.setState({loggingIn: true});
    axios
      .post(
        `${BASE_URL()}/auth/register`,
        QueryString.stringify({
          username: form.username,
          nama_lengkap: form.nama,
          email: form.email,
          password: form.pass,
          no_telp: form.notelp,
        }),
      )
      .then(async ({data}) => {
        this.setState({loggingIn: false});
        if (!data.status) {
          this.alert.show({
            message:
              'Terjadi kesalahan saat register. harap coba lagi beberapa saat.',
          });
          return;
        }
        ToastAndroid.show(
          'Pendaftaran Berhasil, anda akan diarahkan ke halaman home.',
          ToastAndroid.SHORT,
        );
        let sessionData = [
          ['nama', form.nama],
          ['username', form.username],
          ['email', form.email],
          ['notelp', form.notelp],
          ['id', data.data.id.toString()],
          ['token', data.token],
        ];
        console.warn(sessionData);
        await AsyncStorage.multiSet(sessionData);
        this.props.navigation.reset({index: 0, routes: [{name: 'Dashboard'}]});
      })
      .catch(e => {
        this.setState({loggingIn: false});
        this.alert.show({
          message: e.response?.data?.errorMessage ?? errMsg('Register'),
        });
        console.warn(e.response?.data ?? e.message);
      });
  };

  render() {
    const {loggingIn, error, showpass, showkonfpass, form} = this.state;
    return (
      <NativeBaseProvider>
        <AlertOkV2 ref={ref => (this.alert = ref)} />
        <ScrollView>
          <Box flex={1} paddingX={8} pb={8} bg="white">
            <Heading size="lg" color={theme.primary}>
              Daftar
            </Heading>
            {/* <Heading color="muted.400" size="xs">
              Daftar untuk melanjutkan!
            </Heading> */}

            <VStack space={3} mt={5}>
              <FormControl isRequired isInvalid={'username' in error}>
                <FormControl.Label
                  _text={{color: 'muted.700', fontSize: 'sm', fontWeight: 600}}>
                  Username
                </FormControl.Label>
                <Input
                  onSubmitEditing={() => {
                    this.inama.focus();
                  }}
                  onChangeText={val => {
                    this.setState({form: {...this.state.form, username: val}});
                  }}
                  value={form.username}
                  autoCapitalize="none"
                />

                <FormControl.ErrorMessage
                  _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>
                  {error.username}
                </FormControl.ErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={'nama' in error}>
                <FormControl.Label
                  _text={{color: 'muted.700', fontSize: 'sm', fontWeight: 600}}>
                  Nama Lengkap
                </FormControl.Label>
                <Input
                  ref={ref => (this.inama = ref)}
                  onChangeText={val => {
                    this.setState({form: {...this.state.form, nama: val}});
                  }}
                  onSubmitEditing={() => {
                    this.inotelp.focus();
                  }}
                  autoCapitalize="words"
                  value={form.nama}
                />
                <FormControl.ErrorMessage
                  _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>
                  {error.nama}
                </FormControl.ErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={'notelp' in error}>
                <FormControl.Label
                  _text={{color: 'muted.700', fontSize: 'sm', fontWeight: 600}}>
                  No. Telepon
                </FormControl.Label>
                <Input
                  ref={ref => (this.inotelp = ref)}
                  onChangeText={val => {
                    if (val.match(/[^0-9]/)) {
                      // Jika menemukan selain angka, maka ignore.
                      return;
                    }
                    this.setState({form: {...this.state.form, notelp: val}});
                  }}
                  onSubmitEditing={() => {
                    this.ipass.focus();
                  }}
                  autoCapitalize="words"
                  value={form.notelp}
                  keyboardType="number-pad"
                />
                <FormControl.ErrorMessage
                  _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>
                  {error.notelp}
                </FormControl.ErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={'email' in error}>
                <FormControl.Label
                  _text={{color: 'muted.700', fontSize: 'sm', fontWeight: 600}}>
                  E-mail
                </FormControl.Label>
                <Input
                  isDisabled={true}
                  keyboardType="email-address"
                  ref={ref => (this.iemail = ref)}
                  onChangeText={val => {
                    this.setState({form: {...this.state.form, email: val}});
                  }}
                  onSubmitEditing={() => {
                    this.ipass.focus();
                  }}
                  value={form.email}
                  autoCapitalize={'none'}
                />
                <FormControl.ErrorMessage
                  _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>
                  {error.email}
                </FormControl.ErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={'pass' in error}>
                <FormControl.Label
                  _text={{color: 'muted.700', fontSize: 'sm', fontWeight: 600}}>
                  Password
                </FormControl.Label>
                <Input
                  ref={ref => (this.ipass = ref)}
                  onChangeText={val => {
                    this.setState({form: {...this.state.form, pass: val}});
                  }}
                  onSubmitEditing={() => {
                    this.ikonfpass.focus();
                  }}
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

              <FormControl mb={5} isRequired isInvalid={'konfpass' in error}>
                <FormControl.Label
                  _text={{color: 'muted.700', fontSize: 'sm', fontWeight: 600}}>
                  Konfirmasi Password
                </FormControl.Label>
                <Input
                  ref={ref => (this.ikonfpass = ref)}
                  onChangeText={val => {
                    this.setState({form: {...this.state.form, konfpass: val}});
                  }}
                  InputRightElement={
                    <IconButton
                      onPress={_ =>
                        this.setState({showkonfpass: !showkonfpass})
                      }
                      variant="unstyled"
                      startIcon={
                        <Icon
                          as={
                            <MaterialCommunityIcons
                              name={showkonfpass ? 'eye-off' : 'eye'}
                            />
                          }
                          color="muted.700"
                          size="sm"
                        />
                      }
                    />
                  }
                  type={showkonfpass ? 'text' : 'password'}
                />
                <FormControl.ErrorMessage
                  _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>
                  {error.konfpass}
                </FormControl.ErrorMessage>
              </FormControl>

              <VStack space={2}>
                <Button
                  onPress={this.validate}
                  isLoading={loggingIn}
                  bgColor={theme.primary}
                  _text={{color: 'white'}}>
                  Daftar
                </Button>

                {/* <Button
                  mt={1}
                  onPress={this.googleSignIn}
                  disabled={loggingIn}
                  bgColor={'red.600'}
                  _text={{color: 'white'}}
                  startIcon={
                    <Icon as={MaterialCommunityIcons} name="google" size={5} />
                  }>
                  Gunakan Akun Google
                </Button> */}

                {/* <HStack justifyContent="center" alignItem="center">
                  <IconButton
                variant="unstyled"
                startIcon={
                  <Icon
                    as={<MaterialCommunityIcons  name="facebook" />}
                    color="muted.700"
                    size="sm"
                  />
                }
              />
                  <IconButton
                    variant="unstyled"
                    startIcon={
                      <Icon
                        as={<MaterialCommunityIcons name="google" />}
                        color="muted.700"
                        size="sm"
                      />
                    }
                  />
                </HStack> */}
              </VStack>
            </VStack>
          </Box>
        </ScrollView>
      </NativeBaseProvider>
    );
  }
}

function withHook(Component) {
  return function (props) {
    // console.warn('gan',props)
    const toast = useToast();
    return <Component {...props} toast={toast} />;
  };
}

export default Register;
