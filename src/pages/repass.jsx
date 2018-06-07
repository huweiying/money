import React, { Component } from "react";
import { Input, Button, message } from "antd";
export default class password extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: "",
      psd: "",
      yzm: "",
      seconds: 59,
      dlgTipTxt: "发送验证码",
      yzming: false
    };
  }
  back =()=>{
    this.props.history.push('/login')
  }
  handleUser = e => {
    this.setState({ user: e.target.value });
  };
  handlePsd = e => {
    this.setState({ psd: e.target.value });
  };
  yzm = e => {
    this.setState({ yzm: e.target.value });
  };
  sendcode = () => {
    if (!this.state.user) {
      message.error("请输入手机号");
      return false;
    }
    if (
      !/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test(
        this.state.user
      )
    ) {
      message.error("请输入正确的手机号");
      return false;
    }
 
    if (!this.state.yzming) {
      window.$Funs.$AJAX(
        "basis/user/" + this.state.user + "/phone/code",
        "post",
        null,
        res => {
          let siv = setInterval(() => {
            this.setState(
              preState => ({
                seconds: preState.seconds - 1,
                yzming: true,
                dlgTipTxt: `${preState.seconds - 1}s重新发送`
              }),
              () => {
                if (this.state.seconds == 0) {
                  clearInterval(siv);
                  this.setState({
                    yzming: false
                  });
                }
              }
            );
          }, 1000);
        }
      );
    }
  };
  repass = e => {
    if(!this.state.yzm || !this.state.psd){
        message.error("请输入完整");
        return false;
    }
    window.$Funs.$AJAX(
      "basis/user/" +
        this.state.user +
        "/phone/code/" +
        this.state.yzm +
        "/check",
      "get",
      null,
      res => {
        if (res) {
          window.$Funs.$AJAX(
            "auth/user/" + this.state.user + "/pwd",
            "patch",
            {
              code: this.state.yzm,
              newPwd: this.state.psd
            },
            res => {
                message.success("修改成功");
                setInterval(e=>{
                    this.props.history.push('/login')
                },1000)
                
            }
          );
        }
      }
    );
  };
  render() {
    return (
      <div className="login">
        <div className="repass">
          <div className="title">
            <img src={require("../assets/img/login_title.png")} />
          </div>
          <div className="inner ">
            <div className="item">
              <Input
                placeholder="用户名"
                value={this.state.user}
                onChange={this.handleUser}
                style={{ width: 300, height: 50 }}
              />
            </div>
            <div className="item">
              <Input
                placeholder="验证码"
                value={this.state.yzm}
                onChange={this.yzm}
                style={{ width: 160, height: 50 }}
              />
              <Button
                style={{ width: 120, height: 50, marinTop: 0 }}
                onClick={this.sendcode}
              >
                {this.state.dlgTipTxt}
              </Button>
            </div>
            <div className="item">
              <Input
                placeholder="新密码"
                type="password"
                value={this.state.psd}
                onChange={this.handlePsd}
                style={{ width: 300, height: 50 }}
              />
            </div>
          </div>
          <Button type="primary" onClick={this.repass}>
            确认修改
          </Button>
          <a onClick={this.back} className="back">返回</a>
        </div>
      </div>
    );
  }
}
