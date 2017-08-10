/**
 * 个人核身step3
 * yongquan.wu
 */
// react 相关库
import React from 'react';
import ReactDOM from 'react-dom';
// 自定义验证 rule
import {
    ruleType,
    fetch,
    helper
} from 'UTILS';
// 页面组件
import Frame from 'COM/form/frame';
import AgreementModal from 'COM/agreementModal/index';

// antd 组件
import {
    Button,
    Form,
    Input,
    Checkbox,
    Steps,
    Row,
    Col,
    message
} from 'antd';
import classNames from 'classnames';
const createForm = Form.create;
const FormItem = Form.Item;
const Step = Steps.Step;

class PersonalValidate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            agreementModalVisible: false,
            agreementModalName: '',
            submitDis: true,
            protocolData: {}
        };
    }


    handleSubmit() {
        this.props.form.validateFields((errors, values) => {
            if (!errors) {
                let data = {
                    "system": "1",
                };
                data.pfxPassword = values.rePassword;
                data.protocolId = this.state.protocolData.id;
                data.protocolVersion = this.state.protocolData.protocolEdition;
                data.protocolName = this.state.protocolData.protocolName;
                console.log('Submit!!!', data);

                fetch('/personVerification/saveTransactionPassword.do', {
                    body: data
                }).then((res) => {
                    this.props.history.push({
                        pathname: 'personalValidate/step4'
                    });
                }, (res) => {
                    if (res.fieldName) {
                        const {
                            form
                        } = this.props;
                        if (res.fieldName == 'pfxPassword') {
                            helper.focusError(form, 'password', res.message);
                        } else {
                            helper.focusError(form, res.fieldName, res.message);
                        }
                    }
                });
            }


        });
    }

    noop(event) {
        return event.preventDefault();
    }

    checkPassWordAgain(rule, value, callback) {
        const {
            getFieldValue
        } = this.props.form;
        if (value && value !== getFieldValue('password')) {
            callback('两次所填写的密码不一致，请重新输入');
        } else {
            callback();
        }
    }

    onPassWordBlur(e) {
        const value = e.target.value;
        const {
            validateFields,
            getFieldError
        } = this.props.form;
        console.log('pwd:', getFieldError('password'));
        if (value && !getFieldError('password')) {
            validateFields(['rePassword'], {
                force: true
            });
        }
    }

    validateAgreement(rule, value, callback) {
        console.log('请阅读并同意协议:', value);
        if (value == 'false') {
            callback('请阅读并同意协议')
        } else {
            callback();
        }
    }

    /*协议*/
    openAgreementModal() {

        this.setState({
            agreementModalVisible: true,
        });
    }
    hideAgreementModal() {
        this.setState({
            agreementModalVisible: false
        });
    }
    handleAgreement() {

        this.setState({
            agreementModalVisible: false,
        });
    }
    agreementCheck(e) {
        this.setState({
            submitDis: !e.target.checked,
        });
    }
    handleAgreementonOK() {
            this.setState({
                agreementModalVisible: false,
                submitDis: false
            });
        }
        /*协议 end*/

    agreementCheck(e) {
        this.setState({
            submitDis: !e.target.checked
        });
    }

    componentDidMount() {
        this.initPage();
    }

    initPage() {
        //获取此页面需要签署的协议
        fetch('/common/getCurrentProtocol.do', {
            body: {
                "protocolType": 2
            }
        }).then((res) => {
            console.log('获取协议成功：', res.data);
            this.setState({
                protocolData: res.data,
            });
        }, (res) => {
            // alert('获取协议失败，请重新获取！');

        })
    }

    render() {
        const {
            getFieldProps
        } = this.props.form;
        // 表单校验
        const rules = {
            password: {
                rules: [{
                        required: true,
                        message: '密码不能为空'
                    }, {
                        min: 8,
                        max: 20,
                        message: '请输入8-20位字符'
                    },
                    ruleType('password')
                ]
            },
            rePassword: {
                rules: [{
                    required: true,
                    message: '请再次输入密码'
                }, {
                    validator: this.checkPassWordAgain.bind(this)
                }]
            },
        };
        const formItemLayout = {
            labelCol: {
                span: 8
            },
            wrapperCol: {
                span: 10
            },
        };
        return (
            <div>
                <Steps size="default" current={2} className="fn-mb-30">
                    <Step title="填写基本信息" />
                    <Step title="实名认证" />
                    <Step title="设置交易密码" />
                    <Step title="提交结果" />
                </Steps>
                <Frame title="设置交易密码" small="（用于对融资申请、修改账号信息等操作，请勿与登录密码一致）">
                    <div>
                        <Form horizontal className="fn-mt-30">
                            <FormItem
                                {...formItemLayout}
                                label="设置交易密码"
                                required
                            >
                                <Input type="password" {...getFieldProps('password', rules.password)} onBlur={this.onPassWordBlur.bind(this)} autoComplete="off"  onPaste={this.noop.bind(this)} onCopy={this.noop.bind(this)} onCut={this.noop.bind(this)} placeholder={helper.isIEbrowser() ? '' : "8-20位英文字母、数字或符号的组合，字母区分大小写"} />
                            </FormItem>

                            <FormItem
                                {...formItemLayout}
                                label="确认交易密码"
                                required
                            >
                                <Input {...getFieldProps('rePassword', rules.rePassword)} type="password" autoComplete="off"  onPaste={this.noop.bind(this)} onCopy={this.noop.bind(this)} onCut={this.noop.bind(this)} />
                            </FormItem>

                            <Row>
                                <Col span="24">
                                    <Col span="12" offset="8">
                                    {/*<Checkbox onChange={this.agreementCheck.bind(this)}>我已阅读并同意
                                                <a href="javascript:void(0)" onClick={this.openAgreementModal.bind(this,this.state.protocolData.protocolName)}>{this.state.protocolData.protocolName}</a>
                                        </Checkbox>
                                         */}
                                        <AgreementModal
                                            visible={ this.state.agreementModalVisible }
                                            onOk={this.handleAgreementonOK.bind(this)}
                                            onCancel={this.hideAgreementModal.bind(this)}
                                            iframeData={{
                                                iframeSrc:this.state.protocolData.fileUrl,
                                                name:this.state.protocolData.protocolName
                                            }}
                                        >
                                            <Checkbox
                                                checked={!this.state.submitDis}
                                                onChange={this.agreementCheck.bind(this)}
                                                >
                                                我已阅读并同意
                                            </Checkbox>
                                            <a href="javascript:void(0)" onClick={this.openAgreementModal.bind(this)}>
                                                {this.state.protocolData.protocolName}
                                            </a>
                                        </AgreementModal>
                                    </Col>
                                </Col>
                            </Row>
                            <Row className="fn-mt-30">
                                <Col span="24">
                                    <Col span="12" offset="8">
                                        <Button type="primary" size="large" disabled={this.state.submitDis} onClick={this.handleSubmit.bind(this)}>提交</Button>
                                    </Col>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </Frame>
            </div>
        )
    }
}


export default createForm()(PersonalValidate);