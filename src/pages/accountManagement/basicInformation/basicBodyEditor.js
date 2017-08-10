// react 相关库
import React from 'react';
import {Link} from 'react-router';

//less
import './style.less'


// 页面组件
import Sms from 'BCOM/Sms/index';



// antd 组件
import {
    Button,
    Icon,
    Tag,
    message,
    Row,
    Col
} from 'antd';

import { helper } from 'UTILS'
//全局获取基本信息
import State from 'PAGES/redirect/state';
const globalState = State.getState();



// 页面
export default class basicBodyEditor extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: this.props.data
        }

    }
    //个人用户 或者 企业用户
    UserTypeTemplate(item) {
        let items = {
            1: <Tag color="blue">个人用户</Tag>,
            2: <Tag color="blue">企业用户</Tag>
        };
        return items[item]
    }
    //判断完成状态
    GetLoginCheckStatusTemplate(type,getUserCheckStatusCheckItems,getUserCheckStatus) {
        //判断 获取登录后判断状态  银行审核状态，-1：审核中，0：审核不通过，1：审核通过
        //执行到的步骤，0：未开始，1：执行到第1步，2：执行到第2步，3：执行到第3步，4：执行到第4步，999：完成
        //如果需要对齐 <Col span={1}> 改成 <Col span={2}>。这里是故意不对齐。为了使强迫症填写资料
        console.log("getUserCheckStatus=>")
        console.log(getUserCheckStatus)
        let iSuccess = null;
        if(globalState.data.userType==1){

            iSuccess = (
                (type.bankCheckStatus == 1)
                &&
                (type.step == 999)
                &&
                (getUserCheckStatusCheckItems.PerReal.systemStatus ==1)
                &&
                (getUserCheckStatusCheckItems.PerBasicInfo.systemStatus ==1)
            );
        }else if(globalState.data.userType==2){
            if(getUserCheckStatus && getUserCheckStatus.writerType==1){
                iSuccess = (
                    (type.bankCheckStatus == 1)
                    &&
                    (type.step == 999)
                    &&
                    (getUserCheckStatusCheckItems.EnBasicInfo.systemStatus ==1)
                    &&
                    (getUserCheckStatusCheckItems.EnOperator.systemStatus ==1)
                    &&
                    (getUserCheckStatusCheckItems.EnLegalPerson.systemStatus ==1)
                    &&
                    (getUserCheckStatusCheckItems.EnPaper.systemStatus ==1)
                    &&
                    (getUserCheckStatusCheckItems.EnAccount.systemStatus ==1)
                );
            }else{
                iSuccess = (
                    (type.bankCheckStatus == 1)
                    &&
                    (type.step == 999)
                    &&
                    (getUserCheckStatusCheckItems.EnBasicInfo.systemStatus ==1)
                    &&
                    (getUserCheckStatusCheckItems.EnLegalPerson.systemStatus ==1)
                    &&
                    (getUserCheckStatusCheckItems.EnPaper.systemStatus ==1)
                    &&
                    (getUserCheckStatusCheckItems.EnAccount.systemStatus ==1)
                );
            }

        }
        let result = null;
        if (iSuccess) {
            result = (
                <div className="fn-mb-50">
                    <div>
                        您已完成全部安全设置，请放心使用本系统的功能。
                    </div>
                </div>

            )

        } else {
            result = (
                <div className="fn-mb-50">

                    <div>
                        建议您完成全部安全设置，以保障账户及资金安全。
                    </div>
                </div>
            )
        }
        return result;
    }
    //获取用户审核状态组合后的数据
    getUserCheckStatusCheckItems() {
        // console.log( "helper.convertUserCheckStatus(this.state.data.getUserCheckStatus.checkItems)=>" )
        // console.log( helper.convertUserCheckStatus(this.state.data.getUserCheckStatus.checkItems) )
        let checkItems = null;
        let item = null

        checkItems =  this.props.data.getUserCheckStatus.checkItems
        item = helper.convertUserCheckStatus(checkItems);

        return item;
    }
    //基本信息
    basicInformationTemplate(userType,checkItems){

        let items = {
            1:(
                <div className="fn-mtb-10 basicinfo-border-bottom fn-pb-10">
                    <div className="clearfix">
                        <div className="basic-col-1">
                            {
                                ( (checkItems.PerBasicInfo) && (checkItems.PerBasicInfo.bankStatus == 1) && (checkItems.PerBasicInfo.systemStatus==1)  )
                                ?
                                <Icon type="check"/>
                                :
                                <Icon type="cross" className="error-FontColor1" />
                            }

                        </div>
                        <div className="basic-col-2">
                            <h3>
                                基本信息
                            </h3>
                        </div>
                        <div className="basic-col-3">
                            您的基本信息已完善。如资料有变更，请及时更新，这将有助于加快您的业务申请进度。
                        </div>
                    </div>
                </div>
            ),
            2:(
                <div className="fn-mtb-10 basicinfo-border-bottom fn-pb-10">
                    <div className="clearfix">
                        <div className="basic-col-1">
                            {
                                ( (checkItems.EnBasicInfo) && (checkItems.EnBasicInfo.bankStatus == 1) && (checkItems.EnBasicInfo.systemStatus==1)  )
                                ?
                                <Icon type="check"/>
                                :
                                <Icon type="cross" className="error-FontColor1" />
                            }
                        </div>
                        <div className="basic-col-2">
                            <h3>
                                企业信息
                            </h3>
                        </div>
                        <div className="basic-col-3">
                            企业的基本信息已完善。如资料有变更，请及时更新，这将有助于加快您的业务申请进度。
                        </div>
                    </div>
                </div>
            )

        }
        return items[userType]
    }
    //实名验证内容
    getRelatedPersonInfoTemplate(items,type){

        let smsData = {};
        let p1 = "";
        if(type==1){
            p1 = items.map((item,index)=>{
                //1 个人  / 2 3 企业 精准判断
                if(item.connectorType==1){
                    smsData = {
                        businesstype: 1,
                        connectorType: item.connectorType
                    };
                    return (

                        <div key={index} className="fn-mt-10" >
                            <div className="clearfix">

                                <div className="basic-col-1">
                                    {
                                        item.checkPass>0
                                        ?
                                        <Icon type="check"/>
                                        :
                                        <Icon type="cross" className="error-FontColor1" />
                                    }
                                </div>

                                <div className="basic-col-2">
                                    <h3>
                                        实名验证
                                    </h3>
                                </div>

                                <div className="basic-col-3">
                                    姓名：
                                    {item.realName}
                                </div>
                                <div className="basic-col-4">
                                    {
                                        item.checkPass>0
                                        ?
                                        <span
                                            className="success-FontColor1"
                                            style={{width:80,display:"inline-block"}}
                                            >
                                            已验证
                                        </span>
                                        :
                                        <span>
                                            <span
                                                className="error-FontColor1"
                                                style={{width:190,display:"inline-block"}}
                                                >
                                                未认证
                                            </span>
                                            <span colSpan={2}>
                                                <Sms data={ smsData } >重新发送验证短信</Sms>
                                                {/*
                                                    <a href="javascript:;" className="link-standard">
                                                    重新发送验证短信</a>
                                                */}
                                            </span>
                                        </span>
                                    }
                                </div>
                            </div>
                        </div>
                    )
                }
            })
        }else if(type==2){
            let result = items.every((item,index)=>{
                return item.checkPass>0
            })

            p1 = items.map((item,index)=>{
                    smsData = {
                        businesstype: 1,
                        connectorType: item.connectorType
                    };
                    return (
                        <div key={index} className="fn-mt-10">
                            <div className="clearfix">
                                {
                                    index==0
                                    ?
                                    <div className="basic-col-1">
                                        {
                                            result
                                            ?
                                            <Icon type="check"/>
                                            :
                                            <Icon type="cross" className="error-FontColor1" />
                                        }
                                    </div>
                                    :
                                    <div className="basic-col-1">
                                        &nbsp;
                                    </div>
                                }
                                {
                                    index==0
                                    ?
                                    <div className="basic-col-2">
                                        <h3>
                                            实名验证
                                        </h3>
                                    </div>
                                    :
                                    <div className="basic-col-2">
                                        &nbsp;
                                    </div>
                                }


                                <div className="basic-col-2">
                                    { item.connectorType == 2 ? "法定代表人" : "委托代理人"}：
                                    {/*脱敏*/}
                                    {item.realName.replace(/^.*(.)$/,"***$1")}
                                </div>
                                <div className="basic-col-2">
                                    {
                                        item.checkPass>0
                                        ?
                                        <span
                                            className="success-FontColor1"
                                            style={{width:80,display:"inline-block"}}
                                            >
                                            已验证
                                        </span>
                                        :
                                        <span className="clearfix">
                                            <span
                                                className="error-FontColor1 pull-left"
                                                style={{width:100,display:"inline-block"}}
                                                >
                                                未认证
                                            </span>
                                            <span  className="pull-left">
                                                <Sms data={ smsData } >重新发送验证短信</Sms>
                                                {/*
                                                    <a href="javascript:;" className="link-standard">
                                                    重新发送验证短信</a>
                                                */}
                                            </span>
                                        </span>
                                    }
                                </div>
                            </div>
                        </div>
                    )

            })
        }


        return p1;
    }
    //证件资料，只有企业才有证件资料。
    getCompanyPaperInfoStatusTemplate(checkItems,userType){
        let template = ""
        if(userType==2){
                template = (
                    <div className="fn-mtb-10 basicinfo-border-bottom fn-pb-10">
                        <div className="clearfix">
                            <div className="basic-col-1">
                                {
                                    ( (checkItems.EnPaper) && (checkItems.EnPaper.systemStatus==1)  )
                                    ?
                                    <span className="fn-mr-10"><Icon type="check" /></span>
                                    :
                                    <span className="error-FontColor1 fn-mr-10"><Icon type="cross" /></span>
                                }

                            </div>
                            <div className="basic-col-2">
                                <h3>
                                    证件资料
                                </h3>
                            </div>
                            <div className="basic-col-3">
                                如资料有变更，请及时更新。
                            </div>
                            <div className="basic-col-4">
                                <Link to="/companyValidate/documentUpload?isEditor=1" className="ant-btn ant-btn-primary">
                                    <Icon type="edit" />
                                    修改
                                </Link>
                            </div>

                        </div>
                    </div>
                )

        }
        return template;
    }

    //登录密码
    resetPasswordTemplate(){
        let template = "";

        template = (
            <div className="fn-mtb-10 basicinfo-border-bottom fn-pb-10">
                <div className="clearfix">
                    <div className="basic-col-1">
                        <Icon type="check"/>
                    </div>
                    <div className="basic-col-2">
                        <h3>
                            登录密码
                        </h3>
                    </div>
                    <div className="basic-col-3">
                        修改更高级别的密码能提高帐号的安全性。
                    </div>
                    <div className="basic-col-4">
                        <Link className="ant-btn ant-btn-primary" to="/accountManagement/resetPassword/step1">
                            <Icon type="edit" />修改
                        </Link>
                    </div>
                </div>
            </div>
        )

        return template;
    }
    //交易密码
    resetTradingPasswordTemplate(getIsSetPayPassword,getSysAndBankRealCheck){

        let template = "";

        template = (
            <div className="fn-mtb-10 basicinfo-border-bottom fn-pb-10">
                <div className="clearfix">
                    <div className="basic-col-1">
                        {
                            getIsSetPayPassword==true
                            ?
                            <Icon type="check"/>
                            :
                            <Icon type="cross" className="error-FontColor1" />
                        }

                    </div>
                    <div className="basic-col-2">
                        <h3>
                            交易密码
                        </h3>
                    </div>
                    <div className="basic-col-3">
                        关联证书：保护账户资金安全，在修改资料、融资申请以及使用其他会员服务时，需要验证交易密码。
                    </div>
                    <div className="basic-col-4">
                        <Button
                            type="primary"
                            onClick={this.handleGetIsSetPayPasswordTemplateEditor.bind(this,getSysAndBankRealCheck)}
                            >
                            <Icon type="edit" />修改
                        </Button>
                    </div>
                </div>
            </div>
        )

        return template;
    }
    //修改交易密码
    handleGetIsSetPayPasswordTemplateEditor(isValida){

        if(isValida===true){
            this.props.history.push('/accountManagement/resetTradingPassword/step1')
        }else{
            message.error("您的实名认证未完成，完成后才可进行此操作。")
        }
    }
    //绑定手机
    getBindMobileTemplate(item){
        let template = "";

        template = (
            <div className="fn-mtb-10 basicinfo-border-bottom fn-pb-10">
                <div className="clearfix">
                    <div className="basic-col-1">
                        {
                            item
                            ?
                            <Icon type="check" />
                            :
                            <Icon type="cross" className="error-FontColor1" />
                        }
                    </div>
                    <div className="basic-col-2">
                        <h3>
                            绑定手机
                        </h3>
                    </div>
                    <div className="basic-col-3">
                        绑定手机号：{item}。保护账户资金安全，在修改资料、融资申请以及使用其他会员服务时，需要验证绑定手机。
                    </div>
                </div>
            </div>
        )


        return template;
    }
    //银行账户,对公账户
    /**
     * userType 个人企业
     * checkItems //获取用户审核状态组合后的数据
     * getCompanyAccountCheckStatus 获取对公账号的银行账号
     */
    getCompanyAccountCheckStatusTemplate(userType,checkItems,getCompanyAccountCheckStatus,getCheckedBank){
        //console.log("checkItems=》")
        //console.log(checkItems)

        let template = "";

        if(userType==1){
            template = (
                <div className="fn-mtb-10 fn-pb-10">
                    <div className="clearfix">
                        <div className="basic-col-1">
                            {
                                getCheckedBank.checkStatus && (getCheckedBank.checkStatus == 1 )
                                ?
                                <Icon type="check"/>
                                :
                                <Icon type="cross" className="error-FontColor1"  />
                            }
                        </div>
                        <div className="basic-col-2">
                            <h3>
                                银行账户
                            </h3>
                        </div>
                        <div className="basic-col-3">
                            默认账户：
                            <span>{getCheckedBank.bankName} | {getCheckedBank.cardNo&&getCheckedBank.cardNo.replace(/^(.{4}).*(.{4})$/,"$1***********$2")}。</span>
                        </div>
                    </div>
                </div>
            )
        }else if(userType==2){
            template = (
                <div className="fn-mtb-10 fn-pb-10">
                    <div className="clearfix">
                        <div className="basic-col-1">
                            {
                                ( (checkItems.EnAccount) && (checkItems.EnAccount.bankStatus == 1) && (checkItems.EnAccount.systemStatus==1)  )
                                ?
                                <Icon type="check"/>
                                :
                                <Icon type="cross" className="error-FontColor1"  />
                            }

                        </div>
                        <div className="basic-col-2">
                            <h3>
                                对公账户
                            </h3>
                        </div>
                        <div className="basic-col-3">
                            默认账户：
                            {
                                getCompanyAccountCheckStatus && getCompanyAccountCheckStatus.length>0
                                ?
                                getCompanyAccountCheckStatus.map((item,index)=>{
                                    return (
                                        <span key={index}>{item.bankName} | {item.cardNo}。</span>
                                    )
                                })
                                :
                                <span>没有可用的银行账号</span>
                            }
                        </div>
                    </div>
                </div>
            )

        }


        return template;
    }

    render() {
        let getUserCheckStatusCheckItems,
            userType,
            UserTypeTemplate,
            GetLoginCheckStatusTemplate,
            basicInformationTemplate,
            getRelatedPersonInfoTemplate,
            getCompanyPaperInfoStatusTemplate,
            resetPasswordTemplate,
            resetTradingPasswordTemplate,
            getBindMobileTemplate,
            getCompanyAccountCheckStatusTemplate

        /**
         * 获取用户审核状态(v0.4)	/user/getUserCheckStatus
         * 用户简单信息(v2.2)	/user/getLoginUserSimpleInfo
         * 获取登录后判断状态(v0.4)	/common/getLoginCheckStatus
         * 获取用户信息填写人（关系人）信息(v2.6)	/user/getRelatedPersonInfo
         * 获取绑定手机(v0.4)	/user/getBindMobile
         * 是否设置交易密码(v0.4)	/user/getIsSetPayPassword
         * 获取对公账户验证状态(v1.6)	/user/getCompanyAccountCheckStatus
         * 获取已核身银行账号(v0.6)	/person/getCheckedBank
         */
        const {
            getUserCheckStatus,
            getLoginUserSimpleInfo,
            getLoginCheckStatus,
            getRelatedPersonInfo,
            getBindMobile,
            getIsSetPayPassword,
            getCompanyAccountCheckStatus,
            getCheckedBank,
            getSysAndBankRealCheck,
        } = this.props.data;
        //获取用户审核状态组合后的数据
        /**
        * 审核项Key，
        * EnBasicInfo ：企业_基本信息，
        * EnOperator ：企业_经办人，
        * EnLegalPerson ：企业_法人，
        * EnPaper ：企业_证件，
        * EnAccount ：企业_对公账号，
        * PerBasicInfo ：个人_基本信息，
        * PerReal ：个人_实名
        */


        let loadCheckItems = null;

            // console.log("===============")
            // console.log("data",this.state.data)
            // console.log("getUserCheckStatus",this.state.data.getUserCheckStatus)
            // console.log("checkItems",this.state.data.getUserCheckStatus.checkItems)
            // console.log("===============")
            //console.log(loadCheckItems)

        getUserCheckStatusCheckItems  = this.getUserCheckStatusCheckItems();


        /**
        * userType 判断个人或者企业
        * 个人=>1
        * 企业=>2
        */
        userType = getUserCheckStatus.userType;
        //个人用户/企业用户
        UserTypeTemplate = this.UserTypeTemplate(userType);
        //建议完成基本资料
        GetLoginCheckStatusTemplate = this.GetLoginCheckStatusTemplate(getLoginCheckStatus,getUserCheckStatusCheckItems,getUserCheckStatus);

        //基本信息
        basicInformationTemplate = this.basicInformationTemplate(userType,getUserCheckStatusCheckItems);

        //实名验证内容
        getRelatedPersonInfoTemplate = this.getRelatedPersonInfoTemplate(getRelatedPersonInfo,userType);

        //证件资料
        getCompanyPaperInfoStatusTemplate = this.getCompanyPaperInfoStatusTemplate(getUserCheckStatusCheckItems,userType);
        //登录密码
        resetPasswordTemplate = this.resetPasswordTemplate();
        //交易密码
        resetTradingPasswordTemplate = this.resetTradingPasswordTemplate(getIsSetPayPassword,getSysAndBankRealCheck);
        //绑定手机
        getBindMobileTemplate = this.getBindMobileTemplate(getBindMobile);
        //银行账户/对公账户
        getCompanyAccountCheckStatusTemplate = this.getCompanyAccountCheckStatusTemplate(userType,getUserCheckStatusCheckItems,getCompanyAccountCheckStatus,getCheckedBank);



        return (

            <div>

                <div className="fn-mtb-20 ">
                    <h3>
                        <span className="fn-mr-10">下午好，{getLoginUserSimpleInfo.name}</span>
                        {UserTypeTemplate}
                    </h3>

                    <div className="alert alert-warning fn-mt-10">
                        <i></i>
                        <em></em>
                        {GetLoginCheckStatusTemplate}
                    </div>
                </div>
                <div className="fn-mtb-20">
                    {/*基本信息*/}
                    {basicInformationTemplate}
                    {/*实名验证*/}
                    <div className="fn-mtb-10 basicinfo-border-bottom fn-pb-10">

                        {getRelatedPersonInfoTemplate}
                    </div>
                    {/*证件资料*/}
                    {getCompanyPaperInfoStatusTemplate}
                    {/*登录密码*/}
                    {resetPasswordTemplate}
                    {/*交易密码*/}
                    {resetTradingPasswordTemplate}
                    {/*绑定手机*/}
                    {getBindMobileTemplate}
                    {/*银行卡号和对公账号*/}
                    {getCompanyAccountCheckStatusTemplate}
                </div>
            </div>

        );
    }
}
