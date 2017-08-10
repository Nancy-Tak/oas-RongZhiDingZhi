import React, { Component, PropTypes } from 'react';

//  引入fetch
import { fetch } from 'UTILS';

class CountDown extends Component {
    static propTypes = {
        className: PropTypes.string,
    };

    constructor(props) {
        super(props);
        this.state = Object.assign({},this.props,{
			time : 172800000,
			// time : 5000,
			timeDisplay: "",
        });
    }

	componentWillMount() {
		this.state.timeDisplay = this._getTimeDisplay();
	}

	componentDidMount() {
		let me = this;
		fetch('/companyVerification/getBankAccountStatus.do').then(res => {
			me.setState({
				time : res.data.timeLeft * 1000
			});
			me._timeCountDown();
		});
		// this._timeCountDown();
	}

	componentWillUnmount() {
		clearInterval(this.timer);
	}

	_timeCountDown(){
		let me = this;
		me.timer = setInterval(() =>{
			let state = me.state;
			state.time -= 1000;
			state.timeDisplay = me._getTimeDisplay();
			if(state.time < 1000){
				clearInterval(me.timer);
				//	倒计时结束TODO
				state.timeDisplay = undefined;
			}
			me.setState({
				state : state
			});
			// console.log(me.state);
		},1000);
	}

	_getTimeDisplay(){
		let time = this.state.time;
		let secTime = 1000;
		let minTime = 60*secTime;
		let hourTime = 3600*secTime;

		let zeroFill = (num) => {
			return num >= 10 ? num : "0" + num;
		}

		let hour = zeroFill(Math.floor(time/hourTime));
		let min = zeroFill(Math.floor((time - hourTime * hour) / minTime));
		let sec = zeroFill(Math.floor((time - hourTime * hour - minTime * min) / secTime));

		return hour + ":" + min + ":" + sec;
	}

    render() {
    	if(this.state.timeDisplay){
    		return (
	        	<p>
	        		请在
	        		<span className="warning-FontColor fs-26">{ this.state.timeDisplay }</span>
	        		内完成支付
	        	</p>
	        )
    	}else{
			return (<strong className="warning-FontColor fs-16">超过约定时间，系统未收到小额验证金</strong>)
    	}
    }
}

export default CountDown;
