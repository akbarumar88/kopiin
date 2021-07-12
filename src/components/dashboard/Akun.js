import * as React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  NativeBaseProvider,
  Box,
  Text,
  Heading,
  VStack,
  Pressable,
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
import {Alert} from 'react-native';
import AlertYesNoV2 from '../universal/AlertYesNoV2';
import AsyncStorage from '@react-native-community/async-storage';

export default class Akun extends React.Component {
  render() {
    return (
      <NativeBaseProvider>
        <AlertYesNoV2 ref={ref => (this.alert = ref)} />
        <ScrollView>
          <Box flex={1} p={8} bg="white">
            <Heading size="lg" color={theme.primary} mb={4}>
              Akun Saya
            </Heading>

            <VStack>
              <Pressable
                paddingY={2}
                onPress={() => this.profil()}
                borderBottomWidth={0.5}>
                <Text bold>Profil</Text>
                <Text fontSize="sm">Data diri, Alamat, dan Keamanan Akun</Text>
              </Pressable>
              <Pressable
                paddingY={2}
                onPress={() => this.logout()}
                borderBottomWidth={0.5}>
                <Text bold>Keluar</Text>
                <Text fontSize="sm">Keluar dari akun anda.</Text>
              </Pressable>
            </VStack>
          </Box>
        </ScrollView>
      </NativeBaseProvider>
    );
  }

  profil=() => {
    
  }

  logout = () => {
    this.alert.show({message: 'Anda yakin ingin keluar?'}, async () => {
      let sessionData = [
        ['nama', ''],
        ['username', ''],
        ['email', ''],
        ['notelp', ''],
        ['token', ''],
      ]
      await AsyncStorage.multiSet(sessionData);
      this.props.navigation.reset({index: 0, routes: [{name: 'Dashboard'}]});
    });
  };
}
