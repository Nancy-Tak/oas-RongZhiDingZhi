// react 相关库
import React from 'react';



// antd 组件
import {Steps} from 'antd';
const Step = Steps.Step;


// 页面身份验证
export default class ResetTradingPasswordStepsBar extends React.Component {
    constructor(props){
        super(props)
    }
    render() {
        return (
            <Steps size="big" current={0} className="fn-mb-30">
                <Step title="验证身份" />
                <Step title="重置交易密码" />
                <Step title="重置成功" />
            </Steps>
        );
    }
}
