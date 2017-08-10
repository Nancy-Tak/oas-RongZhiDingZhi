/**
 * Restate
 * 一个简单的管理全局react state小工具
 *
 * by koen
 * 2016-08-10
 * 
 */
class Restate{
    createState(stateClass) {
        class base extends stateClass{
            getState() {
                return this.getStateSession();
            }
            setState(state, isInit) {
                const updateState = this.getState();

                if(typeof state === 'function'){
                    state(updateState);
                }else{
                    // 遵循react的浅度assign覆盖赋值
                    this.setStateSession(Object.assign(updateState, state));
                }
                if(!isInit){
                    this.reactComponent.setState(typeof state === 'function' ? updateState : state);
                }
            }
            initState(state) {
                if(!this.hasInit){
                    this.setState(state, true);
                }
                this.hasInit = true;
                
                return this.getState();
            }
            bind(reactComponent) {
                this.reactComponent = reactComponent;
                // sessionId
                //this.sessionId = `React_${reactComponent.constructor.name}_${Date.now()}`;
                //console.log(reactComponent)
                
                if(reactComponent.props && reactComponent.props.location){
                    // 尝试合并路由数据
                    let { state } = reactComponent.props.location;
                    Object.assign(this.state, state);
                    // 开发环境打印从location传递过来的数据（方便调试）
                    if(__DEV__ && state) {
                        console.info('Location State:', state);
                    }
                    // 绑定location
                    this.location = reactComponent.props.location;

                    //还原快照判定query=restate
                    const restateID = reactComponent.props.location.query.restate;
                    if(!restateID){
                        Restate.resetState = true;
                    }else{
                        if(this.restateID){
                            if(this.restateID !== restateID){
                                Restate.resetState = true;
                                //赋值新的id
                                this.restateID = restateID;
                            }else{
                                Restate.resetState = false;
                            }
                        }else{
                            //初始id
                            this.restateID = restateID;
                        }
                    }
                }
                //执行reset
                //console.log(Restate.resetState)
                if(Restate.resetState){
                    this.reset();
                }

                //init state
                // if(!this.getStateSession()){
                //     // 复制一份state拷贝
                //     this.setStateSession(this.copy(this.state));
                // }

                return this;
            }
            reset() {
                this.setStateSession(this.copy(this.state));
                this.hasInit = false;
            }
            copy(object) {
                // 复制state专用
                // state一般含有深度嵌套的数据，故不用Object.assign
                // 且state数据一般表现为属性类型（不含有function），故用JSON方法进行深度复制
                return JSON.parse(JSON.stringify(object));
            }
            setStateSession(value) {
                if(this.sessionId){
                    value = JSON.stringify(value);// 转string
                    sessionStorage.setItem(this.sessionId, value);
                }else{
                    this.updateState = value;
                }
            }
            getStateSession() {
                // 获得初始化的state，兼容一些未bind就直接getState()的情况
                if(!this.hasInit){
                    return JSON.parse(sessionStorage.getItem(this.sessionId)) || this.copy(this.state);
                }
                if(this.sessionId){
                    const value = sessionStorage.getItem(this.sessionId);
                    return JSON.parse(value);
                }else{
                    return this.updateState;
                }
            }
            delStateSession() {
                sessionStorage.removeItem(this.sessionId);
                //sessionStorage.clear();
            }
        }
        return new base();
    }
}
export default new Restate();

/*

组件用法简单示例

1、构建它的state/store.js文件

import { restate } from 'helpers';

class ItemState {
    constructor() {
        this.state = {
            data: {
              Product: {}
            }
        };
    }
}
export default restate.createState(ItemState)

2、在组件中引入它的state

import State from './someState';

export default class Item extends React.Component {
    constructor (props) {
        super(props);
        //注意1：这里设置从State获取组件初始state
        this.state = State.bind(this).getState();
    }
    componentDidMount() {
        this.getData();
    }
    getData() {
        fetch('/FrontJsonProduct/Details', {
          body: {
            productID: this.props.location.query.id
          }
        }, this.props).then(res => {
          //注意2：这里用State的setState方法改变组件state，即用restate管理state，并保持全局更新
          State.setState({
            data: res.DicData
          });
        });
    }
    render() {
        return (
            <div>
              <Focus data={this.state.data.Product.Images} />
              <Ctrl data={this.state.data.Product} />
              <Detail data={this.state.data.Product} />
            </div>
        );
    }
}

*/