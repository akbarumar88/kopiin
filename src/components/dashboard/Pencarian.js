import React, {Component} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  Alert,
  ToastAndroid,
  Dimensions,
  RefreshControl,
  NativeAppEventEmitter,
} from 'react-native';
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
  Pressable,
  Image,
  Center,
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
import Resource from '../universal/Resource';
import {MerchantShimmer, BarangShimmer} from '../universal/Placeholder';

export default class Pencarian extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cari: '',
    };
  }

  render() {
    return (
      <NativeBaseProvider>
        <Box bgColor={'#ff0000'} flex={1}>
          {/* <Box>
            <Text>Ini Header Gan</Text>
          </Box> */}
          <ScrollView
            paddingX={4}
            paddingY={4}
            backgroundColor={'#fff'}
            nestedScrollEnabled>
            <Box>{this.searchBox()}</Box>
          </ScrollView>
        </Box>
      </NativeBaseProvider>
    );
  }

  searchBox = () => (
    <FormControl>
      <Input
        placeholder="Cari"
        value={this.state.cari}
        onChangeText={e => this.setState({cari: e})}
        onSubmitEditing={e => this.bukaPencarian()}
        InputRightElement={
          <Icon
            onPress={() => this.bukaPencarian()}
            size="md"
            mr={2}
            as={<MaterialCommunityIcons name="magnify" />}
          />
        }
      />
    </FormControl>
  );

  bukaPencarian = () => {
    this.props.navigation.navigate('SearchResult', {cari: this.state.cari});
  };
}
