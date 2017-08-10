/**
 * 表单frame
 */
// react 相关库
import React from 'react';

import classnames from 'classnames';

export default class Frame extends React.Component {
  render() {
    // 合并自定义的classname
    const cls = classnames({
      "form-frame": true,
      [this.props.className]: true
    });
    // 返回html
    return (
      <div className={cls}>
        <div className="form-title">
            {this.props.title}
            {this.props.small ? <small className="viceText-FontColor">{this.props.small}</small> : null}
        </div>
        {this.props.children}
    </div>
    );
  }
}
