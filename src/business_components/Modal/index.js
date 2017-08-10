import React, {
	Component,
	PropTypes
} from 'react';

// antd 组件
import {
	Modal,
	Button,
	Row,
	Col,
	Icon
} from 'antd';

import appimg from 'ASSETS/images/app.png';

import './style.less';

//  引入文件链接
import FileUrl from 'PAGES/companyValidate/components/fileUrl';

//  全局状态codeimg
import State from 'PAGES/Layouts/state';
const codeimg = State.getState().sysInfo.appQrcodeUrl;

class IdentityModal extends Component {
	static propTypes = {
		className: PropTypes.string,
	};

	constructor(props) {
		super(props);

		this.state = {
			visible: this.props.visible,
			closeCallBack: this.props.closeCallBack
		}
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			visible: nextProps.visible
		});
	}

	showModal() {
		this.setState({
			visible: true,
		});
	}

	handleOk() {
		console.log('点击了确定');
		this.state.closeCallBack();
		this.setState({
			visible: false,
		});
	}

	handleCancel() {
		console.log('点击了关闭');
		this.state.closeCallBack();
		this.setState({
			visible: false,
		});
	}

	render() {
		return ( < Modal ref = "modal"
			visible = {
				this.state.visible
			}
			title = "提示"
			onOk = {
				this.handleOk
			}
			onCancel = {
				this.handleCancel.bind(this)
			}
			footer = {
				[
					<Button key="submit" type="primary" size="large" onClick={this.handleOk.bind(this)}>
	              我知道了
	            </Button>,
				]
			}
			width = "700"
			className = "step4-modal"
			wrapClassName = "vertical-center-modal" >
			<h4>如何实名认证？</h4> < Row className = "fn-mt-20" >
			<Col span={8} className="s4m-step1">
	          		<div className="wh80">
						<h5>第一步：</h5>
						<p>扫描二维码下载APP。</p>
						<div className="text-align-center codeWrp">
							<img className="wh90" src={codeimg} alt=""/>
			    			<p>支持IOS和安卓</p>
			    		</div>
	          		</div>
	          	</Col> < Col span = {
				8
			}
			className = "s4m-step2" >
			<div className="wh80">
						<h5>第二步：</h5>
						<p>使用你的 <span className="red">姓名</span> 及 <span className="red">身份识别码</span> 登录。</p>
						<div className="text-align-center">
							<img className="wh" src={appimg} alt=""/>
			    		</div>
			    	</div> < /Col> < Col span = {
			8
		}
		className = "s4m-step3" >
			<div className="wh80">
						<h5>第三步：</h5>
						<p>完成以下实名信息。</p>
						<ul>
							<li><Icon type="check-circle" className="icon-check"/>上传身份证照</li>
							<li><Icon type="check-circle" className="icon-check"/>人脸识别</li>
							<li><Icon type="check-circle" className="icon-check"/>银行卡验证</li>
						</ul>
					</div> < /Col> < /Row > < /Modal>
	);
}
}

class SupplementModal extends Component {
	static propTypes = {
		className: PropTypes.string,
	};

	constructor(props) {
		super(props);

		this.state = {
			visible: this.props.visible,
			closeCallBack: this.props.closeCallBack
		}
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			visible: nextProps.visible
		});
	}

	showModal() {
		this.setState({
			visible: true,
		});
	}

	handleOk() {
		console.log('点击了确定');
		this.state.closeCallBack();
		this.setState({
			visible: false,
		});
	}

	handleCancel() {
		console.log('点击了关闭');
		this.state.closeCallBack();
		this.setState({
			visible: false,
		});
	}

	render() {
		return ( < Modal ref = "modal"
			visible = {
				this.state.visible
			}
			title = "提示"
			onOk = {
				this.handleOk
			}
			onCancel = {
				this.handleCancel.bind(this)
			}
			footer = {
				[
					<Button key="submit" type="primary" size="large" onClick={this.handleOk.bind(this)}>
	              我知道了
	            </Button>,
				]
			}
			width = "700"
			className = "step4-modal"
			wrapClassName = "vertical-center-modal" >
			<h4>如何补充企业资料？</h4> < Row className = "fn-mt-20" >
			<Col span={8} className="s4m-step1">
	          		<div className="wh80">
						<h5>第一步：</h5>
						<p>点击下载以下资料，打印填写并加盖公章：<a href={ FileUrl.identityProof } download="企业法定代表人身份证明书">《企业法定代表人身份证明书》</a>，<a href={ FileUrl.deletegatePromiseLetter } download="承诺函及授权委托书">《承诺函及授权委托书》</a>。</p>
						<p>准备好营业执照；组织机构代码证（多证合一营业执照可不提供）。</p>
	          		</div>
	          	</Col> < Col span = {
				8
			}
			className = "s4m-step2" >
			<div className="wh80">
						<h5>第二步：</h5>
						<p>由代理人或法定代表人使用 <span className="red">姓名</span> 及 <span className="red">身份识别码</span> 登录实名认证APP。</p>
						<div className="text-align-center">
							<img className="wh" src={appimg} alt=""/>
			    		</div>
			    	</div> < /Col> < Col span = {
			8
		}
		className = "s4m-step3" >
			<div className="wh80">
						<h5>第三步：</h5>
						<p>点击进入附件上传，拍照上传必填资料。</p>
					</div> < /Col> < /Row > < /Modal>
	);
}
}

export {
	IdentityModal,
	SupplementModal
};