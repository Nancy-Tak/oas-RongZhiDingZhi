/**
 * 修改企业基本信息
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
    Input,
    Select,
    Button,
    Upload,
    Icon,
    Steps,
    Radio,
    DatePicker,
    Checkbox,
    Row,
    Col,
    Modal,
    message
} from 'antd';
const createForm = Form.create;
const Step = Steps.Step;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const Option = Select.Option;
//  表单验证配置
import formValidation from '../components/formValidation';
// 自定义验证 rule
import ruleType from 'UTILS/ruleType';
// 页面组件
import Frame from 'COM/form/frame';

//  业务组件
import OffLinePayTable from '../components/offlinePayTable';
import ComfirmContent from '../components/comfirmContent';
import Account from '../components/accountComponent';

//  引入fetch
import {
    fetch,
    helper
} from 'UTILS';

//  引入moment
import moment from 'moment';

const propsMap = {
    companyName: "企业名称",
    companyPaperType: "证件类型",
    registrationPaperNo: "营业执照号",
    registrationExtendField2: "证件到期日",
    orgInsCodePaperNo: "组织机构代码",
    socialCreditPaperNo: "社会信用证代码",
    accountName: "账户名称",
    cardNo: "银行卡号",
    bankId: "开户行ID",
    bankName: "开户行名称",
    provinceId: "省份ID",
    provinceName: "省份名称",
    cityId: "城市ID",
    cityName: "城市名称",
    branchBankId: "分支行ID",
    branchBankName: "分支行名称",
    validateType: "对公账户验证方式",
}

const companyPaperTypeMap = {
    2: "普通营业执照",
    3: "多证合一营业执照"
}

const validateTypeMap = {
    OffLinePayAuth: "线下支付小额验证金核验",
    OffLineSubmitInfo: "线下提交账户资料核验"
}

//  全局状态
import State from 'PAGES/redirect/state';
const globalState = State.getState().data;

//  登录对接完成后去掉
// const globalState = {
//     userType : 2,
//     step : 999,                 //  0:未开始;1:第一步;2:第二步;3:第三步;4:第四步;999:完成;
//     bankCheckStatus : -1,       //  -1:审核中;0:审核不通过;1:审核通过
//     showName : "用户名称"
// }

// 页面组件（导出）
class CompanyValidate extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            loadingVisible: false,
            data: {
                isHasPassword: false,
                isChecking: globalState.bankCheckStatus == -1,
                accountDisabled: false,
                companyName: "",
                companyPaperType: "2",
                isLongEndTime: false,
                originalData: {},
                pfxPassword: ""
            }
        }

        this.onLongEndTimeChange = this.onLongEndTimeChange.bind(this);
    }

    componentDidMount() {
        this.loadData(this.dataRender.bind(this));
    }

    loadData(callBack) {
        let me = this;
        let data = me.state.data;

        fetch('/user/getUserCheckStatus.do').then(res => {
            let statusMap = helper.convertUserCheckStatus(res.data.checkItems);

            data.accountDisabled = statusMap.EnAccount.systemStatus == 1 ? true : false;

            console.log(data.accountDisabled);

            me.setState({
                data: data
            });

            callBack && callBack();
        });
    }

    dataRender() {
        let me = this;
        let data = me.state.data;
        //  企业信息
        let p1 = fetch('/companyVerification/getCompanyInfo.do');
        //  企业对公账户信息
        let p2 = fetch('/companyVerification/getBankAccountInfo.do');

        Promise.all([p1, p2]).then(res => {
            //  数据合并
            let renderData = Object.assign({}, res[0].data, res[1].data);
            data.originalData = Object.assign({}, renderData);
            // console.log(data.originalData);

            //  企业名称处理
            data.companyName = renderData.companyName;
            //  营业执照类型
            data.companyPaperType = renderData.companyPaperType;
            //  营业执照到期日
            if (renderData.registrationExtendField2 == "长期") {
                renderData.registrationExtendField2 = null;
                data.isLongEndTime = renderData.isLongEndTime = true;
            } else {
                renderData.registrationExtendField2 = moment(renderData.registrationExtendField2)._d;
            }

            //  证件号转字符串处理
            if (renderData.companyPaperType == 2) {
                renderData.registrationPaperNo = renderData.registrationPaperNo.toString();
                renderData.orgInsCodePaperNo = renderData.orgInsCodePaperNo.toString();
            } else {
                renderData.socialCreditPaperNo = renderData.socialCreditPaperNo.toString();
            }

            me.setState({
                data: data
            });

            me.props.form.setFieldsValue(renderData);
            // console.log(data);
            // console.log(renderData);
        }).catch(err => {
            throw err;
        });
    }

    //  弹窗的两个方法
    handleOk() {
        let me = this;
        // 表单校验
        this.props.form.validateFieldsAndScroll((errors, data) => {
            if (errors) {
                console.log(errors);
                console.log(data);
                return false;
            }
            console.log("passed");
            // console.log(data);
            // 验证通过TODO
            me.setState({
                visible: false
            });
            let submitData = me._getSubmitData(data);
            me.submit(submitData);
        });
    }

    handleCancel() {
        this.setState({
            visible: false
        });
    }

    onCompanyNameChange(e) {
        let data = this.state.data;
        data.companyName = e.target.value;
        this.setState({
            data: data
        });
    }

    handleLoadingCancel() {
        this.setState({
            loadingVisible: false
        })
    }

    tipsShow() {
        let me = this;
        Modal.success({
            title: '提示',
            content: '资料修改成功。',
            onOk() {
                me.props.history.push('/companyValidate/tips/check');
            },
        });
    }

    onCompanyPaperTypeChange(e) {
        console.log('radio checked', e.target.value);
        let data = this.state.data;
        data.companyPaperType = e.target.value;
        this.setState({
            data: data
        });
    }

    onLongEndTimeChange(e) {
        console.log('e:', e.target.checked);
        let data = this.state.data;
        data.isLongEndTime = e.target.checked;
        // if(e.target.checked){
        //     this.props.form.setFieldsValue({registrationExtendField2:""});
        // }
        this.setState({
            data: data
        });
        // console.log(data);
    }

    //  点击下一步
    next() {
        let me = this;
        // 表单校验
        this.props.form.validateFieldsAndScroll((errors, data) => {
            if (errors) {
                console.log(errors);
                console.log(data);
                return false;
            }
            console.log("passed");
            // console.log(data);
            // 验证通过TODO
            let submitData = me._getSubmitData(data);
            // me.submit(submitData);
            me.confirm(submitData);
        });
    }

    confirm(submitData) {
        let me = this;
        Modal.confirm({
            title: '信息确认',
            content: me.getConfirmContent(submitData),
            okText: '确定',
            cancelText: '取消',
            onOk() {
                // console.log('确定');
                // me.submit(submitData);
                me.compare(submitData);
            }
        });
    }

    //  对比校验
    compare(submitData) {
        let me = this;
        let data = me.state.data;
        let originalData = me.state.data.originalData;

        const getIsChange = (compareList, submitData, originalData) => {
            let isChange = false;
            compareList.map((prop, index) => {
                if (submitData[prop] != originalData[prop]) {
                    isChange = true;
                    return false;
                }
            });
            return isChange;
        }
        if (!data.isChecking) {
            //  审核不通过TODO
            const compareListMap = {
                basic: ["companyName", "companyPaperType"],
                common: ["registrationPaperNo", "orgInsCodePaperNo"],
                multiple: ["socialCreditPaperNo"]
            }
            let compareList = compareListMap.basic.concat(submitData.companyPaperType == 2 ? compareListMap.common : compareListMap.multiple);
            let isNeedPfxPassword = getIsChange(compareList, submitData, originalData);
            if (isNeedPfxPassword) {
                //  弹窗输入交易密码
                me.setState({
                    isHasPassword: true,
                    visible: true
                });
            } else {
                me.setState({
                    isHasPassword: false
                });
                let leftCompareList = ["registrationExtendField2", "accountName", "cardNo", "bankId", "provinceId", "cityId", "branchBankId", "validateType"];
                let isChange = getIsChange(leftCompareList, submitData, originalData);
                if (isChange) {
                    //  有更改
                    me.submit(submitData);
                } else {
                    //  所有资料都没有改变
                    me.props.history.push('/companyValidate/tips/check');
                }
            }
        } else {
            //  审核中
            let compareList = ["accountName", "cardNo", "bankId", "provinceId", "cityId", "branchBankId", "validateType"];
            let isNeedPost = getIsChange(compareList, submitData, originalData);
            if (isNeedPost) {
                //  对公账户信息及验证方式有变更TODO
                me.submit(submitData);
            } else {
                //  对公账户信息及验证方式无变更TODO
                // console.log("noChange")
                me.props.history.push('/companyValidate/tips/check');
            }
        }

    }

    //  确定窗口数据渲染
    getConfirmContent(submitData) {
        // console.log(submitData);
        const basic = ["companyName", "companyPaperType", "registrationExtendField2", "accountName", "cardNo", "bankName", "provinceName", "cityName", "branchBankName", "validateType"];
        const common = ["registrationPaperNo", "orgInsCodePaperNo"];
        const multiple = ["socialCreditPaperNo"];
        const props = basic.concat(submitData.companyPaperType == 2 ? common : multiple);
        let kvp = {};
        props.map((item, index) => {
            kvp[item] = submitData[item];
        });
        kvp.companyPaperType = companyPaperTypeMap[kvp.companyPaperType];
        kvp.validateType = validateTypeMap[kvp.validateType];
        let sort = ["companyName", "companyPaperType", "registrationPaperNo", "orgInsCodePaperNo", "socialCreditPaperNo", "registrationExtendField2", "accountName", "cardNo", "bankName", "provinceName", "cityName", "branchBankName", "validateType"];
        let map = propsMap;
        let data = {
            kvp: kvp,
            sort: sort,
            map: map
        }
        return (
            <ComfirmContent data={data} />
        );
    }

    submit(submitData) {
        console.log(submitData);
        let me = this;
        let data = me.state.data;
        if (data.isHasPassword) {
            me.setState({
                loadingVisible: true
            })
        }
        fetch('/companyVerification/modifyCompanyInfo.do', {
            body: submitData
        }).then(res => {
            if (res.code == 200) {
                //  提交成功TODO
                console.log('next finish');
                if (data.isHasPassword) {
                    //  交易密码提交TODO
                    // console.log("isHasPassword");
                    me.handleLoadingCancel();
                    me.tipsShow();
                } else {
                    me.props.history.push('/companyValidate/tips/check');
                }
            }
        }, (res) => {
            //  校验不通过TODO
            if (res.fieldName) {
                const {
                    form
                } = me.props;
                helper.focusError(form, res.fieldName, res.message);
            }
        });
    }

    //  获取提交数据
    _getSubmitData(data) {
        let map = this.refs.Account.state.data.map;
        let submitData = data;

        //  账户名称
        submitData.accountName = submitData.companyName;

        //  添加银行账户相关的名称
        submitData.bankName = map.bank[submitData.bankId];
        submitData.provinceName = map.province[submitData.provinceId];
        submitData.cityName = map.city[submitData.cityId];
        submitData.branchBankName = map.branch[submitData.branchBankId];

        // 证件类型
        if (submitData.companyPaperType == 2) {
            //  普通营业执照TODO
            delete submitData.socialCreditPaperNo;
        } else if (submitData.companyPaperType == 3) {
            //  社会信用证TODO
            delete submitData.registrationPaperNo;
            delete submitData.orgInsCodePaperNo;
        }

        //  营业执照到期日
        if (submitData.isLongEndTime) {
            submitData.registrationExtendField2 = "长期";
        } else {
            submitData.registrationExtendField2 = moment(submitData.registrationExtendField2).format('YYYY-MM-DD hh:mm:ss');
        }
        delete submitData.isLongEndTime;

        for (let prop in submitData) {
            if (submitData[prop] === undefined) {
                delete submitData[prop];
            }
        }

        return submitData;
    }

    noEdit() {
        this.props.history.push('/companyValidate/tips/check');
    }

    render() {
        // console.log("limit");
        // 表单校验

        // 根据营业执照类型类型选择验证机制
        const rulesBusiness = this.state.data.companyPaperType == 2 ? formValidation.rulesCommon : formValidation.rulesMultiple;

        // 根据不同类型选择验证机制
        let rules = Object.assign({}, formValidation.rulesBase, rulesBusiness);

        rules.pfxPassword = {
            rules: [{
                    required: true,
                    whitespace: true,
                    message: '交易密码不能为空'
                }, {
                    min: 8,
                    max: 20,
                    message: '请输入8-20位字符'
                },
                ruleType('password')
            ]
        }

        const formItemLayout = {
            labelCol: {
                span: 8
            },
            wrapperCol: {
                span: 12
            },
        };

        const {
            getFieldProps
        } = this.props.form;
        const displayTypeCommon = this.state.data.companyPaperType == 2 ? 'block' : 'none';
        const displayTypeMultiple = this.state.data.companyPaperType == 3 ? 'block' : 'none';

        let data = this.state.data;

        return (
            <Frame title="企业信息" small="（请务必和证件上的资料保持一致）">
                    {/*企业信息*/}
                    <Form horizontal className="fn-mt-30">
                        <FormItem
                            label="企业名称"
                            {...formItemLayout}
                            required
                        >
                           <Input {...getFieldProps('companyName',Object.assign({},rules.companyName,{ onChange : this.onCompanyNameChange.bind(this) }))} disabled = { data.isChecking || data.accountDisabled }/>
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label=" 营业执照类型"
                            required
                        >
                            <RadioGroup {...getFieldProps('companyPaperType',{ initialValue: this.state.data.companyPaperType,onChange: this.onCompanyPaperTypeChange.bind(this) })} disabled = { data.isChecking }>
                                <Radio value={2}>普通营业执照</Radio>
                                <Radio value={3}>多证合一营业执照</Radio>
                            </RadioGroup>

                        </FormItem>

                        <div style={{display:displayTypeCommon}}>
                            <FormItem
                                {...formItemLayout}
                                label="营业执照注册号"
                                required
                            >
                                <Input {...getFieldProps('registrationPaperNo',rules.registrationPaperNo)} type="text" disabled = { data.isChecking } />
                            </FormItem>
                        </div>

                        <div style={{display:displayTypeMultiple}}>
                            <FormItem
                                {...formItemLayout}
                                label="统一社会信用代码"
                                required
                            >
                                <Input {...getFieldProps('socialCreditPaperNo',rules.socialCreditPaperNo)} type="text" disabled = { data.isChecking } />
                            </FormItem>
                        </div>

                        <FormItem
                            {...formItemLayout}
                            label=" 营业执照到期日"
                            required
                        >
                            <Col span="8">
                                { this.state.data.isLongEndTime === true ?
                                    <FormItem validateStatus="success" help={null}>
                                        <DatePicker {...getFieldProps('registrationExtendField2')} disabled={ true }/>
                                    </FormItem>
                                    :
                                    <FormItem>
                                        <DatePicker {...getFieldProps('registrationExtendField2',rules.registrationExtendField2)} disabled = { data.isChecking }/>
                                    </FormItem>
                                }
                            </Col>
                            <Col span="5">
                                <Checkbox {...getFieldProps('isLongEndTime',{onChange:this.onLongEndTimeChange})} checked={ this.state.data.isLongEndTime } disabled = { data.isChecking } >长期</Checkbox>
                            </Col>
                        </FormItem>

                        <div style={{display:displayTypeCommon}}>
                            <FormItem
                                {...formItemLayout}
                                label="组织机构代码"
                                required
                            >
                                <Input {...getFieldProps('orgInsCodePaperNo',rules.orgInsCodePaperNo)} type="text" disabled = { data.isChecking } />
                            </FormItem>
                        </div>

                        <Account ref="Account" getFieldProps={ getFieldProps } accountDisabled = { this.state.data.accountDisabled } isGetInfo={ true } rules = { rules } form={ this.props.form } companyName = {this.state.data.companyName}/>

                        <Row className="fn-mt-30">
                            <Col span="12" offset="6" className="text-align-center">
                                <Button type="primary" onClick={ this.next.bind(this) }>下一步</Button>
                                <Button type="ghost" onClick={ this.noEdit.bind(this) } className="fn-ml-20">暂不修改</Button>
                            </Col>
                        </Row>
                    </Form>

                    <Modal ref="modal"
                      visible={this.state.visible}
                      title="提示" onOk={this.handleOk.bind(this)} onCancel={this.handleCancel.bind(this)}
                      footer={[
                        <Button key="back" type="ghost" size="large" onClick={this.handleCancel.bind(this)}>取 消</Button>,
                        <Button key="submit" type="primary" size="large" onClick={this.handleOk.bind(this)}>
                          确 定
                        </Button>,
                      ]}
                    >
                      <h4>由于您修改了企业信息，将为您重新申请数字证书。</h4>
                      <Form>
                        <FormItem
                            {...formItemLayout}
                            label="交易密码"
                            required
                            className="fn-mt-20"
                        >
                            {this.state.visible ? 
                                <Input {...getFieldProps('pfxPassword',rules.pfxPassword)} type="password" placeholder={helper.isIEbrowser() ? '' : '8-20位英文字母（区分大小写）、数字或符号的组合'}/>
                                :
                                ""
                            }
                        </FormItem>
                      </Form>
                    </Modal>

                    <Modal ref="modal"
                      visible={this.state.loadingVisible}
                      title="提示"
                      onCancel={this.handleLoadingCancel.bind(this)}
                      footer={null}
                    >
                      <Row className="fn-mtb-20">
                          <Col span="6" className="text-align-right">
                                <Icon type="loading" className="fs-36"/>
                          </Col>
                          <Col span="16" offset="2">
                                <h4>系统正在申请数字证书</h4>
                                <p className="viceText-FontColor">请勿关闭当前页面</p>
                          </Col>
                      </Row>
                    </Modal>

                </Frame>
        );
    }
}

export default createForm()(CompanyValidate);