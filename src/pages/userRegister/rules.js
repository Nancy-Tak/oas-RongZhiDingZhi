/**
 * 表单验证规则(废弃)
 * 
 * by koen
 * 2016/9/21
 */
export default {
    inviteCode: {
        rules: [{
            required: true,
            message: '邀请码不能为空'
        }, ]
    },
    userName: {
        rules: [{
                required: true,
                message: '真实姓名不能为空'
            },
            ruleType('cn')
        ]
    },
    CompanyName: {
        rules: [{
            required: true,
            message: '企业名不能为空'
        }, ]
    },
    accountId: {
        rules: [{
                required: true,
                message: '登录名不能为空'
            }, {
                min: 4,
                max: 20,
                message: '请输入4-20位字符'
            },
            ruleType('en-num')
        ]
    },
    loginPassword: {
        rules: [{
                required: true,
                message: '密码不能为空'
            }, {
                min: 8,
                max: 20,
                message: '请输入8-20位字符'
            }, {
                validator: this.checkPassWord.bind(this)
            },
            ruleType('en-num')
        ]
    },
    loginPasswordAgain: {
        rules: [{
            required: true,
            message: '请再次输入密码'
        }, {
            validator: this.checkPassWordAgain.bind(this)
        }]
    },
    userMobile: {
        rules: [{
                required: true,
                message: '手机号码不能为空'
            },
            ruleType('mobile')
        ]
    },
    vCode: {
        rules: [{
            required: true,
            message: '短信验证码不能为空'
        }]
    }
}
