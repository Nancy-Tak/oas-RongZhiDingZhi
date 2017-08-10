/*
  公用底部
*/
import React from 'react';
import {
  Icon
} from 'antd';


export default class Footer extends React.Component {
  render() {
    return (
      <div className="main-footer clearfix">
          <div className="main-ft-inner">
            <div className="main-ft-bank"><span className="bank-bg bank-cmb"></span></div>
            <div className="main-ft-helper">
              <ul>
                <li className="has-r-line">
                  <Icon type="message"  />
                  <a href="javaScript:void(0);">帮助中心</a>
                </li>
                <li className="tel has-r-line"><Icon type="phone" />客服热线<b>400-106-6698</b></li>
                <li className="recordation">粤ICP备 14098252号-2</li>
              </ul>
            </div>
          </div>
        </div>

    );
  }
}