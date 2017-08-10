/*
	404页面
*/
import React from 'react';
import ReactDOM from 'react-dom';

export default class errPage extends React.Component {
  render() {
    const msg = this.props.location.query.p || '无';
    return (
      <div>错误信息：{msg}</div>
    );
  }
}
