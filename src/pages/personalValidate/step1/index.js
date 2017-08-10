/**
 * 个人核身step1
 * yongquan.wu
 */
// react 相关库
import React from 'react';
import ReactDOM from 'react-dom';
// antd 组件
import { Form, Input, Button, Upload, Icon, Steps, Row, Col, Modal,message } from 'antd';
const Step = Steps.Step;
const FormItem = Form.Item;

// 页面组件
import Frame from 'COM/form/frame';
//引入 fetch ruleType helper
import {helper,ruleType,fetch} from 'UTILS';


// 页面组件（导出）
class PersonalValidate extends React.Component {
    constructor(props){
        super(props);
        this.state={
            visible:false,
            loading:false,
            upLoadStatus:'error',
            data:{
                userName:'',
                IdCard:'',
                phoneNumber:''
            }
        }

        this.showModal=this.showModal.bind(this);
        this.handleOk=this.handleOk.bind(this);
        this.handleCancel=this.handleCancel.bind(this);
    }

    showModal() {
        this.props.form.validateFields((errors, values) => {
            console.log('errors:',JSON.stringify(errors));
            if(!errors){
                let data=this.state.data;
                Object.assign(data,values);
                this.setState({
                    data:data,
                    visible: true
                });
            }
            
        });
    }
    //提交数据
    handleOk(e) {
        e.preventDefault();
        this.setState({ loading: true });
        console.log('Submit!!!');
        fetch('/personVerification/savePersonInfo.do',{body:{
            "cardNumber":this.state.data.IdCard
        }}).then((res)=>{
            console.log(res);
            this.setState({ loading: false, visible: false });
            this.props.history.push({
                pathname: '/personalValidate/step2'
            });
        },(res)=>{
        
            if(res.fieldName){
                const {form} = this.props;
                if(res.fieldName=='cardNumber'){
                    helper.focusError(form,'IdCard',res.message);
                }else{
                    helper.focusError(form,res.fieldName,res.message);
                }
            }
            this.setState({ loading: false, visible: false });
            
        });
    }

    handleCancel() {
        this.setState({ visible: false });
    }

    normFile(e) {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    }

    componentDidMount(){
        this.initPage();
        
    }

    initPage(){
        fetch('/personVerification/getPersonInfo.do',{body:{"isMosaicMobile": "0"}}).then((res)=>{
            console.log(res);
            if(res.code=='200'){
                this.setState({
                    data:{
                        userName:res.data.name,
                        phoneNumber:res.data.mobile
                    }
                });
            }
        });
    }

    render() {
        const { getFieldProps } = this.props.form;
        // 表单校验
        const rules = {
            IdCard:{
                rules:[
                    {required:true, message: '身份证号码不能为空'},
                    ruleType('id-card')
                ]
            }
        };

        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 12 },
        };

        return (
            <div>
                <Steps size="default" current={0} className="fn-mb-30">
                    <Step title="填写基本信息" />
                    <Step title="实名认证" />
                    <Step title="设置交易密码" />
                    <Step title="提交结果" />
                </Steps>
                <Frame title="个人信息" small="（请务必与证件上的资料保持一致）" className="">
                    <Form horizontal className="fn-mt-30">
                        <FormItem
                            {...formItemLayout}
                            label="申请人真实姓名"
                            required
                        >
                            <p className="ant-form-text">{this.state.data.userName}</p>
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label=" 身份证号码"
                            required
                            hasFeedback
                        >
                            <Input placeholder={helper.isIEbrowser() ? '' : "请输入身份证号码"} {...getFieldProps('IdCard', rules.IdCard)} />
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="常用手机号码"
                            help="审核结果将通过短信发送至该手机 ，同时将作为此账号的绑定手机号码"
                            required
                        >
                            <p className="ant-form-text">{this.state.data.phoneNumber}</p> <br/>
                        </FormItem>

                        <Row style={{ marginTop: 30 }}>
                            <Col span="12" offset="8">
                                <Button type="primary" size="large" onClick={this.showModal} htmlType="submit">确认无误，下一步</Button>
                            </Col>
                        </Row>

                    </Form>

                </Frame>
                <Modal ref="modal"
                       visible={this.state.visible}
                       style={{ top: 150 }}
                       title="信息确认" onOk={this.handleOk} onCancel={this.handleCancel}
                       footer={[
                        <Button key="back" type="ghost" size="large" onClick={this.handleCancel}>返回修改</Button>,
                        <Button key="submit" type="primary" size="large" loading={this.state.loading} onClick={this.handleOk}>
                          确定
                        </Button>,
                      ]}
                            >
                                <FormItem
                                    {...formItemLayout}
                                    label="申请人真实姓名"
                                    style={{marginBottom:'7px'}}
                                >
                                    <p className="ant-form-text">{this.state.data.userName}</p>
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="身份证号码"
                                    style={{marginBottom:'7px'}}
                                >
                                    <p className="ant-form-text">{this.state.data.IdCard}</p>
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="常用手机号码"
                                    style={{marginBottom:'7px'}}
                                >
                                    <p className="ant-form-text">{this.state.data.phoneNumber}</p>
                                </FormItem>
                </Modal>
            </div>

        );
    }
}

export default Form.create()(PersonalValidate);
