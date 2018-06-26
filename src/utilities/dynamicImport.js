import { Component } from 'react';
import store, { injectReducers } from '../store';

export default class DynamicImport extends Component {
  state = {
    component: null
  }

  componentWillMount() {
    const { load } = this.props;

    load().then((module) => {
      const { component, reducers } = module;

      if(reducers) {
        reducers.forEach((reducer) => {
          injectReducers(store, reducer.name, reducer.fn);
        });
      }

      this.setState({
        component: component ? component : module.default
      });
    });
  }

  render() {
    return this.props.children(this.state.component);
  }
}