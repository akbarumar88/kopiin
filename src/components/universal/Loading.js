import React, {Component} from 'react';
import {View, ActivityIndicator} from 'react-native';
import {VStack, HStack, Text} from 'native-base';
import Modal from 'react-native-modal';
import {theme} from '../../utilitas/Config';
import PropTypes from 'prop-types'


/**
 * Random Component
 * @augments {Component<Props, State>}
 */
export default class Loading extends Component {
  static propTypes = {
    /** Custom Messagenya gan.  */
    message: PropTypes.string
  }

  static defaultProps = {
    message: "Sedang memvalidasi data"
  }

  render() {
    const {message} = this.props;
    return (
      <Modal
        animationInTiming={100}
        animationOutTiming={100}
        isVisible={this.props.isVisible}
        animationIn={'zoomIn'}
        animationOut={'zoomOut'}>
        <HStack bgColor="#fff" alignItems="center" p={6} borderRadius={8}>
          <ActivityIndicator size="large" color={theme.primary} />
          <VStack ml={4}>
            <Text bold>Loading...</Text>
            <Text fontSize="sm">{message}</Text>
          </VStack>
        </HStack>
      </Modal>
    );
  }
}
