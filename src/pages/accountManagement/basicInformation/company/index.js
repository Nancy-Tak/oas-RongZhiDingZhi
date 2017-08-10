// 样式
import './style.less';
// react 相关库
import React from 'react';

// antd 组件
import {Button,Icon,Tag} from 'antd';

// 页面
export default class Company extends React.Component {
    render() {
        return (
            <div>
                <div>
                    <div className="account-manage-wrap">
                        <h3>
                            <span className="fn-mr-10">下午好，广东亿达有限公司</span>
                            <Tag color="blue">企业用户</Tag>
                        </h3>

                        <div className="alert alert-warning fn-mt-10">
                            <i></i>
                            <em></em>
                            建议您完成全部安全设置，以保障账户及资金安全。
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
                                        <Button type="primary"><Icon type="edit" />修改</Button>
                                    </td>
                                </tr>
                                <tr className="align-top">
                                    <td rowSpan={3}  className="text-align-center fs-20">
                                        <Icon type="cross" />
                                    </td>
                                    <td rowSpan={3}>
                                        <h3 className="fn-pt-10">实名认证</h3>
                                    </td>
                                    <td className="noborder" colSpan={5}>
                                        <div className="fn-pt-15">您的实名认证信息：</div>
                                    </td>
                                </tr>
                                <tr className="noborder align-top">
                                    <td className="text-align-right">经办人：</td>
                                    <td className="heading-FontColor">**敏</td>
                                    <td className="error-FontColor1">未认证</td>
                                    <td colSpan={2}>
                                        <a href="javascript:;" className="link-standard">
                                            重新发送验证短信</a>
                                    </td>
                                </tr>
                                <tr className="align-top">
                                    <td className="text-align-right">法人代表人</td>
                                    <td className="heading-FontColor">**敏</td>
                                    <td className="error-FontColor1">未认证</td>
                                    <td colSpan={2}>
                                        <a href="javascript:;" className="link-standard">
                                            重新发送验证短信</a>
                                    </td>
                                </tr>
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
                                        <Button type="primary"><Icon type="edit" />修改</Button>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="text-align-center fs-20">
                                        <Icon type="check" />
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
                                        <Button type="primary"><Icon type="edit" />修改</Button>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="text-align-center fs-20">
                                        <Icon type="check" />
                                    </td>
                                    <td>
                                        <h3>
                                            绑定手机
                                        </h3>
                                    </td>
                                    <td colSpan={4}>
                                        绑定手机号：133****1234。保护账户资金安全，在修改资料、融资申请以及使用其他会员服务时，需 要验证绑定手机。
                                    </td>
                                    <td></td>
                                </tr>
                                <tr className="noborder">
                                    <td className="text-align-center fs-20">
                                        <Icon type="check" />
                                    </td>
                                    <td>
                                        <h3>银行账户</h3>
                                    </td>
                                    <td colSpan={4}>
                                        默认账户：招商银行 | 622012346220123462201234。
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
