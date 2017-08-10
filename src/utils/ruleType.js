/**
 * 表单验证规则（for Ant）
 *
 * by koen
 * 2016/9/28
 */

// Ant 验证中默认可用的 type 类型有：
//
// string: Must be of type string. This is the default type.
// number: Must be of type number.
// boolean: Must be of type boolean.
// method: Must be of type function.
// regexp: Must be an instance of RegExp or a string that does not generate an exception when creating a new RegExp.
// integer: Must be of type number and an integer.
// float: Must be of type number and a floating point number.
// array: Must be an array as determined by Array.isArray.
// object: Must be of type object and not Array.isArray.
// enum: Value must exist in the enum.
// date: Value must be valid as determined by Date
// url: Must be of type url.
// hex: Must be of type hex.
// email: Must be of type email.

// 自定义数据类型
const dataType = {
    // 任意字符
    "any": {
        reg: /[\w\W]+/
    },
    // 4-20任意字符
    // "*4-20": /^[\w\W]{4,20}$/,
    // 数字
    "number": {
        reg: /^\d+$/,
        errMsg: '只能是数字'
    },
    // 中文
    "cn": {
        reg: /^[\u4E00-\u9FA5\uf900-\ufa2d]+$/,
        errMsg: '只能是中文'
    },
    // 英文/数字组合
    "en-num": {
        reg: {
            // 自定义 test 方法
            test: function(value) {
                return /[a-zA-Z]+(?=[0-9]+)|[0-9]+(?=[a-zA-Z]+)/.test(value) && 　value.replace(/[a-zA-Z]/g, '').replace(/[0-9]/g, '') === '';
            }
        },
        errMsg: '必须是英文字母、数字组合'
    },
    // 邮政编码
    "post": {
        reg: /^[0-9]{6}$/,
        errMsg: '邮政编码格式不正确'
    },
    // 手机
    "mobile": {
        reg: /^13[0-9]{9}$|^147[0-9]{8}$|^15[0-9]{9}$|^17(0|7)[0-9]{8}$|^18[0-9]{9}$/,
        errMsg: '手机格式不正确'
    },
    // email
    "email": {
        reg: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
        errMsg: '邮箱格式不正确'
    },
    // url
    "url": {
        reg: /^(\w+:\/\/)?\w+(\.\w+)+.*$/,
        errMsg: 'url格式不正确'
    },
    //idcard
    "id-card": {
        reg: /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/,
        errMsg: '身份证号码格式不正确'
    },
    //英文字母（区分大小写）、数字或符号组合(三选二 )
    // "password": {
    //     reg: {
    //         // 自定义 test 方法
    //         test: function(value) {
    //             const regArr = [/[0-9]\d*/, /[A-Za-z]+/, /[_\-~\*\(\)\!@\#\$%\^\.·•,&]+/];
    //             let matchNum = 0;
    //             regArr.map((item, index) => {
    //                 if (item.test(value)) {
    //                     matchNum++;
    //                 }
    //             });
    //             let isMatch = matchNum >= 2;
    //             return isMatch;
    //         }
    //     },
    //     errMsg: '必须为英文字母（区分大小写）、数字或符号组合'
    // },
    "password":{
        reg: /^[a-zA-Z_\-~\*\(\)\!@\#\$%\^\.·•,&]+$|^[0-9_\-~\*\(\)\!@\#\$%\^\.·•,&]+$|^[0-9a-zA-Z]+$|^[0-9a-zA-Z_\-~\*\(\)\!@\#\$%\^\.·•,&]+$/,
        errMsg: "必须为英文字母（区分大小写）、数字或符号组合"
    },
    //验证由数字和26个英文字母组成的字符串 4-20位
    "en+num": {
        reg: /^[A-Za-z0-9]+$/,
        errMsg: "只能输入英文、数字"
    },
    //中文、英文、可含半角标点符号•.,-_~ *()!@#$%^&
    "cn+en+str": {
        reg: /^[\u4e00-\u9fa5_\-~\*\(\)\!@\#\$%\^\.·•,&a-zA-Z]+$/,
        errMsg: "中文、英文、常用字符"
    },
    //不能为今天或过去的日期(value必须为Date对象)
    "futureTime": {
        reg: {
            // 自定义 test 方法
            test: function(value) {
                return value > new Date();
            }
        },
        errMsg: '非法日期'
    },
    //  匹配数字和半角标点符号-
    "num+minus": {
        reg: {
            // 自定义 test 方法
            test: function(value) {
                value = value.toString();
                let reg = new RegExp(/([0-9]|-)+/);
                if (!value.match(reg)) {
                    return false;
                }

                return value.match(reg)[0].length == value.length;
            }
        },
        errMsg: '必须为数字或半角符号-'
    },
};

// 生成 Ant 验证规则 rule
export default function getRule(type, errMsg) {
    const validate = dataType[type];
    if (validate) {
        return {
            validator: function(rule, value, callback) {
                // console.log(rule)
                if (!value) {
                    callback();
                } else {
                    if (!validate.reg.test(value)) {
                        callback([new Error(errMsg || validate.errMsg)]);
                    } else {
                        callback();
                    }
                }
            }
        }
    }
}