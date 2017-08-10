import React, {
    Component,
    PropTypes
} from 'react';
import {
    Link
} from 'react-router';

// antd 组件
import {
    Row,
    Col,
    Icon,
    Button,
    Table,
    Modal
} from 'antd';

//  业务组件
import InfoRow from './infoRow';
import Map from 'PAGES/companyValidate/components/map';

//  引入fetch
import {
    fetch,
    helper
} from 'UTILS';

//  全局状态
import State from 'PAGES/Layouts/state';
const sysInfo = State.getState().sysInfo;
// console.log(State.getState().sysInfo);

class TipsRow extends Component {
    static propTypes = {
        className: PropTypes.string,
    };

    constructor(props) {
        super(props);
        this.state = Object.assign({}, this.props, {
            data: {
                basicData: {
                    passed: true
                },
                tipsRow: "",
                logoutUrl: sysInfo && sysInfo.logoutUrl || "javaScript:void(0);"
            }
        });
    }

    //  重新获取状态刷新时更新状态
    componentWillReceiveProps(nextProps) {
        let state = Object.assign({}, this.state, nextProps);
        this.setState(state);
        this.loadData();
    }

    componentDidMount() {
        if (this.props.isReload) {
            return false;
        }
        this.loadData();
    }

    reVerify() {
        fetch('/companyVerification/resubmitVerification.do').then((res) => {
            Modal.success({
                title: '审核申请已提交，请耐心等待结果。',
                content: (
                    <div>
                        <p>我们将尽快完成审核，结果将以短信通知您。</p>
                        <p>如需修改信息请联系客服电话：400-106-6698。</p>
                    </div>
                ),
            });

            this.props.updatePageType('check');
            window.location.reload();
        });


    }

    loadData() {
        let me = this;
        let data = me.state.data;
        //  身份实名认证
        let p1 = fetch('/user/getRelatedPersonInfo.do');
        //  企业对公账户认证
        let p2 = fetch('/user/getCompanyAccountCheckStatus.do');
        //  企业资料补充
        let p3 = fetch('/paper/getCompanyPaperInfoStatus.do');
        //  获取用户审核状态
        let p4 = fetch('/user/getUserCheckStatus.do');

        Promise.all([p1, p2, p3, p4]).then(res => {
            console.log(res);
            let checkStatus = helper.convertUserCheckStatus(res[3].data.checkItems);
            console.log(checkStatus);

            //  企业基本信息
            data.basicData = Object.assign({}, data.basicData, checkStatus.EnBasicInfo);
            data.basicData.passed = (data.basicData.bankStatus == -1 && data.basicData.systemStatus == -1) ? false : true;
            //  身份实名认证数据处理
            let user = {};
            res[0].data.map((item, index) => {
                let userData = {
                    name: item.realName,
                    connectorType: item.connectorType,
                    identityCode: item.identityCode,
                    passed: Map.identityMap.passType[item.checkPass]
                }
                let dataType = Map.identityMap.type[item.connectorType];
                user[dataType + "Data"] = userData;
            });
            if (user.agentData) {
                user.agentData = Object.assign({}, user.agentData, checkStatus.EnOperator);
            }
            user.corporationData = Object.assign({}, user.corporationData, checkStatus.EnLegalPerson);

            //  企业对公账户认证数据处理
            let accountItem = res[1].data[0];
            let accountData = Object.assign({}, {
                accountValidateType: Map.accountMap.type[accountItem.accountValidateType],
                passed: Map.accountMap.passType[accountItem.checkStatus]
            }, checkStatus.EnAccount);
            this.props.updateAccountPassed(accountData.passed);

            //  企业资料补充
            let informationData = Object.assign({}, {
                lackFiles: res[2].data.lackFiles,
                passed: Map.supplementMap.passType[res[2].data.status]
            }, checkStatus.EnPaper);

            data.tipsRow = <Row className="tipsRow">
                                <InfoRow type="basic" pageType={ this.state.pageType } data={ this.state.data.basicData } />

                                <InfoRow type="corporation" pageType={ this.state.pageType } data={ user.corporationData || {} } />

                                {user.agentData ? <InfoRow type="agent" pageType={ this.state.pageType } data={ user.agentData } /> : ""}

                                <InfoRow type="information" pageType={ this.state.pageType } data={ informationData } />

                                <InfoRow type="account" pageType={ this.state.pageType } data={ accountData } />
                                {this.state.pageType =='disapproval' ? <Row className="">
                                                                            <Col span={24}>
                                                                                <p>如确认申请资料无误，请重新申请认证，点击 <Button type="primary" onClick={this.reVerify.bind(this)} size="small">提交认证申请</Button></p>
                                                                            </Col>
                                                                        </Row> : null }
                            </Row>;

            me.setState({
                data: data
            });
        }).catch(err => {
            throw err;
        });
    }

    logout() {
        let url = (__DEV__ ? `/api` : ``) + `/logout.do`;
        location.href = url;
    }

    render() {
        return (
            <div>
            	{ this.state.data.tipsRow }
            	<Row className="tipsRow pl-50">
            		<Col span={24}>
            			<p>如您想更换账号，请点击 <a href={ this.state.data.logoutUrl }>重新登录</a>。</p>
            		</Col>
                </Row>
            </div>
        );
    }
}

export default TipsRow;