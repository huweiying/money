import React, { Component } from 'react';
import { Input ,Button ,message} from 'antd';
import { Spin } from 'antd';
import { withRouter } from 'react-router-dom'
import $http from "superagent";

class TLogin extends Component {
  constructor(props) {
    super(props);
    this.state={
      user:'',
      psd:'',
      loading:false
    }
  }
  toggle = (value) => {
    this.setState({ loading: value });
  }

  handleUser=(e)=>{
    this.setState({user:e.target.value})
  }
  handlePsd=(e)=>{
    this.setState({psd:e.target.value})
  }
  repass=()=>{
    this.props.history.push('/repass')
  }
  login=()=>{
    if(this.state.user == ''){
      message.error('请输入用户名');
    }else if(this.state.psd == ''){
      message.error('请输入密码');
    }else{
      this.toggle(true)
      $http.post($Funs.Basse_Port + "auth/login", {username:this.state.user,password:this.state.psd})
      .set("Content-Type", "application/json").end((err, res) => {
        this.toggle(false)
        if (err || !res.ok) {
          message.error('登录失败');
        } else {
          // 成功登录
          $Funs.cook.set('token',res.body.token,7)
          $Funs.cook.set('userName',res.body.userName,7)
          $Funs.cook.set('id',res.body.id,7)
          $Funs.cook.set('name',res.body.name,7)
          $Funs.cook.set('roles',res.body.roles,7)
          this.props.history.push('/')
        }
      });
  
    }
  }
  render() {
    return (
      <div className="login">
        <Spin spinning={this.state.loading} >
          <div className = 'login_box'>
            <div className = 'title'>
              <img src={require('../assets/img/login_title.png')} />
            </div> 
            <div className = 'inner'>
              <div className = 'item'>
                <Input placeholder="用户名" value={this.state.user} onChange={this.handleUser}  style={{ width: 300,height:50 }}/>
                <img src={require('../assets/img/user.png')} />
                </div>
                <div className = 'item'>
                  <Input placeholder="密码" type="password" value={this.state.psd} onChange={this.handlePsd}  style={{ width: 300,height:50 }}/>
                  <img src={require('../assets/img/lock.png')} />
                </div>
                <Button type="primary" onClick = {this.login}>登录</Button>
                <a href="javascript:void(0);" onClick={this.repass}>忘记密码？</a>
            </div>
          </div>
        </Spin>
      </div>
    );
  }
}

const Login = withRouter(TLogin)
export default Login;