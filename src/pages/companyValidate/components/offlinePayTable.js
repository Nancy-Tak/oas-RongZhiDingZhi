import React, { Component, PropTypes } from 'react';

//  antd
import { Table } from 'antd';

//  引入线下支付小额验证金核验表格信息
import offlinePayTableInfo from 'PAGES/companyValidate/components/offlinePayTableInfo';

class OfflinePayTable extends Component {
    static propTypes = {
        className: PropTypes.string,
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <p>请在<span className="warning-FontColor">48小时</span>以内，通过<span className="warning-FontColor">网上银行</span>或<span className="warning-FontColor">银行柜台</span>，使用您的对公账户向下面的指定账户支付<span className="warning-FontColor">0.10元</span>验证金 。</p>
                <Table className="fn-mt-15" dataSource={offlinePayTableInfo.dataSource} columns={offlinePayTableInfo.columns} pagination={false}/>
                <p className="fn-mt-15">若超时支付或公司名和对公账户开户名不一致，验证失败。</p>
                <p className="fn-mt-15">本平台不收取任何手续费，如产生手续费等，由发卡行收取。</p>
            </div>
        );
    }
}

export default OfflinePayTable;
