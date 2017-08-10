/**
 * 企业核身step2
 * limit
 */
// react 相关库
import React from 'react';
import ReactDOM from 'react-dom';

import {
    Link
} from 'react-router';

// antd 组件
import {
    Form,
    Button,
    Icon,
    Steps,
    Row,
    Col,
    message
} from 'antd';
const createForm = Form.create;
const Step = Steps.Step;
const FormItem = Form.Item;
// 页面组件
import Frame from 'COM/form/frame';

//  业务组件
import OffLinePayTable from '../components/offlinePayTable';

//  引入fetch
import {
    fetch
} from 'UTILS';

//  引入moment
import moment from 'moment';

const map = {
    companyPaperType: {
        2: "普通营业执照",
        3: "多证合一营业执照"
    },
    validateType: {
        "OffLinePayAuth": "线下支付小额验证金核验",
        "OffLineSubmitInfo": "线下提交账户资料核验"
    }
}

// 页面组件（导出）
class CompanyValidate extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            data: {
                companyInfo: {
                    commonDisplay: "none",
                    multipleDisplay: "none",
                    companyName: "",
                    companyPaperType: "",
                    registrationPaperNo: "",
                    registrationExtendField2: "",
                    orgInsCodePaperNo: "",
                    socialCreditPaperNo: ""
                },
                companyConnectorInfoDto: {
                    clientDisplay: "block",
                    writerType: 1,
                    client: {
                        name: "",
                        mobile: "",
                        email: ""
                    },
                    corperator: {
                        name: "",
                        mobile: "",
                        email: ""
                    }
                },
                bankAccountInfo: {
                    "payDisplay": "block",
                    "submitDisplay": "none",
                    "accountName": "",
                    "cardNo": "",
                    "bankName": "",
                    "provinceName": "",
                    "cityName": "",
                    "branchBankName": "",
                    "validateType": "",
                    "payAmount": 0
                }
            },
        }

    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        let me = this;
        let data = me.state.data;
        // const time = new Date().getTime();
        //  身份实名认证
        let p1 = fetch(`/companyVerification/getCompanyInfo.do`);
        //  企业对公账户认证
        let p2 = fetch(`/companyVerification/getConnectorInfo.do`);
        //  企业资料补充
        let p3 = fetch(`/companyVerification/getBankAccountInfo.do`);

        Promise.all([p1, p2, p3]).then(res => {
            // console.log(res);

            //  企业信息处理
            let companyInfo = res[0].data;
            companyInfo.commonDisplay = "block";
            companyInfo.multipleDisplay = "none";
            if (companyInfo.companyPaperType == 3) {
                //  多证合一营业执照TODO
                companyInfo.commonDisplay = "none";
                companyInfo.multipleDisplay = "block";
            }
            companyInfo.companyPaperType = map.companyPaperType[companyInfo.companyPaperType];
            //  营业执照到期日处理
            if (companyInfo.registrationExtendField2 != "长期") {
                companyInfo.registrationExtendField2 = moment(companyInfo.registrationExtendField2).format("YYYY-MM-DD");
            }
            data.companyInfo = companyInfo;

            //  关系人信息处理
            let companyConnectorInfoDto = res[1].data;

            companyConnectorInfoDto.clientDisplay = "block";
            if (companyConnectorInfoDto.writerType == 2) {
                //  填写人为法定代表人TODO
                companyConnectorInfoDto.clientDisplay = "none";
            }
            data.companyConnectorInfoDto = companyConnectorInfoDto;

            // 企业对公账户信息处理
            let bankAccountInfo = res[2].data;
            bankAccountInfo.payDisplay = "block";
            bankAccountInfo.submitDisplay = "none";
            if (bankAccountInfo.validateType == "OffLineSubmitInfo") {
                bankAccountInfo.payDisplay = "none";
                bankAccountInfo.submitDisplay = "block";
            }
            bankAccountInfo.validateType = map.validateType[bankAccountInfo.validateType];
            data.bankAccountInfo = bankAccountInfo;

            me.setState({
                data: data
            });
        }).catch(err => {
            throw err;
        });
    }

    next() {
        fetch('/companyVerification/confirmBasicInfo.do', {
            body: {}
        }).then(res => {
            if (res.code == 200) {
                //  提交成功TODO
                this.props.history.push('/companyValidate/step3');
            }
        });
    }

    goBack() {
        this.props.history.push('/companyValidate/step1?getInfo=1');
    }

    render() {
        let data = this.state.data;

        const formItemLayout = {
            labelCol: {
                span: 8
            },
            wrapperCol: {
                span: 12
            },
        };

        return (
            <div>
                <Steps size="default" current={1} className="fn-mb-30">
                    <Step title="填写基本信息" />
                    <Step title="实名认证" />
                    <Step title="企业安全验证" />
                    <Step title="提交结果" />
                </Steps>
                <Frame title="企业信息" small="（请务必和证件上的资料保持一致）" className="abc">
                    <Form horizontal className="fn-mt-30">
                        {/*企业信息*/}
                        <FormItemDefault label="企业名称" formItemLayout={formItemLayout} text={data.companyInfo.companyName}></FormItemDefault>

                        <FormItemDefault label="营业执照类型" formItemLayout={formItemLayout} text={data.companyInfo.companyPaperType}></FormItemDefault>

                        <FormItemDefault label="营业执照注册号" formItemLayout={formItemLayout} text={data.companyInfo.registrationPaperNo} display={ data.companyInfo.commonDisplay }></FormItemDefault>

                        <FormItemDefault label="统一社会信用代码" formItemLayout={formItemLayout} text={data.companyInfo.socialCreditPaperNo} display={ data.companyInfo.multipleDisplay }></FormItemDefault>

                        <FormItemDefault label="营业执照到期日" formItemLayout={formItemLayout} text={data.companyInfo.registrationExtendField2}></FormItemDefault>

                        <FormItemDefault label="组织机构代码" formItemLayout={formItemLayout} text={data.companyInfo.orgInsCodePaperNo} display={ data.companyInfo.commonDisplay }></FormItemDefault>

                        <div className="form-title fn-mb-30" style={{borderTop:'1px solid #e8e8e8'}}>
                            填写人信息
                            <small className="viceText-FontColor"> (请务必与授权书的资料保持一致。)</small>
                        </div>

                        <FormItemDefault label="代理人姓名" formItemLayout={formItemLayout} text={data.companyConnectorInfoDto.client.name} display={ data.companyConnectorInfoDto.clientDisplay }></FormItemDefault>

                        <FormItemDefault label="代理人手机号码" formItemLayout={formItemLayout} text={data.companyConnectorInfoDto.client.mobile} display={ data.companyConnectorInfoDto.clientDisplay }></FormItemDefault>

                        <FormItemDefault label="代理人联系邮箱" formItemLayout={formItemLayout} text={data.companyConnectorInfoDto.client.email} display={ data.companyConnectorInfoDto.clientDisplay }></FormItemDefault>

                        <FormItemDefault label="法定代表人姓名" formItemLayout={formItemLayout} text={data.companyConnectorInfoDto.corperator.name}></FormItemDefault>

                        <FormItemDefault label="法定代表人手机号码" formItemLayout={formItemLayout} text={data.companyConnectorInfoDto.corperator.mobile}></FormItemDefault>

                        <FormItemDefault label="法定代表人联系邮箱" formItemLayout={formItemLayout} text={data.companyConnectorInfoDto.corperator.email}></FormItemDefault>

                        <div className="form-title fn-mb-30" style={{borderTop:'1px solid #e8e8e8'}}>
                            企业对公账户
                            <small className="viceText-FontColor"> (请务必与授权书的资料保持一致。)</small>
                        </div>

                        <FormItemDefault label="账户名称" formItemLayout={formItemLayout} text={data.bankAccountInfo.accountName}></FormItemDefault>

                        <FormItemDefault label="银行账号" formItemLayout={formItemLayout} text={data.bankAccountInfo.cardNo}></FormItemDefault>

                        <FormItemDefault label="开户行" formItemLayout={formItemLayout} text={data.bankAccountInfo.bankName}></FormItemDefault>

                        <FormItemDefault label="所在省市" formItemLayout={formItemLayout} text={data.bankAccountInfo.provinceName + data.bankAccountInfo.cityName}></FormItemDefault>

                        <FormItemDefault label="分支行" formItemLayout={formItemLayout} text={data.bankAccountInfo.branchBankName}></FormItemDefault>

                        <FormItemDefault label="对公账户验证方式" formItemLayout={formItemLayout} text={data.bankAccountInfo.validateType}></FormItemDefault>

                        <Row style={ { display : data.bankAccountInfo.payDisplay } }>
                            <Col offset={1} span={22}>
                                <OffLinePayTable />
                            </Col>
                        </Row>

                        <Row style={ { display : data.bankAccountInfo.submitDisplay } }>
                            <Col offset={1} span={23}>
                                需要您提供对公账户的相关资料，具体请联系核心企业或企业合作分行。
                            </Col>
                        </Row>

                        <Row className="fn-mt-30">
                            <Col span="12" offset="6" className="text-align-center">
                                <Button type="primary" onClick={ this.next.bind(this) }>下一步</Button>
                                <Button type="ghost" onClick={ this.goBack.bind(this) } className="fn-ml-20">信息有误，返回修改</Button>
                            </Col>
                        </Row>

                    </Form>
                </Frame>
            </div>

        );
    }
}

// 私有组件
class FormItemDefault extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            display: this.props.display ? this.props.display : "block"
        }
    }

    componentWillReceiveProps(nextProps) {
        //  获取是否展示状态
        let display = nextProps.display ? nextProps.display : "block";
        //  如果没有text则固定
        display = nextProps.text ? display : 'none';

        this.setState({
            display: display
        });
    }

    render() {
        return (
            <FormItem
                label={this.props.label}
                {...this.props.formItemLayout}
                style={ { display : this.state.display } }
            >
                <p className="ant-form-text">{this.props.text}</p>
            </FormItem>
        )
    }
}

export default createForm()(CompanyValidate);