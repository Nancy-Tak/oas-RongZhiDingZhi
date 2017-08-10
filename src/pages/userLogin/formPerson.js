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

import {Link} from 'react-router';

import vcode from 'ASSETS/images/vcode.png';

// 页面
class FormPerson extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: '',
        };
    }
    render() {
        const { getFieldProps } = this.props.form;
        // 表单布局
        const formItemLayout = {
            labelCol: { span:8 },
            wrapperCol: { span: 12 },
        };
        return (
            <div>
                <Alert message="仅支持IE8以上版本的浏览器，请切换浏览器！" type="warning" showIcon />
                <Form horizontal>
                    <FormItem
                        {...formItemLayout}
                        label="真实姓名"
                    >
                        <Input type="input" {...getFieldProps('userName')} />
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="登录名"
                    >
                        <Input type="input" {...getFieldProps('accountId')} />
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="登录密码"
                    >
                        <Input type="password" {...getFieldProps('loginPassword')} />
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="验证码"
                    >
                        <InputGroup className="ant-search-input">
                            <Input {...getFieldProps('vCode')} style={{ width: 80 }}/>
                            <div className="ant-input-group-wrap">
                                <img className="ant-search-btn vcode" src={vcode}/>
                            </div>
                        </InputGroup>
                    </FormItem>

                    <FormItem wrapperCol={{ span: 16, offset: 8 }} style={{ marginTop: 24}}>
                        <Button type="primary" htmlType="submit">登录</Button>
                    </FormItem>

                    <FormItem wrapperCol={{ span: 12, offset: 8 }}>
                        <Link to="/userRegister">新用户注册</Link>
                        <Link to="/resetPassword/step1"><span className='float-right'>忘记密码</span></Link>
                    </FormItem>

                </Form>
            </div>
        );
    }
}

export default Form.create()(FormPerson);
