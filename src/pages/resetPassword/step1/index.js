
/**
 * findPassword step1
 * update by yongquan.wu
 */
// react 相关库
import React from 'react';
import ReactDOM from 'react-dom';
import {Link} from 'react-router';

// antd 组件
import { Form, Input, Button, Steps, Radio, Row, Col, Modal, message } from 'antd';
const createForm = Form.create;
const Step = Steps.Step;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
// fetch、 自定义验证 rule
import {fetch,ruleType,helper} from 'UTILS';
// 页面组件
import Frame from 'COM/form/frame';

//  获取全局sysInfo
import State from 'PAGES/Layouts/state';
const logoutUrl = State.getState() && State.getState().sysInfo && State.getState().sysInfo.logoutUrl;

// 页面组件（导出）
class CompanyValidate extends React.Component {

    constructor(props){
        super(props);
        this.state={
            data:{
                userType:'1',
            }
        }
        this.handleNext=this.handleNext.bind(this);
    }

    handleNext() {
        this.props.form.validateFields((errors, values) => {
            var data=values;
            console.log('submit:',data);
            if (!errors) {
                fetch('/resetLoginPwd/checkUserInfo.do',{
                    body:data
                }).then((res)=>{
                    var nextStep='';
                    if(res.data.bankCheckStatus=='1'){
                        nextStep='/resetPassword/step2/autherized/index1';
                    }else{
                        nextStep='/resetPassword/step2/unautherized';
                    }
                    this.props.history.push({
                        pathname:nextStep
                    });
                },(res)=>{
                    if(res.fieldName){
                        const {form} = this.props;
                        helper.focusError(form,res.fieldName,res.message);
                    }
                })
            }else{
                console.log('Errors in form!!!');
            }
        });
    }

    onBusinessLicenseTypeChange(e) {
        this.setState({
            data: {
                userType:e.target.value
            }
        });
    }

    render() {
        // 表单校验
        const rules = {
            userType:{
                initialValue:this.state.data.userType,
                onChange:this.onBusinessLicenseTypeChange.bind(this)
            },
            realName: {
                rules: [
                    {required: true, message: '真实姓名不能为空'},
                ],

            },
            companyName:{
                rules:[
                    {required: true, message: '企业名称不能为空'},
                ]
            },
            userNo:{
                rules:[
                    {required: true, message: '登录名不能为空'},
                ]
            },
            mobile:{
                rules:[
                    {required: true, message: '常用手机号码不能为空或者格式不正确'},
                    ruleType('mobile')
                ]
            },
        };


        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 12 },
        };
        const { getFieldProps } = this.props.form;

        var nameHtml=null;
        if(this.state.data.userType =='1'){
            nameHtml=(
                <FormItem
                    {...formItemLayout}
                    label="真实姓名"
                    hasFeedback
                    required
                >
                    <Input
                        {...getFieldProps('realName',rules.realName)}
                        type="text"

                    />
                </FormItem>
            );
        }else{
            nameHtml=(
                <FormItem
                    {...formItemLayout}
                    label="企业名称"
                    hasFeedback
                    required
                >
                    <Input
                        {...getFieldProps('companyName',rules.companyName)}
                        type="text"

                    />
                </FormItem>
            );
        }

        return (
            <div>
                <Steps size="default" current={0} className="fn-mb-30">
                    <Step title="账户信息" />
                    <Step title="验证身份" />
                    <Step title="重置登录密码" />
                    <Step title="重置成功" />
                </Steps>

                <Frame title="填写账户信息" small=" 输入你需要找回登录密码的账户信息">
                    <Form horizontal className="fn-mt-30">
                        <FormItem
                            {...formItemLayout}
                            label="用户类型"
                            required
                        >
                            <RadioGroup {...getFieldProps('userType',rules.userType)}>
                                <Radio value="1">个人用户</Radio>
                                <Radio value="2">企业用户</Radio>
                            </RadioGroup>

                        </FormItem>

                        {nameHtml}

                        <div>
                            <FormItem
                                {...formItemLayout}
                                label="登录名"
                                hasFeedback
                                required
                            >
                                <Input
                                    {...getFieldProps('userNo',rules.userNo)}
                                    type="text"

                                />
                            </FormItem>
                        </div>
                        <div>
                            <FormItem
                                {...formItemLayout}
                                label="手机号码"
                                hasFeedback
                                required
                            >
                                <Input
                                    {...getFieldProps('mobile',rules.mobile)}

                                />
                            </FormItem>
                        </div>
                        <Row style={{ marginTop: 30 }}>
                            <Col span="12" offset="8">
                                <Button key="submit" type="primary" size="large" onClick={this.handleNext}>下一步 </Button>
                                <a href={logoutUrl} className='fn-ml-30'>重新登录</a>
                            </Col>
                        </Row>
                    </Form>
                </Frame>
            </div>

        );
    }
}

export default createForm()(CompanyValidate);
