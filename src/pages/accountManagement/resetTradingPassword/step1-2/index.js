// 样式
import './style.less';
// react 相关库
import React from 'react';
import {
    Link
} from 'react-router';

// 页面组件
import Frame from 'COM/form/frame';

//自己内部组件
/**
 * StepsBar 步骤
 * Authenticate 验证身份
 * RealNameAuthentication 实名认证
 */
import StepsBar from './StepsBar';

import RealNameAuthentication from './RealNameAuthentication';
//全局获取基本信息
import State from 'PAGES/redirect/state';
const globalState = State.getState();
console.log("globalState", globalState)
    // antd 组件
import {
    Form,
    Input,
    Button,
    Steps,
    Row,
    Col,
    message
} from 'antd';
const Step = Steps.Step;
const FormItem = Form.Item;

import {
    fetch
} from 'UTILS';

let iTime = null;


// 页面
export default class Steps1 extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            //虚假数据
            data: {
                realName: 'xxx',
                identityCode: '12345',
                phoneNumber: '15999872092',
                getLoginUserSimpleInfo: {},
                getDesensitizeMobile: {},
                getAccountRealCheckStatus: {},
                getRelatedPersonInfo: []
            },
            //是否验证
            isValidation: false,
        }
    }
    handleNext() {
            this.setState({
                visible: true
            });
        }
        //马上认证
    handleOk() {
            this.setState({
                visible: false
            });
        }
        //稍后认证，下一步
    handleCancel(e) {
            this.setState({
                visible: false
            });
            console.log('e.target', e.target);
            if (e.target.tagName.toLowerCase() == 'span' && e.target.className == '') {
                window.location.href = '/#/personalValidate/step3?_k=REPLACE';
            }
        }
        //进入实名验证
    handleSend() {
        //发送识别码接口(v0.7)	/common/pinCode
        //如果已经验证
        fetch('/common/pinCode.do', {
            body: {
                "connectorType": this.state.data.getDesensitizeMobile.connectorType,
                "businessType": 3,
                "isFirst": true
            }
        }).then(res => {
            this.loadPaddingFetchFn();

        })
    }
    componentDidMount() {

        if (globalState.data.bankCheckStatus == 1 && globalState.data.step == 999) {
            this.loadData();
            //无限请求
            this.loadPaddingFetch(3000);
        } else {
            //不通过核身验证什么的，就跳走了。
            this.props.history.push("/accountManagement")
        }



    }

    //无限请求
    loadPaddingFetch(endTime) {
            clearInterval(iTime);
            iTime = setInterval(() => {
                this.loadPaddingFetchFn()
            }, endTime)
        }
        //单次请求
    loadPaddingFetchFn() {
        fetch('/user/getAccountRealCheckStatus.do',null, false).then(res => {
            if (res.code == 200 && res.data.checkPass == 1) {
                //window.location.href = '/#/accountManagement/resetTradingPassword/step2?_k=c8odmq';
                //this.props.history.push("/accountManagement/resetTradingPassword/step2");
                //权限控制，跳转乱动枪毙
                this.props.history.push({
                    pathname: '/accountManagement/resetTradingPassword/step2?isCheck=1'
                })
            }
        })
    }
    componentWillUnmount() {
        clearInterval(iTime);
    }
    loadData() {

        //用户简单信息(v0.7)
        //let p1 = fetch('/user/getLoginUserSimpleInfo.do');
        //获取姓名及脱敏手机号(v0.2)
        let p2 = fetch('/user/getDesensitizeMobile.do', {
                body: {
                    "businessType": 3
                }
            })
            //实名验证
            // let p3 = fetch(/user/getAccountRealCheckStatus.do', false)

        //  身份实名认证
        //let p4 = fetch('/user/getRelatedPersonInfo.do');

        Promise.all([p2]).then(values => {
            console.log(values);
            //this.state.data.getLoginUserSimpleInfo = values[0].data
            this.state.data.getDesensitizeMobile = values[0].data
                //this.state.data.getAccountRealCheckStatus = values[2].data
                //this.state.data.getRelatedPersonInfo = values[3].data;
                //console.log(values[3].data)
            this.forceUpdate();
        }).catch(err => {
            message.error(err)
            throw err;
        });
    }
    render() {
        console.log(this)
            //console.log(reason)
        return (
            <div>

                {/*StepsBar 步骤1*/}
                <StepsBar/>

                {/*Authenticate 验证身份*/}
                {/* RealNameAuthentication 实名认证 */}
                <RealNameAuthentication
                    isValidation={this.state.isValidation}
                    {...this.state.data}
                    handleSend={this.handleSend.bind(this)}
                />
            </div>
        );
    }
}
