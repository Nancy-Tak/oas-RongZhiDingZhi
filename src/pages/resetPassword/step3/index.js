/**
 * findPassword step3
 * yongquan.wu
 */
// react 相关库
import React from 'react';
import classNames from 'classnames';
import {
    Link
} from 'react-router';
// 页面组件
import Frame from 'COM/form/frame';

// 自定义验证 rule
import {
    fetch,
    ruleType,
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
    message
} from 'antd';
const Step = Steps.Step;
const createForm = Form.create;
const FormItem = Form.Item;

// 页面
class Step3 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    handleSubmit() {
        this.props.form.validateFields((errors, values) => {
            if (!errors) {
                let data = {
                    pwd:values.password,
                    conPwd:values.rePassword,
                };
                // data.pwd = values.password;
                // data.conPwd = values.rePassword;
                console.log('Submit!!!', data);

                fetch('/resetLoginPwd/resetLoginPwd.do', {
                    body: data
                }).then((res) => {
                    console.log('res:', res);
                    this.props.history.push({
                        pathname: 'resetPassword/step4',
                        state: {
                            loginUrl: res.data && res.data.loginUrl
                        }
                    });
                }, (res) => {
                    console.log(res)
                    if(res.fieldName){
                        const {form} = this.props;
                        if(res.fieldName=='pwd'){
                            helper.focusError(form,'password',res.message);
                        }else if(res.fieldName=='conPwd'){
                            helper.focusError(form,'rePassword',res.message);
                        }

                    }
                });
            }

        });
    }

    checkPassWordAgain(rule, value, callback) {
        const {getFieldValue} = this.props.form;
        if (value && value !== getFieldValue('password')) {
            callback('两次所填写的密码不一致，请重新输入');
        } else {
            callback();
        }
    }

    onPassWordBlur(e) {
        const value = e.target.value;
        const {validateFields,getFieldError} = this.props.form;
        if (value && !getFieldError('password')) {
            validateFields(['rePassword'], {
                force: true
            });
        }
    }

    noop(event) {
        return event.preventDefault();
    }

    render() {
        const {getFieldProps} = this.props.form;
        const formItemLayout = {
            labelCol: {
                span: 8
            },
            wrapperCol: {
                span: 12
            },
        };
        // 表单校验
        const rules = {
            password: {
                rules: [{
                        required: true,
                        message: '密码不能为空'
                    }, {
                        min: 8,
                        max: 20,
                        message: '请输入8-20位字符'
                    },
                    ruleType('password')
                ]
            },
            rePassword: {
                rules: [{
                    required: true,
                    message: '请再次输入密码'
                }, {
                    validator: this.checkPassWordAgain.bind(this)
                }]
            },
        };

        console.log(this)
        return (
            <div>
                <Steps size="default" current={2} className="fn-mb-30">
                    <Step title="账户信息" />
                    <Step title="验证身份" />
                    <Step title="重置登录密码" />
                    <Step title="重置成功" />
                </Steps>
                <Frame title="重置登录密码" small=" &nbsp;&nbsp;请勿与交易密码一致" className="">
                    <Form horizontal  className="fn-mt-30">
                        <FormItem
                                {...formItemLayout}
                                label="设置登录密码"
                                required
                            >
                                <Input type="password" {...getFieldProps('password', rules.password)} onBlur={this.onPassWordBlur.bind(this)} autoComplete="off"  onPaste={this.noop.bind(this)} onCopy={this.noop.bind(this)} onCut={this.noop.bind(this)} placeholder="8-20位英文字母、数字或符号的组合，字母区分大小写" />
                            </FormItem>

                            <FormItem
                                {...formItemLayout}
                                label="确认登录密码"
                                required
                            >
                                <Input {...getFieldProps('rePassword', rules.rePassword)} type="password" autoComplete="off"  onPaste={this.noop.bind(this)} onCopy={this.noop.bind(this)} onCut={this.noop.bind(this)} />
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
export default createForm()(Step3);
