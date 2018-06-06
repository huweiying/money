import React, { Component } from 'react';
import { Modal } from 'antd';
class Message extends React.Component{
    constructor(props) {
        super(props);
        this.state = ({
          bool:true
        })
      }
    mess=()=>{
        let type=$Funs.cook.get("roles");
        type=type==0?2:1;
        let txt=type==2?"审批通知":"安装/维修"
        $Funs.$AJAX('message', 'get', {type:type}, res => {
            Modal.info({
                title: '提示',
                content: (
                  <div>{
                        "你有"+res.code+"条"+txt+"未处理消息"
                  }
                  </div>
                ),
                onOk() {},
            });
        })
    }
    componentDidMount(){
       
    }
    render() {
        return (
          
            <div className="message">
                <a href="javascript:void(0);" className="context" onClick={this.mess}>
                    有新的即将过期的消息，请及时处理
                </a>
            </div>
        );
    }
}

export default Message;