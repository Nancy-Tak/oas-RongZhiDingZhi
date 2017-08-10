// react 相关库
import React from 'react';

//自己内部组件
/**
 *  Personal 个人
 *  Company 公司
 */
import BasicBodyEditor from './basicBodyEditor';

// antd 组件
import {
  Alert,
  Steps,
  Button,
  message
} from 'antd';
import {
  Link
} from 'react-router';
const Step = Steps.Step;
//全局获取基本信息
import State from 'PAGES/redirect/state';
const globalState = State.getState();
console.log("globalState=>")
console.log(globalState)


//fetch
import {
  fetch
} from 'UTILS';

// 页面
export default class BasicInformation extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {
        getUserCheckStatus: {
          checkItems: [],
        },
        getLoginUserSimpleInfo: {},
        getLoginCheckStatus: {},
        getRelatedPersonInfo: {

        },
        getCheckedBank: {}
      },
      history: this.props.history
    }
  }
  componentDidMount() {
    if (globalState.data.userType == 1) {
      this.loadDataP();
    } else if (globalState.data.userType == 2) {
      this.loadDataC();
    } else {
      message.error("加载失败,没有获取到登录信息啊。")
    }

  }

  loadDataP() {

    console.log("个人")

    //获取用户审核状态(v0.4)
    let p1 = fetch('/user/getUserCheckStatus.do');
    //用户简单信息(v2.2)
    let p2 = fetch('/user/getLoginUserSimpleInfo.do');
    //获取登录后判断状态(v0.4)
    let p3 = fetch('/common/getLoginCheckStatus.do');
    //获取绑定手机(v0.4)	/user/getBindMobile
    let p4 = fetch('/user/getBindMobile.do');
    //是否设置交易密码(v0.4)	/user/getIsSetPayPassword
    let p5 = fetch('/user/getIsSetPayPassword.do');
    //获取对公账户验证状态(v1.6)	/user/getCompanyAccountCheckStatus
    //let p6 = fetch('/user/getCompanyAccountCheckStatus.do');
    //获取已核身银行账号(v0.6)	/person/getCheckedBank
    let p6 = fetch('/person/getCheckedBank.do');
    //获取用户信息填写人（关系人）信息(v2.6)
    let p7 = fetch('/user/getRelatedPersonInfo.do');
    //判断系统和银行级别实名认证是否通过(v0.1)
    let p8 = fetch('/user/getSysAndBankRealCheck.do');





    Promise.all([p1, p2, p3, p4, p5, p6, p7,p8]).then(values => {
      //   if(values[6].data){
      //       this.state.data.getCheckedBank = values[6].data
      //   }


      this.state.data.getUserCheckStatus = values[0].data;
      this.state.data.getLoginUserSimpleInfo = values[1].data;
      this.state.data.getLoginCheckStatus = values[2].data;
      this.state.data.getBindMobile = values[3].data;
      this.state.data.getIsSetPayPassword = values[4].data;
      this.state.data.getCheckedBank = values[5].data;
      this.state.data.getRelatedPersonInfo = values[6].data;
      this.state.data.getSysAndBankRealCheck = values[7].data;

      this.forceUpdate();

    }).catch(err => {
        message.error(err)
      throw err;
    });
  }

  loadDataC() {


    console.log("企业")
      //获取用户审核状态(v0.4)
    let p1 = fetch('/user/getUserCheckStatus.do');
    //用户简单信息(v2.2)
    let p2 = fetch('/user/getLoginUserSimpleInfo.do');
    //获取登录后判断状态(v0.4)
    let p3 = fetch('/common/getLoginCheckStatus.do');
    //获取绑定手机(v0.4)	/user/getBindMobile
    let p4 = fetch('/user/getBindMobile.do');
    //是否设置交易密码(v0.4)	/user/getIsSetPayPassword
    let p5 = fetch('/user/getIsSetPayPassword.do');
    //获取对公账户验证状态(v1.6)	/user/getCompanyAccountCheckStatus
    let p6 = fetch('/user/getCompanyAccountCheckStatus.do');
    //获取已核身银行账号(v0.6)	/person/getCheckedBank
    //let p6 = fetch('/person/getCheckedBank.do');
    //获取用户信息填写人（关系人）信息(v2.6)
    let p7 = fetch('/user/getRelatedPersonInfo.do');

    //判断系统和银行级别实名认证是否通过(v0.1)
    let p8 = fetch('/user/getSysAndBankRealCheck.do');



    Promise.all([p1, p2, p3, p4, p5, p6, p7, p8]).then(values => {
      //   if(values[6].data){
      //       this.state.data.getCheckedBank = values[6].data
      //   }


      this.state.data.getUserCheckStatus = values[0].data;
      this.state.data.getLoginUserSimpleInfo = values[1].data;
      this.state.data.getLoginCheckStatus = values[2].data;
      this.state.data.getBindMobile = values[3].data;
      this.state.data.getIsSetPayPassword = values[4].data;
      this.state.data.getCompanyAccountCheckStatus = values[5].data;
      this.state.data.getRelatedPersonInfo = values[6].data;
      this.state.data.getSysAndBankRealCheck = values[7].data;

      this.forceUpdate();

    }).catch(err => {
        message.error(err)
      throw err;
    });
  }

  render() {


    return (
      <div>
              {/*个人和企业写一起了。*/}
              {
                  this.state.data.getRelatedPersonInfo.length>0
                  ?
                  <BasicBodyEditor {...this.state} />
                  :
                  <span>正在请求接口...</span>
              }


            </div>
    );
  }
}
