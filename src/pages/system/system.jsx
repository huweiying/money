import React, { Component } from 'react'
import { renderRoutes } from 'react-router-config'

export default class Print extends Component {
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
