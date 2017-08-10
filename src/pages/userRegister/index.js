/**
 * 新用户注册
 * 
 * by koen
 * 2016/9/21
 */
// 样式
import './style.less';

// react 相关库
import React from 'react';

// antd 组件
import { Tabs, Alert } from 'antd';
const TabPane = Tabs.TabPane;

// 页面组件
import Frame from 'COM/form/frame';
import FormPerson from './formPerson';
import FormCompany from './formCompany';


// 页面
export default class Reg extends React.Component {
  constructor(props){
    super(props);
    this.state={};
  }
  

  render() {
    console.log('router context:',this);
    return (
      <Frame title="填写注册信息">
        <Tabs defaultActiveKey="1">
          <TabPane tab="个人用户" key="1">
            <Alert message="真实姓名必须与身份证信息保持一致。" type="warning" showIcon />
            <FormPerson />
          </TabPane>
          <TabPane tab="企业用户" key="2" history={this.props.history}>
            <Alert message="您企业名称必须与提交的证件信息保持一致。" type="warning" showIcon />
            <FormCompany />
          </TabPane>
        </Tabs>
      </Frame>
    );
  }
}
