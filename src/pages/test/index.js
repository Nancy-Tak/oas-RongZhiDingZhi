// test
import React from 'react';
import { RouteContext } from 'react-router';

import Sub from './sub';

const TEST = React.createClass({

  // route 会被放到 Home 和它子组件及孙子组件的 context 中，
  // 这样在层级树中 Home 及其所有子组件都可以拿到 route。
  mixins: [ RouteContext ],

  render() {
    return <Sub history={this.props.history} />
  }

});

export default TEST;
