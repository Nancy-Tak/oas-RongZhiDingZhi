/**
 * fetch wrapper
 */

// 同构 fetch 库
// import fetch from 'isomorphic-fetch';

// 全局 loading 状态
import State from 'PAGES/Layouts/state';
import {
    message,
    Button
} from 'antd';

//  helper
import {
    helper
} from 'UTILS';

/**
 * @param { String } url 异步请求地址，默认为 get 方法
 * @param { PlainObject } data 异步配置参数 [可选]
 * @param { Boolean } showLoading 判断是否显示 Loading [可选]
 * @param { Function } errCallback 自定义错误处理函数 [可选]
 * @param { Function } codeErrCallback 自定义返回码为非200错误处理函数 [可选]
 */
export default (url, data, showLoading, errCallback, codeErrCallback) => {

    // 请求统一自动加上 /api，以便使用 webpack-dev-server 代理
    // 代理会去掉 /api 获取数据

    // CORS跨域判断
    if (__CORS__) {
        url = `${__CORS__.slice(0, -1)}${url}`;
    } else if (__DEV__) {
        url = `/api${url}`;
    }
    //url = __DEV__ ? `/api${url}` : url;

    //  添加时间戳
    url = helper.urlAddParam(url, {
        _t: new Date() / 1
    });

    if (showLoading === undefined) {
        if (typeof data === 'boolean') {
            // 兼容 showLoading 在第二个参数位置设置
            showLoading = data;
            data = {};
        } else {
            // 默认显示loading
            showLoading = true
        }
    }

    // fetch 规范中只有 post 才能设置 body 属性
    // 当为 get 方法时需拼接在 url 上
    if (data && data.body) {

        // 当有body传递时，强制设置为 post 方法
        data.method = 'post';
        // 统一JSON字符串化
        data.body = JSON.stringify(data.body);
    }

    // 合并配置
    data = Object.assign({}, {
        method: "get",
        headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
            // //  注意：这个用于设置无缓存
            // "Cache-Control": "no-cache",
        },
        // 设置cookies跨域
        credentials: 'include' //'same-origin'
    }, data);

    // 显示loading图标
    showLoading && State.showLoading && State.showLoading();

    return new Promise(function(resolve, reject) {

        fetch(url, data)
            .then(res => res.json()) // 数据接口统一为 json
            .then(res => {
                // 隐藏loading图标
                showLoading && State.hideLoading && State.hideLoading();

                // 业务code特定处理
                if (res.code == 200) {
                    resolve(res);
                } else {

                    // 本地联调用到的专用登录页
                    if (__DEV__ && (res.code == "001")) {
                        return location.href = `${location.origin}${location.pathname}#/userLogin`;
                    }

                    // 未登录，页面跳转到指定url登录
                    // "cas=1"是为了中转页面判断第一次登录，记录日志

                    if (res.code == 401) {
                        //提醒登录
                        message.error(`未登录，3秒后将跳到登录页面`);
                        //res.data = res.data.replace(/\?.*/, '');
                        //const url = `${res.data}?service=${location.origin}${location.pathname}${encodeURIComponent('?cas=1')}`;
                        const url = `${res.data}`;
                        //const loginUrl = State.getState().sysInfo.loginUrl;
                        //const url = loginUrl;
                        setTimeout(() => {
                            location.href = url;
                        }, 3000);

                        return;
                    }

                    //alert(`错误代码：${res.ResultCode}, 原因：${res.Message}`)
                    // 处理错误
                    reject(res);

                    //  当返回code不等于200时，自定义错误处理，codeErrCallback返回false不继续往下走
                    if (codeErrCallback && codeErrCallback(res) === false) {
                        return;
                    }

                    if (res.message && !res.fieldName) {
                        message.error(`错误提示：(${res.code})` + res.message, 3);
                    }

                    // 代码提示错误
                    if (res.code == 500) {
                        throw new Error(`错误代码：${res.code}, 原因：${res.message}`);
                    }


                }
            })
            .catch(err => {
                // 隐藏loading图标
                showLoading && State.hideLoading && State.hideLoading();

                if (errCallback) {
                    return errCallback();
                }
                message.error(`错误代码：${ err }`);
                console.error('Fetch Error: %s', err);
            })
    })
}

// 附：后端所有响应代码

// 响应码：200，响应码描述：成功
// 响应码：201，响应码描述：表单信息有修改
// 响应码：202，响应码描述：未通过审核
// 响应码：001，响应码描述：系统内部错误
// 响应码：002，响应码描述：参数错误
// 响应码：003，响应码描述：操作失败
// 响应码：004，响应码描述：验证码失效
// 响应码：005，响应码描述：验证码错误
// 响应码：006，响应码描述：业务类型不合法
// 响应码：007，响应码描述：手机格式不合法
// 响应码：008，响应码描述：邮箱格式不合法
// 响应码：300，响应码描述：账户名错误
// 响应码：301，响应码描述：手机号错误
// 响应码：302，响应码描述：公司名错误
// 响应码：303，响应码描述：用户类型错误
// 响应码：304，响应码描述：真实姓名错误
// 响应码：305，响应码描述：公司名被占用
// 响应码：306，响应码描述：身份证号码已存在
// 响应码：307，响应码描述：密码不符合规则
// 响应码：308，响应码描述：密码与确认密码不一致
// 响应码：309，响应码描述：服务协议不能为空
// 响应码：310，响应码描述：实名认证不通过
// 响应码：400，响应码描述：操作步骤不正确
// 响应码：401，响应码描述：未登录
// 响应码：404，响应码描述：查询数据为空
// 响应码：501，响应码描述：该服务不存在
// 响应码：502，响应码描述：用户已添加该服务
// 响应码：503，响应码描述：邀请码已存在
// 响应码：504，响应码描述：业务渠道编号已存在
// 响应码：601，响应码描述：黑名单用户
// 响应码：701，响应码描述：交易密码不正确
// 响应码：999，响应码描述：登录超时