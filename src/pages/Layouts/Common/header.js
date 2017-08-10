/*
  公用头部
*/
import React from 'react';

import { Link } from 'react-router';

export default class Header extends React.Component{
    shouldComponentUpdate(nextProps, nextState) {
      //console.log(nextProps.data.data)
      if(nextProps.data && nextProps.data.data === null)
        return false;
      else
        return true;
    }
    render() {
      let { showName } = this.props.userInfo;
      const { logoutUrl } = this.props.sysInfo;
      // 清空showName
      if(this.props.isLogoutPage){
        showName = "";
      }
      return (
        <div className="the-main-nav-wrap">
          <div className="the-main-nav-box">
            <Link to="/" className="logo-wrap"></Link>
            <div className="login-box ">
              {showName? <a title={`当前登录用户${showName}`}>您好，{showName}</a> : null}
              <Link to="/" title="首页">首页</Link>
              {showName? <a href={logoutUrl} title="退出">退出</a> : null}
            </div>
          </div>
        </div>

      );
  }
}
