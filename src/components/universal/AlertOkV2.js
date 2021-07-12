import React, { Component } from "react"
import { View, Text, TouchableNativeFeedback } from "react-native"
import Modal from "react-native-modal"
import PropTypes from "prop-types"

/**
 * Alert Ok Component
 *
 * @version 1.0.0
 * @author [Akbar Umar](https://github.com/akbarumar88)
 * @author [React Native Community](https://github.com/react-native-community)
 */

export default class AlertOkV2 extends Component {
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
    additionalButton: PropTypes.any
  }

  static defaultProps = {
    animationIn: "fadeIn",
    animationOut: "fadeOut",
    refs: () => {}
  }

  constructor(props) {
    super(props)

    this.state = {
      isVisible: false,
      title: "",
      message: "",
      setCanceledOnTouchOutside: true,
      onConfirm: () => {},
      onCancel: () => {},
      onModalHide: () => {},
      customMessageComponent: null
    }
  }

  componentDidMount() {
    // console.warn(this.props)
    this.props.refs(this)
  }

  render() {
    const { props } = this
    const {
      isVisible,
      title,
      message,
      setCanceledOnTouchOutside,
      onConfirm,
      onCancel,
      customMessageComponent
    } = this.state
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
        onModalHide={this.state.onModalHide}
      >
        <View
          style={{
            backgroundColor: "white",
            // alignItems: "center",
            paddingHorizontal: 16,
            paddingTop: 24,
            paddingBottom: 16,
            borderRadius: 8
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              color: "#333",
              fontSize: 20,
              textAlign: "center"
            }}
          >
            {title}
          </Text>

          {customMessageComponent ?? (
            <Text
              style={{
                color: "#777",
                marginTop: 16,
                textAlign: "center",
                fontSize: 14
              }}
            >
              {message}
            </Text>
          )}

          <TouchableNativeFeedback
            onPress={_ => this.close(onConfirm)}
            style={{}}
          >
            <View
              style={{
                paddingVertical: 12,
                backgroundColor: "green",
                borderRadius: 8,
                marginTop: 24
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: "white",
                  fontSize: 14,
                  fontWeight: "bold"
                }}
              >
                OK
              </Text>
            </View>
          </TouchableNativeFeedback>
        </View>
      </Modal>
    )
  }

  show = (
    {
      title = "Peringatan",
      message,
      setCanceledOnTouchOutside = true,
      customMessageComponent = null
    },
    onConfirm = () => {},
    onCancel = () => {}
  ) => {
    this.setState({
      title,
      message,
      setCanceledOnTouchOutside,
      onCancel,
      onConfirm,
      isVisible: true,
      customMessageComponent
    })
  }

  close = action => {
    this.setState({
      title: "",
      message: "",
      setCanceledOnTouchOutside: true,
      onCancel: _ => {},
      onConfirm: _ => {},
      onModalHide: action,
      isVisible: false,
      customMessageComponent: null
    })
  }
}

/**
 * Contoh Penggunaan
 * <AlertYesNo
        title={this.state.alertAnythingTitle}
        message={this.state.alertAnythingMessage}
        positiveText="OK"
    />
 */
