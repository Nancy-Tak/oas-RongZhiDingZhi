/**
 * 核审提示页(企业)
 * limit
 */
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
    Button
} from 'antd';

//  业务组件
import TipsContent from '../components/tipsContent';

//  样式
import '../style.less';

//  引入fetch
import {
    fetch
} from 'UTILS';

//  全局状态
import State from 'PAGES/redirect/state';
let globalState = State.getState().data;

//  登录对接完成后去掉
// const globalState = {
//     userType : 2,
//     step : 999,                 //  0:未开始;1:第一步;2:第二步;3:第三步;4:第四步;999:完成;
//     bankCheckStatus : 0,       //  -1:审核中;0:审核不通过;1:审核通过
//     showName : "用户名称"
// }

class Check extends Component {
    static propTypes = {
        className: PropTypes.string,
    };

    constructor(props) {
        super(props);
        State.bind(this);
        this.state = {
            pageType: this._getPageType(),
            showName: globalState.showName ? globalState.showName : "",
            accountPassed: false
        }
    }

    componentDidMount() {
        this._refreshStatus();
    }

    _refreshStatus() {
        let me = this;

        fetch('/common/getLoginCheckStatus.do').then(res => {
            globalState = res.data;
            State.setState({
                data:res.data
            });
            me.setState({
                pageType: me._getPageType(),
                showName: globalState.showName ? globalState.showName : ""
            });
        });
    }

    _getPageType() {
        //  没有完成 核身信息补充提示页
        let pageType = "supplement";
        if (globalState.step == 999) {
            //  完成
            if (globalState.bankCheckStatus == -1) {
                //  审核中提示页
                pageType = "check";
            } else if (globalState.bankCheckStatus == 0) {
                //  审核不通过提示页
                pageType = "disapproval";
            } else {
                //  审核通过
                this.props.history.push(`accountManagement`);
            }
        }
        return pageType;
    }

    headerRender() {
        //  中转
        return this["_" + this.state.pageType]();
    }

    continueToFill() {
        let step = 1;
        if (globalState && globalState.step) {
            step = globalState.step == 0 ? 1 : globalState.step;
        }
        this.props.history.push('/companyValidate/step' + step);
    }

    _supplement() {
        return (
            <Row className="tipsRow">
                <Col span={3} className="text-align-center">
                    <Icon type="exclamation-circle" className="tipsIcon exclamation"/>
                </Col>
                <Col span={21}>
                    <h4>{ this.state.showName }</h4>
                    <p>您的认证资料未填写完，请尽快完成。<Button type="primary" onClick={ this.continueToFill.bind(this) }>继续填写</Button></p>
                    <p>如需修改已提交信息，请点击<Link to='/companyValidate/step1?getInfo=1'>重新认证</Link>。</p>
                </Col>
            </Row>
        );
    }

    _check() {
        return (
            <Row className="tipsRow">
                <Col span={3} className="text-align-center">
                    <Icon type="exclamation-circle" className="tipsIcon exclamation"/>
                </Col>
                {   this.state.accountPassed ?
                    <Col span={21}>
                        <h4>{ this.state.showName }</h4>
                        <p>账号正在审核中，我们将尽快完成审核，结果将以短信通知您。</p>
                        <p>请尽快完成以下认证条件，如需修改信息请联系客服电话：400-106-6698。</p>
                    </Col>
                    :
                    <Col span={21}>
                        <h4>{ this.state.showName }</h4>
                        <p>请根据您的实际情况尽快完成以下未认证项，如需修改信息请联系客服电话：400-106-6698。</p>
                    </Col>
                }
            </Row>
        );
    }

    _disapproval() {
            return (
                <Row className="tipsRow">
                    <Col span={3} className="text-align-center">
                        <Icon type="cross-circle" className="tipsIcon across"/>
                    </Col>
                    <Col span={21}>
                        <h4>{ this.state.showName }</h4>
                        <p>您的资料审核不通过，具体原因请联系分行客户经理。</p>
                        <p>您需要修改资料后重新提交认证申请，如有疑问请联系客服电话：400-106-6698。</p>
                    </Col>
                </Row>
            );
        }
        //更新审核状态
    updatePageType(pageType) {
            console.log('pageType', pageType);
            this.setState({
                pageType: pageType
            })
        }
        //更新对公账户状态
    updateAccountPassed(passed) {
        console.log('accountPassed', passed);
        if (this.state.accountPassed == passed) {
            return false;
        }
        this.setState({
            accountPassed: passed
        })
    }

    render() {
        return (
            <div className="tipsBox">
                { this.headerRender() }
                <TipsContent pageType={ this.state.pageType } isReload={ true } updatePageType={this.updatePageType.bind(this)} updateAccountPassed={this.updateAccountPassed.bind(this)}/>
            </div>
        );
    }
}

export default Check;