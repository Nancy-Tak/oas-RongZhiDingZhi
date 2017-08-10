// 自定义验证 rule
import ruleType from 'UTILS/ruleType';

const rulesBase = {
    companyName: {
        rules: [{
            required: true,
            message: '企业名称不能为空'
        }, {
            max: 50,
            message: '请输入50位以内的字符'
        }, ]
    },
    registrationExtendField2: {
        rules: [{
                required: true,
                type: 'object',
                message: '营业执照到期日不能为空'
            },
            ruleType('futureTime', '非法的营业执照日期'),
        ]
    },
    name: {
        rules: [{
            required: true,
            message: '您的姓名不能为空'
        }, {
            max: 50,
            message: '请输入50位以内的字符'
        }, ]
    },
    mobile: {
        rules: [{
                required: true,
                message: '填写人常用手机号码不能为空'
            },
            ruleType('mobile')
        ]
    },
    email: {
        rules: [
            ruleType('email'), {
                max: 99,
                message: '请输入99位以内的字符'
            },
        ]
    },
    cardNo: {
        rules: [{
                required: true,
                message: '银行账号不能为空'
            }, {
                min: 5,
                max: 30,
                message: '请输入5-30位字符'
            },
            ruleType('num+minus')
        ]
    },
    bankId: {
        rules: [{
            required: true,
            message: '开户行不能为空'
        }, ]
    },
    provinceId: {
        rules: [{
            required: true,
            message: '所在省份不能为空'
        }],
    },
    cityId: {
        rules: [{
            required: true,
            message: '所在城市不能为空'
        }],
    },
    branchBankId: {
        rules: [{
            required: true,
            message: '分支行不能为空'
        }, ]
    }
}
const rulesCommon = {
    registrationPaperNo: {
        rules: [{
            required: true,
            message: '营业执照注册号不能为空'
        }, {
            max: 30,
            message: '请输入30位以内的字符'
        }, ]
    },
    orgInsCodePaperNo: {
        rules: [{
            required: true,
            message: '组织机构代码证不能为空'
        }, {
            min: 9,
            max: 15,
            message: '请输入9-15位字符'
        }, ]
    }
};

const rulesMultiple = {
    socialCreditPaperNo: {
        rules: [{
            required: true,
            message: '统一社会信用代码不能为空'
        }, {
            min: 13,
            max: 20,
            message: '请输入13-20位字符'
        }, ]
    },
};

const rulesAgent = {
    corporationName: {
        rules: [{
            required: true,
            message: '法定代表人姓名不能为空'
        }, {
            max: 50,
            message: '请输入50位以内的字符'
        }, ]
    },
    corporationMobile: {
        rules: [
            ruleType('mobile')
        ]
    },
    corporationEmail: {
        rules: [
            ruleType('email')
        ]
    },
};

export default {
    rulesBase: rulesBase,
    rulesCommon: rulesCommon,
    rulesMultiple: rulesMultiple,
    rulesAgent: rulesAgent,
}