// react 相关库
import React from 'react';

//自己内部组件
/**
 *StepsBar 步骤
 * BodyBar 身体
 */

import BodyBar from './BodyBar';

// antd 组件
import { Alert, Steps, Button } from 'antd';
import { Link } from 'react-router';
const Step = Steps.Step;

// 页面
export default class Steps2 extends React.Component {
    render() {
        return (
            <div>
                <BodyBar />
            </div>
        );
    }
}
