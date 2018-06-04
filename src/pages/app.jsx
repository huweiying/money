import React, { Component } from 'react'
// import Routers from '../router/router'
import Header from '../component/header'
import { withRouter } from 'react-router-dom'
import { renderRoutes } from 'react-router-config'
import  Index  from './index/index'
import { message} from 'antd';
// const  navIdx = [0]
 class TApp extends Component {
  constructor(props) {
    super(props)
    this.state={
      navIdx : 0 //导航id
    }
  }
  
  componentWillMount(){
    if(!$Funs.cook.get('userName')){//未登录
      this.props.history.push('/login')
    }else{//已登录
      console.log(this.props.location.pathname)
      if(this.props.location.pathname == '/'){
        return
      }else{
        if($Funs.cook.get('roles') == '1'){//操作员
          if(this.props.location.pathname.split('/')[1] != 'carInfo' ){
            this.props.history.push('/login')
            message.error('您没有该权限，请重新登录')
            return
          }else{
            return
          }
        }else if($Funs.cook.get('roles') == '3'){
          if(this.props.location.pathname.split('/')[1] != 'print' || this.props.location.pathname.split('/')[1] != 'charge' ){
            this.props.history.push('/login')
            message.error('您没有该权限，请重新登录')
            return
          }else{
            return
          }
        }
      }

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