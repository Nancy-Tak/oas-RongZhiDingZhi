/**
 * 个人核身step4
 * xing
 * update by yongquan.wu
 */
// react 相关库
import React from 'react';
import ReactDOM from 'react-dom';

import {Link} from 'react-router';
// antd 组件
import { Alert, Steps, Button } from 'antd';
const Step = Steps.Step;

// 页面组件
import Frame from 'COM/form/frame';

// 获取全局state
import State from 'PAGES/redirect/state';

import {fetch} from 'UTILS';

// 页面组件（导出）
export default class PersonalValidate extends React.Component {
    constructor(props){
        super(props);
        State.bind(this);
        this.state={
            nextStep:''
        };
    }

    componentDidMount(){
        this.initPage();
    }
    initPage(){
        fetch('/common/getLoginCheckStatus.do').then(res => {

            // save data
            State.setState({
                data: res.data,
            });

            const {step, userType, bankCheckStatus} = res.data;
            let nextStep='/personalValidate/tips/check'
            if(step == 999 && bankCheckStatus == 1){
                nextStep='accountManagement';
            }

            this.setState({
                nextStep
            })

        });
    }

    render() {
        return (
            <div>
                <Steps size="large" current={3} className="fn-mb-30">
                    <Step title="填写基本信息" />
                    <Step title="实名认证" />
                    <Step title="设置交易密码" />
                    <Step title="提交结果" />
                </Steps>
                <div className="form-frame">
                    <div style={{ width: '58%', margin: '0 auto',marginTop:30 }}>
                        <Alert message="审核申请已提交。"
                               description="我们将尽快完成审核，结果将以短信通知您。如需修改信息请联系客服电话：400-106-6698。"
                               type="success"
                               showIcon
                        />
                        <div className="text-align-center fn-mt-30">
                            <Link className='ant-btn ant-btn-primary' to={this.state.nextStep}>返回首页</Link>
                        </div>
                    </div>

                </div>
            </div>

        );
    }
}
