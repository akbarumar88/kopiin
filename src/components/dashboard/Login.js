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
    } else if (form.pass.length < 5) {
      error = {...error, pass: 'Password harus minimal 5 karakter'};
    }

    this.setState({error: error ?? {}});
    if (error) {
      return;
    }
  };

  render() {
    const {loggingIn, error, showpass} = this.state;
    return (
      <NativeBaseProvider>
        <ScrollView>
          <Box flex={1} p={2} w="90%" mx="auto">
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

              <VStack space={2}>
                <Button
                  onPress={this.validate}
                  isLoadingText={'login gan'}
                  isLoading={loggingIn}
                  bgColor={theme.primary}
                  _text={{color: 'white'}}>
                  Login
                </Button>

                <HStack justifyContent="center" alignItem="center">
                  {/* <IconButton
                    variant="unstyled"
                    startIcon={
                      <Icon
                        as={<MaterialCommunityIcons name="facebook" />}
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

              <HStack justifyContent="center">
                <Text fontSize="sm" color="muted.700" fontWeight={400}>
                  Pengguna baru?.{' '}
                </Text>
                <Link
                  onPress={_ => {
                    this.props.navigation.navigate('Register');
                  }}
                  _text={{color: theme.primary, bold: true, fontSize: 'sm'}}
                  href="Register">
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
