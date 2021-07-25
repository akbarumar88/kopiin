import React, { Component } from "react"
import { View, Dimensions } from "react-native"

import moment from "moment"
import ImageLoad from "./../universal/ImageLoad"
import {
  NativeBaseProvider,
  HStack,
  Avatar,
  Input,
  Box,
  Text,
  VStack,
  IconButton,
  Icon,
  FlatList,
  Pressable,
} from "native-base"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import AsyncStorage from "@react-native-community/async-storage"
import Resource from "./../universal/Resource"
import { BASE_URL } from "./../../utilitas/Config"
import { toCurrency } from "./../../utilitas/Function"
import FooterLoading from "../universal/FooterLoading"
import QueryString from "qs"
import axios from "axios"
export class Post extends Component {
  constructor(props) {
    super(props)
    this.state = {
      liked: this.props.item.liked == "0",
      like: 0,
      isLoaded: false,
      clicked: false,
    }
  }

  componentDidMount() {
    this.setState({
      liked: this.props.item.liked == "0",
    })
  }

  likePost = async () => {
    let id = await AsyncStorage.getItem("id")
    let idPostingan = this.props.item.id
    axios
      .post(
        `${BASE_URL()}/postingan/like/${idPostingan}`,
        QueryString.stringify({
          liked: !this.state.liked,
          id_user: id,
        })
      )
      .then(({ data }) => {
        this.setState({ isLoaded: false })
      })
      .catch((e) => {
        this.setState({ isLoaded: false })
      })
  }

  getRange = () => {
    let a = moment()
    let b = moment(this.props.item.tglpostingan)
    let hari = a.diff(b, "days")
    let bulan = a.diff(b, "months")
    if (bulan > 0) {
      return bulan.toString() + " bulan yang lalu"
    } else if (hari <= 0) {
      return "Hari Ini"
    } else if (hari == 1) {
      return "Kemarin"
    }
    return hari.toString() + " hari yang lalu"
  }

  render() {
    const { item } = this.props
    const { like, liked, isLoaded, clicked } = this.state
    const imgPost = Dimensions.get("window").width * 0.8
    const imgproduct = Dimensions.get("window").width * 0.15
    return (
      <Pressable
        onPress={() => {
          clearTimeout(this.clearClick)
          if (!isLoaded && clicked) {
            let temp = like
            if (this.state.liked) {
              temp++
              this.setState({
                liked: !this.state.liked,
                like: temp,
                isLoaded: true,
              })
              this.likePost()
            }
          }
          this.setState({ clicked: true })
          this.clearClick = setTimeout(() => {
            this.setState({ clicked: false })
          }, 600)
        }}
      >
        <Box bg="white" mx={2} rounded={8} mt={1} mb={1} px={3} py={5} pb={3}>
          <VStack space={2}>
            <HStack space={2} alignItems="center">
              <Avatar
                source={{
                  uri: `${BASE_URL()}/image/user/` + item.foto_user,
                }}
                size="md"
              />
              <Text fontSize="sm" bold>
                {item.nama_lengkap}
              </Text>
            </HStack>
            {item.foto_postingan && (
              <ImageLoad
                alignSelf="center"
                w={imgPost}
                h={imgPost}
                url={`${BASE_URL()}/image/postingan/` + item.foto_postingan}
              />
            )}
            {item.id_barang && (
              <Box>
                <HStack space={2} alignItems="center">
                  <ImageLoad
                    rounded={2}
                    w={imgproduct}
                    h={imgproduct}
                    url={`${BASE_URL()}/image/barang/` + item.foto_barang}
                  />
                  <VStack>
                    <Text fontSize="sm" bold>
                      {item.nama}
                    </Text>
                    <Text color="grey" bold fontSize="sm">
                      {toCurrency(item.harga)}
                    </Text>
                  </VStack>
                </HStack>
              </Box>
            )}

            <Text fontSize="sm" mt={1} color="grey">
              {item.postingan}
            </Text>
            <HStack alignItems="center">
              <Text sub>{this.getRange()}</Text>
              <HStack
                color="grey"
                flex={1}
                justifyContent="flex-end"
                alignItems="center"
              >
                <IconButton
                  onPress={() => {
                    if (!isLoaded) {
                      let temp = like
                      if (this.state.liked) {
                        temp++
                      } else {
                        temp--
                      }
                      this.setState({
                        liked: !this.state.liked,
                        like: temp,
                        isLoaded: true,
                      })
                      this.likePost()
                    }
                  }}
                  variant="ghost"
                  startIcon={
                    <Icon
                      as={
                        <MaterialCommunityIcons
                          name={liked ? "heart-outline" : "heart"}
                        />
                      }
                      color={liked ? "grey" : "red"}
                      size="xs"
                    />
                  }
                />
                <Text fontSize="xs" color="grey">
                  {parseInt(item.like) + parseInt(like)}
                </Text>
              </HStack>
            </HStack>
          </VStack>
        </Box>
      </Pressable>
    )
  }
}

export default class Feed extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: "",
      initialLoading: true,
      hasMorePost: false,
      limit: 5,
    }
  }

  async componentDidMount() {
    let id = await AsyncStorage.getItem("id")
    this.setState({ id: id, initialLoading: false })
  }

  postArea = () => {
    const { id } = this.state
    return (
      <Pressable onPress={() => this.props.navigation.navigate("Posting")}>
        <Box bg="white" px={3} py={5}>
          <HStack space={2}>
            <Resource url={`${BASE_URL()}/user/${id}`}>
              {({ loading, error, payload: data, refetch, fetchMore }) => {
                if (loading) {
                  return <Avatar alt={id} size="md" />
                } else {
                  return (
                    <Avatar
                      size="md"
                      alt={id}
                      source={{
                        uri:
                          `${BASE_URL()}/image/user/` + data?.data?.foto_user,
                      }}
                    />
                  )
                }
              }}
            </Resource>
            <Input
              isDisabled={true}
              fontSize="sm"
              size="sm"
              placeholder="Buat Postingan Terbaru"
              borderColor="grey"
              variant="rounded"
              flex={1}
            />
          </HStack>
        </Box>
      </Pressable>
    )
  }

  render() {
    const { limit, id, initialLoading } = this.state
    return (
      <NativeBaseProvider>
        {this.postArea()}
        {!this.state.initialLoading && (
          <Resource
            url={`${BASE_URL()}/postingan`}
            params={{
              user: this.state.id,
              limit,
            }}
          >
            {({ loading, error, payload: data, refetch, fetchMore }) => {
              if (loading) {
                return (
                  <Box flex={1} justifyContent="center">
                    <FooterLoading full />
                  </Box>
                )
              }
              let nextOffset = data.data.length
              return (
                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={data.data}
                  flex={1}
                  keyExtractor={(item, index) => item.id}
                  refreshing={false}
                  onRefresh={() => {
                    this.setState({ hasMorePost: true })
                    refetch()
                  }}
                  renderItem={({ item }) => <Post item={item} />}
                  onEndReachedThreshold={0.01}
                  onEndReached={({ distanceFromEnd }) => {
                    if (data.data.length) {
                      fetchMore(
                        { offset: nextOffset },
                        (newPayload, oldPayload) => {
                          // console.warn(newPayload);
                          if (newPayload.data < limit) {
                            this.setState({ hasMorePost: false })
                          }
                          return {
                            ...oldPayload,
                            data: [...oldPayload.data, ...newPayload.data],
                          }
                        }
                      )
                    }
                  }}
                  ListFooterComponent={
                    this.state.hasMorePost ? <FooterLoading /> : null
                  }
                />
              )
            }}
          </Resource>
        )}
      </NativeBaseProvider>
    )
  }
}
