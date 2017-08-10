// react 相关库
import React from 'react';
import {Link} from 'react-router';


// 页面组件
import Sms from 'BCOM/Sms/index';



// antd 组件
import {Button,Icon,Tag,message} from 'antd';


// 页面
export default class basicBody extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            data:this.props.data,
        }
    }
    //个人用户 或者 企业用户
    handleUserTypeTemplate(item){
        let items = {
            1:<Tag color="blue">个人用户</Tag>,
            2:<Tag color="blue">企业用户</Tag>,
        };
        return items[item]
    }
    //企业资料提交状态 证件资料
    handleGetCompanyPaperInfoStatusTemplate(item){
        let items = {
            0:<Icon type="cross" className="error-FontColor1" />,
            1:<Icon type="check" />,
        };
        return items[item]
    }
    //交易密码
    handleGetIsSetPayPasswordTemplate(item){
        let result = null;
        if(item==true){
            result = <Icon type="check" />
        }else{
            result = <Icon type="cross" className="error-FontColor1" />
        }
        return result
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
    handleGetBindMobileTemplate(item){
        let result = null;
        if(item){
            result = <Icon type="check" />
        }else{
            result = <Icon type="cross" className="error-FontColor1" />
        }
        return result
    }
    //对公账户
    handleGetAccountCheckStatusTemplate(item){
        let result = null;
        if(item && item.length>0){
            result = <Icon type="check" />
        }else{
            result = <Icon type="cross" className="error-FontColor1" />
        }
        return result
    }
    /**
     * items 数组的每一项
     * type 个人/企业
     * connectorType==3 个人姓名
     * items.filter 全部都>0的时候，改变状态。
     */
    //实名验证图标
    handleGetRelatedPersonInfoIconTemplate(items,type){
        let p1 = "";
        if(type===1){
            p1 = items.map((item,index)=>{
                if(item.connectorType==3){
                    return (
                        <div key={index}>
                            {
                                item.checkPass>0
                                ?
                                <Icon type="check"/>
                                :
                                <Icon type="cross" className="error-FontColor1" />
                            }
                        </div>
                    )
                }
            })
        }else if(type===2){

            let result = items.every((item,index)=>{
                return item.checkPass>0
            })
            if(result==true){
                p1 = <Icon type="check"/>;
            }else{
                p1 = <Icon type="cross" className="error-FontColor1" />;
            }
            //console.log(p1,"filter")
        }

        return p1;
    }
    //实名验证内容
    getRelatedPersonInfoTemplate(items,type){
        let smsData = {};
        let p1 = "";
        if(type===1){
            p1 = items.map((item,index)=>{
                if(item.connectorType==3){
                    smsData = {
                        name: item.realName,
                        identityCode: item.identityCode,
                    }
                    return (
                        <div key={index} className="fn-mt-10">
                            <span
                                className="text-align-right"
                                style={{width:150,display:"inline-block"}}
                                >
                                姓名：
                            </span>
                            <span
                                className="heading-FontColor"
                                style={{width:80,display:"inline-block"}}
                                >
                                {item.realName}
                            </span>
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
                                <span  >
                                    <span
                                        className="error-FontColor1"
                                        style={{width:80,display:"inline-block"}}
                                        >
                                        未认证
                                    </span>
                                    <span colSpan={2}>
                                        <Sms data={ smsData } businesstype={1}>重新发送验证短信</Sms>
                                        {/*
                                            <a href="javascript:;" className="link-standard">
                                            重新发送验证短信</a>
                                        */}
                                    </span>
                                </span>
                            }


                        </div>
                    )
                }
            })
        }else if(type===2){
            p1 = items.map((item,index)=>{
                    smsData = {
                        name: item.realName,
                        identityCode: item.identityCode,
                        connectorType: item.connectorType
                    }
                    return (
                        <div key={index} className="fn-mt-10">
                            <span
                                className="text-align-right"
                                style={{width:150,display:"inline-block"}}
                                >
                                { item.connectorType == 2 ? "法定代表人" : "委托代理人"}姓名：
                            </span>
                            <span
                                className="heading-FontColor"
                                style={{width:80,display:"inline-block"}}
                                >
                                {item.realName}
                            </span>
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
                                        style={{width:80,display:"inline-block"}}
                                        >
                                        未认证
                                    </span>
                                    <span colSpan={2}>
                                        <Sms data={ smsData } businesstype={1}>重新发送验证短信</Sms>
                                        {/*
                                            <a href="javascript:;" className="link-standard">
                                            重新发送验证短信</a>
                                        */}
                                    </span>
                                </span>
                            }


                        </div>
                    )

            })
        }


        return p1;
    }
    handleGetLoginCheckStatusTemplate(type){
        //判断 获取登录后判断状态  银行审核状态，-1：审核中，0：审核不通过，1：审核通过
        //执行到的步骤，0：未开始，1：执行到第1步，2：执行到第2步，3：执行到第3步，4：执行到第4步，999：完成
        let iSuccess = (type.bankCheckStatus==1 && type.step==999);
        let result = null;
        if( iSuccess ){
            result = (
                <span>
                    <span className="fn-mr-10"><Icon type="check" /></span>
                    您已完成全部安全设置，请放心使用本系统的功能。
                </span>
            )

        }else{
            result = (
                <span>
                    <span className="error-FontColor1 fn-mr-10"><Icon type="cross" /></span>
                    建议您完成全部安全设置，以保障账户及资金安全。
                </span>
            )
        }
        return result;
    }


    render() {
        console.log(this)
        let {
            getLoginUserSimpleInfo,
            getBindMobile,
            getIsSetPayPassword,
            getCompanyAccountCheckStatus,
            getRelatedPersonInfo,
            getCompanyPaperInfoStatus,
            getLoginCheckStatus
         } = this.state.data;

         //个人用户 或者 企业用户
         const userTypeTemplate = this.handleUserTypeTemplate(getLoginUserSimpleInfo.userType);
         //企业资料提交状态 证件资料
         const getCompanyPaperInfoStatusTemplate = this.handleGetCompanyPaperInfoStatusTemplate(getCompanyPaperInfoStatus.status);
         //交易密码
         const getIsSetPayPasswordTemplate = this.handleGetIsSetPayPasswordTemplate(getIsSetPayPassword);

         //绑定手机
         const getBindMobileTemplate = this.handleGetBindMobileTemplate(getBindMobile);
         //对公账户
         const getCompanyAccountCheckStatusTemplate = this.handleGetAccountCheckStatusTemplate(getCompanyAccountCheckStatus);

         //实名验证图标
         let getRelatedPersonInfoIcon = this.handleGetRelatedPersonInfoIconTemplate(getRelatedPersonInfo,getLoginUserSimpleInfo.userType);
         //实名验证内容
         let getRelatedPersonInfoTemplate = this.getRelatedPersonInfoTemplate(getRelatedPersonInfo,getLoginUserSimpleInfo.userType);

         let getLoginCheckStatusTemplate = this.handleGetLoginCheckStatusTemplate(getLoginCheckStatus)
        return (
            <div>
                <div>

                    <div className="account-manage-wrap">
                        <h3>
                            <span className="fn-mr-10">下午好，{getLoginUserSimpleInfo.name}</span>
                            {userTypeTemplate}
                        </h3>

                        <div className="alert alert-warning fn-mt-10">
                            <i></i>
                            <em></em>
                            {getLoginCheckStatusTemplate}

                        </div>
                        <div className="cms-wrap-in fn-mt-30" style={{"borderTop": "none"}}>
                            <table className="table dashed account-table">
                                <colgroup>
                                    <col width={80}/>
                                    <col width={100}/>
                                    <col width={150}/>
                                    <col width={80}/>
                                    <col width={80}/>
                                    <col/>
                                    <col width={150}/>
                                </colgroup>

                                {/*基本信息*/}
                                <tr>
                                    <td className="text-align-center fs-20">
                                        <Icon type="check" />
                                    </td>
                                    <td>
                                        <h3>
                                            基本信息
                                        </h3>
                                    </td>
                                    <td colSpan={4}>
                                        您的基本信息已完善。如资料有变更，请及时更新，这将有助于加快您的业务申请进度。
                                    </td>
                                    <td className="text-align-right">
                                        {/*
                                            <Button type="primary"><Icon type="edit" />修改</Button>
                                        */}
                                    </td>
                                </tr>
                                {/*实名认证*/}
                                <tr className="align-top">
                                    <td rowSpan={2}  className="text-align-center fs-20">
                                        {getRelatedPersonInfoIcon}
                                    </td>
                                    <td rowSpan={2}>
                                        <h3 className="fn-pt-10">实名认证</h3>
                                    </td>
                                    <td className="noborder" colSpan={5}>
                                        <div className="fn-pt-15">您的实名认证信息：</div>
                                    </td>
                                </tr>

                                <tr className="noborder align-top">
                                    <td>
                                            {getRelatedPersonInfoTemplate}
                                    </td>
                                </tr>
                                {
                                    getLoginUserSimpleInfo.userType==2
                                    ?
                                    <tr>

                                            <td className="text-align-center fs-20">
                                                {getCompanyPaperInfoStatusTemplate}
                                            </td>
                                            <td>
                                                <h3>
                                                    证件资料
                                                </h3>
                                            </td>
                                            <td colSpan={4}>
                                                如资料有变更，请及时更新。
                                            </td>
                                            <td className="text-align-right">
                                                <Link to="/companyValidate/documentUpload" className="ant-btn ant-btn-primary">
                                                    <Icon type="edit" />
                                                    修改
                                                </Link>
                                            </td>


                                    </tr>
                                    :
                                    null
                                }

                                <tr>
                                    <td className="text-align-center fs-20">
                                        <Icon type="check" />
                                    </td>
                                    <td>
                                        <h3>
                                            登录密码
                                        </h3>
                                    </td>
                                    <td colSpan={4}>
                                        修改更高级别的密码能提高帐号的安全性。
                                    </td>
                                    <td className="text-align-right">
                                        <Link className="ant-btn ant-btn-primary" to="/accountManagement/resetPassword/step1">
                                            <Icon type="edit" />修改
                                        </Link>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="text-align-center fs-20">
                                        {getIsSetPayPasswordTemplate}
                                    </td>
                                    <td>
                                        <h3>
                                            交易密码
                                        </h3>
                                    </td>
                                    <td colSpan={4}>
                                        关联证书：保护账户资金安全，在修改资料、融资申请以及使用其他会员服务时，需要验证交易密码。
                                    </td>
                                    <td className="text-align-right">
                                        <Button
                                            type="primary"
                                            onClick={this.handleGetIsSetPayPasswordTemplateEditor.bind(this,getIsSetPayPassword)}
                                            >
                                            <Icon type="edit" />修改
                                        </Button>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="text-align-center fs-20">
                                        {getBindMobileTemplate}
                                    </td>
                                    <td>
                                        <h3>
                                            绑定手机
                                        </h3>
                                    </td>
                                    <td colSpan={4}>
                                        绑定手机号：{getBindMobile}。保护账户资金安全，在修改资料、融资申请以及使用其他会员服务时，需 要验证绑定手机。
                                    </td>
                                    <td></td>
                                </tr>
                                <tr className="noborder">
                                    <td className="text-align-center fs-20">
                                        {getCompanyAccountCheckStatusTemplate}
                                    </td>
                                    <td>
                                        <h3>
                                            {
                                                getLoginUserSimpleInfo.userType==1
                                                ?
                                                <span>银行账户</span>
                                                :
                                                <span>对公账户</span>
                                            }
                                        </h3>
                                    </td>
                                    <td colSpan={4}>
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

                                    </td>
                                    <td className="text-align-right">

                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}
