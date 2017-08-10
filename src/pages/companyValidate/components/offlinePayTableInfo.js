//	线下支付小额验证金核验表格信息
const offlinePayTableInfo = {
	dataSource: [{
		key: '1',
		name: '中金支付有限公司客户备付金',
		bank: '招商银行',
		account: '1109 0799 6610 999',
		branch: '北京分行宣武门支行'
	}],
	columns: [{
		title: '账户名称',
		dataIndex: 'name',
		key: 'name',
	}, {
		title: '开户行',
		dataIndex: 'bank',
		key: 'bank',
	}, {
		title: '银行账号',
		dataIndex: 'account',
		key: 'account',
	}, {
		title: '分支行',
		dataIndex: 'branch',
		key: 'branch',
	}]
}

export default offlinePayTableInfo;