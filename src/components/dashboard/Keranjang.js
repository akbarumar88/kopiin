import React, {Component} from 'react';
import {RefreshControl, Dimensions, TextInput} from 'react-native';
import ImageLoad from './../universal/ImageLoad';
import {
  Checkbox,
  NativeBaseProvider,
  Box,
  Text,
  FlatList,
  Divider,
  HStack,
  VStack,
  Button,
  HamburgerIcon,
  IconButton,
  Icon,
  Pressable,
  Menu,
} from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Resource from './../universal/Resource';
import {BASE_URL, theme} from './../../utilitas/Config';
import {toCurrency} from './../../utilitas/Function';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import AlertYesNoV2 from './../universal/AlertYesNoV2';
import ItemKeranjang from '../keranjang/ItemKeranjang';
export default class Keranjang extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cartData: [],
      changedData: false,
      refresh: false,
      iduser: '0',
      paramrefresh: new Date(),
      savedNumber: 0,
    };
  }

  async getUser() {
    let iduser = await AsyncStorage.getItem('id');

    this.setState({
      iduser: iduser,
    });
  }

  componentDidMount() {
    this.getUser();
    this._focus = this.props.navigation.addListener('focus', async () => {
      let loadAgain = await AsyncStorage.getItem('refreshKeranjang');

      if (loadAgain) {
        AsyncStorage.removeItem('refreshKeranjang');
        this.setState({paramrefresh: new Date()});
      }
    });
  }

  componentWillUnmount() {
    this._focus();
  }

  getCountOrder = () =>
    this.state.cartData.reduce((total, item) => {
      if (!item.selected) {
        return total + 0;
      }
      return total + 1;
    }, 0);

  getTotalDetailSelected = () =>
    this.state.cartData.reduce((total, item) => {
      if (!item.selected) {
        return total + 0;
      }
      return (
        total +
        item.orderdetail.reduce(
          (sub, item) => sub + parseInt(item.harga) * parseInt(item.jumlah),
          0,
        ) + (item.shipping?.biaya ?? 0)
      );
    }, 0);

  //Header Checkbox
  header = () => {
    const {cartData} = this.state;
    return (
      <Checkbox
        mt={2}
        ml={1}
        alignSelf="flex-start"
        value="success"
        aria-label="t1"
        isChecked={
          cartData.reduce((check, item) => {
            if (item.selected) {
              check += 1;
            }
            return check;
          }, 0) == cartData.length
        }
        color={theme.primary}
        onChange={checked => {
          this.setState({
            cartData: cartData.map(item => {
              item.selected = checked;
              return item;
            }),
          });
        }}>
        Pilih Semua
      </Checkbox>
    );
  };

  //Order

  render() {
    const {iduser} = this.state;
    return (
      <NativeBaseProvider>
        <AlertYesNoV2 ref={ref => (this.alert = ref)} />
        <Box bg="white" flex={1} pb={0}>
          {
            <Resource
              url={`${BASE_URL()}/orderdetail/user/${iduser}`}
              params={this.state.paramrefresh}>
              {({loading, error, payload: data, refetch, fetchMore, updateQuery}) => {
                const {cartData, refresh} = this.state;

                if (cartData != data.data && !loading) {
                  this.setState({
                    cartData: data.data,
                  });
                }
                return (
                  <>
                    <FlatList
                      refreshControl={
                        <RefreshControl
                          refreshing={loading || refresh}
                          onRefresh={async () => {
                            this.setState({
                              refresh: false,
                            });
                            refetch();
                          }}
                        />
                      }
                      ListHeaderComponent={() => this.header()}
                      px={4}
                      flex={1}
                      data={loading ? [] : data.data}
                      showsVerticalScrollIndicator={false}
                      renderItem={({item, index}) => {
                        // this.orderList(item, index)
                        return (
                          <ItemKeranjang
                            cartData={this.state.cartData}
                            item={item}
                            orderIndex={index}
                            navigation={this.props.navigation}
                            setParentState={this.setState.bind(this)}
                            refetchKeranjang={refetch}
                            updateQuery={updateQuery}
                          />
                        );
                      }}
                    />
                    <Box roundedTop={8} bg="#FF7F00" p={4}>
                      <HStack space={2}>
                        <Text bold rounded={4} px={2} bg="white">
                          {this.getCountOrder()}
                        </Text>

                        <Text color="white" bold flex={1}>
                          BAYAR
                        </Text>
                        <Text color="white" bold>
                          {toCurrency(this.getTotalDetailSelected())}
                        </Text>
                      </HStack>
                    </Box>
                  </>
                );
              }}
            </Resource>
          }
        </Box>
      </NativeBaseProvider>
    );
  }
}
