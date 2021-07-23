import React, {Component} from 'react';
import {Image} from 'native-base';

export default class ImageLoad extends Component {
  state = {
    img: {
      uri: 'https://safetyaustraliagroup.com.au/wp-content/uploads/2019/05/image-not-found.png',
    },
    alt: '',
  };

  static defaultProps = {
    alt: 'Gambar',
    defaultUrl: {
      uri: 'https://safetyaustraliagroup.com.au/wp-content/uploads/2019/05/image-not-found.png',
    },
  };

  componentDidMount() {
    this.setState({
      img: {uri: this.props.url},
    });
  }

  render() {
    return (
      <Image
        {...this.props}
        source={this.state.img}
        onError={() => {
          this.setState({img: this.props.defaultUrl});
        }}
      />
    );
  }
}
