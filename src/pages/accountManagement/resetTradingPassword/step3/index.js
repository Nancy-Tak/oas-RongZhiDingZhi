// react 相关库
import React from 'react';

//自己内部组件
/**
 *StepsBar 步骤
 * BodyBar 身体
 */
import StepsBar from './StepsBar';
import BodyBar from './BodyBar';

// antd 组件
import { Alert, Steps, Button } from 'antd';
import { Link } from 'react-router';
const Step = Steps.Step;

// 页面
export default class Steps3 extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount(){
        this.loadData()
    }
    loadData(){
        //权限控制，如果没有参数 不要进来。
        if(this.props.location.query.isCheck!="1"){
            this.props.history.push("/accountManagement")
        }
    }
    render() {
        return (
            <div>
                {/*步骤*/}
                <StepsBar />

                <BodyBar />

            </div>
        );
    }
}
