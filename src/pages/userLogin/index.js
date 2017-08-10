/**
 * 用户登录
 *
 * by xing
 * 2016/10/24
 */

// 样式
import './style.less';


// react 相关库
import React from 'react';

// antd 组件
import {
    Tabs,
    Alert,
    Form,
    Input,
    Button,
    Checkbox,
    Radio,
    Tooltip,
    Icon,
} from 'antd';
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const InputGroup = Input.Group;

import {
    fetch
} from 'UTILS';

// 页面组件
//import Frame from 'COM/form/frame';


// 页面
class Login extends React.Component {
    login() {
        // fetch(`/tmp/login.do?subUserId=${this.props.form.getFieldValue('subUserId')}`, null, false, () => {
        //     location.href = `${location.origin}${location.pathname}`;
        // });
        let loginData = this.props.form.getFieldsValue();
        console.log(loginData);
        fetch('/tmp/login2.do', {
            body: loginData
        }, false, () => {
            location.href = `${location.origin}${location.pathname}`;
        });
    }
    render() {
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
        return (
            <div className="login-page">
                <div className="main-frm">
                    <div className="login-layerout text-align-center fn-pt-30">
                        <FormItem
                            label="登录名"
                            {...formItemLayout}
                            required
                        >
                           <Input type="text" {...getFieldProps('userNo')} />
                        </FormItem>

                        <FormItem
                            label="登录密码"
                            {...formItemLayout}
                            required
                        >
                           <Input type="text" {...getFieldProps('password')} />
                        </FormItem>

                        <Button type="primary" htmlType="submit" onClick={this.login.bind(this)}>登录</Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Form.create()(Login);