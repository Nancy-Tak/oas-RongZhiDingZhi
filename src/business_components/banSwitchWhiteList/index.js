//	核身流程禁止用户非法跳转的一些白名单页面，主要为头部和底部的链接

const banSwitchWhiteList = ["/", "redirect", "/redirect"];

export default banSwitchWhiteList;