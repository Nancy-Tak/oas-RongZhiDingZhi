import React, {
    Component,
    PropTypes
} from 'react';

// antd 组件
import {
    Form,
    Input,
    Select,
    Radio,
    Row,
    Col
} from 'antd';
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const Option = Select.Option;

//	业务组件
import OffLinePayTable from '../components/offlinePayTable';

//  引入fetch
import {
    fetch
} from 'UTILS';

class Account extends Component {
    static propTypes = {
        className: PropTypes.string
    };

    constructor(props) {
        super(props);
        this.state = {
            data: {
                provinces: [],
                cities: [],
                bankList: [],
                cityPlaceHolder: "请先选择省份",
                cityDisabled: true,
                branchDisabled: true,
                branchPlaceHolder: "请先选择开户行和所在城市",
                branches: [],
                validateType: 'OffLinePayAuth',
                map: {
                    bank: {},
                    province: {},
                    city: {},
                    branch: {}
                }
            }
        }
    }

    componentDidMount() {
        this.loadData(this.dataRender.bind(this));
    }

    loadData(callBack) {
        let me = this;
        let data = me.state.data;
        //  银行列表信息
        let p1 = fetch('/bank/banklist.do');
        //  省份列表信息
        let p2 = fetch('/bank/provinces.do');

        Promise.all([p1, p2]).then(res => {
            // console.log(res);
            data.bankList = res[0].data;
            // console.log(data.bankList);

            data.provinces = res[1].data;
            // console.log(data.provinces);
            //  配置映射表
            data.bankList.map((item, index) => {
                data.map.bank[item.B_BankID] = item.BankName;
            });
            data.provinces.map((item, index) => {
                data.map.province[item.B_BankAreaID] = item.AreaName;
            });

            me.setState({
                data: data
            });

            callBack && callBack();
        }).catch(err => {
            throw err;
        });
    }

    dataRender() {
        let me = this;
        let data = me.state.data;
        if (!me.props.isGetInfo) {
            return false;
        }
        // const time = new Date().getTime();
        //  获取企业对公账户信息
        fetch(`/companyVerification/getBankAccountInfo.do`).then(res => {
            if (res.code == 200) {
                //  提交成功TODO
                let fieldsValue = res.data;
                if (!fieldsValue) {
                    return false;
                }
                //  开户行处理
                if (fieldsValue.bankId) {
                    //  存在开户行时TODO
                    data.bankId = fieldsValue.bankId;
                }

                //  所在省份处理
                if (fieldsValue.provinceId) {
                    data.provinceId = fieldsValue.provinceId;
                    data.cityPlaceHolder = "请选择城市";
                    data.cityDisabled = false;
                    let param = {
                        data: {
                            provinceId: fieldsValue.provinceId
                        }
                    }
                    if (fieldsValue.cityId) {
                        //  存在城市时TODO
                        data.cityId = fieldsValue.cityId;
                    }
                    me.getCityList(param);
                }

                //  分支行处理
                me._getBranch(true);

                me.setState({
                    data
                });
                me.props.form.setFieldsValue(fieldsValue);
            }
        });

    }

    //  获取城市列表
    getCityList(param) {
        // param : {
        //     data : {
        //         provinceId : {provinceId}   string
        //     },
        //     callBack : {callBack}     function
        // }
        let me = this;
        let data = me.state.data;
        fetch('/bank/citys.do', {
            body: param.data
        }).then(res => {
            if (res.code == 200) {
                data.cities = res.data;
                //  配置映射表
                data.cities.map((item, index) => {
                    data.map.city[item.B_BankAreaID] = item.AreaName;
                });
                param.callBack && param.callBack();

                me.setState({
                    data: data
                });
            }
        });
    }

    onCardNoChange(e, value) {
        let me = this;
        let data = me.state.data;
        let cardNo = value ? value : e.target.value;
        if (cardNo.length < 5) {
            return false;
        } //  输入银行账号长度大于4才去请求匹配开户行
        fetch('/bank/cardNumber.do', {
            body: {
                "cardNumber": cardNo
            }
        }, false).then(res => {
            if (res.code == 200 && res.data && res.data.B_BankID) {
                let bankId = res.data.B_BankID;
                if (data.bankId == bankId) {
                    //  如果返回的bankId没有改变,不进行任何操作
                    return false;
                }
                data.bankId = bankId;
                me.setState({
                    data: data
                });
                me.props.form.setFieldsValue({
                    bankId: bankId,
                    branchBankId: undefined
                });
            }
        });
    }

    onProvinceChange(value) {
        let me = this;
        let data = me.state.data;
        if (data.provinceId == value) {
            //  如果省份Id没有改变，不执行任何操作
            return false;
        }
        let callBack = function() {
            data.cityId = undefined;
            data.cityPlaceHolder = "请选择城市";
            data.cityDisabled = false;
            data.branchPlaceHolder = "请先选择开户行和所在城市";
            data.branchDisabled = true;
            // 配置映射表
            data.cities.map((item, index) => {
                data.map.city[item.B_BankAreaID] = item.AreaName;
            });
            me.props.form.setFieldsValue({
                cityId: undefined,
                branchBankId: undefined
            });
        }
        let param = {
            data: {
                provinceId: value
            },
            callBack: callBack
        }
        me.getCityList(param);
    }

    onBankChange(value) {
        let data = this.state.data;
        if (data.bankId == value) {
            return false;
        }
        data.bankId = value;
        // console.log(data);
        this._getBranch();
    }

    onCityChange(value) {
        let data = this.state.data;
        if (data.cityId == value) {
            return false;
        }
        data.cityId = value;
        this._getBranch();
    }

    _getBranch(isRender) {
        let me = this;
        let data = me.state.data;
        // console.log(data);
        if (data.bankId && data.cityId) {
            fetch('/bank/branchlist.do', {
                body: {
                    "bankId": data.bankId,
                    "cityId": data.cityId
                }
            }).then(res => {
                if (res.code == 200) {
                    data.branches = res.data;
                    data.branchPlaceHolder = "请选择分支行";
                    data.branchDisabled = false;

                    //  配置映射表
                    data.branches.map((item, index) => {
                        data.map.branch[item.BranchBankCode] = item.BranchBankName;
                    });
                    me.setState({
                        data: data
                    });
                    if (!isRender) {
                        //  不是初始化Render
                        me.props.form.setFieldsValue({
                            branchBankId: undefined
                        });
                    }
                }
            });
        }
    }

    onValidateTypeChange(e) {
        console.log('radio checked', e.target.value);
        let data = this.state.data;
        if (data.validateType === e.target.value) {
            return false;
        }
        data.validateType = e.target.value;
        this.setState({
            data: data
        });
    }

    render() {

        const formItemLayout = {
            labelCol: {
                span: 8
            },
            wrapperCol: {
                span: 12
            },
        };

        const {
            getFieldProps,
            rules
        } = this.props;

        return (
            <div>
            	{/*填写企业对公账户*/}
                <div className="form-title fn-mb-30" style={{borderTop:'1px solid #e8e8e8'}}>
                    填写企业对公账户
                </div>

                <FormItem
                  {...formItemLayout}
                  label="账户名称"
                >
                  <p className="ant-form-text" id="userName" name="userName">{ this.props.companyName }</p>
                </FormItem>

                <FormItem
                    label="银行账号"
                    {...formItemLayout}
                    required
                >
                    <Input type="text" {...getFieldProps('cardNo',Object.assign({},rules.cardNo,{ onChange: this.onCardNoChange.bind(this) }))} placeholder="请输入银行账号" disabled = { this.props.accountDisabled }/>
                </FormItem>

                <FormItem
                  label="开户行"
                  {...formItemLayout}
                  required
                >
                  <Select showSearch optionFilterProp="children" notFoundContent="无法找到" {...getFieldProps('bankId',Object.assign({},rules.bankId,{ onChange: this.onBankChange.bind(this) }))} size="large" placeholder="请选择开户行" disabled = { this.props.accountDisabled }>
                    { this.state.data.bankList.map( (item,index) => {
                        return (
                            <Option value={item.B_BankID} key={index}>{item.BankName}</Option>
                        );
                    })}
                  </Select>
                </FormItem>

                <FormItem
                  {...formItemLayout}
                  label="所在省份"
                  required
                >
                    <Select showSearch optionFilterProp="children" notFoundContent="无法找到" placeholder="请选择省份" {...getFieldProps('provinceId',Object.assign({},rules.provinceId,{ onChange: this.onProvinceChange.bind(this) }))} disabled = { this.props.accountDisabled }>
                        { this.state.data.provinces.map( (item,index) => {
                            return (
                                <Option value={item.B_BankAreaID} key={index}>{item.AreaName}</Option>
                            );
                        })}
                    </Select>
                </FormItem>

                <FormItem
                  {...formItemLayout}
                  label="所在城市"
                  required
                >
                    <Select showSearch optionFilterProp="children" notFoundContent="无法找到" placeholder={ this.state.data.cityPlaceHolder } {...getFieldProps('cityId',Object.assign({},rules.cityId,{ onChange: this.onCityChange.bind(this) }))} disabled={ this.props.accountDisabled || this.state.data.cityDisabled }>
                        { this.state.data.cities.map( (item,index) => {
                            return (
                                <Option value={item.B_BankAreaID} key={index}>{item.AreaName}</Option>
                            );
                        })}
                    </Select>
                </FormItem>

                <FormItem
                  label="分支行"
                  {...formItemLayout}
                  required
                >
                  <Select showSearch optionFilterProp="children" notFoundContent="无法找到" {...getFieldProps('branchBankId',rules.branchBankId)} placeholder={ this.state.data.branchPlaceHolder } disabled = { this.props.accountDisabled || this.state.data.branchDisabled } >
                    { this.state.data.branches.map( (item,index) => {
                        return (
                            <Option value={ item.BranchBankCode } key={ index }>{ item.BranchBankName }</Option>
                        );
                    }) }
                  </Select>
                </FormItem>

                <div className="form-title fn-mb-30" style={{borderTop:'1px solid #e8e8e8'}}>
                    对公账户验证
                </div>

                <FormItem
                    {...formItemLayout}
                    label="请选择验证方式"
                    required
                >
                    <RadioGroup {...getFieldProps('validateType',{ initialValue: this.state.data.validateType , onChange : this.onValidateTypeChange.bind(this)})} disabled = { this.props.accountDisabled }>
                        <Radio value="OffLinePayAuth">线下支付小额验证金核验</Radio>
                        <Radio value="OffLineSubmitInfo">线下提交账户资料核验</Radio>
                    </RadioGroup>

                </FormItem>

                <Row>
                    <Col offset={1} span={22} className="fn-pa-20" style={{border:'1px solid #e8e8e8'}}>
                        <Row style={{display:this.state.data.validateType == 'OffLinePayAuth' ? 'block' : 'none'}}>
                            <Col offset={1} span={22}>
                                <OffLinePayTable />
                            </Col>
                        </Row>
                        <Row style={{display:this.state.data.validateType == 'OffLineSubmitInfo' ? 'block' : 'none'}}>
                            <Col offset={1} span={22}>
                                <p>需要您提供对公账户的相关资料，具体请联系核心企业或企业合作分行。</p>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Account;