import React, {Component,forwardRef, useRef, useImperativeHandle} from 'react';
import {View, Text, TouchableNativeFeedback} from 'react-native';
import Modal from 'react-native-modal';
import PropTypes from 'prop-types';
import {theme} from '../../utilitas/Config';
import {AlertDialog, Button, NativeBaseProvider, Center} from 'native-base';

/**
 * Alert Ok Component
 *
 * @version 1.0.0
 * @author [Akbar Umar](https://github.com/akbarumar88)
 * @author [React Native Community](https://github.com/react-native-community)
 */

class AlertYesNoV2 extends Component {
  static propTypes = {
    /**
     * Title modal nya.
     * @since Version 1.0.0
     */
    title: PropTypes.string,
    /**
     * Message modal nya.
     * @since Version 1.0.0
     */
    message: PropTypes.string,
    /**
     * Positive Text.
     * @since Version 1.0.0
     */
    positiveText: PropTypes.string,
    /**
     * Negative Text.
     * @since Version 1.0.0
     */
    negativeText: PropTypes.string,
    /**
     * Ketika menekan tombol back.
     * @since Version 1.0.0
     */
    onBackButtonPress: PropTypes.func,
    /**
     * Ketika menekan selain / diluar modal.
     * @since Version 1.0.0
     */
    onBackdropPress: PropTypes.func,
    /**
     * Ketika menekan tombol positive.
     * @since Version 1.0.0
     */
    onPositiveButtonPress: PropTypes.func,
    /**
     * Ketika menekan tombol negative.
     * @since Version 1.0.0
     */
    onNegativeButtonPress: PropTypes.func,
    /**
     * Apakah visible ?.
     * @since Version 1.0.0
     */
    isVisible: PropTypes.bool,
    /**
     * Animation Masuk.
     * @since Version 1.0.0
     */
    animationIn: PropTypes.string,
    /**
     * Animation Keluar.
     * @since Version 1.0.0
     */
    animationOut: PropTypes.string,
    /**
     * Flag untuk menampilkan button positif.
     * @since Version 1.0.0
     */
    showPositiveButton: PropTypes.bool,
    /**
     * Flag untuk menampilkan button negatif.
     * @since Version 1.0.0
     */
    showNegativeButton: PropTypes.bool,
    /**
     * Lakukan sesuatu, Ketika modal di hide.
     * @since Version 1.0.0
     */
    onModalHide: PropTypes.func,
    /**
     * Button tambahan di bawah 'ok'
     * @since Version 1.0.0
     */
    additionalButton: PropTypes.any,
  };

  static defaultProps = {
    animationIn: 'zoomIn',
    animationOut: 'zoomOut',
    refs: () => {},
  };

  // cancelRef = React.createRef();

  constructor(props) {
    super(props);

    this.state = {
      isVisible: false,
      title: '',
      message: '',
      confirmText: '',
      cancelText: '',
      setCanceledOnTouchOutside: true,
      onConfirm: () => {},
      onCancel: () => {},
      onModalHide: () => {},
    };
  }

  componentDidMount() {
    // console.warn(this.props)
    this.props.refs(this);
  }

  renderv2() {
    const {props} = this;
    const {
      isVisible,
      title,
      message,
      setCanceledOnTouchOutside,
      onConfirm,
      onCancel,
      customMessageComponent,
    } = this.state;
    return (
      <Center>
        <AlertDialog
          motionPreset="fade"
          leastDestructiveRef={this.cancelRef}
          onClose={() => {}}
          isOpen={isVisible}
          closeOnOverlayClick
          isCentered>
          <AlertDialog.Content>
            <AlertDialog.CloseButton
              onPress={() => {
                this.close();
                onCancel();
              }}
            />
            <AlertDialog.Header>{title}</AlertDialog.Header>
            <AlertDialog.Body>{message}</AlertDialog.Body>
            <AlertDialog.Footer>
              <Button
                colorScheme="danger"
                _text={{color: '#fff'}}
                ref={ref => (this.cancelRef = ref)}
                onPress={() => {
                  this.close();
                  onCancel();
                }}>
                Tidak
              </Button>
              <Button
                bgColor={theme.primary}
                ml={3}
                onPress={() => {
                  this.close();
                  onConfirm();
                }}>
                Ya
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog>
      </Center>
    );
  }

  render() {
    const {props} = this;
    const {
      isVisible,
      title,
      message,
      confirmText,
      cancelText,
      setCanceledOnTouchOutside,
      onConfirm,
      onCancel,
    } = this.state;
    return (
      <Modal
        animationInTiming={100}
        animationOutTiming={100}
        isVisible={isVisible}
        onBackdropPress={
          setCanceledOnTouchOutside ? _ => this.close(onCancel) : null
        }
        onBackButtonPress={
          setCanceledOnTouchOutside ? _ => this.close(onCancel) : null
        }
        animationIn={props.animationIn}
        animationOut={props.animationOut}
        onModalHide={this.state.onModalHide}>
        <View
          style={{
            backgroundColor: 'white',
            // alignItems: "center",
            paddingHorizontal: 16,
            paddingTop: 24,
            paddingBottom: 16,
            borderRadius: 8,
          }}>
          <Text
            style={{
              fontWeight: 'bold',
              color: '#333',
              fontSize: 20,
              textAlign: 'center',
            }}>
            {title}
          </Text>

          <Text
            style={{
              color: '#777',
              marginTop: 16,
              textAlign: 'center',
              fontSize: 14,
            }}>
            {message}
          </Text>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 24,
            }}>
            <TouchableNativeFeedback
              onPress={_ => this.close(onCancel)}
              style={{}}>
              <View
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  backgroundColor: '#de3535',
                  borderRadius: 8,
                  marginRight: 6,
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: 'white',
                    fontSize: 14,
                    fontWeight: 'bold',
                  }}>
                  {cancelText}
                </Text>
              </View>
            </TouchableNativeFeedback>

            <TouchableNativeFeedback
              onPress={_ => this.close(onConfirm)}
              style={{}}>
              <View
                style={{
                  paddingVertical: 12,
                  backgroundColor: theme.primary,
                  borderRadius: 8,
                  marginLeft: 6,
                  flex: 1,
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: 'white',
                    fontSize: 14,
                    fontWeight: 'bold',
                  }}>
                  {confirmText}
                </Text>
              </View>
            </TouchableNativeFeedback>
          </View>
        </View>
      </Modal>
    );
  }

  show = (
    {
      title = 'Peringatan',
      message,
      confirmText = 'Ya',
      cancelText = 'Tidak',
      setCanceledOnTouchOutside = true,
    },
    onConfirm = () => {},
    onCancel = () => {},
  ) => {
    this.setState({
      title,
      message,
      confirmText,
      cancelText,
      setCanceledOnTouchOutside,
      onCancel,
      onConfirm,
      isVisible: true,
    });
  };

  close = action => {
    this.setState({
      setCanceledOnTouchOutside: true,
      onCancel: _ => {},
      onConfirm: _ => {},
      onModalHide: action,
      isVisible: false,
    });
  };
}

/**
 * Contoh Penggunaan
 * <AlertYesNo
        title={this.state.alertAnythingTitle}
        message={this.state.alertAnythingMessage}
        positiveText="OK"
    />
 */
export default AlertYesNoV2