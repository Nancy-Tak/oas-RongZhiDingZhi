/**
 * findPassword step4
 * yongquan.wu
 */
// react 相关库
import React from 'react';

// antd 组件
import { Alert, Steps, Button } from 'antd';
import { Link } from 'react-router';
const Step = Steps.Step;

//全局获取基本信息
import State from 'PAGES/Layouts/state';
const globalState = State.getState();

// 页面
class Steps3 extends React.Component {
    constructor(props){
        super(props);
        this.state={};
    }
  

    render() {
        return (
            <div>
                <Steps size="default" current={3} className="fn-mb-30">
                    <Step title="账户信息" />
                    <Step title="验证身份" />
                    <Step title="重置登录密码" />
                    <Step title="重置成功" />
                </Steps>

                <div className="form-frame">
                    <div
                        style={{
                        width: '58%',
                        margin: '0 auto',
                        marginTop: 30
                        }}
                    >
                        <Alert message="重置登录密码成功" description="登录密码已重置成功，请妥善保管您的密码。如需帮助请联系客服电话：400-106-6698。" type="success" showIcon/>
                        <div className="text-align-center fn-mt-30">
                                <a className='ant-btn ant-btn-primary' href={globalState.sysInfo && globalState.sysInfo.logoutUrl}>重新登录</a>
                        </div>
                    </div>

                </div>

            </div>
        );
    }
}


export default Steps3;
