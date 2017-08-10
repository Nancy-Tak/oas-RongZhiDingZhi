/**
 * 注册结果页
 * wuyongquan
 */
// react 相关库
import React from 'react';
import ReactDOM from 'react-dom';
import {Link} from 'react-router';

//  获取全局sysInfo
import State from 'PAGES/Layouts/state';
const logoutUrl = State.getState() && State.getState().sysInfo && State.getState().sysInfo.logoutUrl;

// antd 组件
import { Alert, Steps, Button } from 'antd';
const Step = Steps.Step;

// 页面组件
import Frame from 'COM/form/frame';

class RegisterResult extends React.Component{
    constructor(props){
        super(props);
        this.state={};
    }

    render(){
        return(
            <div>
                
                <div className="form-frame">
                    <div style={{ width: '58%', margin: '0 auto',marginTop:30 }}>
                        <Alert message="注册成功"
                               description="温馨提示：快速完善认证信息，可获得平台提供的所有服务。"
                               type="success"
                               showIcon
                        />
                        <div className="text-align-center fn-mt-30">
                            <a className='ant-btn ant-btn-primary' href={logoutUrl}>&nbsp;&nbsp;&nbsp;&nbsp;返回登录&nbsp;&nbsp;&nbsp;&nbsp;</a>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}

export default RegisterResult;