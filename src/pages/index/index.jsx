import React, { Component } from 'react'
// import Routers from '../../router/router'
import { HashRouter, Route ,NavLink } from 'react-router-dom'
import { renderRoutes } from 'react-router-config'
import { Badge } from 'antd';
export default class Index extends Component {
  constructor(props) {
    super(props)
    this.state={
      roles:''
    }
  }
  componentWillMount(){
    this.setState({
      roles:$Funs.cook.get('roles')
    })
  }
  render() {
    return (
      <div className = 'msg'>
        <div className = 'msgBar'>
            <Badge count={5} className = 'fr'>
              <a href="#" className="context">有新的即将过期的消息，请及时处理</a>
            </Badge>
        </div>
        { this.state.roles && <div className = 'navIndex'>
          <div  className = 'clean row'>
            <NavLink to='/carInfo/entry' onClick = {()=>{this.props.handleNav(1)}}><img src={require('../../assets/img/car.png')}/>车辆基本信息</NavLink>
            {(this.state.roles !=1 ) && <NavLink to='/print/prove' onClick = {()=>{this.props.handleNav(2)}}><img src={require('../../assets/img/print.png')}/>打印审核</NavLink>}
            {(this.state.roles !=1 ) && <NavLink to='/charge/save' onClick = {()=>{this.props.handleNav(3)}}><img src={require('../../assets/img/coast.png')}/>收费管理</NavLink>}
          </div>
          {this.state.roles == 0 && <div className = 'clean row'>
            <NavLink to='/information/stop'  onClick = {()=>{this.props.handleNav(4)}}><img src={require('../../assets/img/msg.png')}/>信息管理</NavLink>
            <NavLink to='/system/log'  onClick = {()=>{this.props.handleNav(5)}}><img src={require('../../assets/img/setting.png')}/>系统管理</NavLink>
            <NavLink to='/person'  onClick = {()=>{this.props.handleNav(6)}}><img src={require('../../assets/img/personal.png')}/>人员管理</NavLink>
          </div>}
        </div>}
        
      </div>
    )
  }
}
