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
import { Tabs , Alert ,Form, Input, Button, Checkbox, Radio, Tooltip, Icon, } from 'antd';
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const InputGroup = Input.Group;

import { fetch } from 'UTILS';

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
        fetch('/tmp/login.do',{
            body : loginData
        }).then(res => {
            console.log(res);
        });
    }
    render() {
        const { getFieldProps } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 12 },
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

                        {/*<h4>一些可用的subUserId：</h4>
                        <pre>
                        <br/>
                        67213cbb5e41401f9696b9481638b214	csx001<br/>
                        545b56ba38e54be380621c96df782d70	wuyq123<br/>
                        75657385a6b54b0da96d71c30f212ad3	dangdang2<br/>
                        ed5cac7f60394282848b45744fffd34a	testName<br/>
                        dfeb61318dcd4344afad1345442f05de	fronypay<br/>
                        a753a42b772041f3bd56a6949f3eeab9	dangdang<br/>
                        6dc7d994f5134ffeb9b032e0cb3d010c	koen<br/>
                        54a06e3531354edb9f672145a14fb87a    bug2<br/>
                        </pre>*/}
                    </div>
                </div>
            </div>
        );
    }
}

export default Form.create()(Login);
