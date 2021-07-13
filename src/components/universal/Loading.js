import React, {Component} from 'react';
import {View, ActivityIndicator} from 'react-native';
import {VStack,HStack,Text} from 'native-base'
import Modal from 'react-native-modal'
import { theme } from '../../utilitas/Config';

/**
 * Random Component
 * @augments {Component<Props, State>}
 */
export default class Loading extends Component {
  render() {
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
            <Text fontSize="sm">Sedang memvalidasi data</Text>
          </VStack>
        </HStack>
      </Modal>
    );
  }
}
