/**
 * findPassword step2
 * yongquan.wu
 */
// react 相关库
import React from 'react';

// antd 组件
import { Alert, Steps, Button,Form,Row,Col,message } from 'antd';
import { Link } from 'react-router';
const Step = Steps.Step;
const FormItem = Form.Item;

import {fetch} from 'UTILS';
// 页面
class Steps2 extends React.Component {
    constructor(props){
        super(props);
        this.state={
            name:'',
            nameText:'',
            mobile:''
        };
    }

    handleSendPinCode(){
        var data={
            "connectorType": this.state.connectorType,
            "isFirst": true
        };
        fetch('/resetLoginPwd/pinCode.do',{body:data}).then((res)=>{
            this.props.history.push({
                pathname:'/resetPassword/step2/autherized/index2'
            });
        });
    }

    componentDidMount(){
        this.initPage();
    }

    initPage(){
        fetch('/resetLoginPwd/getDesensitizeMobile.do').then((res)=>{
            var nameText='姓名';
            if(res.data.connectorType=='1'){
                nameText='姓名';
            }else if(res.data.connectorType=='2'){
                nameText='法人';
            }else if(res.data.connectorType=='3'){
                nameText='经办人';
            }
            this.setState({
                name:res.data.name,
                mobile:res.data.mobile,
                nameText:nameText,
                connectorType:res.data.connectorType
            });
        });
    }

    render() {
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 12 },
        };
        return (
            <div>
                <Steps size="default" current={1} className="fn-mb-30">
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
                        <Form horizontal className="fn-mt-30">
                            <FormItem
                                label={this.state.nameText}
                                {...formItemLayout}
                                >
                                <p>{this.state.name}</p>
                            </FormItem>
                            <FormItem
                                label="手机号码"
                                {...formItemLayout}
                                >
                                <p>{this.state.mobile}</p>
                            </FormItem>

                            <Row style={{ marginTop: 30 }}>
                                <Col span="12" offset="8">
                                    <Button type="primary" onClick={this.handleSendPinCode.bind(this)}>发送身份识别码至手机</Button>
                                </Col>
                            </Row>
                        </Form>
                    </div>

                </div>

            </div>
        );
    }
}


export default Steps2;
