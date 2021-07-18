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
  Avatar,
  Pressable,
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
import Loading from '../universal/Loading';
import {errMsg} from '../../utilitas/Function';
import AsyncStorage from '@react-native-community/async-storage';
import {launchImageLibrary} from 'react-native-image-picker';

class Profil extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      updating: false,
      error: {},
      form: {},
      showpass: false,
      showkonfpass: false,
      loadingEmail: false,
      initialLoad: true,
      foto_user: 'https://puprpkpp.riau.go.id/asset/img/default-image.png',
      userid: 0,
    };
  }

  componentDidMount() {
    GoogleSignin.configure({
      webClientId: OAUTH_CLIENT_ID, // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: false, // if you want to access Google API on behalf of the user FROM YOUR SERVER
    });
    this.fillData();
  }

  async componentWillUnmount() {
    if (await GoogleSignin.isSignedIn()) {
      // Logout Google Account, agar tidak auto signed-in
      this.signOutGoogle();
    }
  }

  getDataAccount = id => {
    axios
      .get(`${BASE_URL()}/user/${id}`)
      .then(async ({data}) => {
        this.setState({
          foto_user: data.data.foto_user
            ? `${BASE_URL()}/image/user/` +
              data.data.foto_user +
              '?tgl=' +
              new Date()
            : 'https://puprpkpp.riau.go.id/asset/img/default-image.png',
        });
      })
      .catch(e => {});
  };

  fillData = async () => {
    let [[k0, userid], [k1, email], [k2, username], [k3, nama], [k4, notelp]] =
      await AsyncStorage.multiGet([
        'id',
        'email',
        'username',
        'nama',
        'notelp',
      ]);
    await this.getDataAccount(userid);
    // console.warn({email,username,nama,notelp})
    this.setState(s => ({
      form: {...s.form, email, username, notelp, nama},
      userid,
      initialLoad: false,
    }));
  };

  handleChoosePhoto() {
    launchImageLibrary({noData: true}, response => {
      if (response.assets) {
        this.setState({foto_user: response.assets[0]});
      }
    });
  }

  uploadFoto = () => {
    let data = new FormData();
    let photo = this.state.foto_user;
    data.append('foto_user', {
      name: photo.fileName,
      type: photo.type,
      uri: Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.uri,
    });

    axios
      .post(`${BASE_URL()}/user/fotoprofil/${this.state.userid}`, data)
      .then(async ({data}) => {})
      .catch(e => {
        this.alert.show({
          message: 'Terjadi Kesalahan saat Upload Foto',
        });
      });
    return data;
  };

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
    this.saveChange();
  };

  saveChange = () => {
    const {form, userid, foto_user} = this.state;
    this.setState({updating: true});
    axios
      .put(
        `${BASE_URL()}/user/${userid}`,
        QueryString.stringify({
          username: form.username,
          nama_lengkap: form.nama,
          email: form.email,
          password: form.pass,
          no_telp: form.notelp,
        }),
      )
      .then(async ({data}) => {
        this.setState({updating: false});
        if (!data.status) {
          this.alert.show({
            message: errMsg('Ubah Profil'),
          });
          return;
        }
        if (foto_user.uri) {
          await this.uploadFoto();
        }
        let sessionData = [
          ['nama', form.nama],
          ['username', form.username],
          ['email', form.email],
          ['notelp', form.notelp],
        ];
        // console.warn(sessionData)
        await AsyncStorage.multiSet(sessionData);
        ToastAndroid.show(
          'Berhasil ubah profil. Data anda telah disimpan.',
          ToastAndroid.SHORT,
        );
      })
      .catch(e => {
        this.setState({updating: false});
        this.alert.show({
          message: e.response?.data?.errorMessage ?? errMsg('Ubah Profil'),
        });
        console.warn(e.response?.data ?? e.message);
      });
  };

  selectEmail = async () => {
    const {userid} = this.state;
    try {
      if (await GoogleSignin.isSignedIn()) {
        // Logout Google Account, agar tidak auto signed-in
        await this.signOutGoogle();
      }
      await GoogleSignin.hasPlayServices();
      const {user} = await GoogleSignin.signIn();

      // console.warn('1', user);
      // Jika berhasil sign-in, cek ketersediaan e-mail
      this.setState({loadingEmail: true});
      try {
        let {data} = await axios.post(
          `${BASE_URL()}/auth/email`,
          QueryString.stringify({email: user.email, id: userid}),
        );
        this.setState({loadingEmail: false});
        if (!data.status) {
          this.alert.show({
            message: errMsg('Cek E-mail'),
          });
          return;
        }
        // Berhasil
        this.setState(s => ({form: {...s.form, email: user.email}}));
      } catch (e) {
        this.setState({loadingEmail: false});
        this.alert.show({
          message: e.response?.data?.errorMessage ?? errMsg('Cek E-mail'),
        });
        console.warn(e.response?.data ?? e.message);
      }
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        // Alert.alert('Cancel');
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

  render() {
    const {
      updating,
      error,
      showpass,
      showkonfpass,
      form,
      loadingEmail,
      initialLoad,
      foto_user,
    } = this.state;
    return (
      <NativeBaseProvider>
        <Loading isVisible={loadingEmail || initialLoad} />
        <AlertOkV2 ref={ref => (this.alert = ref)} />
        <ScrollView>
          <Box flex={1} paddingX={8} pb={8} bg="white">
            <Heading size="lg" mt={3} color={theme.primary}>
              Akunku
            </Heading>
            {/* <Heading color="muted.400" size="xs">
              Daftar untuk melanjutkan!
            </Heading> */}

            <VStack space={3} mt={5}>
              <Pressable onPress={() => this.handleChoosePhoto()}>
                <Avatar
                  source={{
                    uri: foto_user.uri ? foto_user.uri : foto_user,
                  }}
                  alignSelf={{base: 'center'}}
                  size="xl">
                  Upload
                </Avatar>
              </Pressable>
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
                  InputRightElement={
                    <IconButton
                      onPress={_ => this.selectEmail()}
                      variant="unstyled"
                      startIcon={
                        <Icon
                          as={
                            <MaterialCommunityIcons
                              name={'email-edit-outline'}
                            />
                          }
                          color="muted.700"
                          size="sm"
                        />
                      }
                    />
                  }
                />
                <FormControl.ErrorMessage
                  _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>
                  {error.email}
                </FormControl.ErrorMessage>
              </FormControl>

              <VStack space={2} mt={4}>
                <Button
                  onPress={this.validate}
                  isLoading={updating}
                  bgColor={theme.primary}
                  _text={{color: 'white'}}>
                  Ubah
                </Button>

                {/* <Button
                  mt={1}
                  onPress={this.selectEmail}
                  disabled={updating}
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

export default Profil;
