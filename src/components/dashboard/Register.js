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
import {theme} from '../../utilitas/Config';

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
  };

  render() {
    const {loggingIn, error, showpass, showkonfpass} = this.state;
    return (
      <NativeBaseProvider>
        <ScrollView>
          <Box flex={1} p={2} w="90%" mx="auto">
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

                <HStack justifyContent="center" alignItem="center">
                  {/* <IconButton
                variant="unstyled"
                startIcon={
                  <Icon
                    as={<MaterialCommunityIcons  name="facebook" />}
                    color="muted.700"
                    size="sm"
                  />
                }
              /> */}
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
                </HStack>
              </VStack>
            </VStack>
          </Box>
        </ScrollView>
      </NativeBaseProvider>
    );
  }
}
