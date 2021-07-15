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
import Resource from '../universal/Resource';
import {MerchantShimmer} from '../universal/Placeholder';

export default class Home extends Component {
  render() {
    return (
      <NativeBaseProvider>
        <ScrollView>
          <Text bold>Toko / Kedai Terdekat</Text>
          {this.listToko()}
          <Text bold>Mungkin anda butuh barang ini</Text>
          {this.listBarang()}
        </ScrollView>
      </NativeBaseProvider>
    );
  }

  listToko = () => {
    return (
      <Resource url={`${BASE_URL()}/dashboard/shop`}>
        {({loading, error, payload: data, refetch}) => {
          if (loading) {
            return <MerchantShimmer />;
          } else if (error) {
            return <Text>{errMsg('Load Merchant')}</Text>;
          } else if (!data.status) {
            return <Text>{errMsg('Load Merchant')}</Text>;
          }

          return (
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              <View style={{flexDirection: 'row'}}>
                {data.data.map((item, index) => {
                  return (
                    <Pressable
                      key={index}
                      onPress={() => {
                        if (index % 2 == 0) {
                          this.props.navigation.navigate('ApotekDetail', {
                            appid,
                            kl_nama: nama,
                          });
                        } else {
                          this.props.navigation.navigate('KlinikDetail', {
                            data: item,
                          });
                        }
                      }}>
                      {/* <View style={[{width}, style.wCardApotek, marginLeft]}> */}
                        <RNImage
                          resizeMode="contain"
                          style={[{width, height: width}, style.imgApotek]}
                          source={{
                            uri: foto,
                          }}
                        />
                        <View style={{padding: 10}}>
                          <Text numberOfLines={2} style={{fontSize: 12}}>
                            {nama}
                          </Text>
                          <View style={{flexDirection: 'row'}}>
                            <Text
                              numberOfLines={3}
                              style={{
                                fontSize: 10,
                                color: 'gray',
                                marginLeft: 0,
                              }}>
                              {kota ? kota : ''}
                            </Text>
                          </View>
                        </View>
                      {/* </View> */}
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>
          );
        }}
      </Resource>
    );
  };

  listBarang = () => {};
}
