import * as React from "react"
import Ionicons from "react-native-vector-icons/Ionicons"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
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
  Tabs,
  extendTheme,
} from "native-base"
import { theme } from "../../utilitas/Config"
import { Alert } from "react-native"
import AlertYesNoV2 from "../universal/AlertYesNoV2"
import AsyncStorage from "@react-native-community/async-storage"

export default class Akun extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      id_merchant: null,
    }
  }

  async cekToko() {
    let id_merchant = await AsyncStorage.getItem("id_merchant")
    this.setState({ id_merchant: id_merchant })
  }

  componentDidMount() {
    this.cekToko()
  }

  render() {
    const { id_merchant } = this.state
    return (
      <NativeBaseProvider>
        <AlertYesNoV2 ref={(ref) => (this.alert = ref)} />
        <ScrollView>
          <Box flex={1} p={8} bg="white">
            <Heading size="lg" color={theme.primary} mb={4}>
              Akun Saya
            </Heading>

            <VStack>
              <Tabs colorScheme="amber" isFitted>
                {/* Tab Heading */}
                <Tabs.Bar>
                  <Tabs.Tab>User</Tabs.Tab>
                  <Tabs.Tab>Toko</Tabs.Tab>
                </Tabs.Bar>

                {/* Tab View */}
                <Tabs.Views>
                  <Tabs.View>{this.userView()}</Tabs.View>
                  <Tabs.View>
                    {id_merchant ? this.merchantView() : this.registerView()}
                  </Tabs.View>
                </Tabs.Views>
              </Tabs>
            </VStack>
          </Box>
        </ScrollView>
      </NativeBaseProvider>
    )
  }

  userView = () => {
    const { id_merchant } = this.state
    return (
      <Box>
        <Pressable
          paddingY={2}
          onPress={() => this.profil()}
          borderBottomWidth={0.5}
        >
          <Text bold>Profil</Text>
          <Text fontSize="sm">Data diri, Alamat, dan Keamanan Akun</Text>
        </Pressable>
        <Pressable
          paddingY={2}
          onPress={() => this.alamat()}
          borderBottomWidth={0.5}
        >
          <Text bold>Alamat</Text>
          <Text fontSize="sm">Kelola alamat dari akun anda</Text>
        </Pressable>
        <Pressable
          paddingY={2}
          onPress={() => this.wishlist()}
          borderBottomWidth={0.5}
        >
          <Text bold>Wishlist</Text>
          <Text fontSize="sm">Wishlist Anda</Text>
        </Pressable>
        <Pressable
          paddingY={2}
          onPress={() => this.ubahPasssword()}
          borderBottomWidth={0.5}
        >
          <Text bold>Ubah Password</Text>
          <Text fontSize="sm">Ubah Password dari akun anda</Text>
        </Pressable>

        <Pressable
          paddingY={2}
          onPress={() => this.logout()}
          borderBottomWidth={0.5}
        >
          <Text bold>Keluar</Text>
          <Text fontSize="sm">Keluar dari akun anda.</Text>
        </Pressable>
      </Box>
    )
  }

  merchantView = () => {
    return (
      <Box>
        <Pressable
          paddingY={2}
          onPress={() => this.bukaToko()}
          borderBottomWidth={0.5}
        >
          <Text bold>Profil Toko</Text>
          <Text fontSize="sm">Jenis Toko, Alamat, dan Foto Profil</Text>
        </Pressable>

        <Pressable
          paddingY={2}
          onPress={() => this.myListProduk()}
          borderBottomWidth={0.5}
        >
          <Text bold>Daftar Produk</Text>
          <Text fontSize="sm">Produk di toko saya</Text>
        </Pressable>
      </Box>
    )
  }

  registerView = () => {
    return (
      <Box>
        <Pressable
          paddingY={2}
          onPress={() => this.bukaToko()}
          borderBottomWidth={0.5}
        >
          <Text bold>Buka Toko</Text>
          <Text fontSize="sm">Buka Toko Gratis!</Text>
        </Pressable>
      </Box>
    )
  }

  profil = () => {
    this.props.navigation.navigate("Profil")
  }

  alamat = () => {
    this.props.navigation.navigate("Alamat")
  }
  wishlist = () => {
    this.props.navigation.navigate("Wishlist")
  }
  ubahPasssword = () => {
    this.props.navigation.navigate("UbahPassword")
  }

  bukaToko = () => {
    this.props.navigation.navigate("Shop")
  }

  myListProduk = () => {
    this.props.navigation.navigate("MyProduk")
  }

  logout = () => {
    this.alert.show({ message: "Anda yakin ingin keluar?" }, async () => {
      let sessionData = [
        ["nama", ""],
        ["username", ""],
        ["email", ""],
        ["notelp", ""],
        ["token", ""],
        ["id", ""],
        ["id_merchant", ""],
      ]
      await AsyncStorage.multiSet(sessionData)
      this.props.navigation.reset({ index: 0, routes: [{ name: "Dashboard" }] })
    })
  }
}
