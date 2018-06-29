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
      roles:window.$Funs.cook.get('roles')
    })
  }
  render() {
    return (
      <div className = 'msg'>
        { this.state.roles !=1 && <div className = 'navIndex'>
          <div  className = 'clean row'>
            <NavLink to='/carInfo/entry' onClick = {()=>{this.props.handleNav(1)}}><img src={require('../../assets/img/car.jpg')}/>车辆基本信息</NavLink>
            <NavLink to='/print/prove' onClick = {()=>{this.props.handleNav(2)}}><img src={require('../../assets/img/print.jpg')}/>打印审核</NavLink>
            <NavLink to='/charge/save' onClick = {()=>{this.props.handleNav(3)}}><img src={require('../../assets/img/coast.jpg')}/>收费管理</NavLink>
          </div>
          <div className = 'clean row'>
            <NavLink to='/information/stop'  onClick = {()=>{this.props.handleNav(4)}}><img src={require('../../assets/img/msg.jpg')}/>信息管理</NavLink>
            {this.state.roles == 0 && <NavLink to='/system/log'  onClick = {()=>{this.props.handleNav(5)}}><img src={require('../../assets/img/setting.jpg')}/>系统管理</NavLink>}
            {this.state.roles == 0 && <NavLink to='/person'  onClick = {()=>{this.props.handleNav(6)}}><img src={require('../../assets/img/personal.jpg')}/>人员管理</NavLink>}
          </div>
        </div>}
        { this.state.roles == 1 && 
        <div className = 'navIndex'>
          <div  className = 'clean row'>
            <NavLink to='/carInfo/entry' onClick = {()=>{this.props.handleNav(1)}}><img src={require('../../assets/img/car.jpg')}/>车辆基本信息</NavLink>
            <NavLink to='/information/stop'  onClick = {()=>{this.props.handleNav(4)}}><img src={require('../../assets/img/msg.jpg')}/>信息管理</NavLink>
          </div>
        </div>
        }
      </div>
    )
  }
}
