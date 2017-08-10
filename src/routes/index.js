/*
	Routes 路由配置
*/
import React from 'react';
import { Router, hashHistory } from 'react-router';

const routes = {
  childRoutes: [
    // 不需要公用头部/尾部的页面
    // 登录
      {
          path: 'userLogin',
          getComponent(nextState, cb) {
              require.ensure([], (require) => {
                  cb(null, require('PAGES/userLogin').default);
              });
          }
      },


    // 带头部/尾部样式
    {
      component: require('PAGES/Layouts').default,
      childRoutes: [{
          // 首页跳转
          path: '/',
          indexRoute: {
            onEnter: (nextState, replace) => replace('', 'redirect')
          },
        },
        // 登录跳转页
        {
          path: 'redirect',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('PAGES/redirect').default)
            })
          }
        },
        // 用户注册页
        {
          path: 'userRegister',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('PAGES/userRegister').default)
            })
          }
        },
        // 用户注册页结果页
        {
          path: 'userRegister/result',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('PAGES/userRegister/result').default)
            })
          }
        },

        // 业务错误页面
        {
          path: 'error',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('PAGES/error').default)
            })
          }
        },
          // 注册
          {
              path: 'userRegister',
              getComponent(nextState, cb) {
                  require.ensure([], (require) => {
                      cb(null, require('PAGES/userRegister').default);
                  });
              }
          },
        /***************核身页面 ***************/
        // 审核中提示页(个人)
        {
            path: 'personalValidate/tips/check',
            getComponent(nextState, cb) {
                require.ensure([], (require) => {
                    cb(null, require('PAGES/personalValidate/tips/check/index.js').default)
                })
            }
        },

        // 个人核身-step1
        {
          path: 'personalValidate/step1',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('PAGES/personalValidate/step1').default)
            })
          }
        },
        // 个人核身-step2
        {
          path: 'personalValidate/step2',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('PAGES/personalValidate/step2').default)
            })
          }
        },
        // 个人核身-step3
        {
          path: 'personalValidate/step3',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('PAGES/personalValidate/step3').default)
            })
          }
        },
        // 个人核身-step4
        {
          path: 'personalValidate/step4',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('PAGES/personalValidate/step4').default)
            })
          }
        },
        // 核身信息提示页(企业)
        {
            path: 'companyValidate/tips/check',
            getComponent(nextState, cb) {
                require.ensure([], (require) => {
                    cb(null, require('PAGES/companyValidate/tips/check/index.js').default)
                })
            }
        },
        // 企业核身-step1
        {
          path: 'companyValidate/step1',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('PAGES/companyValidate/step1/index.js').default)
            })
          }
        },
        // 企业核身-step2
        {
          path: 'companyValidate/step2',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('PAGES/companyValidate/step2/index.js').default)
            })
          }
        },
        // 企业核身-step3
        {
          path: 'companyValidate/step3',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('PAGES/companyValidate/step3/index.js').default)
            })
          }
        },
        // 企业核身-step4
        {
          path: 'companyValidate/step4',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('PAGES/companyValidate/step4/index').default)
            })
          }
        },
        // 修改基本信息(企业)
        {
          path: 'companyValidate/editBasic',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('PAGES/companyValidate/editBasic/index').default)
            })
          }
        },
        //  证件资料上传(企业)
        {
          path: 'companyValidate/documentUpload',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('PAGES/companyValidate/documentUpload/index').default)
            })
          }
        },
        //  修改实名认证(企业)
        {
          path: 'companyValidate/editRealName',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('PAGES/companyValidate/editRealName/index').default)
            })
          }
        },
        //  提交结果(企业)
        {
          path: 'companyValidate/result',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('PAGES/companyValidate/editRealName/result').default)
            })
          }
        },
        /***************核身页面 end ***************/
        /*************** 账户管理 ***************/
        // 账户管理首页
        {
          path: 'accountManagement',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('PAGES/accountManagement/home').default);
            });
          }
        },
        {
          path: 'accountManagement/home',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('PAGES/accountManagement/home').default);
            });
          }
        },
        // 账户管理基本信息
        {
          path: 'accountManagement/basicInformation',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('PAGES/accountManagement/basicInformation').default);
            });
          }
        },
        // 账户管理修改密码
        {
          path: 'accountManagement/resetPassword/step1',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('PAGES/accountManagement/resetPassword/step1').default);
            });
          }
        },
        {
          path: 'accountManagement/resetPassword/step2',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('PAGES/accountManagement/resetPassword/step2').default);
            });
          }
        },
        // 账户管理修改交易密码 步骤1
        {
          path: 'accountManagement/resetTradingPassword/step1',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('PAGES/accountManagement/resetTradingPassword/step1').default);
            });
          }
        },
        //账户管理修改交易密码 步骤1-2
        {
          path: 'accountManagement/resetTradingPassword/step1-2',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('PAGES/accountManagement/resetTradingPassword/step1-2').default);
            });
          }
        },
        // 账户管理修改交易密码 步骤2
        {
          path: 'accountManagement/resetTradingPassword/step2',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('PAGES/accountManagement/resetTradingPassword/step2').default);
            });
          }
        },
        // 账户管理修改交易密码 步骤3
        {
          path: 'accountManagement/resetTradingPassword/step3',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('PAGES/accountManagement/resetTradingPassword/step3').default);
            });
          }
        },
        /***************账户管理 end ***************/

        /***************重置登录密码(密码找回) start *************/
        {
          path: 'resetPassword/step1',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('PAGES/resetPassword/step1').default);
            });
          }
        },

        {
          path: 'resetPassword/step2/autherized/index1',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('PAGES/resetPassword/step2/autherized/index1').default);
            });
          }
        },
        {
          path: 'resetPassword/step2/autherized/index2',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('PAGES/resetPassword/step2/autherized/index2').default);
            });
          }
        },
        {
          path: 'resetPassword/step2/unautherized',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('PAGES/resetPassword/step2/unautherized').default);
            });
          }
        },
        {
          path: 'resetPassword/step3',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('PAGES/resetPassword/step3').default);
            });
          }
        },
        {
          path: 'resetPassword/step4',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('PAGES/resetPassword/step4').default);
            });
          }
        },
        /***************重置登录密码(密码找回) end ***************/
        // test
        {
          path: 'test',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('PAGES/test').default);
            });
          }
        },
        // 404
        {
          path: '*',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('PAGES/404').default);
            });
          }
        }
      ]
    }



  ]
};

export default <Router history = {hashHistory} routes = {routes} />;
