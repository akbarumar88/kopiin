import React, {Component} from 'react';
import {StyleSheet, Image, View, TextInput} from 'react-native';
import {
  Container,
  Button,
  Icon,
  Text,
  Item,
  Input,
  Header,
  Box,
  HStack,
  IconButton,
} from 'native-base';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import Geolocation from '@react-native-community/geolocation';

import {APIMAPS} from '../../utilitas/Config';
import Loading from './../universal/Loading';

import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {theme} from '../../utilitas/Config';
import AlertOkV2 from '../universal/AlertOkV2';

export default class PilihLokasi extends Component {
  constructor(props) {
    super(props);

    const {lat = 0, long = 0} = props.route.params ?? {};
    let Region = {
      latitude: lat,
      longitude: long,
    };

    this.state = {
      Region,
      namaalamat: '',
      loadalamat: false,
      loading: false,
      cari: '',
      isMapReady: true,
    };
  }

  componentDidMount() {
    Geocoder.init(APIMAPS);
    if (this.state.Region.latitude == 0 || this.state.Region.longitude == 0) {
      this.myposition();
    }
  }

  onMapLayout = () => {
    if (
      this.state.isMapReady &&
      this.state.Region.latitude !== 0 &&
      this.state.Region.longitude !== 0
    ) {
      this.animate(this.state.Region);
      this.setState({isMapReady: false});
    }
  };

  render() {
    return (
      <Box flex={1} bgColor="#000">
        <Loading
          isVisible={this.state.loading}
          message="Sedang mencari lokasi..."
        />
        <AlertOkV2 ref={ref => (this.alert = ref)} />

        {this.mapView()}

        <HStack bg="#fff" alignItems="center" p={2}>
          <Icon
            color="coolGray.600"
            name="arrow-back"
            as={Ionicons}
            onPress={() => this.props.navigation.goBack()}
          />
          <Input
            mx={4}
            size="sm"
            p={2}
            flex={1}
            placeholder="Cari Alamat"
            onChangeText={cari => this.setState({cari})}
            onSubmitEditing={() => this.getLatLong()}
          />
          <Button size="sm">Cari</Button>
        </HStack>

        <View style={style.container}>
          <HStack style={style.wadahnama} p={2} shadow={2} alignItems="center">
            {this.state.loadalamat ? (
              <Text flex={1}>Loading...</Text>
            ) : (
              <Text flex={1} style={{minWidth: 150}}>
                {this.state.namaalamat ?? 'nama alamat'}
              </Text>
            )}
            <IconButton
              onPress={() => this.simpan()}
              variant="solid"
              icon={
                <Icon
                  size="sm"
                  as={Ionicons}
                  color="white"
                  name="checkmark-sharp"
                />
              }
            />
          </HStack>
          <Icon as={Ionicons} name="location" />
        </View>

        <HStack justifyContent="flex-end" p={2}>
          <Button
            borderRadius={16}
            bgColor="rgba(0,0,0,0.2)"
            onPress={() => {
              this.myposition();
            }}>
            <Icon name="location" as={Ionicons} />
          </Button>
        </HStack>
      </Box>
    );
  }

  myposition() {
    this.setState({loading: true});
    Geolocation.getCurrentPosition(
      position => {
        this.setState({loading: false});
        let Region = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0,
          longitudeDelta: 0,
        };
        this.animate(Region);
        this.change(Region);
      },
      error => {
        this.setState({loading: false});

        if (error.code == 2) {
          this.alert.show({
            message:
              'Gagal mendapatkan lokasi saat ini. Harap nyalakan GPS Anda!',
          });
        } else if (error.code == 3) {
          this.alert.show({
            message:
              'Telah terjadi kesalahan. Harap coba lagi.' + error.message,
          });
        } else {
          this.alert.show({message: error.message});
        }
      },
      {timeout: 30000},
    );
  }

  animate(Region) {
    this.map.animateToRegion(Region, 1000);
  }

  simpan() {
    const {BackRoute} = this.props.route.params;
    // this.props.navigation.state.params.setMaps(
    //   this.state.Region.latitude,
    //   this.state.Region.longitude,
    // );
    this.props.navigation.navigate(BackRoute, {
      Region: {...this.state.Region, namaalamat:this.state.namaalamat},
    });
  }

  getAlamat(Region) {
    this.setState({loadalamat: true});
    Geocoder.from(Region.latitude, Region.longitude)
      .then(json => {
        this.setState({loadalamat: false});
        var addressComponent = json.results[0].formatted_address;
        let namaalamat = 'Tidak diketahui';
        if (addressComponent.length > 5) {
          namaalamat = addressComponent;
        }
        this.setState({namaalamat: namaalamat});
      })
      .catch(error => console.log(error));
  }

  getLatLong() {
    this.setState({loading: true});
    Geocoder.from(this.state.cari)
      .then(json => {
        this.setState({loading: false});
        var location = json.results[0].geometry.location;
        let Region = {
          latitude: location.lat,
          longitude: location.lng,
          latitudeDelta: 0,
          longitudeDelta: 0,
        };
        this.change(Region);
        this.animate(Region);
      })
      .catch(error => console.warn(error));
  }

  change(Region) {
    this.setState({Region});
    this.getAlamat(Region);
  }

  mapView() {
    return (
      // <Text>OKE</Text>
      <MapView
        ref={ref => (this.map = ref)}
        provider={PROVIDER_GOOGLE}
        onRegionChangeComplete={Region => {
          console.log('onRegionChangeComplete');
          this.change(Region);
        }}
        // region={this.state.Region}
        style={{...StyleSheet.absoluteFillObject}}
        // cacheEnabled={true}
        // liteMode={true}
        showsUserLocation={true}
        showsMyLocationButton={false}
        toolbarEnabled={false}
        showsIndoors={false}
        showsTraffic={false}
        showsBuildings={false}
        showsScale={false}
        showsCompass={false}
        showsPointsOfInterest={false}
        onLayout={this.onMapLayout}></MapView>
    );
  }
}

const style = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingBottom: 85,
    paddingHorizontal: 16,
    // backgroundColor: 'red'
  },
  button: {
    backgroundColor: theme.primary,
  },
  wadahnama: {
    backgroundColor: 'white',
    borderRadius: 4,
  },
});
