import {
  NativeBaseProvider,
  FormControl,
  Input,
  Button,
  Icon,
  HStack,
  Box,
  Text,
  VStack,
  FlatList,
  useDisclose,
  Actionsheet,
  Fab,
  Divider,
  ScrollView,
  Stack,
} from 'native-base';

import * as React from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ImageLoad from '../universal/ImageLoad';
import {Dimensions, Linking} from 'react-native';
import Resource from '../universal/Resource';
import AsyncStorage from '@react-native-community/async-storage';
import {BASE_URL} from '../../utilitas/Config';
import FooterLoading from '../universal/FooterLoading';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import EmptyCart from './../universal/EmptyCart';
import {errMsg, getStatus, toCurrency} from '../../utilitas/Function';

class HeaderTransaksi extends React.Component {
  render() {
    const {data} = this.props;
    return (
      <Stack space={1} py={2}>
        <Text sub>Status</Text>
        <Text fontSize="sm" bold color="green">
          {getStatus(data.status)}
        </Text>
        <Divider my={1} />
        <Text sub>Tanggal Pembelian</Text>
        <Text fontSize="sm" bold color="green">
          {moment(data.tgl_order).format('yyyy-MM-DD')}
        </Text>
        <Divider my={1} />
        <Text sub>Faktur</Text>
        <Text fontSize="sm" bold color="green">
          {data.no_faktur}
        </Text>
        <Divider my={1} />
      </Stack>
    );
  }
}

class BodyTransaksi extends React.Component {
  render() {
    const {data} = this.props;
    const imgWidth = Dimensions.get('screen').width * 0.15;
    const dataGambar = BASE_URL() + '/image/barang/';
    return (
      <Stack space={1}>
        <HStack>
          <Text fontSize="sm">Toko : </Text>
          <Text fontSize="sm" bold>
            {data.detailorder[0]?.nama_toko}
          </Text>
        </HStack>
        <FlatList
          data={data.detailorder}
          renderItem={({item}) => (
            <Box mx={2}>
              <HStack space={2} my={2}>
                <ImageLoad
                  url={dataGambar + item.foto_barang}
                  w={imgWidth}
                  h={imgWidth}
                />
                <VStack>
                  <Text fontSize="sm" bold>
                    {item.nama}
                  </Text>
                  <Text color="grey" sub>
                    {item.jumlah} Barang ({item.berat}gr)
                  </Text>
                  <Text fontSize="sm" bold>
                    {toCurrency(item.harga)}
                  </Text>
                </VStack>
              </HStack>
              <Divider my={1} />
            </Box>
          )}
        />
      </Stack>
    );
  }
}

class PengirimanTransaksi extends React.Component {
  render() {
    const {data} = this.props;
    return (
      <Stack space={1} py={2}>
        <Text fontSize="md" my={2} bold>
          Detail Pengiriman
        </Text>
        {data.kurir && data.no_resi && (
          <>
            <HStack>
              <Text flex={1} fontSize="xs" bold color="grey">
                Kurir Pengiriman
              </Text>
              <Text flex={1} fontSize="xs" color="green">
                {data.kurir}
              </Text>
            </HStack>
            <Divider my={1} />
            <HStack>
              <Text flex={1} fontSize="xs" bold color="grey">
                No Resi
              </Text>
              <VStack space={2} flex={1}>
                <Text fontSize="xs" color="grey">
                  {data.no_resi}
                </Text>
                <Text fontSize="xs" bold>
                  Salin No Resi
                </Text>
              </VStack>
            </HStack>
            <Divider my={1} />
          </>
        )}
        <HStack>
          <Text flex={1} fontSize="xs" bold color="grey">
            Alamat
          </Text>
          <VStack space={1} flex={1}>
            <Text fontSize="xs" color="grey">
              {data.nama}
            </Text>
            <Text fontSize="xs" color="grey">
              {data.no_telp}
            </Text>
            <Text fontSize="xs" color="grey">
              {data.detail}
            </Text>
            <Text fontSize="xs" color="grey">
              {data.kecamatan}
            </Text>
            <Text fontSize="xs" color="grey">
              {data.kota}
            </Text>
            <Text fontSize="xs" color="grey">
              {data.provinsi}
            </Text>
          </VStack>
        </HStack>

        <Divider my={1} />
      </Stack>
    );
  }
}

class PembayaranTransaksi extends React.Component {
  render() {
    return (
      <Stack space={1} py={2}>
        <Text fontSize="md" my={2} bold>
          Detail Pembayaran
        </Text>
        <HStack>
          <Text flex={1} fontSize="xs" bold color="grey">
            Metode Pembayaran
          </Text>
          <Text flex={1} fontSize="xs">
            {this.props.data.metode_pembayaran
              ? this.props.data.metode_pembayaran
              : 'Belum Dibayar'}
          </Text>
        </HStack>
        <Divider my={1} />
        <HStack mb={3}>
          <Text flex={1} fontSize="sm" bold color="grey">
            Total
          </Text>
          <Text flex={1} fontSize="sm" bold>
            {toCurrency(
              this.props.data.detailorder.reduce((total, data) => {
                return total + data.jumlah * data.harga;
              }, 0),
            )}
          </Text>
        </HStack>
      </Stack>
    );
  }
}
export default class DetailTransaksi extends React.Component {
  render() {
    return (
      <NativeBaseProvider>
        <Box bg="white" flex={1}>
          <Resource
            url={`${BASE_URL()}/orderdetail/orders/${
              this.props.route.params.idorder
            }`}>
            {({loading, error, payload: data, refetch, fetchMore}) => {
              if (loading) {
                return <FooterLoading full />;
              } else if (error) {
                return <Text>{errMsg('Load Detail Transaksi')}</Text>;
              }
              return (
                <FlatList
                  refreshing={false}
                  onRefresh={() => {
                    refetch();
                  }}
                  data={[data?.data]}
                  mx={2}
                  renderItem={({item}) => (
                    <>
                      {/* Header */}
                      <HeaderTransaksi data={item} />
                      {/* End Header */}
                      {/* Body */}
                      <BodyTransaksi data={item} />
                      {/* End Body */}
                      <PengirimanTransaksi data={item} />
                      <PembayaranTransaksi data={item} />
                    </>
                  )}
                />
              );
            }}
          </Resource>
        </Box>
      </NativeBaseProvider>
    );
  }
}
