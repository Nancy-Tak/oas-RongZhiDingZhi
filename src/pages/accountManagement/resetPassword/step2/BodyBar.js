// react 相关库
import React from 'react';
import {Link} from 'react-router';



// antd 组件
import {Steps,Alert} from 'antd';
const Step = Steps.Step;


// 页面身份验证
export default class BodyBar extends React.Component {
    render() {
        return (
            <div className="form-frame">
                <div
                    style={{
                    width: '58%',
                    margin: '0 auto',
                    marginTop: 30
                    }}
                >
                    <Alert message="重置密码成功" description="密码已重置成功，请妥善保管您的密码。如需帮助请联系客服电话：400-106-6698。" type="info" showIcon/>
                    <div className="text-align-center fn-mt-30">
                        <Link to="/accountManagement/basicInformation" className="ant-btn ant-btn-primary">返回账户管理</Link>
                    </div>
                </div>

            </div>
        );
    }
}
