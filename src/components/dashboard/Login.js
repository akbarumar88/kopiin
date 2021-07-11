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
} from 'native-base';
import {theme} from '../../utilitas/Config';

export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loggingIn: false,
    };
  }

  render() {
    const {loggingIn} = this.state;
    return (
      <NativeBaseProvider>
        <Box flex={1} p={2} w="90%" mx="auto">
          <Heading size="lg" color={theme.primary}>
            Selamat Datang
          </Heading>
          <Heading color="muted.400" size="xs">
            Masuk untuk melanjutkan!
          </Heading>

          <VStack space={3} mt={5}>
            <FormControl>
              <FormControl.Label
                _text={{color: 'muted.700', fontSize: 'sm', fontWeight: 600}}>
                Username
              </FormControl.Label>
              <Input />
            </FormControl>

            <FormControl mb={5}>
              <FormControl.Label
                _text={{color: 'muted.700', fontSize: 'sm', fontWeight: 600}}>
                Password
              </FormControl.Label>
              <Input type="password" />
              <Link
                _text={{
                  fontSize: 'xs',
                  fontWeight: '700',
                  color: theme.primary,
                }}
                alignSelf="flex-end"
                mt={1}>
                Lupa Password?
              </Link>
            </FormControl>

            <VStack space={2}>
              <Button
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

            <HStack justifyContent="center">
              <Text fontSize="sm" color="muted.700" fontWeight={400}>
                Pengguna baru?.{' '}
              </Text>
              <Link
                onPress={_ => {this.props.navigation.navigate('Register')}}
                _text={{color: theme.primary, bold: true, fontSize: 'sm'}}
                href="Register">
                Daftar
              </Link>
            </HStack>
          </VStack>
        </Box>
      </NativeBaseProvider>
    );
  }
}
