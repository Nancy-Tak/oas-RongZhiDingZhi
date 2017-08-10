import React, { Component, PropTypes } from 'react';


// antd 组件
import { Row, Col } from 'antd';

import './style.less';

export default class Content extends Component{
     static propTypes = {
        className: PropTypes.string,
    };

    constructor(props) {
        super(props);
        this.state = this.props;
        this.state = Object.assign({},this.state,{
            statusData : {
                identity : {
                    0 : '未认证',
                    1 : '已认证'
                },
                bond : {
                    0 : '未收到小额验证金',
                    1 : '已收到小额验证金',
                },
                information : {
                    0 : '未提交',
                    1 : '已提交'
                },
                supplement : {
                    0 : '未提交',
                    1 : '已提交'
                }
            }
        });
    }

    componentWillReceiveProps(nextProps) {
        this.setState(nextProps);
    }

    identity(){
        let data = this.state.data;
        return (
            <div className={this.state.data.length > 1 ? "doubleTd" : ""}>
                {data.map((item,index) =>{
                    let passType = item.passed ? 1 : 0;
                    return (
                        <Row key={index} className="row">
                            <Col span={24}>
                                <span className={passType == 1 ? "success-FontColor1" : "error-FontColor1"}>{this.state.statusData[this.props.type][passType]}</span>
                            </Col>
                        </Row>
                    )
                })}
            </div>
        )
    }

    render(){
        if(this.props.type === 'identity'){
            return this[this.props.type]();
        }else{
            let passType = this.state.data.passed ? 1 : 0;
            return (
                <span className={passType == 1 ? "success-FontColor1" : "error-FontColor1"}>{this.state.statusData[this.props.type][passType]}</span>
            )
        }
    }
}
