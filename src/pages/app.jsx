import React, { Component } from 'react'
// import Routers from '../router/router'
import Header from '../component/header'
import { withRouter } from 'react-router-dom'
import { renderRoutes } from 'react-router-config'
import  Index  from './index/index'

// const  navIdx = [0]
 class TApp extends Component {
  constructor(props) {
    super(props)
    this.state={
      navIdx : 0 //导航id
    }
  }
  componentWillMount(){
    if(!$Funs.cook.get('userName')){
      this.props.history.push('/login')
    }
  }
  handleNav = (i)=>{
    this.setState({
      navIdx:i
    })
  }
  render() {
    return (
      <div>
        <Header navIdx = {this.state.navIdx}></Header>
        { location.hash == '#/'  && (<Index handleNav = {this.handleNav}/>)}
        <div className = 'container'>
          {renderRoutes(this.props.route.routes)}
        </div>
      </div>
    )
  }
}
const App=withRouter(TApp)

export default App