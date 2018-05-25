import React, { Component } from 'react'
// import { Breadcrumb } from 'antd';
// import { HashRouter, Route } from 'react-router-dom'
import { renderRoutes } from 'react-router-config'
// const items= [
//     {name:'车辆录入',href:'/carInfo/entry',child:[{name:'新增补全车辆信息',id:'1-1'}]},
// ]
export default class Information extends Component {
  constructor(props) {
    super(props)
    
  }
  render() {
    return (
      <div>
        {renderRoutes(this.props.route.routes)}
      </div>
    )
  }
}
