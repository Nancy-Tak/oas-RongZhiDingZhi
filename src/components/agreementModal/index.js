/**
 * 协议弹窗
 * wuyongquan
 *
 * 参数说明：
 * {
 *     //入口
 *     iframeData:{
 *          name：[string]协议名字，默认值为"《协议提示》"
 *          iframeSrc：[string]链接地址，默认为空
 *          modalWidth：[string/number]容器的宽度，默认为"60%"
 *          iframeHeight：[string/number]高度，默认为"430px"
 *     }
 *     visible:[boolean] Modal里面的，弹出/关闭窗口 不封在iframeData里面了。
 *     onOk:[function] Modal里面的 确认按钮 不封在iframeData。里面了
 *     onCancel:[function] Modal里面的 关闭按钮 不封在iframeData。里面了
 * }
 * 使用说明
 * <AgreementModal iframeSrc="连接地址" />
 *
 *

 let iframeData = {
     iframeSrc:"https://www.baidu.com/",
     name:this.state.protocolData.protocolName
 }

 <AgreementModal
     visible={ this.state.agreementModalVisible }
     onOk={this.handleAgreementonOK.bind(this)}
     onCancel={this.hideAgreementModal.bind(this)}
     iframeData={iframeData}
     //iframeData={{
     //    iframeSrc:"https://www.baidu.com/",
     //    name:this.state.protocolData.protocolName
     //}}

 >
     <Checkbox
         checked={!this.state.submitDis}
         onChange={this.agreementCheck.bind(this)}
         >
         我已阅读并同意
     </Checkbox>
     <a href="javascript:void(0)" onClick={this.openAgreementModal.bind(this)}>
         {this.state.protocolData.protocolName}
     </a>
 </AgreementModal>
 */
// react 相关库
import React from 'react';
import ReactDOM from 'react-dom';

import './style.less';

// antd 组件
import { Button, Modal, Row, Col } from 'antd';


class AgreementModal extends React.Component{
    constructor(props){
        super(props);
        this.state={
            iframeData:{
                name:this.props.iframeData && this.props.iframeData.name || "《协议提示》",
                iframeSrc:this.props.iframeData && this.props.iframeData.iframeSrc || "",
                modalWidth:this.props.iframeData && this.props.iframeData.modalWidth || "60%",
                iframeHeight:this.props.iframeData && this.props.iframeData.iframeHeight || '430px'
            }

        };
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            iframeData:nextProps.iframeData
        });
    }

    handleOk(){
        console.log('AgreementModal ok');
        this.props.onOk();
    }

    handleCancel(){
        console.log('AgreementModal cancel');
        this.props.onCancel();
    }

    render(){
        return(
            <div className='agreementModal'>
                {this.props.children}
                <Modal
                    title={this.state.iframeData.name}
                    visible={this.props.visible}
                    maskClosable={false}
                    onCancel={this.handleCancel.bind(this)}
                    okText="已阅读并同意此协议"
                    width={this.state.iframeData.modalWidth}
                    wrapClassName="vertical-center-modal"
                    footer={
                        <div style={{
                                "textAlign":"center"
                            }}>
                            <Button type="primary" onClick={this.handleOk.bind(this)}>已阅读并同意此协议</Button>
                        </div>
                    }

                >
                    <iframe
                    src={this.state.iframeData.iframeSrc}
                    scrolling="yes"
                    frameBorder="no"
                    allowTransparency="true"
                    style={{
                        "border": 'none',
                        "width":"100%",
                        "display": 'block',
                        "height":this.state.iframeData.iframeHeight,
                        "overflow": 'hidden'
                    }}
                    name="dialog-iframe1478073723066"
                >

                </iframe>
                </Modal>
            </div>

        )
    }

}

export default AgreementModal;
