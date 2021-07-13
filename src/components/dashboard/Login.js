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
import {ToastAndroid,ActivityIndicator} from 'react-native';
import Modal from 'react-native-modal';
import {errMsg} from '../../utilitas/Function';
import AlertOkV2 from '../universal/AlertOkV2';
import Loading from '../universal/Loading';
import QueryString from 'qs';
import AsyncStorage from '@react-native-community/async-storage';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';

export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loggingIn: false,
      error: {},
      form: {},
      showpass: false,
      loadingEmail: false
    };
  }

  componentDidMount() {
    GoogleSignin.configure({
      webClientId: OAUTH_CLIENT_ID, // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: false, // if you want to access Google API on behalf of the user FROM YOUR SERVER
    });
  }

  async componentWillUnmount() {
    
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

  googleSignIn = async () => {
    try {
      if (await GoogleSignin.isSignedIn()) {
        // Logout Google Account, agar tidak auto signed-in
        await this.signOutGoogle();
      }
      await GoogleSignin.hasPlayServices();
      const {user} = await GoogleSignin.signIn();

      // console.warn('1', user);
      // Jika berhasil sign-in, cek ketersediaan e-mail
      this.setState({loadingEmail:true})
      try {
        let {data} = await axios.post(
          `${BASE_URL()}/auth/email`,
          QueryString.stringify({email: user.email, id: 0}), // Pake id=0 agar kena semua
        );
        this.setState({loadingEmail:false})
        if (!data.status) {
          this.alert.show({
            message: errMsg('Cek E-mail'),
          });
          return;
        }
        // Berhasil
        this.props.navigation.navigate('Register', {
          email: user.email,
          nama: user.name,
          username: user.email.replace(/@.+/, ''),
        });
      } catch (e) {
        this.setState({loadingEmail:false})
        this.alert.show({
          message: e.response?.data?.errorMessage ?? errMsg('Cek E-mail'),
        });
        console.warn(e.response?.data ?? e.message);
      }
      // this.setState(s => ({
      //   form: {
      //     ...s.form,
      //     email: user.email,
      //     nama: user.name,
      //     username: user.email.replace(/@gmail.com/, ''),
      //   },
      // }));
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        Alert.alert('Cancel');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        alert('Signin in progress');
        // operation (f.e. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        alert('PLAY_SERVICES_NOT_AVAILABLE');
        // play services not available or outdated
      } else {
        // some other error happened
        console.warn(error.message);
        Alert.alert(
          'Terjadi kesalahan saat register dengan Google... ',
          error.toString(),
        );
        setError(error);
      }
    }
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
    const {loggingIn, error, showpass, loadingEmail} = this.state;
    return (
      <NativeBaseProvider>
        <Loading isVisible={loadingEmail} />
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
                    // this.props.navigation.navigate('Register');
                    this.googleSignIn();
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
