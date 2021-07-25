import React, { Component } from "react"
import { RefreshControl, Dimensions, TextInput } from "react-native"
import ImageLoad from "./../universal/ImageLoad"
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
} from "native-base"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import Resource from "./../universal/Resource"
import { BASE_URL, theme } from "./../../utilitas/Config"
import { toCurrency } from "./../../utilitas/Function"
import axios from "axios"
import AsyncStorage from "@react-native-community/async-storage"
import AlertYesNoV2 from "./../universal/AlertYesNoV2"
export default class Keranjang extends Component {
  constructor(props) {
    super(props)
    this.state = {
      cartData: [],
      changedData: false,
      refresh: false,
      iduser: "0",
      paramrefresh: new Date(),
      savedNumber: 0,
    }
  }

  async getUser() {
    let iduser = await AsyncStorage.getItem("id")

    this.setState({
      iduser: iduser,
    })
  }

  componentDidMount() {
    this.getUser()
    this._focus = this.props.navigation.addListener("focus", async () => {
      let loadAgain = await AsyncStorage.getItem("refreshKeranjang")

      if (loadAgain) {
        AsyncStorage.removeItem("refreshKeranjang")
        this.setState({ paramrefresh: new Date() })
      }
    })
  }

  componentWillUnmount() {
    this._focus()
  }

  deleteItem = (id) => {
    this.alert.show(
      { message: "Apakah Anda yakin ingin menghapus data ini ?" },
      async () => {
        this.setState({ paramrefresh: new Date() })
        await axios.delete(`${BASE_URL()}/orderdetail/${id}`).then((e) => {})
      }
    )
  }

  deleteOrder = (id) => {
    this.alert.show(
      { message: "Apakah Anda yakin ingin menghapus data ini ?" },
      async () => {
        await axios.delete(`${BASE_URL()}/order/${id}`).then((e) => {})
        this.setState({ paramrefresh: new Date() })
      }
    )
  }

  getCountOrder = () =>
    this.state.cartData.reduce((total, item) => {
      if (!item.selected) {
        return total + 0
      }
      return total + 1
    }, 0)

  getTotalDetailSelected = () =>
    this.state.cartData.reduce((total, item) => {
      if (!item.selected) {
        return total + 0
      }
      return (
        total +
        item.orderdetail.reduce(
          (sub, item) => sub + parseInt(item.harga) * parseInt(item.jumlah),
          0
        )
      )
    }, 0)

  getSubTotal = (orderIndex) =>
    this.state.cartData[orderIndex].orderdetail.reduce(
      (sub, item) => sub + parseInt(item.harga) * parseInt(item.jumlah),
      0
    )

  //Header Checkbox
  header = () => {
    const { cartData } = this.state
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
              check += 1
            }
            return check
          }, 0) == cartData.length
        }
        color={theme.primary}
        onChange={(checked) => {
          this.setState({
            cartData: cartData.map((item) => {
              item.selected = checked
              return item
            }),
          })
        }}
      >
        Pilih Semua
      </Checkbox>
    )
  }

  //Produk
  detailList = (item, index, orderIndex) => {
    const { cartData } = this.state
    const imgWidth = Dimensions.get("screen").width * 0.175
    const urlGambar = `${BASE_URL()}/image/barang/`
    return (
      <HStack mb={2} space={3}>
        <IconButton
          colorScheme="danger"
          onPress={() => this.deleteItem(item.id)}
          startIcon={
            <Icon
              as={<MaterialCommunityIcons name="delete" />}
              color="red"
              size="sm"
            />
          }
        />
        <Pressable
          onPress={() =>
            this.props.navigation.navigate("DetailProduk", {
              idproduk: item.id_barang,
            })
          }
        >
          <HStack mb={2} space={3}>
            <ImageLoad
              style={{
                resizeMode: "contain",
                alignSelf: "center",
              }}
              w={imgWidth}
              h={imgWidth}
              url={urlGambar + item.foto_barang}
            />

            <VStack>
              <Text fontSize="sm" bold>
                {item.nama}
              </Text>
              {item.varian != "-" && (
                <Text fontSize="xs">Varian : {item.varian}</Text>
              )}
              <Text color="grey" bold>
                {toCurrency(item.harga)}
              </Text>
              <Text color="grey" fontSize="sm">
                x {item.jumlah}
              </Text>
            </VStack>
          </HStack>
        </Pressable>
      </HStack>
    )
  }

  //Order
  orderList = (item, orderIndex) => {
    const { cartData, checkedAll } = this.state

    return (
      <Box ml={2} bg="white" flex={1} my={2}>
        <VStack space={2}>
          <HStack mb={2}>
            <Checkbox
              aria-label={orderIndex + "a"}
              isChecked={cartData[orderIndex]?.selected || false}
              value="success"
              color={theme.primary}
              _text={{ fontWeight: "bold" }}
              onChange={(state) => {
                cartData[orderIndex].selected = state

                this.setState({
                  cartData: cartData,
                })
              }}
            >
              {item.nama_toko}
            </Checkbox>
            <Box flex={1}></Box>
            <Menu
              mr={2}
              trigger={(triggerProps) => {
                return (
                  <Pressable
                    accessibilityLabel="More options menu"
                    {...triggerProps}
                  >
                    <HamburgerIcon size="sm" fontSize="sm" />
                  </Pressable>
                )
              }}
            >
              <Menu.Item
                _text={{ padding: 0 }}
                onPress={() =>
                  this.props.navigation.navigate("UbahKeranjang", {
                    idorder: item.id,
                  })
                }
              >
                Edit
              </Menu.Item>
              <Menu.Item onPress={() => this.deleteOrder(item.id)}>
                Hapus
              </Menu.Item>
            </Menu>
          </HStack>

          {/* Item Keranjang */}
          <FlatList
            data={item.orderdetail}
            renderItem={({ item, index }) => {
              return this.detailList(item, index, orderIndex)
            }}
          />
          {/* Footer */}
          <Text fontSize="sm" bold>
            Alamat Pengiriman
          </Text>
          <HStack alignItems="center">
            <VStack flex={1} mr={2}>
              <Text fontSize="sm">{item.nama}</Text>
              <Text
                color="grey"
                fontSize="xs"
              >{`${item.detail} , ${item.kecamatan} , ${item.kota} , ${item.provinsi}`}</Text>
              <Text color="grey" fontSize="xs">
                {item.no_telp}
              </Text>
            </VStack>
            <VStack>
              <Button
                size="sm"
                onPress={() => {
                  this.props.navigation.navigate("Alamat", {
                    idorder: item.id,
                    selected: item.id_alamat,
                  })
                }}
              >
                Ubah
              </Button>
            </VStack>
          </HStack>
          <Divider />
          {/* Metode Pengiriman */}
          <Text bold>Metode Pengiriman</Text>
          <HStack alignItems="center">
            <VStack flex={1}>
              <Text>Nama Kurir</Text>
              <Text>Harga</Text>
            </VStack>
            <VStack>
              <Button size="sm">Ubah</Button>
            </VStack>
          </HStack>
          <Divider />
          {/* Total */}
          <HStack alignItems="center">
            <Text flex={1} bold>
              Total
            </Text>
            <Text mb={3}>
              {toCurrency(
                cartData[orderIndex]
                  ? this.getSubTotal(orderIndex)
                  : item?.orderdetail.reduce(
                      (sub, item) => sub + parseInt(item.harga),
                      0
                    )
              )}
            </Text>
          </HStack>
        </VStack>
      </Box>
    )
  }

  render() {
    const { iduser } = this.state
    return (
      <NativeBaseProvider>
        <AlertYesNoV2 ref={(ref) => (this.alert = ref)} />
        <Box bg="white" flex={1} pb={0}>
          {
            <Resource
              url={`${BASE_URL()}/orderdetail/user/${iduser}`}
              params={this.state.paramrefresh}
            >
              {({ loading, error, payload: data, refetch, fetchMore }) => {
                const { cartData, refresh } = this.state

                if (cartData != data.data && !loading) {
                  this.setState({
                    cartData: data.data,
                  })
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
                            })
                            refetch()
                          }}
                        />
                      }
                      ListHeaderComponent={() => this.header()}
                      px={4}
                      flex={1}
                      data={loading ? [] : data.data}
                      showsVerticalScrollIndicator={false}
                      renderItem={({ item, index }) =>
                        this.orderList(item, index)
                      }
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
                )
              }}
            </Resource>
          }
        </Box>
      </NativeBaseProvider>
    )
  }
}
