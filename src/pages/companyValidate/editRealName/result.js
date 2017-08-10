// react 相关库
import React, { Component, PropTypes } from 'react';

//  业务组件
import ResultComponent from '../components/resultComponent';

//  引入fetch
import { fetch } from 'UTILS';

class Result extends Component {
    static propTypes = {
        className: PropTypes.string,
    };

    constructor(props) {
        super(props);
        this.state = {
          pageType : "result"
        }
    }

    render() {
        return (
            <ResultComponent pageType={ this.state.pageType } history={ this.props.history }/>
        );
    }
}

export default Result;
