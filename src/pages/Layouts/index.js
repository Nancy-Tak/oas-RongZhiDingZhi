/*
	layout主页面
*/
import React from 'react';

import Header from './Common/header';
import Footer from './Common/footer';

// Loading icon
import { Spin } from 'antd';

import State from './state';
import rState from 'PAGES/redirect/state';

import { fetch } from 'UTILS';

export default class Index extends React.Component{
    constructor(props) {
        super(props);
        this.state = State.bind(this).getState();
        // 导出方法
        State.showLoading = () => this.setLoading(true);
        State.hideLoading = () => this.setLoading(false);
    }
    setLoading(bool) {
        State.setState({
            loading: bool
        });
    }
    componentDidMount() {
        fetch('/common/getSystemInfo.do').then(res => {
            State.setState({
                sysInfo: res.data
            });
        })
    }
    render() {
      const userInfo = rState.getState().data;
      const sysInfo = State.getState().sysInfo;
      // 判断是否注册页面，以清空userName
      const pathname = this.props.location.pathname;
      let isLogoutPage = false;
      if(pathname == '/userRegister' || pathname.indexOf('/resetPassword') != -1){
          isLogoutPage = true;
      }
      return (
          <Spin spinning={this.state.loading}>
          <div className="main-frm">
            <Header userInfo={userInfo} sysInfo={sysInfo} isLogoutPage={isLogoutPage} />
            <div className="frame-wrap-bg">
              <div className="frame-wrap">
                {/* 主内容区 */}
                {this.props.children}
              </div>
            </div>
            <Footer />
          </div>
          </Spin>
      );
  }
}
