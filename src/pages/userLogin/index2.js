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

// 页面组件
//import Frame from 'COM/form/frame';

import eaccountlogo from 'ASSETS/images/eaccountlogo.png';

import FormPerson from './formPerson';
import FormCompany from './formCompany';


// 页面
export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: '',
        };
    }
    render() {
        return (
            <div className="login-page">
                <div className="main-frm">
                    <div className="login-layerout">
                        <div className="login-head-wrap">
                            <div className="login-head-content">
                                <a href="#" className="login-head-logo">
                                    <img src={eaccountlogo} />
                                </a>
                                <a href="###" className="login-admin default-FontColor">管理员登录</a>
                            </div>
                        </div>
                        <div className="login-wrap">
                            <div className="login-bg">
                                <div className="login-content">
                                    <Tabs type="card">
                                        <TabPane tab="个人用户" key="1">
                                            <FormPerson />

                                        </TabPane>
                                        <TabPane tab="企业用户" key="2">
                                            <FormCompany />
                                        </TabPane>
                                    </Tabs>
                                </div>


                            </div>
                        </div>
                    </div>


                    <div className="main-footer clearfix">
                        <div className="main-ft-inner">
                            <div className="main-ft-bank"><span className="bank-bg bank-cmb"></span></div>
                            <div className="main-ft-helper">
                                <ul>
                                    <li className="has-r-line">
                                        <Icon type="message"  />
                                        <a href="##">帮助中心</a>
                                    </li>
                                    <li className="tel has-r-line"><Icon type="phone" />客服热线<b>400-106-6698</b></li>
                                    <li>粤ICP备 14098252号-2</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        );
    }
}
