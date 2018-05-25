import React, { Component } from 'react'
import { Breadcrumb } from 'antd';
// import { HashRouter, Route } from 'react-router-dom'
import { renderRoutes } from 'react-router-config'

export default class carInfo extends Component {
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
