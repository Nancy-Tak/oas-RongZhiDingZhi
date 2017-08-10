// react 相关库
import React from 'react';
import {Link} from 'react-router';

//less
import './style.less'

// antd 组件
import {
    Alert,
    Tag,
    Card,
    Row,
    Col,
    Icon,
    Modal,
    Select,
    Input,
    notification,
    Button,
    message,
    Form
} from 'antd';
const Option = Select.Option;
const createForm = Form.create;
const FormItem = Form.Item;

function noop() {
    return false;
}

//fetch
import {
    fetch,
    helper,
    ruleType
} from 'UTILS';
// 自定义验证 rule
//import ruleType from 'UTILS/ruleType';
// 页面
import Frame from 'COM/form/frame';

// 页面
class Home extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {
                name: "",
                lastLoginTime: "",
                getUserServiceList: []
            },
            isInviteCode: true
        }
    }
    componentDidMount() {

        this.loadData();
    }
    loadData() {
        //用户简单信息
        // fetch('/user/getLoginUserSimpleInfo').then(res => {
        //     console.log(res)
        //     this.setState(res)
        // });
        //
        // fetch('/user/getUserServiceList').then(res => {
        //     console.log(res)
        //     this.setState(res)
        // });
        //

        //用户简单信息(v0.7)
        let p1 = fetch('/user/getLoginUserSimpleInfo.do');
        //返回用户服务列表(v0.3)
        let p2 = fetch('/user/getUserServiceList.do');

        //获取登录后判断状态
        let p3 = fetch('/common/getLoginCheckStatus.do');

        Promise.all([p1, p2, p3]).then(values => {
            this.state.data = values[0].data
            this.state.data.getUserServiceList = values[1].data
            this.state.data.getLoginCheckStatus = values[2].data

            //验证不通过，就跳转到验证页面
            if (values[2].data.bankCheckStatus == 1 && values[2].data.step == 999) {
                console.log("成功")
                //return true
            } else {
                //this.props.history.push("/accountManagement/basicInformation")
            }

            this.forceUpdate();
        }).catch(err => {
            message.error(err)
            throw err;
        });
    }
    handleAddBusiness() {
        this.setState({inviteCodeValue: "", visible: true})
        this.props.form.setFieldsValue({inviteCode: ""});
    }
    // handleSubmit2(){
    //
    //     let data = {"serviceChannelNo":"20161031160941","serviceChannelName":"单元测试20161031160941","serviceURL":"http://www.baidu.com3"};
    //     this.state.data.getUserServiceList.push(data)
    //     this.forceUpdate();
    // }

    handleSubmit(e) {

        //console.log(this.props.from.getFieldValue())
        //e.preventDefault();

        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            }
            console.log('Submit!!!');
            console.log(values);
            fetch('/service/addService.do', {
                body: {
                    "inviteCode": this.state.inviteCodeValue
                }
            }).then(res => {
                //console.log(res)
                //this.setState(res)
                //提示
                //this.openNotification(res)
                //设置值为空

                //暂时用window.location.reload 其实应该返回列表然后再浪的
                //window.location.reload()
                //console.log(res)
                let resData = res.data
                this.state.data.getUserServiceList.push(resData)

                this.setState({ visible: false})
                this.openNotification();
                //this.setState({visible: false});
            }, (res) => {
                // if(res.fieldName){
                //     this.props.form.setFields({
                //         [res.fieldName]:{
                //             "value":this.props.form.getFieldValue(res.fieldName),
                //             "errors":[new Error(res.message)]
                //         }
                //     });
                // }
                if(res.fieldName){
                  const {form} = this.props;
                  helper.focusError(form,res.fieldName,res.message);
                }
            });
        });
    }
    openNotification(getRes) {
        console.log(getRes)
        message.success('添加成功');
    }
    handleCancel(e) {
        console.log(e);
        this.setState({visible: false});
    }
    handleChange(value) {
        if (value === "isInviteCode") {
            this.setState({isInviteCode: true})
        } else {
            this.setState({isInviteCode: false})
        }
        console.log(`selected ${value}`);
    }
    //个人用户或者企业用户
    templateUserType(item) {
        let items = {
            1: <Tag color="blue">个人用户</Tag>,
            2: <Tag color="blue">企业用户</Tag>
        };
        return items[item]
    }
    //个人账户管理或者企业账户管理
    templateUserTypeManagement(item) {
        let items = {
            1: <Link to="/accountManagement/basicInformation">个人账户管理</Link>,
            2: <Link to="/accountManagement/basicInformation">企业账户管理</Link>
        };
        return items[item]
    }
    handleInviteCodeValue(e) {

        this.setState({inviteCodeValue: e.target.value})
    }

    render() {
        console.log(this)

        let {getUserServiceList} = this.state.data;

        const {getFieldProps} = this.props.form;
        const formItemLayout = {
            labelCol: {
                span: 7
            },
            wrapperCol: {
                span: 16
            }
        };
        const nameProps = getFieldProps('inviteCode', {
            rules: [
                {
                    required: true,
                    message: '请输入邀请码'
                }
            ],
            onChange: (e) => {
                this.setState({inviteCodeValue: e.target.value})
            }
        });

        return (
            <div style={{
                minHeight: "700px"
            }}>
                <Modal title="添加业务" visible={this.state.visible} onOk={this.handleSubmit.bind(this)} onCancel={this.handleCancel.bind(this)} wrapClassName="vertical-center-modal">
                    {this.state.isInviteCode
                        ? <Form>
                                <Row>
                                    <Col span={12} offset={6}>
                                        <FormItem {...formItemLayout} label="邀请码">
                                            <Input {...nameProps} placeholder={helper.isIEbrowser() ? '' : "请输入邀请码"}/>
                                        </FormItem>

                                    </Col>
                                </Row>
                            </Form>
                        : null
}

                </Modal>
                <div className="fn-ptb-20 ">
                    <div className="ant-card-head" style={{
                        padding: 0
                    }}>
                        <h3 className="ant-card-head-title">
                            <span className="fn-mr-10">欢迎您，{this.state.data.name}</span>
                            {/*@:data {string} userType 用户类型(1:个人,2:企业)*/}
                            {this.templateUserType(this.state.data.userType)}

                        </h3>
                    </div>

                    <div className="alert alert-warning fn-mt-10">
                        {/*@:data {string} userType 用户类型(1:个人,2:企业)*/}
                        {this.templateUserTypeManagement(this.state.data.userType)}
                        {this.state.data.lastLoginTime && this.state.data.lastLoginTime.length > 0
                            ? <span>
                                    <span className="fn-plr-10">|</span>
                                    上次登录时间： {this.state.data.lastLoginTime}
                                </span>
                            : null
}
                    </div>
                </div>

                <div>
                    <div className="ant-card-head fn-mb-20" style={{
                        padding: 0
                    }}>
                        <h3 className="ant-card-head-title">
                            我的业务
                        </h3>
                    </div>

                    <Row>

                        {getUserServiceList && getUserServiceList.map((item, index) => {
                            return (
                                <a key={index} href={item.serviceURL}>
                                    <Col span="6">
                                        <Card>{item.serviceChannelName}</Card>
                                    </Col>
                                </a>
                            )
                        })
}

                        <a href="javascript:;" onClick={this.handleAddBusiness.bind(this)}>
                            <Col span="6">
                                <Card><Icon type="plus"/>添加业务</Card>
                            </Col>
                        </a>

                    </Row>

                </div>
            </div>
        );
    }
}

export default createForm()(Home);
