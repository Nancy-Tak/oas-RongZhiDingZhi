// test
import React from 'react';
import { Lifecycle } from 'react-router';

const SUB = React.createClass({

  // 后代组件使用 Lifecycle mixin 获得
  // 一个 routerWillLeave 的方法。
  mixins: [ Lifecycle ],

  getInitialState: function() {
    return {isSaved: false};
  },

  routerWillLeave(nextLocation) {
    if (!this.state.isSaved){
      return this.props.history.push(`test`);
    }
  },

  render() {
    return <div>test33333333333333333</div>;
  }

});

export default SUB;
