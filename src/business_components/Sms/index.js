// 使用方式：
// 传入data
// data : {
//     businesstype : 业务类型 （1：身份核实，2.重置登录密码，3：重置交易密码）
//     connectorType: 关系人类型 （2：企业法人，3：经办人）（个人账户不用传，企业账户必须）
// };

import React, { Component, PropTypes } from 'react';

// antd 组件
import { Button, Modal, Row, Col } from 'antd';

//初始


let map = {
    connectorType : {
        1 : "真实姓名：",
        2 : "法定代表人姓名：",
        3 : "委托代理人姓名："
    }
}
//  引入fetch
import { fetch } from 'UTILS';

class Sms extends Component {
    static propTypes = {
        className: PropTypes.string,
    };

    constructor(props) {
        super(props);
        this.state = Object.assign({},this.props,{
            timeGo : 0,
            showData : {},
            iTime:null
        });
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            data:nextProps.data
        })
    }
    sms() {
    	let me = this;

		fetch('/common/pinCode.do',{
			body : {
			  businessType : me.state.data.businesstype,
			  connectorType : me.state.data.connectorType,
              isFirst : false           //  这里为重新发送写死
			}
		}).then(res => {
            if(res.code == 200){
            	// console.log(res);
                //	重新发送验证码TODO
                // console.log(res)
                me.setState({
                    showData : res.data,
                    iTime:res.data.name
                })

				me.success(60,this.state.iTime);
            }
        });
    }

    success(timeGocountdown,iTime){
    	let me = this;
		Modal.success({
		    title: '实名认证邀请已发送，请尽快完成认证。',
		    content: me._getSuccessContent()
		});

        // console.log(iTime)
        clearInterval(iTime);
        iTime = setInterval(()=>{
            timeGocountdown--
            if(timeGocountdown==0){
                clearInterval(iTime);
            }
            this.setState({
                timeGo:timeGocountdown
            })
        },1000)

    }
    componentWillUnmount(){
        clearInterval(this.state.iTime);
    }

    _getSuccessContent(){
        let data = this.state.showData;
    	return (
    		<div>
	    		<Row>
					<Col span={8} className="text-align-right">{ map.connectorType[data.connectorType] }</Col><Col span={16}>{data.realName}</Col>
	    		</Row>
	    		<Row>
					<Col span={8} className="text-align-right">身份识别码：</Col><Col span={16}>{ data.identityCode }</Col>
	    		</Row>
                {
                    data.mobile ? 
                    <Row>
                        <Col span={8} className="text-align-right">接收手机号码：</Col><Col span={16}>{ data.mobile }</Col>
                    </Row>
                    :
                    ""
                }
    		</div>
    	);
    }

    render() {
         // console.log(this)
        return (
            <Button type="primary" disabled={this.state.timeGo>0?true:false}  onClick={ this.sms.bind(this) } size="small">
                { this.props.children }
                {this.state.timeGo>0?this.state.timeGo+"秒":""}
            </Button>
        );
    }
}

export default Sms;
