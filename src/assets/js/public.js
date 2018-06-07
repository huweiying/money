import $http from "superagent";
import { message , Modal} from 'antd';
const cook = {
  set(name, value, days) {
    var d = new Date();
    if (days == null) {
      days = 1;
    }
    d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * days);
    document.cookie = name + "=" + value + ";path=/;expires=" + d.toGMTString();
  },
  get(name) {
    var v = document.cookie.match("(^|;) ?" + name + "=([^;]*)(;|$)");
    return v ? v[2] : null;
  },
  clear(){
    
  },
  delete(name) {
    cook.set(name, "", -1);
  }
};
const Basse_Port = "http://192.168.1.82:8899/api/v1/";
const main={
  cook: cook,
  Basse_Port: Basse_Port,
  sethistory() {
    cook.set("history", window.location.href);
  },
  setindex() {
    cook.set("index", window.location.href);
  },
  format(format){
      let time=new Date(format);
      return format=time.getFullYear()+"年"+(time.getMonth() + 1)+"月"+time.getDate()+"日";
  },
  $AJAX(newUrl, type, data, callback) {
    let p = new Promise((resolve, reject) => {
      let $put;
      let token = cook.get("token");
      if (token) {
        if (type == "get") {
          $put = $http
            .get(Basse_Port + newUrl, data)
            .set("Authorization", "Bearer " + token)
            .set("Content-Type", "application/json");
        }
        if (type == "patch") {
          $put = $http
            .patch(Basse_Port + newUrl, data)
            .set("Authorization", "Bearer " + token)
            .set("Content-Type", "application/json");
        }
        if (type == "DELETE") {
          $put = $http
            .delete(Basse_Port + newUrl, data)
            .set("Authorization","Bearer "+token)
            .set("Content-Type", "application/json");
        }
        if (type == "post") {
          $put = $http
            .post(Basse_Port + newUrl, data)
            .set("Authorization", "Bearer " + token)
            .set("Content-Type", "application/json");
        }
        $put.end((err, res) => {
          if (err || !res.ok) {
            //错误提示
            message.error('网络错误');
            reject();
          } else {
            if (res.status == 200 || res.status == 201) {
              callback(res.body);
              resolve();
            }
          }
        });
      } else {
        
        // window.location.href = cook.get("index") ;
      }
    });
    return p;
  },
  index_config: {},
  formatDate(data){
    let time = new Date(data)
    let year = time.getFullYear();
    let month = (time.getMonth() + 1)<10 ? '0'+ (time.getMonth() + 1) : time.getMonth() + 1;
    let date = time.getDate() < 10 ? '0' + time.getDate() : time.getDate();
    return year + '-' + month + '-' + date
  }
}
window.$Funs =main;
/*export default {
  cook: cook,
  Basse_Port: Basse_Port,
  sethistory() {
    cook.set("history", window.location.href);
  },
  setindex() {
    cook.set("index", window.location.href);
  },
  $AJAX(newUrl, type, data, callback) {
    let p = new Promise((resolve, reject) => {
      let $put;
      let token = cook.get("token");
      if (token) {
        if (type == "get") {
          $put = $http
            .get(Basse_Port + newUrl,data)
          // .set("Authorization","Bearer "+token)
            .set("Content-Type", "application/json");
        } 
        if(type=="patch"){
            $put = $http
            .patch(Basse_Port + newUrl,data)
         //  .set("Authorization","Bearer "+token)
            .set("Content-Type", "application/json");
        }
        if(type=="post"){
          $put = $http
        //  .post(Basse_Port + newUrl, data)
            .set("Content-Type", "application/json");
        }
        $put.end((err, res) => {
          if (err || !res.ok) {
            //错误提示
            reject();
          } else {
           
            callback("返回数据");
            resolve();
          }
        });
      } else {
        window.location.href = cook.get("index") ;
      }
    })
    return p;
  },
  index_config: {}
};*/
