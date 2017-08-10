// react 相关库
import React from 'react';
// antd 组件
import {
    Button,
    Form,
    Input
} from 'antd';
// 自定义验证 rule
import ruleType from 'UTILS/ruleType';
// 页面
import Frame from 'COM/form/frame';

import { Link } from 'react-router';


//fetch
import {
    fetch,
    helper
} from 'UTILS';


//全局获取基本信息
import State from 'PAGES/redirect/state';
const globalState = State.getState();
console.log(globalState)


class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            oldLoginPwd: "",
            newLoginPwd: "",
            conNewLoginPwd: "",
        }
    }

    componentDidMount() {
        //this.loadData()
    }
    loadData() {
        //fetch("/user/checkUserInfo.do").then(res=>{
        //    console.log(res)
        //})
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                return;
            }

            fetch('/user/modifyLoginPwd.do', {
                body: {
                    oldLoginPwd: this.state.oldLoginPwd,
                    newLoginPwd: this.state.newLoginPwd,
                    conNewLoginPwd: this.state.conNewLoginPwd,
                }
            }).then(res => {
                //alert(res)
                console.log(res)
                    //this.setState(res)
                    //window.location.href="/#/accountManagement/resetPassword/step2/?_k=REPLACE"
                this.props.history.push("/accountManagement/resetPassword/step2")
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
    //不让复制
    noop(event) {
      return event.preventDefault();
    }

    checkPass(rule, value, callback) {
        if (value) {
            this.props.form.validateFields(['conNewLoginPwd'], {
                force: true
            });
        }
        callback();
    }

    checkConfirmPass(rule, value, callback) {
        if (value && value !== this.props.form.getFieldValue('newLoginPwd')) {
            callback('两次输入密码不一致！');
        } else {
            callback();
        }
    }

    render() {
        console.log(this)
        const props = {
            labelCol: {
                span: 8
            },
            wrapperCol: {
                span: 8
            },
        };
        const {
            getFieldProps
        } = this.props.form; //用于和表单进行双向绑定
        const oldLoginPwd = getFieldProps('oldLoginPwd', { //原登录密码
            rules: [{
                required: true,
                whitespace: true,
                min: 8,
                max: 20,
                message: '请输入8-20个字符的原登录密码'
            }, ruleType('password')],
            onChange: (e) => {
                this.setState({
                    oldLoginPwd: e.target.value
                })
                console.log('原密码：', e.target.value);
            }
        });
        const newLoginPwd = getFieldProps('newLoginPwd', { //新登录密码
            rules: [{
                    required: true,
                    min: 8,
                    max: 20,
                    message: '请输入8-20个字符'
                }, {
                    validator: this.checkPass.bind(this)
                },
                ruleType('password')
            ],
            onChange: (e) => {
                this.setState({
                    newLoginPwd: e.target.value
                })
                console.log('新登录密码：', e.target.value);
            }
        });
        const conNewLoginPwd = getFieldProps('conNewLoginPwd', { //确认新登录密码
            rules: [{
                required: true,
                message: '请再次输入密码'
            }, {
                validator: this.checkConfirmPass.bind(this)
            },ruleType('password') ],
            onChange: (e) => {
                this.setState({
                    conNewLoginPwd: e.target.value
                })
                console.log('确认新登录密码：', e.target.value);
            }
        });
        return (
            <Frame title="修改登录密码" small="  避免使用有规律的数字或字母，请勿与交易密码一致。">
                <div className="fn-pt-30">
                    <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
                        <Form.Item {...props} label="登录名">
                            <label>{globalState.data.loginName}</label>
                        </Form.Item>
                        <Form.Item {...props} label="原登录密码"   required>
                            <Input type="password"
                                   autoComplete="off"
                                   placeholder=""
                                   onPaste={this.noop.bind(this)}
                                   onCopy={this.noop.bind(this)}
                                   onCut={this.noop.bind(this)}
                                {...oldLoginPwd}/>
                        </Form.Item>
                        <Form.Item {...props} label="新登录密码" hasFeedback required>
                            <Input type="password"
                                   autoComplete="off"
                                   placeholder={helper.isIEbrowser() ? '' : "8-20位英文字母（区分大小写）、数字或符号的组合"}

                                   onPaste={this.noop.bind(this)}
                                   onCopy={this.noop.bind(this)}
                                   onCut={this.noop.bind(this)}
                                {...newLoginPwd}/>
                        </Form.Item>
                        <Form.Item {...props} label="确认新登录密码" hasFeedback required>
                            <Input type="password"
                                   autoComplete="off"
                                   placeholder={helper.isIEbrowser() ? '' : "8-20位英文字母（区分大小写）、数字或符号的组合"}

                                   onPaste={this.noop.bind(this)}
                                   onCopy={this.noop.bind(this)}
                                   onCut={this.noop.bind(this)}
                                {...conNewLoginPwd} />
                        </Form.Item>
                        <Form.Item wrapperCol={{span: 12, offset: 8}}>
                            <Button type="primary" htmlType="submit">确认提交</Button>
                            <Link style={{paddingLeft: 20}} to="/accountManagement/basicInformation">取消</Link>
                        </Form.Item>
                    </Form>
                </div>
            </Frame>
        )
    }
}
export default Form.create()(ResetPassword)
