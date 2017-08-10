/**
 * 登录跳转页
 *
 * by koen
 * 2016/11/4
 */
// react 相关库
import React from 'react';

import { fetch } from 'UTILS';

import State from './state';

import LayoutsState from 'PAGES/Layouts/state';

// 页面
export default class Redirect extends React.Component {
    constructor(props) {
        super(props);
        this.state = State.bind(this).getState();
    }
    componentDidMount() {
        fetch('/common/getLoginCheckStatus.do').then(res => {
            const {step, userType, bankCheckStatus} = res.data;
            const type = {
                "1": "personalValidate",
                "2": "companyValidate"
            }[userType];

            // save data
            State.setState({
                data: res.data,
                sysInfo: LayoutsState.getState().sysInfo
            });

            //setTimeout(() => {
                // 业务判断
                if(step == 0){ //未开始
                    return this.props.history.push(`${type}/step1`);
                } else if (step == 999 && bankCheckStatus == 1){ //已完成核身流程且审核通过
                    return this.props.history.push(`accountManagement`);
                } else {
                    return this.props.history.push(`${type}/tips/check`);
                }
            //}, 3000);

            // 业务判断
            // if(step == 999){ //已完成核身流程
            //     if(bankCheckStatus == -1 ||  bankCheckStatus == 0){ // 审核中/审核不通过
            //         return this.props.history.push(`${type}/tips/check`);
            //     }
            //     if(bankCheckStatus == 0){ // 审核不通过
            //         return this.props.history.push(`${type}/tips/disapproval`);
            //     }
            //     if(bankCheckStatus == 1){ // 审核通过
            //         return this.props.history.push(`personalValidate/step${step}`);
            //     }
            // } else { // 未完成流程，跳转到信息补充提示页
            //     return this.props.history.push(`personalValidate/step${step}`);
            // }

        });
        // OAS日志接口
        // if(location.search.indexOf('cas=1') != -1){
        //     fetch('/redirect.do');
        // }
    }
    render() {
        return (
            <div style={{textAlign: 'center', height: 450, fontSize: '20px', paddingTop: '200px'}}>
                页面跳转中...
            </div>
        );
    }
}
