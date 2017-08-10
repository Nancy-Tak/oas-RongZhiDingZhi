import React, { Component, PropTypes } from 'react';

// antd 组件
import { Row, Col } from 'antd';

class ComfirmContent extends Component {
    static propTypes = {
        className: PropTypes.string,
    };

    constructor(props) {
        super(props);
        this.state = {
        	data : this.props.data
        }
    }

    render() {
    	// console.log(this.state);
    	let data = this.state.data;

        let propNameSpan = 9;
        let propSpan = 15;
        let tips = "";
        if(this.props.type == "realName"){
            propNameSpan = 12;
            propSpan = 12;
            tips = <h4>如您变更了法定代表人或代理人的姓名或手机号码，需重新进行APP实名认证。</h4>;
        }
        return (
            <div>
                {tips}
            	{
            		data.sort.map( (prop,index) => {
            			if(!data.kvp[prop]){ return true; }
            			return (
            				<Row className="fn-mt-10" key={index}>
								<Col span={propNameSpan} className="text-align-right">{data.map[prop]}：</Col>
								<Col span={propSpan}>{data.kvp[prop]}</Col>
							</Row>
            			)
            		})
            	}
            </div>
        );
    }
}

export default ComfirmContent;
