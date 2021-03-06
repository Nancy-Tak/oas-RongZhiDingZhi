/**
 * 开发构建配置
 */
const path = require('path');
const webpack = require('webpack');
// 公用配置
const commonConfig = require('./webpack.common');
// WDS
const utils = require('./utils');
const HOST = utils.getIP();
const PORT = 8090;

module.exports = Object.assign(commonConfig, {
    devtool: 'source-map', // 'eval'  生产配置这个： cheap-source-map  测试配置这个：source-map
    cache: true,
    plugins: commonConfig.plugins.concat([
        // 配置全局常量
        new webpack.DefinePlugin({
            'process.env': { // React/Redux打包常用
                NODE_ENV: JSON.stringify('development')
            },
            __DEV__: true,
            __CORS__: false // CORS跨域请求
        })
    ]),
    // webpack dev server 配置
    devServer: {
        host: HOST,
        port: PORT,
        proxy: {
            '/api/*': {
                target: 'http://accountcmb.frontpay.cn/',// 13服务器，需要配host：10.1.21.13 accountcmb.frontpay.cn
                //target: 'http://192.168.8.160:20160/',// mock服务器
                pathRewrite: {
                    '^/api': ''
                },
                secure: false
            }
        }
    }
});
