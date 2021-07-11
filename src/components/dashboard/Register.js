import * as React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Alert} from 'react-native'
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
import {OAUTH_CLIENT_ID, theme} from '../../utilitas/Config';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';
import auth from '@react-native-firebase/auth';

export default class Register extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loggingIn: false,
      error: {},
      form: {},
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
      this.signOutGoogle()
    }
  }
  
  signOutGoogle=async() => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
    } catch (error) {
      Alert.alert('Terjadi kesalahan saat logout... ', error.toString());
    }
  }
  
  validate = () => {
    const {form} = this.state;
    let error;
    if (!form.username) {
      error = {...error, username: 'Username harus diisi'};
    }
    if (!form.nama) {
      error = {...error, nama: 'Nama harus diisi'};
    }
    if (!form.email) {
      error = {...error, email: 'Email harus diisi'};
    }

    if (!form.pass) {
      error = {...error, pass: 'Password harus diisi'};
    } else if (form.pass.length < 5) {
      error = {...error, pass: 'Password harus minimal 5 karakter'};
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
    this.login()
  };

  login=() => {
    
  }

  googleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const {user} = await GoogleSignin.signIn();

      // console.warn('gan', user)
      this.setState(s => ({
        form: {
          ...s.form,
          email: user.email,
          nama: user.name,
          username: user.email.replace(/@gmail.com/, ''),
        },
      }));
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
        console.warn(error.message)
        Alert.alert('Terjadi kesalahan saat register dengan Google... ', error.toString());
        setError(error);
      }
    }
  };

  render() {
    const {loggingIn, error, showpass, showkonfpass, form} = this.state;
    return (
      <NativeBaseProvider>
        <ScrollView>
          <Box flex={1} p={2} w="90%" mx="auto" pb={8}>
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
                    this.iemail.focus();
                  }}
                  autoCapitalize="words"
                  value={form.nama}
                />
                <FormControl.ErrorMessage
                  _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>
                  {error.nama}
                </FormControl.ErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={'email' in error}>
                <FormControl.Label
                  _text={{color: 'muted.700', fontSize: 'sm', fontWeight: 600}}>
                  E-mail
                </FormControl.Label>
                <Input
                  keyboardType="email-address"
                  ref={ref => (this.iemail = ref)}
                  onChangeText={val => {
                    this.setState({form: {...this.state.form, email: val}});
                  }}
                  onSubmitEditing={() => {
                    this.ipass.focus();
                  }}
                  value={form.email}
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
                  isLoadingText={'login gan'}
                  isLoading={loggingIn}
                  bgColor={theme.primary}
                  _text={{color: 'white'}}>
                  Daftar
                </Button>

                <Button
                  mt={1}
                  onPress={this.googleSignIn}
                  isLoadingText={'login gan'}
                  isLoading={loggingIn}
                  bgColor={'red.600'}
                  _text={{color: 'white'}}
                  startIcon={<Icon as={MaterialCommunityIcons} name="google" size={5} />}>
                  Daftar Dengan Google
                </Button>
 
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
