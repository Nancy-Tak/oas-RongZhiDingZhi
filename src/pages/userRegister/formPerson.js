/**
 * 个人用户注册表单
 *
 * by koen
 * 2016/9/21
 */
// react 相关库
import React from 'react';

// antd 组件
import { Button, Form, Input, Checkbox, Modal,message } from 'antd';
const createForm = Form.create;
const FormItem = Form.Item;
const InputGroup = Input.Group;


//  获取全局sysInfo
import State from 'PAGES/Layouts/state';
const logoutUrl = State.getState() && State.getState().sysInfo && State.getState().sysInfo.logoutUrl;

// 自定义验证 rule 及 fetch 方法
import { ruleType, fetch,helper } from 'UTILS';

import AgreementModal from 'COM/agreementModal'

// 页面
class Reg extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      submitDis: true,
      btnSmsCodeText:'获取验证码',
      isBtnSmsCodeDisabled:false,
      protocolData:{},
      // submitDisCheck:false
    };
    this.timer=null;
  }
  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((errors, values) => {

      console.log(errors,values);

      if(!errors){
        var data=values;
        data.userType=1;
        data.protocolId=this.state.protocolData.id;
        console.log('Submit!!!',data);

        fetch('/register/post.do',{body:data}).then((res)=>{
          console.log('注册成功');
          window.location.href='#/userRegister/result';
        },(res)=>{
          console.log('注册失败');
            if(res.fieldName){
              const {form} = this.props;
              helper.focusError(form,res.fieldName,res.message);
            }
        });

      }

    });
  }

  checkPassWord(rule, value, callback) {
    const { validateFields } = this.props.form;
    if (value) {
      validateFields(['conLoginPwd'], { force: true });
    }
    callback();
  }
  checkPassWordAgain(rule, value, callback) {
    const { getFieldValue } = this.props.form;
    if (value && value !== getFieldValue('loginPwd')) {
      callback('两次所填写的密码不一致，请重新输入');
    } else {
      callback();
    }
  }

  getVerifyCode() {
    var that =this;
    this.props.form.validateFields(['mobile'],(errors,values)=>{
      console.log(errors,values);
      if(!errors){
        fetch('/common/smsAutoCode.do', {
          body: {
            "mobile": values.mobile,
            "businessType": "register"
          }
        }).then(res => {
          console.log('短信验证码获取成功：',res);
          message.success('短信验证码获取成功');
          countDown();
        });
      }else{
          Modal.warning({
            title: '提示',
            content: errors.mobile.errors[0].message,
          });
      }
    });

    function countDown(){
        that.setState({
            isBtnSmsCodeDisabled:true
        });

        var count=60;
        that.timer = setInterval(()=>{
            count--;
            if(count>0){
                that.setState({
                    btnSmsCodeText:`${count}秒后重新获取`
                });
            }else{
                clearInterval(that.timer);
                that.setState({
                    btnSmsCodeText:`获取验证码`,
                    isBtnSmsCodeDisabled:false
                });
            }
        },1000)
    }

  }

  noop(event) {
      return event.preventDefault();
  }

  /*协议*/
  openAgreementModal(){

      this.setState({
          agreementModalVisible:true,
      });
  }
  hideAgreementModal(){
      this.setState({
          agreementModalVisible:false
      });
  }
  handleAgreement(){

      this.setState({
          agreementModalVisible:false,
      });
  }
  agreementCheck(e) {
    this.setState({
      submitDis: !e.target.checked,
      // submitDisCheck:e.target.checked
    });
  }
  handleAgreementonOK(){
      this.setState({
        // submitDisCheck:true,
        agreementModalVisible:false,
        submitDis:false
      });
  }
  /*协议 end*/


  componentDidMount(){
    this.initPage();
  }

  componentWillUnmount(){
    if(this.timer){
      clearInterval(this.timer);
    }
  }

  initPage(){
      //获取此页面需要签署的协议
      fetch('/common/getCurrentProtocol.do',{
          body:{
              "protocolType": 1
          }
      }).then((res)=>{
          console.log('获取协议成功：',res.data);
          this.setState({
              protocolData:res.data,
          });
      },(res)=>{
          message.error(`${res.code}获取协议失败，请重新获取！`,3);
      })
  }

  handleKeyDown(event){
    if(event.keyCode == 32){
      return event.preventDefault();
    }
  }

  render() {
    const { getFieldProps } = this.props.form;
    console.log('is ie?',helper.isIEbrowser())
    // 表单校验
    const rules = {
      realName: {
        rules: [
          {required: true, message: '真实姓名不能为空'},
          ruleType('cn+en+str'),
          {max:50,message:'真实姓名长度不能超过50位'}
        ]
      },
      companyName: {
        rules: [
          {required: true, message: '企业名不能为空'},
        ]
      },
      userNo: {
        rules: [
          {required: true, message: '登录名不能为空'},
          ruleType('en+num'),
          {min: 4, max: 32, message: '请输入4-32位字符'},
        ]
      },
      loginPwd: {
        rules: [
          {required: true, message: '密码不能为空'},
          {validator: this.checkPassWord.bind(this)},
          ruleType('password'),
          {min: 8, max: 20, message: '请输入8-20位字符'}
        ]
      },
      conLoginPwd: {
        rules: [
          {required: true, message: '请再次输入密码'},
          {validator: this.checkPassWordAgain.bind(this)}
        ]
      },
      mobile: {
        rules: [
          {required: true, message: '手机号码不能为空'},
          ruleType('mobile')
        ]
      },
      smsCode: {
        rules: [
          {required: true, message: '短信验证码不能为空'},
          ruleType('number'),
          {len :6, message: '请输入6位的短信验证码'}
        ]
      },
      recommender:{
        rules:[
          ruleType('cn+en+str'),
          {max: 50, message: '推荐人长度不能超过50位'},
        ]
      },
      recommenderNo:{
        rules:[
          ruleType('cn+en+str'),
          {max: 30, message: '推荐人长度不能超过30位'},
        ]
      }
    };

    // 表单布局
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 12 },
    };
    
    return (
      <Form horizontal>


        <FormItem
          {...formItemLayout}
          label="真实姓名"
          required
        >
          <Input {...getFieldProps('realName', rules.realName)} />
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="登录名"
          required
        >
          <Input placeholder={helper.isIEbrowser() ? '' : '4-32个英文字母、数字'} {...getFieldProps('userNo', rules.userNo)} />
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="登录密码"
          required
        >
          <Input type="password" autoComplete="off" onPaste={this.noop.bind(this)} onCopy={this.noop.bind(this)} onCut={this.noop.bind(this)} placeholder={helper.isIEbrowser() ? '' : "8-20位英文字母、数字或符号的组合，字母区分大小写"} {...getFieldProps('loginPwd', rules.loginPwd)} />
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="确认密码"
          required
        >
          <Input type="password" autoComplete="off" onPaste={this.noop.bind(this)} onCopy={this.noop.bind(this)} onCut={this.noop.bind(this)} {...getFieldProps('conLoginPwd', rules.conLoginPwd)} />
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="手机号码"
          required
        >
          <Input {...getFieldProps('mobile', rules.mobile)} />
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="短信验证码"
          required
        >
          <Input className="smsCodeInput" onPaste={this.noop.bind(this)} {...getFieldProps('smsCode', rules.smsCode)} onKeyDown={this.handleKeyDown} />
          <Button className="ant-search-btn" disabled={this.state.isBtnSmsCodeDisabled} onClick={this.getVerifyCode.bind(this)}>{this.state.btnSmsCodeText}</Button>
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="推荐人姓名"
        >
          <Input {...getFieldProps('recommender',rules.recommender)} />
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="推荐人编号"
        >
          <Input {...getFieldProps('recommenderNo',rules.recommenderNo)} />
        </FormItem>

        <FormItem wrapperCol={{ span: 12, offset: 7 }}>
            <AgreementModal
                visible={ this.state.agreementModalVisible }
                onOk={this.handleAgreementonOK.bind(this)}
                onCancel={this.hideAgreementModal.bind(this)}
                iframeData={{
                    iframeSrc:this.state.protocolData.fileUrl,
                    name:this.state.protocolData.protocolName
                }}
            >
                <Checkbox
                    checked={!this.state.submitDis}
                    onChange={this.agreementCheck.bind(this)}
                    >
                    我已阅读并同意
                </Checkbox>
                <a href="javascript:void(0)" onClick={this.openAgreementModal.bind(this)}>
                    {this.state.protocolData.protocolName}
                </a>
            </AgreementModal>

        </FormItem>

        <FormItem wrapperCol={{ span: 12, offset: 7 }}>
          <Button type="primary" onClick={this.handleSubmit.bind(this)} disabled={this.state.submitDis}>提交注册</Button>
        </FormItem>

        <FormItem wrapperCol={{ span: 12, offset: 7 }}>
          <p>已有账号？ <a href={logoutUrl}>直接登录</a></p>
        </FormItem>


      </Form>
    );
  }
}

export default Form.create()(Reg);
