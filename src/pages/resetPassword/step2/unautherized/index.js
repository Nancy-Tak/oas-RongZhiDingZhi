/**
 * findPassword step2
 * yongquan.wu
 */
// react 相关库
import React from 'react';

// antd 组件
import { Alert, Steps, Button,Form,Input,message,Modal } from 'antd';
import { Link } from 'react-router';
const Step = Steps.Step;
const FormItem = Form.Item;
import {fetch,ruleType,helper} from 'UTILS';
// 页面组件
import Frame from 'COM/form/frame';


// 页面
class Steps2 extends React.Component {
    constructor(props){
        super(props);
        this.state={
            btnSmsCodeText:'获取验证码',
            isBtnSmsCodeDisabled:false,
            mobile:'',
            connectorType:''
        };
    }

    handleNext(){
        this.props.form.validateFields((errors, values) => {
            if (!errors) {
                let data ={"smsAutoCode": values.smsCode};
                console.log('Submit!!!',data);
                fetch('/user/checkResetPwdAutoCode.do',{
                    body:data
                }).then((res)=>{
                    this.props.history.push({
                        pathname:'/resetPassword/step3'
                    });
                },(res)=>{

                    if(res.fieldName){
                        const {form} = this.props;
                        if(res.fieldName=='smsAutoCode'){
                            helper.focusError(form,'smsCode',res.message);
                        }else{
                            helper.focusError(form,res.fieldName,res.message);
                        }
                    }

                });
            }
        });
    }

    getVerifyCode() {
        var that =this;
        // const num = this.props.form.getFieldValue('mobile');
        const num = this.state.mobile;
        if(!num){
        Modal.warning({
            title: '提示',
            content: '请先输入电话号码',
        });
        return;
        }
        // 获取验证码
        fetch('/common/smsAutoCode.do', {
        body: {
            "mobile": num,
            "businessType": "resetPwd"
        }
        }).then(res => {
        console.log('短信验证码获取成功：',res);
        message.success('短信验证码获取成功');
        countDown();
        });

        function countDown(){
            that.setState({
                isBtnSmsCodeDisabled:true
            });

            var count=60;
            let timer = setInterval(()=>{
                count--;
                if(count>0){
                    that.setState({
                        btnSmsCodeText:`${count}秒后重新获取`
                    });
                }else{
                    clearInterval(timer);
                    that.setState({
                        btnSmsCodeText:`获取验证码`,
                        isBtnSmsCodeDisabled:false
                    });
                }
            },1000)
        }

    }

    componentDidMount(){
        this.initPage();
    }

    initPage(){
        fetch('/resetLoginPwd/getDesensitizeMobile.do').then((res)=>{
            this.setState({
                mobile:res.data.mobile,
                connectorType:res.data.connectorType
            });
        });
    }

    handleKeyDown(event){
        if(event.keyCode == 32){
        return event.preventDefault();
        }
    }

    noop(event) {
        return event.preventDefault();
    }

    render() {
        const {getFieldProps} = this.props.form;
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 12 },
        };
        const rules={
            smsCode: {
                rules: [
                    {required: true, message: '短信验证码不能为空'},
                    ruleType('number'),
                    {len:6, message: '请输入6位的短信验证码'}
                ]
            }
        }
        return (
            <div>
                <Steps size="default" current={1} className="fn-mb-30">
                    <Step title="账户信息" />
                    <Step title="验证身份" />
                    <Step title="重置登录密码" />
                    <Step title="重置成功" />
                </Steps>
                 <Frame title="您的账户正在审核中，请使用验证短信进行校验。">
                    <Form horizontal className="fn-mt-30">

                        <FormItem
                            label="手机号码"
                            {...formItemLayout}
                            >
                            <p>{this.state.mobile}</p>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="短信验证码"
                            required
                            >
                            <Input className="smsCodeInput" style={{width:'200px',marginRight:'20px'}} {...getFieldProps('smsCode', rules.smsCode)} onKeyDown={this.handleKeyDown}  onPaste={this.noop.bind(this)}  />
                            <Button className="ant-search-btn" disabled={this.state.isBtnSmsCodeDisabled} onClick={this.getVerifyCode.bind(this)}>{this.state.btnSmsCodeText}</Button>
                            </FormItem>
                        <FormItem wrapperCol={{ span: 8, offset: 8 }} style={{ marginTop: 24 }}>
                            <Button type="primary" onClick={this.handleNext.bind(this)}>下一步</Button>
                        </FormItem>
                    </Form>
                 </Frame>
            </div>
        );
    }
}


export default Form.create()(Steps2);
