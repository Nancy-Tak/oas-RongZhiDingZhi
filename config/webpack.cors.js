/**
 * CORS跨域构建配置
 */
const path = require('path');
const webpack = require('webpack');
// 公用配置
const commonConfig = require('./webpack.common');
// WDS
const utils = require('./utils');
const HOST = 'localhost';
const PORT = 8080;

// CORS跨域服务器地址
const CORS_URL = 'http://accountcmb.frontpay.cn/';

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
            __CORS__: JSON.stringify(CORS_URL) // CORS跨域请求
        })
    ]),
    // webpack dev server 配置
    devServer: {
        host: HOST,
        port: PORT
    }
});
