/**
 * routerWillLeave
 * 一个简单的增加路由生命周期routerWillLeave(准备离开该页面)的方法
 *
 * by limit
 * 2016-11-25
 *
 * react组件使用方法
 	//  引入routerWillLeave
	import routerWillLeaveInit from 'COM/routerWillLeave';

	构造器constructor中加上
	routerWillLeaveInit(this);

	封装routerWillLeave函数即可(默认传参为包含目标路由页面的信息，包括pathname)
**/

const routerWillLeaveInit = (Component) => {
	let {
		history,
		route
	} = Component.props;

	history.listenBeforeLeavingRoute(route, Component.routerWillLeave.bind(Component));
}

export default routerWillLeaveInit;