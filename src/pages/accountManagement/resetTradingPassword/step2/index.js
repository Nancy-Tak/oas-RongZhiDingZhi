// react 相关库
import React from 'react';
import classNames from 'classnames';
import {
    Link
} from 'react-router';

// 页面组件
import Frame from 'COM/form/frame';

//自己内容组件
import StepsBar from './StepsBar';
// 自定义验证 rule
import ruleType from 'UTILS/ruleType';


import {
    fetch,
    helper
} from 'UTILS';

// antd 组件
import {
    Alert,
    Steps,
    Button,
    Form,
    Input,
    Col,
    Row,
} from 'antd';
const Step = Steps.Step;
const createForm = Form.create;
const FormItem = Form.Item;

function noop() {
    return false;
}
// 页面
class Steps2 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            passBarShow: false, // 是否显示密码强度提示条
            rePassBarShow: false,
            passStrength: 'L', // 密码强度
            rePassStrength: 'L',
            pwd: "",
            conPwd: "",
        }
    }
    componentDidMount() {
        this.loadData()
    }
    loadData() {
        //权限控制，如果没有参数 不要进来。
        if (this.props.location.query.isCheck != "1") {
            this.props.history.push("/accountManagement")
        }
    }
    //不让复制
    noop(event) {
      return event.preventDefault();
    }
    handleSubmit() {
        console.log(this)
        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            }
            fetch('/user/resetPayPwd.do', {
                body: {
                    "pwd": this.state.pwd,
                    "conPwd": this.state.conPwd
                }
            }).then(res => {

                console.log(res)
                    //this.setState(res)
                    //window.location.href="/#/accountManagement/resetTradingPassword/step3?_k=aam5lv"
                    //权限控制，跳转乱动枪毙
                this.props.history.push("/accountManagement/resetTradingPassword/step3?isCheck=1");
            }, (res) => {
                // if(res.fieldName){
                //     this.props.form.setFields({
                //         [res.fieldName]:{
                //             "value":this.props.form.getFieldValue(res.fieldName),
                //             "errors":[new Error(res.message)]
                //         }
                //     });
                // }
                if(res.fieldName){
                  const {form} = this.props;
                  helper.focusError(form,res.fieldName,res.message);
                }
            });
        });
    }

    getPassStrenth(value, type) {
        if (value) {
            let strength;
            // 密码强度的校验规则自定义，这里只是做个简单的示例
            if (value.length < 6) {
                strength = 'L';
            } else if (value.length <= 9) {
                strength = 'M';
            } else {
                strength = 'H';
            }
            if (type === 'pwd') {
                this.setState({
                    passBarShow: true,
                    passStrength: strength
                });
            } else {
                this.setState({
                    rePassBarShow: true,
                    rePassStrength: strength
                });
            }
        } else {
            if (type === 'pwd') {
                this.setState({
                    passBarShow: false
                });
            } else {
                this.setState({
                    rePassBarShow: false
                });
            }
        }
    }

    checkPass(rule, value, callback) {
        const form = this.props.form;
        this.getPassStrenth(value, 'pwd');

        if (form.getFieldValue('pwd')) {
            form.validateFields(['conPwd'], {
                force: true
            });
        }


        callback();
    }

    checkPass2(rule, value, callback) {
        const form = this.props.form;
        this.getPassStrenth(value, 'conPwd');

        if (value && value !== form.getFieldValue('pwd')) {
            callback('两次输入密码不一致！');
        } else {
            callback();
        }
    }

    renderPassStrengthBar(type) {
        const strength = type === 'pwd' ? this.state.passStrength : this.state.rePassStrength;
        const classSet = classNames({
            'ant-pwd-strength': true,
            'ant-pwd-strength-low': strength === 'L',
            'ant-pwd-strength-medium': strength === 'M',
            'ant-pwd-strength-high': strength === 'H'
        });
        const level = {
            L: '低',
            M: '中',
            H: '高'
        };

        return (
            <div>
                <ul className={classSet}>
                    <li className="ant-pwd-strength-item ant-pwd-strength-item-1"></li>
                    <li className="ant-pwd-strength-item ant-pwd-strength-item-2"></li>
                    <li className="ant-pwd-strength-item ant-pwd-strength-item-3"></li>
                    <span className="ant-form-text">
                        {level[strength]}
                    </span>
                </ul>
            </div>
        );
    }

    render() {
        console.log(this)
        const {
            getFieldProps
        } = this.props.form;
        const formItemLayout = {
            labelCol: {
                span: 8
            },
            wrapperCol: {
                span: 12
            },
        };
        const passProps = getFieldProps('pwd', {
            rules: [{
                required: true,
                whitespace: true,
                message: '请填写密码'
            }, {
                min: 8,
                max: 20,
                message: '请输入8-20位字符'
            }, ruleType('password'),{
                validator: this.checkPass.bind(this)
            }],
            onChange: (e) => {
                console.log('你的密码就是这样被盗的：', e.target.value);
                this.setState({
                    pwd: e.target.value
                })
            }
        });
        const rePassProps = getFieldProps('conPwd', {
            rules: [{
                required: true,
                whitespace: true,
                message: '请再次输入密码'
            }, {
                min: 8,
                max: 20,
                message: '请输入8-20位字符'
            }, {
                validator: this.checkPass2.bind(this)
            }],
            onChange: (e) => {
                console.log('你的密码就是这样被盗的：', e.target.value);
                this.setState({
                    conPwd: e.target.value
                })
            }
        });


        return (
            <div>
                {/*步骤*/}
                <StepsBar />
                <Frame title="重置交易密码" small=" 用于对融资申请、修改账号信息等操作，请勿与登录密码一致。" className="">
                    <Form horizontal  className="fn-mt-30">
                        <FormItem {...formItemLayout} label="设置交易密码" hasFeedback>
                            <Input
                                placeholder={helper.isIEbrowser() ? '' : "8-20位英文字母（区分大小写）、数字或符号的组合"}
                                {...passProps}
                                type="password"
                                onPaste={this.noop.bind(this)}
                                onCopy={this.noop.bind(this)}
                                onCut={this.noop.bind(this)}
                                autoComplete="off"
                                id="pwd"/>
                            {/*this.state.passBarShow
                                ? this.renderPassStrengthBar('pwd')
                                : null*/}
                        </FormItem>

                        <FormItem {...formItemLayout} label="确认交易密码" hasFeedback>
                            <Input
                                placeholder={helper.isIEbrowser() ? '' : "8-20位英文字母（区分大小写）、数字或符号的组合"}
                                {...rePassProps}
                                type="password"
                                onPaste={this.noop.bind(this)}
                                onCopy={this.noop.bind(this)}
                                onCut={this.noop.bind(this)}
                                autoComplete="off"
                                id="conPwd"/>
                            {/*this.state.rePassBarShow
                                ? this.renderPassStrengthBar('conPwd')
                                : null*/}
                        </FormItem>

                        <Row>
                            <Col span="16">
                                <Col span="8" offset="12">
                                    <Button type="primary" onClick={this.handleSubmit.bind(this)}>提交</Button>
                                </Col>
                            </Col>
                        </Row>
                    </Form>
                </Frame>
            </div>
        );
    }
}
export default createForm()(Steps2);
