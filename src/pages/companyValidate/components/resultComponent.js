/**
 * 提交结果组件
 * limit
 */
// react 相关库
import React, {
  Component,
  PropTypes
} from 'react';

import {
  Link
} from 'react-router';

// antd 组件
import {
  Table,
  Alert,
  Button,
  Row,
  Col,
  Modal
} from 'antd';

//  业务组件
import Content from './content'; //  认证内容组件
import Status from './status'; //  认证状态组件

import Map from './map';

//  引入fetch
import {
  fetch
} from 'UTILS';

// 页面组件（导出）
export default class ResultComponent extends React.Component {
  static propTypes = {
    className: PropTypes.string,
  };

  constructor(props) {
    super(props);

    this.state = {
      data: {
        tableColumns: [{
          title: '认证类型',
          dataIndex: 'type',
          key: 'type',
        }, {
          title: '认证内容',
          dataIndex: 'content',
          key: 'content',
        }, {
          title: '认证状态',
          dataIndex: 'status',
          key: 'status',
        }],
        dataSource: [],
        description: ""
      }
    }
  }

  // componentWillReceiveProps(nextProps) {
  //     this.setState(nextProps);
  // }

  componentDidMount() {
    //  数据加载
    this.loadData();
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

    Promise.all([p1, p2, p3]).then(res => {
      //  未完成认证内容数组
      let unFinishArr = [];

      //  身份实名认证数据处理
      let identityData = [];
      let identityPassed = true;
      res[0].data.map((item, index) => {
        let passed = Map.identityMap.passType[item.checkPass];

        let identityItem = {
          type: Map.identityMap.type[item.connectorType],
          name: item.realName,
          identityCode: item.identityCode,
          passed: passed
        }
        identityData.push(identityItem);

        if (!passed) {
          identityPassed = false;
        }
      });

      //  企业对公账户认证数据处理
      let accountItem = res[1].data[0];
      let accountPassed = Map.accountMap.passType[accountItem.checkStatus];
      let accountData = {
        passed: accountPassed,
        accountValidateType: Map.accountMap.type[accountItem.accountValidateType],
      }

      //  企业资料补充数据处理
      let supplementPassed = Map.supplementMap.passType[res[2].data.status];
      let supplementData = {
        passed: supplementPassed,
      }

      //  未完整认证内容描述
      !identityPassed && unFinishArr.push("身份实名认证");
      !accountPassed && unFinishArr.push("企业对公账户认证");
      !supplementPassed && unFinishArr.push("企业资料补充");

      unFinishArr.map((item, index) => {
        data.description += (index + 1) + "." + item + "；";
      })

      // dataSource
      data.dataSource = [{
        key: '0',
        type: '身份实名认证',
        content: <Content data={identityData} type="identity"/>,
        status: <Status data={identityData} type="identity"/>
      }, {
        key: '1',
        type: '企业对公账户认证',
        content: <Content type={ accountData.accountValidateType } />,
        status: <Status data={ accountData } type={ accountData.accountValidateType } />
      }, {
        key: '2',
        type: '企业资料补充',
        content: <Content type="supplement"/>,
        status: <Status data={supplementData} type="supplement"/>
      }, ];

      me.setState({
        data: data
      })

    }).catch(err => {
      throw err;
    });
  }

  finish() {
    let me = this;
    let stateData = me.state.data;
    fetch('/common/getLoginCheckStatus.do').then(res => {
      if (res.code == 200) {
        let data = res.data;
        if (data.bankCheckStatus == 1) {
          //  审核通过
          this.props.history.push(`accountManagement`);
          return false;
        }
        if (stateData.description != "") {
          //  资料仍然需要补充
          me.tipsShow();
        } else {
          //  不需要补充资料
          me.goToTips();
        }
      }
    });
  }

  goToTips() {
    this.props.history.push('/companyValidate/tips/check');
  }

  tipsShow() {
    let me = this;
    Modal.warning({
      title: '提示',
      content: '您还有实名资料未完成认证，将影响您的审核进度，请尽快完成。',
      onOk() {
        me.goToTips();
      },
    });
  }

  render() {
    let linkBtn = this.props.pageType == "result" ? <Button type="ghost" onClick={ this.goToTips.bind(this) } className="fn-ml-20">稍后认证，返回</Button> : "";
    return (
      <div className="form-frame">
                <Row className="fn-mt-30">
                    <Col offset={1} span={22}>
                        <Alert message="请根据您的实际情况尽快完成以下认证内容："
                           description={ this.state.data.description }
                           type="info"
                           showIcon
                        />

                        <Table className="fn-mt-15" dataSource={this.state.data.dataSource} columns={this.state.data.tableColumns} pagination={false}/>
                    </Col>
                </Row>
                <Row className="fn-mt-30">
                    <Col offset="8" span="8" className="text-align-center">
                        <Button type="primary" onClick={ this.finish.bind(this) } >已完成认证</Button>
                        { linkBtn }
                    </Col>
                </Row>
            </div>
    );
  }
}