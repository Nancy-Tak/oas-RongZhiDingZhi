import React, {
    Component,
    PropTypes
} from 'react';

import {
    Link
} from 'react-router';
// antd 组件
import {
    Form,
    Input,
    Button,
    Radio,
    Row,
    Col,
    Modal
} from 'antd';

const createForm = Form.create;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;

// 页面组件
import Frame from 'COM/form/frame';
//  业务组件
import ComfirmContent from '../components/comfirmContent';
//  表单验证配置
import formValidation from '../components/formValidation';

//  引入fetch
import {
    fetch,
    helper
} from 'UTILS';

class EditRealName extends Component {
    static propTypes = {
        className: PropTypes.string,
    };

    constructor(props) {
        super(props);
        this.state = {
            display: "block",
            data: {
                writerType: '1',
                original: {}
            }
        }
    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        let me = this;
        let data = me.state.data;
        fetch('/companyVerification/getConnectorInfo.do').then(res => {
            // console.log(res);
            let renderData = {};
            let companyConnectorInfoDto = data.original = res.data;

            //  处理保存的原始数据(用于修改对比)
            data.original.writerType = data.original.writerType.toString();
            data.original.client.mobile = data.original.client.mobile.toString();
            data.original.corperator.mobile = data.original.corperator.mobile.toString();

            data.writerType = companyConnectorInfoDto.writerType.toString();
            let display = "block";
            if (data.writerType == "2") {
                //  法定代表人
                display = "none";
            }

            for (let prop in companyConnectorInfoDto.client) {
                renderData[prop] = prop == "mobile" ? companyConnectorInfoDto.client[prop].toString() : companyConnectorInfoDto.client[prop];
            }
            for (let prop in companyConnectorInfoDto.corperator) {
                renderData["corporation" + me._firstUpperCase(prop)] = prop == "mobile" ? companyConnectorInfoDto.corperator[prop].toString() : companyConnectorInfoDto.corperator[prop];
            }

            me.setState({
                display: display,
                data: data
            });

            me.props.form.setFieldsValue(renderData);
        });
    }

    _firstUpperCase(name) {
        let nameArr = name.split("");
        nameArr[0] = nameArr[0].toLocaleUpperCase();
        return nameArr.join("");
    }

    onWriterTypeChange(e) {
        console.log('radio checked', e.target.value);
        let display = e.target.value == "1" ? "block" : "none";
        if (this.state.display == display) {
            return false;
        }
        if (e.target.value == "2") {
            this.warning();
        }
        this.setState({
            display: display
        });
    }

    warning() {
        Modal.warning({
            title: '提示',
            content: '您将以法定代表人身份作为该企业账号的全权委托代理人，日后使用该账号发起的融资申请必须由法定代表人本人操作。',
        });
    }

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
                me.submit(submitData);
            }
        });
    }

    //  确定窗口数据渲染
    getConfirmContent(submitData) {
        // console.log(submitData);
        let me = this;
        let companyConnectorInfoDto = submitData;
        let client = companyConnectorInfoDto.client;
        let corperator = companyConnectorInfoDto.corperator;
        let kvp = Object.assign({}, client);
        if (submitData.writerType == 1) {
            //  委托代理人TODO
            for (let prop in corperator) {
                kvp["corporation" + me._firstUpperCase(prop)] = corperator[prop];
            }
        } else if (submitData.writerType == 2) {
            //  法定代表人TODO
            for (let prop in kvp) {
                kvp["corporation" + me._firstUpperCase(prop)] = kvp[prop];
                delete kvp[prop];
            }
        }
        let sort = ["corporationName", "corporationMobile", "corporationEmail", "name", "mobile", "email"];
        let map = {
            corporationName: "法定代表人姓名",
            corporationMobile: "法定代表人常用手机号码",
            corporationEmail: "法定代表人联系邮箱",
            name: "代理人姓名",
            mobile: "代理人常用手机号码",
            email: "代理人联系邮箱"
        }
        let data = {
            kvp,
            sort,
            map
        };
        return (
            <ComfirmContent data={data} type="realName" />
        )
    }

    submit(submitData) {
        console.log(submitData);
        let me = this;
        if (me._isObjectValueEqual(submitData, this.state.data.original)) {
            //  没有修改任何信息
            me.props.history.push('/companyValidate/tips/check');
            return false;
        }
        fetch('/companyVerification/modifyConnectorInfo.do', {
            body: submitData,
        }).then(res => {
            //  修改完成TODO
            if (res.data == 201 || res.data == 202) {
                // 201或202-代表有修改跳转至提交结果页
                me.props.history.push('/companyValidate/result');
            } else if (!res.data) {
                // 空则跳转至审核不通过提示页(弹窗确认)
                me.tipsShow();
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

    _getSubmitData(data) {
        let submitData = data;
        // 填写人类型
        let client = client = {
            name: submitData.name,
            mobile: submitData.mobile,
            email: submitData.email
        };
        let corperator = {
            name: submitData.corporationName,
            mobile: submitData.corporationMobile.toString(),
            email: submitData.corporationEmail
        };
        let companyConnectorInfoDto = {
            writerType: submitData.writerType,
            client: client,
            corperator: corperator
        }

        delete submitData.writerType;
        delete submitData.name;
        delete submitData.mobile;
        delete submitData.email;
        delete submitData.corporationName;
        delete submitData.corporationMobile;
        delete submitData.corporationEmail;

        submitData = companyConnectorInfoDto;

        return submitData;
    }

    //  判断两个对象是否相等
    _isObjectValueEqual(a, b) {
        let me = this;
        // Of course, we can do it use for in 
        // Create arrays of property names
        var aProps = Object.getOwnPropertyNames(a);
        var bProps = Object.getOwnPropertyNames(b);

        // If number of properties is different,
        // objects are not equivalent
        if (aProps.length != bProps.length) {
            return false;
        }

        let _isObject = (obj) => {
            return Object.prototype.toString.call(obj).match(/^\[object\s(.*)\]$/)[1].toLocaleLowerCase() == "object";
        }

        for (var i = 0; i < aProps.length; i++) {
            var propName = aProps[i];

            // If values of same property are not equal,
            // objects are not equivalent
            if (_isObject(a[propName])) {
                if (!me._isObjectValueEqual(a[propName], b[propName])) {
                    return false;
                }
            } else {
                if (a[propName] !== b[propName]) {
                    return false;
                }
            }

        }

        // If we made it this far, objects
        // are considered equivalent
        return true;
    }

    noEdit() {
        this.props.history.push('/companyValidate/tips/check');
    }

    render() {

        //  根据填写人身份选择验证机制
        const rulesFill = this.state.data.writerType == '1' ? formValidation.rulesAgent : {};

        // 根据不同类型选择验证机制
        const rules = Object.assign({}, formValidation.rulesBase, rulesFill);

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

        return (
            <Frame title="填写人信息" small="（请务必与授权书的资料保持一致。）">
                <Form horizontal className="fn-mt-30">

                	<FormItem
                        label="您的姓名"
                        {...formItemLayout}
                        required
                    >
                        <Input {...getFieldProps('name',rules.name)} type="text"/>
                    </FormItem>

                    <FormItem
                        label="常用手机号码"
                        {...formItemLayout}
                        extra="审核结果将通过短信发送至该手机 ，同时将作为此账号的绑定手机号码。"
                        required
                    >
                        <Input {...getFieldProps('mobile',rules.mobile)} type="text"/>
                    </FormItem>

                    <FormItem
                        label="联系邮箱"
                        {...formItemLayout}
                    >
                        <Input type="text" {...getFieldProps('email',rules.email)} />
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label=" 填写人的身份"
                        required
                    >
                        <RadioGroup {...getFieldProps('writerType',{ initialValue: this.state.data.writerType, onChange: this.onWriterTypeChange.bind(this) })}>
                            <Radio value="1">我是委托代理人</Radio>
                            <Radio value="2">我是法定代表人</Radio>
                        </RadioGroup>

                    </FormItem>

                    <div style={{display:this.state.display}}>
                        <div className="form-title fn-mb-30" style={{borderTop:'1px solid #e8e8e8'}}>
                            法定代表人信息
                            <small className="viceText-FontColor"> (请务必与法定代表人身份证明书、营业执照上的资料保持一致。)</small>
                        </div>

                        <FormItem
                            label="法定代表人姓名"
                            {...formItemLayout}
                            required
                        >
                            <Input {...getFieldProps('corporationName',rules.corporationName)} type="text" />
                        </FormItem>

                        <FormItem
                            label="常用手机号码"
                            {...formItemLayout}
                        >
                            <Input {...getFieldProps('corporationMobile',rules.corporationMobile )} type="text" />
                        </FormItem>

                        <FormItem
                            label="联系邮箱"
                            {...formItemLayout}
                        >
                            <Input {...getFieldProps('corporationEmail',rules.corporationEmail)} type="text" />
                        </FormItem>
                    </div>

                    <Row className="fn-mt-30">
                        <Col span="12" offset="6" className="text-align-center">
                            <Button type="primary" onClick={ this.next.bind(this) }>下一步</Button>
                            <Button type="ghost" onClick={ this.noEdit.bind(this) } className="fn-ml-20">暂不修改</Button>
                        </Col>
                    </Row>

                </Form>
            </Frame>
        );
    }
}

export default createForm()(EditRealName);