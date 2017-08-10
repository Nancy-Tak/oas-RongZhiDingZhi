/**
 * findPassword step2
 * yongquan.wu
 */
// react 相关库
import React from 'react';
import ReactDOM from 'react-dom';

import classnames from 'classnames';
import store from 'store';


//  全局状态codeimg
// import State from 'PAGES/redirect/state';
import State from 'PAGES/Layouts/state';
const codeimg = State.getState().sysInfo.appQrcodeUrl;

import { Link } from 'react-router';

import { IdentityModal } from 'BCOM/Modal/index';

// antd 组件
import { Alert, Steps, Button, Modal, Row, Col,message } from 'antd';
const Step = Steps.Step;

// 页面组件
import Frame from 'COM/form/frame';
import {helper,fetch} from 'UTILS';



// 页面组件（导出）
class Steps2 extends React.Component {
    constructor(props){
        super(props);
        this.state={
            identityVisible: false,
            isSendMsgDisabled:false,
            btnSendText:'没有收到短信，重新发送',
            name:'',
            mobile:'',
            nameText:'',
            connectorType:''
        }

        this.componentDidMount=this.componentDidMount.bind(this);

        this.timer=null;
    }

    showIdentityModal() {
        this.setState({
          identityVisible: true,
        });
    }

    closeIdentityModal() {
        this.setState({
          identityVisible: false,
        });
    }

    //手动点击下一步
    handleNextClick(){
        console.log('handleNextClick');
        //查询是否已经实名验证
        fetch('/resetLoginPwd/getAccountRealCheckStatus.do').then((res)=>{
            if(res.data.checkPass=='1'){
                clearInterval(this.timer);
                this.props.history.push({
                    pathname:'/personalValidate/step3'
                });
            }else{
                //未验证提醒
                console.log('未验证提醒');
                Modal.info({
                    title: '实名认证提示',
                    content: (
                    <div>
                        <p>您的实名认证未完成，请尽快完成。</p>
                    </div>
                    ),
                    onOk() {},
                });
            }
        });
    }

    //发送身份识别码
    sendMsg(countNum){
        if(this.state.isSendMsgDisabled) return;
        var that=this;

        fetch('/resetLoginPwd/pinCode.do',{
            body:{
                "connectorType": this.state.connectorType,
                "isFirst": false
            }
        }).then((res)=>{
            if(res.code=='200'){
                message.success('身份识别码发送成功');
                countDown(countNum);
            }
        });

        function countDown(){
            that.setState({
                isSendMsgDisabled:true
            });

            var count=countNum;
            let timer = setInterval(()=>{
                count--;
                if(count>0){
                    that.setState({
                        btnSendText:`发送成功，${count}秒后可重新发送`
                    });
                // store.set('counter_inPersonalValidateStep2',count);
                }else{
                    clearInterval(timer);
                    // store.set('counter_inPersonalValidateStep2',0);
                    that.setState({
                        btnSendText:`没有收到短信，重新发送`,
                        isSendMsgDisabled:false
                    });
                }
            },1000)
        }
    }

    componentDidMount(){
        this.initPage();
        this.timer = setInterval(()=>{
            //查询是否已经实名验证
            fetch('/resetLoginPwd/getAccountRealCheckStatus.do',null,false).then((res)=>{
                if(res.data.checkPass=='1'){
                    clearInterval(this.timer);
                    this.props.history.push({
                        pathname:'/resetPassword/step3'
                    });
                }else{
                    console.log('轮询中，未验证..');
                }
            });
        },5000);

        let countNum=parseInt(store.get('counter_inPersonalValidateStep2'));
        if(countNum && countNum>0){
            this.sendMsg(countNum);
        }
    }

    initPage(){
        fetch('/resetLoginPwd/getDesensitizeMobile.do').then((res)=>{
            var nameText='姓名';
            if(res.data.connectorType=='1'){
                nameText='姓名';
            }else if(res.data.connectorType=='2'){
                nameText='法人';
            }else if(res.data.connectorType=='3'){
                nameText='经办人';
            }
            this.setState({
                name:res.data.name,
                mobile:res.data.mobile,
                nameText:nameText,
                connectorType:res.data.connectorType
            });
        });
    }

    componentWillUnmount(){
        if(this.timer){
            clearInterval(this.timer);
        }
    }

    render() {
        const sendMsgCls=classnames({
            color_gray:this.state.isSendMsgDisabled
        });
        return (
            <div>
                <Steps size="default" current={1} className="fn-mb-30">
                    <Step title="账户信息" />
                    <Step title="验证身份" />
                    <Step title="重置登录密码" />
                    <Step title="重置成功" />
                </Steps>
                <Frame title="实名认证" className="">
                    <Row className="fn-mt-30">
                        <Col span={12} offset={6}>
                            <p>
                                {this.state.nameText}： <span className='name'>{this.state.name}</span>，您的身份识别码已发送到手机{this.state.mobile}。
                                <a href='javascript:void(0)' onClick={this.sendMsg.bind(this,60)} className={sendMsgCls}>{this.state.btnSendText}</a>
                            </p>
                            <p className='fn-mt-10'>
                                请下载实名认证APP完成认证。
                                <Button type="primary" className='fn-ml-5' onClick={this.showIdentityModal.bind(this)}>详细操作步骤</Button>
                            </p>
                        </Col>
                    </Row>
                    <Row className="text-align-center fn-mt-30">
                        <p>扫描二维码下载实名认证APP，支持IOS和安卓</p>
                        <div className="pic"><img src={codeimg}/></div>
                    </Row>
                    <Row className="text-align-center fn-mt-30">
                        <p>实名认证成功后页面自动跳转，如没有跳转请点击 <Button className='fn-ml-5' onClick={this.handleNextClick.bind(this)} type="primary">已完成认证</Button></p>
                    </Row>
                </Frame>
                <IdentityModal visible={ this.state.identityVisible } closeCallBack={ this.closeIdentityModal.bind(this) }/>
            </div>
        );
    }
}


export default Steps2;
