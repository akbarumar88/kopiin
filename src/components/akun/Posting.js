import React, { Component, useState, useEffect } from "react"
import {
  NativeBaseProvider,
  Box,
  VStack,
  HStack,
  Icon,
  Actionsheet,
  TextArea,
  Button,
  Avatar,
  Text,
  Divider,
  Pressable,
  useDisclose,
  Image,
  FormControl,
} from "native-base"
import { launchImageLibrary, launchCamera } from "react-native-image-picker"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { Dimensions, ToastAndroid } from "react-native"
import ImageLoad from "./../universal/ImageLoad"
import { BASE_URL } from "./../../utilitas/Config"
import { toCurrency } from "./../../utilitas/Function"
import AsyncStorage from "@react-native-community/async-storage"
import axios from "axios"
import Resource from "./../universal/Resource"
import QueryString from "qs"
export default function Posting({ navigation }) {
  const { isOpen, onOpen, onClose } = useDisclose()
  const [post, setPost] = useState("")
  const [imagePost, setImagePost] = useState("")
  const [produk, setProduk] = useState()
  const [merchant, setMerchant] = useState()
  const [id, setId] = useState()
  const [errorForm, setErrorForm] = useState()
  const [nama, setNama] = useState("")
  const [loading, setLoading] = useState(false)
  const imgWidth = Dimensions.get("screen").width

  useEffect(async () => {
    let data = await AsyncStorage.getItem("id_merchant")
    setMerchant(data)
    AsyncStorage.multiGet(["id_merchant", "id", "nama"]).then((response) => {
      setMerchant(response[0][1])
      setId(response[1][1]) // Value2
      setNama(response[2][1])
    })
  }, [])

  const validation = () => {
    if (post.toString().trim() == "") {
      setErrorForm(true)
    } else {
      postStatus()
      setErrorForm(false)
    }
  }

  const postStatus = () => {
    setLoading(true)
    let data

    if (produk?.id) {
      data = {
        postingan: post,
        id_user: id,
        id_barang: produk.id,
      }
    } else {
      data = {
        postingan: post,
        id_user: id,
      }
    }

    axios
      .post(`${BASE_URL()}/postingan`, QueryString.stringify(data))
      .then(async ({ data }) => {
        if (imagePost?.uri) {
          await uploadFoto(data.id)
        }
        navigation.goBack()
        setLoading(false)
      })
      .catch(() => {
        ToastAndroid.show("Terjadi kesalahan saat upload", ToastAndroid.SHORT)
        setLoading(false)
      })
  }

  const uploadFoto = (id) => {
    let data = new FormData()
    let photo = imagePost
    data.append("foto_postingan", {
      name: photo.fileName,
      type: photo.type,
      uri: Platform.OS === "ios" ? photo.uri.replace("file://", "") : photo.uri,
    })

    return axios.post(`${BASE_URL()}/postingan/foto/${id}`, data)
  }

  function handleChoosePhoto() {
    launchImageLibrary({ noData: true }, (response) => {
      if (response.assets) {
        setImagePost(response.assets[0])
        // let data = response.assets[0];
      }
    })
  }
  function handleTakePhoto() {
    launchCamera({ noData: true }, (response) => {
      if (response.assets) {
        setImagePost(response.assets[0])
      }
    })
  }

  const setData = (produk) => {
    setProduk(produk)
  }

  function piliProduk() {
    navigation.navigate("MyProduk", { pilih: setData })
  }
  return (
    <NativeBaseProvider>
      <Box bg="white">
        <VStack>
          <HStack space={2} p={3} alignItems="center">
            {id && (
              <Resource url={`${BASE_URL()}/user/${id}`}>
                {({ loading, error, payload: data, refetch, fetchMore }) => {
                  if (loading) {
                    return <Avatar alt={nama} size="md" />
                  } else {
                    return (
                      <Avatar
                        size="md"
                        alt={nama}
                        source={{
                          uri:
                            `${BASE_URL()}/image/user/` + data.data.foto_user,
                        }}
                      />
                    )
                  }
                }}
              </Resource>
            )}
            <Text bold fontSize="sm">
              {nama}
            </Text>
          </HStack>

          <Box>
            <FormControl px={2} isInvalid={errorForm}>
              <TextArea
                value={post}
                onChangeText={setPost}
                fontSize="sm"
                placeholder="Tuliskan Status anda"
                rounded={0}
                textAlignVertical="top"
              />
              <FormControl.ErrorMessage>
                Harap isi postingan
              </FormControl.ErrorMessage>
            </FormControl>
            {imagePost?.uri && (
              <Box mt={3}>
                <Image
                  ml={1}
                  w={imgWidth * 0.19}
                  h={imgWidth * 0.19}
                  source={{ uri: imagePost?.uri }}
                />
                <Pressable
                  onPress={() => setImagePost("")}
                  style={{
                    position: "absolute",
                  }}
                >
                  <Icon
                    size="sm"
                    color="red"
                    as={<MaterialCommunityIcons name="close-circle" />}
                  />
                </Pressable>
                <Divider mt={3} />
              </Box>
            )}
            {produk?.nama && (
              <VStack mx={1} p={1}>
                <Text bold mt={2} fontSize="sm" mb={2}>
                  Produk Terkait
                </Text>
                <HStack space={3} alignItems="center">
                  <ImageLoad
                    w={imgWidth * 0.15}
                    h={imgWidth * 0.15}
                    url={`${BASE_URL()}/image/barang/${
                      produk?.foto_barang
                    }?time=${new Date()}`}
                  />
                  <VStack>
                    <Text fontSize="sm" bold>
                      {produk?.nama}
                    </Text>
                    <Text fontSize="sm" color="grey">
                      {toCurrency(produk?.harga)}
                    </Text>
                  </VStack>
                  <Box flex={1}></Box>
                  <Pressable
                    onPress={() => {
                      setProduk("")
                    }}
                  >
                    <Icon
                      size="sm"
                      color="red"
                      as={<MaterialCommunityIcons name="close-circle" />}
                    />
                  </Pressable>
                </HStack>
                <Divider mt={3} />
              </VStack>
            )}
          </Box>
          <Box>
            <Pressable onPress={onOpen}>
              <HStack p={2} space={2} alignItems="center">
                <Icon
                  as={<MaterialCommunityIcons name="image" />}
                  color="grey"
                  size="sm"
                />
                <Text color="grey" fontSize="sm">
                  Foto
                </Text>
                <Box flex={1}></Box>
              </HStack>
            </Pressable>

            <Actionsheet isOpen={isOpen} onClose={onClose}>
              <Actionsheet.Content>
                <Actionsheet.Item
                  onPress={() => {
                    handleChoosePhoto()
                    onClose()
                  }}
                >
                  Pilih Dari Galeri
                </Actionsheet.Item>
                <Actionsheet.Item
                  onPress={() => {
                    handleTakePhoto()
                    onClose()
                  }}
                >
                  Ambil Foto
                </Actionsheet.Item>
              </Actionsheet.Content>
            </Actionsheet>

            <Divider />
            {merchant && (
              <Pressable onPress={() => piliProduk()}>
                <HStack p={2} space={2} alignItems="center">
                  <Icon
                    as={<MaterialCommunityIcons name="tag" />}
                    color="grey"
                    size="sm"
                  />
                  <Text color="grey" fontSize="sm">
                    Produk
                  </Text>
                  <Box flex={1}></Box>
                </HStack>
              </Pressable>
            )}
          </Box>
          <Button
            isLoading={loading}
            isLoadingText="Loading..."
            onPress={() => validation()}
            m={2}
            size="sm"
          >
            Posting
          </Button>
        </VStack>
      </Box>
    </NativeBaseProvider>
  )
}
