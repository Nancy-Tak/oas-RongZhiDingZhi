/**
 * 企业核身step4
 * limit
 */
// react 相关库
import React, { Component, PropTypes } from 'react';

// antd 组件
import { Steps } from 'antd';
const Step = Steps.Step;

//  业务组件
import ResultComponent from '../components/resultComponent';

// 页面组件（导出）
export default class PersonalValidate extends React.Component {
    static propTypes = {
        className: PropTypes.string,
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Steps size="big" current={3} className="fn-mb-30">
                    <Step title="填写基本信息" />
                    <Step title="实名认证" />
                    <Step title="企业安全认证" />
                    <Step title="提交结果" />
                </Steps>
                <ResultComponent history={ this.props.history }/>
            </div>

        );
    }
}