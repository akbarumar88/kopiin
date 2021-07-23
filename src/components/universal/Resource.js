import React, {Component} from 'react';
import Axios from 'axios';

export default class Resource extends Component {
  state = {
    loading: true,
    error: false,
    payload: '',
  };

  static defaultProps = {
    url: '',
    params: {},
    method: 'get',
  };

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.url != this.props.url ||
      JSON.stringify(prevProps.params) != JSON.stringify(this.props.params)
    ) {
      // Jika terjadi perubahan url / parameter, refetch ulang
      this.fetchData();
    }
  }

  fetchData = async () => {
    let {url, params, method} = this.props;
    method = method.toLowerCase();

    this.setState({loading: true});
    try {
      let body;
      if (method == 'get') {
        body = {
          params,
        };
      } else {
        body = params;
      }
      // console.warn(body)
      let {data} = await Axios[method](url, body);

      this.setState({payload: data, loading: false, error: false});
    } catch (error) {
      this.setState({error, loading: false});
    }
  };

  fetchMore = async (newParams, callback) => {
    let {url, params, method} = this.props;
    method = method.toLowerCase();
    let body;
    if (method == 'get') {
      body = {
        params: {...params, ...newParams},
      };
    } else {
      body = {...params, ...newParams};
    }
    // console.warn(body)
    let {data} = await Axios[method](url, body);
    let newPayload = await callback(data, this.state.payload);
    this.setState({payload: newPayload});
  };

  render() {
    return this.props.children({
      ...this.state,
      refetch: this.fetchData,
      fetchMore: this.fetchMore,
    });
  }
}
