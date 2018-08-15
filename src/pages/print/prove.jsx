import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Base64 } from 'js-base64';
import { Table, Input, Button, Form, Select, Pagination, Modal, message, Breadcrumb ,Radio,Spin,Switch} from 'antd';
const FormItem = Form.Item;
const Search = Input.Search;
const Option = Select.Option;
import Finds from "../../component/find"
import Arrs from "../../assets/js/formArray"
import domtoimage from "dom-to-image";
// import { renderRoutes } from 'react-router-config'

const itemColumns = [
  { title: '证明编号', dataIndex: 'num', key: 'it-num', width: 150, align: 'center' },
  { title: '打印时间', dataIndex: 'createTime', key: 'it-createTime', width: 200, align: 'center' },
  { title: '打印说明', dataIndex: 'type', width: 150, key: 'it-type', align: 'center' },
  { title: '是否作废', dataIndex: 'status', width: 150, key: 'status', align: 'center' }
];

class MainList extends Component {  
  constructor(props) {
    super(props)
    this.state = {
      loading:true,
      list: [],
      status: ['未审核', '审核中', '已通过', '未通过'],
      Bstatus: ['未作废', '已作废',],
      nowpage: 1, //当前页  个坑逼框架
      form: {},
      car: {     //查看详情 -- 底下列表 和 车牌
        privelist: [],
        carnum: null
      },
      print: {

      },
      close: true,
      nav:{
        selected:0,
        list:[
          {
            tit:"付费后打印",
            href:'1',
            selected:true
          },
          {
            tit:"旧车辆打印",
            href:'2',
            selected:false
          },
          {
            tit:"补全信息打印",
            href:'3',
            selected:false
          }
        ]
      }
    }
  }
  componentWillMount() {
    this.list({
      currPage: 1,
      pageSize: 10
    })
  }
  sub(e) {
    let Arr = e;
    Arr.currPage = 1;
    Arr.pageSize = 10;
    this.setState({
      form: Arr,
      nowpage: 1,
      loading:true
    },()=>{
      this.list(Arr)
    })
  }
  list=(data)=>{
    let index=this.state.nav.selected;
    if(index==0){
      window.$Funs.$AJAX('proves', 'get', data, res => {
        res.data = res.data.map((v, i) => {
          // window.$Funs.format(v.paymentDate)
          v.paymentDate = window.$Funs.formatDate(v.paymentDate)
          v.deadlineDate = window.$Funs.formatDate(v.deadlineDate)
          v.nowstatus = this.state.status[v.status];
          v.leaveFactoryDate = v.leaveFactoryDate.split(' ')[0]
          v.key = i
          return v
        })
        this.setState({
          list: res.data,
          total: res.count,
          loading:false
        })
      })
    }
    else if(index==1){
      window.$Funs.$AJAX('cars', 'get', data, res => {
        res.data = res.data.map((v, i) => {
          // window.$Funs.format(v.paymentDate)
          v.nowstatus = this.state.status[v.status];
          v.leaveFactoryDate = v.leaveFactoryDate.split(' ')[0]
          v.key = i
          return v
        })
        this.setState({
          list: res.data,
          total: res.count,
          loading:false
        })
      })
    }else{
      window.$Funs.$AJAX('newCars', 'get', data, res => {
        let data = res.data.map((v,i)=>{
          v.carDto.key = i;
          v.carDto.proid=v.id;
          v.carDto.newstatus=v.status;
          v.carDto.printHistoryDTOS=v.printHistoryDTOS;
          v.carDto.leaveFactoryDate = v.carDto.leaveFactoryDate.split(' ')[0];
          v.stop == 0 ? v.carDto.stop = '否' : v.carDto.stop = '是' 
          v.carDto.photoCodes = v.photoCodes; 
          return v.carDto
        })

        this.setState({
          list: data,
          total: res.count,
          loading:false
        })
      })
    }
  }
  pageChange = (page) => {
    this.setState({
      nowpage: page,
      loading:true,
    },()=>{
      let Brr = this.state.form;
      Object.assign(Brr, {
        currPage: page,
        pageSize: 10
      });
      this.list(Brr)
    })
  }
  sh=(id,index)=>{
    let data = this.state.list, _this = this;
    let type=parseInt(_this.state.nav.selected)+1;
    Modal.confirm({
      title: '申请打印',
      content: '确认提交？',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        window.$Funs.$AJAX("prove/" + id, "post", {
          baseInteger:type,
          baseString:window.$Funs.cook.get('name')
        }, e => {
          data[index].nowstatus = '审核中'
          data[index].status = 1
          _this.setState({
            list: data
          })
          message.success('提交成功')
        })
      }
    });
  }
  look = (list, carnum, id, status) => { 
    console.log(list)
    for(let val of list){
      val.createTime= window.$Funs.formatDate(val.createTime)
      val.status=this.state.Bstatus[val.status];
    }
    this.setState({
      close: false,
      car: {
        privelist: list,
        carnum: carnum
      },
      print: {
        status: this.state.status[status],
        id: id
      }
    },() => {
      window.scroll(0,2000) 
    })
  }
  printfalse = (id) => {
    Modal.confirm({
      title: '申请取消打印?',
      content: '确认提交？',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        window.$Funs.$AJAX('prove/'+id+'/delete', 'post', null, e => {
          message.success('已取消')
          setTimeout(() => {
            location.reload();
          }, 500);
        })
      }
    });
  }
  want=()=>{
    let type=parseInt(this.state.nav.selected)+1;
    let numid;
    if(this.state.car.privelist.length>0){
      numid=this.state.car.privelist[this.state.car.privelist.length-1]
    }else{
      numid={num:0};
    }
   
    // let print=this.state.print;
    // print.numid=numid
    // this.setState({
    //   print:print
    // })
    this.props.want(this.state.print.id,type,numid);
    
  }
  prosct=(index)=>{
    document.getElementById("form").reset()
    let nav=this.state.nav;
    if(nav.list[index].selected) return false;
    for(let val of nav.list){
      val.selected=false
    }
    nav.selected=index;
    nav.list[index].selected=true;
    this.setState({
      nav:nav,
      form:{},
      nowpage:1
    },);
    this.list({
      currPage: 1,
      pageSize: 10
    })
    
  }
  render() {
    let index=this.state.nav.selected, columns = [],x=0;
    let liketype;
    if(index==0) {
      liketype=Arrs.prove.prove;  
      x=2100;
      columns = [
      { title: '车牌号', width: 100, dataIndex: 'vehiclePlate', key: 'vehiclePlate', align: 'center' },
      { title: 'SIM卡号', width: 100, dataIndex: 'sim', key: 'sim', align: 'center'},
      { title: '终端号', dataIndex: 'manageNum', key: 'manageNum', width: 150, align: 'center' },
      { title: '公司车队', dataIndex: 'teamName', key: 'teamName',  width: 150, align: 'center' },
      { title: '付款时间', dataIndex: 'paymentDate', key: 'paymentDate', width: 100, align: 'center' },
      { title: '有效期', dataIndex: 'deadlineDate', key: 'deadlineDate', width: 100, align: 'center' },
      { title: '车辆类型', dataIndex: 'typeName', key: 'typeName', width: 150, align: 'center' },
      { title: '审核状态', dataIndex: 'nowstatus', key: 'nowstatus', width: 100, align: 'center' },
      { title: '联系方式', dataIndex: 'phone', key: 'phone', width: 150, align: 'center' },
      { title: '终端说明', dataIndex: 'deviceName', key: 'deviceName', width: 150, align: 'center' },
      { title: '车牌颜色', dataIndex: 'carColor', key: 'carColor', width: 100, align: 'center' },
      { title: '发票号', dataIndex: 'invoiceNum', key: 'invoiceNum', width: 150, align: 'center' },
      { title: '安装时间', dataIndex: 'leaveFactoryDate', key: 'leaveFactoryDate', width: 100, align: 'center' },
      {
        title: '操作', key: 'operation', width: 150, align:'center',fixed:'right', render: (res, index) => {
          if (res.status == 0 || res.status == 3) {
            return (
              <Button type="primary" onClick={(item) => this.sh(res.id, res.key)}>申请</Button>
            )
          } else {
            return (
              <Button  onClick={() => this.look(res.printHistoryDTOS, res.vehiclePlate, res.id, res.status)}>详情</Button>
            )
          }
        }
     }]
    }
    else if(index==1){
      liketype=Arrs.prove.entry;
      x=2100;
      columns = [
        { title: '安装日期', width: 100, dataIndex: 'leaveFactoryDate', key: 'leaveFactoryDate',align: 'center' },
        { title: '公司车队', width: 200, dataIndex: 'teamName', key: 'teamName' ,align: 'center' },
        { title: '车辆类型', dataIndex: 'typeName', key: 'typeName', width: 150 ,align: 'center' },
        { title: '终端说明', dataIndex: 'deviceName', key: 'deviceName', width: 150 ,align: 'center' },
        { title: '车牌号', dataIndex: 'vehicleId', key: 'vehicleId', width: 150 ,align: 'center' },
        { title: 'SIM卡类型', dataIndex: 'simTypeName', key: 'simTypeName', width: 150 ,align: 'center' },
        { title: 'SIM卡号', dataIndex: 'sim', key: 'sim', width: 150 ,align: 'center' },
        { title: '终端号', dataIndex: 'manageNum', key: 'manageNum', width: 150 ,align: 'center' },
        {
          title: '操作', key: 'entrytion', width: 150, align:'center',fixed:'right', render: (res, index) => {
         
            if (res.status == 0 || res.status == 3) {
              return (
                <Button type="primary" onClick={(item) => this.sh(res.id, res.key)}>申请</Button>
              )
            } else {
              return (
                <Button  onClick={() => this.look(res.printHistoryDTOS, res.vehicleId, res.id, res.status)}>详情</Button>
              )
            }
            
          }
       }
      ];
    }
    else {
      liketype=Arrs.prove.info;
      x=1500;
      columns=[
        { title: '安装日期', width: 100, dataIndex: 'leaveFactoryDate', key: 'leaveFactoryDate',align: 'center' },
        { title: '公司车队', width: 100, dataIndex: 'teamName', key: 'teamName' ,align: 'center' },
        { title: '车辆类型', dataIndex: 'typeName', key: 'typeName', width: 100 ,align: 'center' },
        { title: '终端说明', dataIndex: 'deviceName', key: 'deviceName', width: 100 ,align: 'center' },
        { title: '车牌号', dataIndex: 'vehicleId', key: 'vehicleId', width: 100 ,align: 'center' },
        { title: 'SIM', dataIndex: 'simTypeName', key: 'simTypeName', width: 100 ,align: 'center' },
        { title: 'SIM卡号', dataIndex: 'sim', key: 'sim', width: 100 ,align: 'center' },
        { title: '终端号', dataIndex: 'manageNum', key: 'manageNum', width: 100 ,align: 'center' },
        { title: '是否报停', dataIndex: 'stop', key: 'stop' ,width: 100 ,align: 'center'},
        {
          title: '操作', key: 'infotion', width: 150, align:'center',fixed:'right', render: (res, index) => {
            if (res.newstatus == 0 || res.newstatus == 3) {
              return (
                <Button type="primary" onClick={(item) => this.sh(res.proid, res.key)}>申请</Button>
              )
            } else {
              return (
                <Button  onClick={() => this.look(res.printHistoryDTOS, res.vehicleId, res.proid, res.newstatus)}>详情</Button>
              )
            }
          }
       }
      ]
    }
   
    function PrintHistory(props) {
      return (
        <div className='fl history'>
          <p>打印历史</p>
          <div style={{ marginBottom: '10px' }}><span>车牌号：</span>{props.car.carnum}</div>
          {
            props.car.privelist.length == 0 && <div>暂无打印历史</div> || <Table columns={itemColumns} dataSource={props.car.privelist} scroll={{ y: 130 }} pagination={false} />
          }
        </div>
      )
    }
    return (
      <div className='prove'>
         <div className="selectbox">
          {
            this.state.nav.list.map((v,i)=>{
              return(
                <a href="javascript:void(0)" key={i} className={v.selected?'current':' '} data-id={v.href} onClick={this.prosct.bind(this,i)}>{v.tit}</a>
              )
            })
          }
        </div>
      <Spin spinning={this.state.loading} size='large'>
      
        <Finds Formbody={liketype} sub={mode => this.sub(mode)} />
              <Table columns={columns} dataSource={this.state.list} scroll={{ x: x}} pagination={{ defaultPageSize: 10, current: this.state.nowpage, total: this.state.total, onChange: this.pageChange }} />
              {
                this.state.close == false &&
                <div className='clean'>
                  <PrintHistory car={this.state.car} />
                  <div className='fr apply'>
                    <div className='applyBtn clean'>
                      {
                        this.state.print.status == '审核中' && <Button type="primary" onClick={this.printfalse.bind(this, this.state.print.id)}>取消申请</Button> ||
                        this.state.print.status == '已通过' && <Button type="primary" onClick={this.want}>前往打印</Button>
                      }
                    </div>
                    <div className='isApply'>
                      {this.state.print.status}
                    </div>
                  </div>
                </div>
              }

        </Spin>
      </div>
    )
  }
}
const RadioGroup = Radio.Group;
class Details extends Component {
  constructor(props) {
    super(props)
    this.state = {
      print:false,
      value:1,
      cked:false,
      details:null,
      bool:false,
      bools:"false",
      post:{}
    }
    this.details = this.details.bind(this);
  }
  componentWillMount(){
   
  }
  details(cp) {
    this.setState({
        currentPassage: cp
    });
  }
  onChange=(e)=>{
    this.setState({
      value: e.target.value,
    });
  }
  booled=(val)=>{
    let bool=this.state.bool;
    let bools;
    if(bool==true){
      bools="false"
      this.setState({
        print:false,
      })
    }else{
      bools="true"
      this.setState({
        print:true,
      })
    }
    this.setState({
      bool:!bool,
      bools:bools
    })
  }
  switched=(val)=>{
    let bool=this.state.cked;
    if(bool){

    }
    this.setState({
      cked:!bool
    })
  }
  print=(value)=>{
      //dataUrl
      let details=this.props.details;
      let post={
        vehiclePlate:encodeURI(encodeURI(details.vehicleId)),
        num:details.systemPlatformNumber,
        type:this.state.value,
        pType:details.type,
        
      };
      var node =value==1?document.getElementById("printA"):document.getElementById("printB");
      this.setState({
        print:true,
      })
       domtoimage.toPng(node).then(dataUrl => {
          window.$Funs.$AJAX("img",'post', dataUrl, e => {
          //   this.setState({
          //     printimg:dataUrl
          //  })
            post.id=e.text;            
            window.open("http://122.227.217.62:9105/finical/print.html?data="+ Base64.encode(JSON.stringify(post)));
          },'upload')
       })
      
      // let data=this.props.details;
      // data.value=value;
      // Modal.confirm({
      //   title: '打印申请',
      //   content: '友情提示：如果在新窗口未打印则不会有打印历史记录！',
      //   okText: '确认前往打印',
      //   cancelText:"暂时不想打印",
      //   onOk(){
      //     window.open("https://www.minbaojianguan.com/print/print.html?data="+JSON.stringify(data));
      //     window.history.go(0)
      //   }
      // });
      
      /*this.setState({
        print:true,
      })
     setTimeout(e => {
       var node =value==1?document.getElementById("printA"):document.getElementById("printB");
       setTimeout(e=>{
       domtoimage.toPng(node).then(dataUrl => {
         this.setState({
            printimg:dataUrl
         })
         setTimeout(e => { 
           var printHtml = document.getElementById("printimg").innerHTML;
           var wind = window.open(
             "",
             "newwindow",
             "height=720, width=1920, top=100, left=100, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=n o, status=no"
           );
           wind.document.body.innerHTML = printHtml;
           if(wind.matchMedia){
            var mediaQueryList = wind.matchMedia('print');
              mediaQueryList.addListener(function(mql) {
                console.log(mql.matches)
                // if (mql.matches) {
                //   alert(1)
                // } else {
                //   alert(2)
                // }
              })
           }
           wind.print();
           this.setState({
            print:false,
          })
           return false;
         }, 1000);
       });
     }, 1000);
    },500)*/
  }
  lets(e){
    let a="&nbsp;&nbsp;&nbsp;&nbsp;"
    if(!e) return a
    else return e;
  }
  render() {
    const details=this.props.details,
          bool=this.state.bools;
          
    return (
      <div className="privemain">
       
        {
          this.state.print && !this.state.bool && <div id="printimg">
            <div className="img">
              <img src={this.state.printimg} width="100%"/>
            </div>
          </div>
        }
        <Breadcrumb>
          <Breadcrumb.Item>证明打印</Breadcrumb.Item>
          <Breadcrumb.Item>打印</Breadcrumb.Item>
        </Breadcrumb>
        <div className={['pribox', this.state.print ? 'print':'noprint'].join(' ')}>
          <div className="lfbox" id="printA">
            <div className="conent">
              <div className="bhnum">编号:<span contenteditable={bool} dangerouslySetInnerHTML={{__html:this.lets(details.printnum)}}></span></div>
              <div className="tit">道路运输车辆卫星定位装置安装证明</div>
              <div className="say">
                <div className="absoubox">运营商存根</div>
               
                <div className="p">兹有 <span contenteditable={bool} dangerouslySetInnerHTML={{__html:this.lets(details.teamName)}}></span> 车牌号 <span contenteditable={bool} dangerouslySetInnerHTML={{__html:this.lets(details.vehicleId)}}></span>,车牌颜色 <span contenteditable={bool} dangerouslySetInnerHTML={{__html:this.lets(details.carColor)}}></span>,已于(<span contenteditable={bool}>{window.$Funs.format(details.leaveFactoryDate)}</span>,车辆出厂前)
                安装(口北斗/GPS双模口/GPS)卫星定位装置,终端型号为 <span contenteditable={bool} dangerouslySetInnerHTML={{__html:this.lets(details.terminalType)}}></span>(为第<span contenteditable={bool} dangerouslySetInnerHTML={{__html:this.lets(details.terminalOrder)}}></span>批符合道路运输车辆卫星定位系统标准的车载终端，生产厂家为<span contenteditable={bool} dangerouslySetInnerHTML={{__html:this.lets(details.manufacturer)}}></span>,厂家编号为<span contenteditable={bool} dangerouslySetInnerHTML={{__html:this.lets(details.factoryNumber)}}></span>,车载终端序列号为<span contenteditable={bool} dangerouslySetInnerHTML={{__html:this.lets(details.manageNum)}}></span>),SIM卡号为<span contenteditable={bool} dangerouslySetInnerHTML={{__html:this.lets(details.sim)}}></span>,采用<span contenteditable={bool} dangerouslySetInnerHTML={{__html:this.lets(details.systemPlatform)}}></span>(第<span contenteditable={bool} dangerouslySetInnerHTML={{__html:this.lets(details.systemPlatformOrder)}}></span>
                批符合道路运输车辆卫星定位系统标准的系统平台,平台编号<span contenteditable={bool} dangerouslySetInnerHTML={{__html:this.lets(details.systemPlatformNumber)}}></span>)，作为企业监控平台，并已接入政府监管平台,运行正常。
                </div>
                <div className="p mgt20">
                  特此证明。
                    </div>
              </div>
              <div className="bot">
                  <p>运营商盖章（盖章)</p>
                  <p>{window.$Funs.format(new Date().getTime())}</p>
              </div>
            </div>
            <div className="middsolide hide">
              浙江马良通讯科技有限公司余慈分公司 <i></i>
            </div>
            <div className="conent hdbot hide">
            <div className="bhnum">编号:<span contenteditable={bool} dangerouslySetInnerHTML={{__html:this.lets(details.printnum)}}></span></div>
              <div className="tit">道路运输车辆卫星定位装置安装证明</div>
              <div className="say">
                <div className="absoubox">管理部门存根</div>
               {
                 /* <div className="p">兹有 <span>{details.teamName}</span> 车牌牌号 <span>{details.vehicleId}</span>,车牌颜色 <span>{details.carColor}</span>,已于<span>{window.$Funs.format(details.leaveFactoryDate)}</span>
                  安装 <span>{details.terminalType}</span> 卫星定位装置,终端型号为 <span>{details.terminalTypeNum}</span> 
                  (为第<span>{details.terminalOrder}</span>批符合道路运输车辆卫星定位系统标准的车载终端,生产厂家名称为<span>{details.manufacturer}</span>,厂家编号为<span>{details.factoryNumber}</span>,车载终端序列号为
                  <span>{details.manageNum}</span>),SIM卡号为<span>{details.sim}</span>,采用<span>{details.systemPlatform}</span>(第<span>{details.systemPlatformOrder}</span>
                  批符合道路运输车辆卫星定位系统标准的平台,平台编号<span>{details.systemPlatformNumber}</span>)作为企业监控平台，并已接入政府监管平台,运行正常。
                  </div>
                   <div className="p">兹有 <span  dangerouslySetInnerHTML={{__html:this.lets(details.teamName)}}></span> 车牌牌号 <span  dangerouslySetInnerHTML={{__html:this.lets(details.vehicleId)}}></span>,车牌颜色 <span dangerouslySetInnerHTML={{__html:this.lets(details.carColor)}}></span>,已于<span>{window.$Funs.format(details.leaveFactoryDate)}</span>
                  安装 <span dangerouslySetInnerHTML={{__html:this.lets(details.terminalTypeNum)}}></span> 卫星定位装置,终端型号为 <span  dangerouslySetInnerHTML={{__html:this.lets(details.terminalType)}}></span>(为第<span dangerouslySetInnerHTML={{__html:this.lets(details.terminalOrder)}}></span>批符合道路运输车辆卫星定位系统标准的车载终端，生产厂家名称为<span dangerouslySetInnerHTML={{__html:this.lets(details.manufacturer)}}></span>,厂家编号为<span dangerouslySetInnerHTML={{__html:this.lets(details.factoryNumber)}}></span>,车载终端序列号为<span dangerouslySetInnerHTML={{__html:this.lets(details.manageNum)}}></span>),SIM卡号为<span dangerouslySetInnerHTML={{__html:this.lets(details.sim)}}></span>,采用<span dangerouslySetInnerHTML={{__html:this.lets(details.systemPlatform)}}></span>(第<span dangerouslySetInnerHTML={{__html:this.lets(details.systemPlatformOrder)}}></span>
                  批符合道路运输车辆卫星定位系统标准的平台,平台编号<span dangerouslySetInnerHTML={{__html:this.lets(details.systemPlatformNumber)}}></span>)作为企业监控平台，并已接入政府监管平台,运行正常。
                  </div>
                  */
                }
                <div className="p">兹有 <span contenteditable={bool} dangerouslySetInnerHTML={{__html:this.lets(details.teamName)}}></span> 车牌号 <span contenteditable={bool} dangerouslySetInnerHTML={{__html:this.lets(details.vehicleId)}}></span>,车牌颜色 <span contenteditable={bool} dangerouslySetInnerHTML={{__html:this.lets(details.carColor)}}></span>,已于(<span contenteditable={bool}>{window.$Funs.format(details.leaveFactoryDate)}</span>,车辆出厂前)
                安装(口北斗/GPS双模口/GPS)卫星定位装置,终端型号为 <span contenteditable={bool} dangerouslySetInnerHTML={{__html:this.lets(details.terminalType)}}></span>(为第<span contenteditable={bool} dangerouslySetInnerHTML={{__html:this.lets(details.terminalOrder)}}></span>批符合道路运输车辆卫星定位系统标准的车载终端，生产厂家为<span contenteditable={bool} dangerouslySetInnerHTML={{__html:this.lets(details.manufacturer)}}></span>,厂家编号为<span contenteditable={bool} dangerouslySetInnerHTML={{__html:this.lets(details.factoryNumber)}}></span>,车载终端序列号为<span contenteditable={bool} dangerouslySetInnerHTML={{__html:this.lets(details.manageNum)}}></span>),SIM卡号为<span contenteditable={bool} dangerouslySetInnerHTML={{__html:this.lets(details.sim)}}></span>,采用<span contenteditable={bool} dangerouslySetInnerHTML={{__html:this.lets(details.systemPlatform)}}></span>(第<span contenteditable={bool} dangerouslySetInnerHTML={{__html:this.lets(details.systemPlatformOrder)}}></span>
                批符合道路运输车辆卫星定位系统标准的系统平台,平台编号<span contenteditable={bool} dangerouslySetInnerHTML={{__html:this.lets(details.systemPlatformNumber)}}></span>)，作为企业监控平台，并已接入政府监管平台,运行正常。
                </div>
                <div className="p mgt20">
                  特此证明。
                    </div>
              </div>
              <div className="bot">
                <p>运营商盖章（盖章)</p>
                <p>{window.$Funs.format(new Date().getTime())}</p>
              </div>
            </div>
          </div>
          <div className="rtbox" id="printB">
            <div className="conent">
              <div className="tit">浙江马良通讯科技有限公司余慈分公司<br/>证  明</div>
              <div className="bhnum">编号:<span contenteditable={bool} dangerouslySetInnerHTML={{__html:this.lets(details.printnum)}}></span></div>
              <div className="say">
                <div className="p">兹有<span contenteditable={bool} dangerouslySetInnerHTML={{__html:this.lets(details.teamName)}}></span>所属车辆共<span contenteditable={bool}>壹</span>台已于<span contenteditable={bool}>{window.$Funs.format(details.leaveFactoryDate)}</span>安装我公司GPS监控,终端型号为<span contenteditable={bool}>{details.terminalType}</span>，为第<span contenteditable={bool} dangerouslySetInnerHTML={{__html:this.lets(details.terminalOrder)}}></span>批符合道路运输车辆卫星定位系统标准车载终端，生产厂家为<span contenteditable={bool} dangerouslySetInnerHTML={{__html:this.lets(details.manufacturer)}}></span>，厂家编号为<span contenteditable={bool} dangerouslySetInnerHTML={{__html:this.lets(details.factoryNumber)}}></span>。截止日期为<span contenteditable={bool} >{!this.state.cked && window.$Funs.format(details.deadlineDate) || "永久"}</span> 经核查于省市运管GPS监控平台实现数据联网联控，且使用正常，望运管局给予办理相关手续!
                  <br/>特此证明！
                </div>
              </div>
              <div className="cdtable">
                <div className="mtit">附：安装GPS车辆基础数据信息</div>
                <table>
                  <tr>
                    <th width="15%">车牌号码</th>
                    <th width="10%">车牌颜色</th>
                    <th width="10%">经营范围</th>
                    <th width="15%">业户</th>
                    <th width="20%">运营商</th>
                    <th width="20%">设备卡号</th>
                    <th width="20%">行政区划</th>
                  </tr>
                  <tbody className="hide">
                    <tr>
                      <td rowspan="2" contenteditable={bool} dangerouslySetInnerHTML={{__html:this.lets(details.vehicleId)}}></td>
                      <td rowspan="2" contenteditable={bool} dangerouslySetInnerHTML={{__html:this.lets(details.carColor)}}></td>
                      <td rowspan="2" contenteditable={bool} dangerouslySetInnerHTML={{__html:this.lets(details.typeName)}}></td>
                      <td rowspan="2" contenteditable={bool} dangerouslySetInnerHTML={{__html:this.lets(details.teamName)}}></td>
                      <td rowspan="2" contenteditable={bool}>浙江马良通讯科技有限公司余慈分公司</td>
                      <td>设备号 <br/><span contenteditable={bool}>{details.manageNum}</span></td>
                      <td rowspan="2" contenteditable={bool}></td>
                    </tr>
                    <tr>
                      <td >卡号<span contenteditable={bool}>{details.sim}</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="bot hide">
                <div className="bz">(附钢印有效)</div>
                <p>GPS运营商:_ _ _ _ _ _(盖章)</p> 
                <p>{window.$Funs.format(new Date().getTime())}</p> 
                </div>
            </div>
          </div>
        </div>
        <div className="ckbox">
             <div className="Alignck">
                <label>单位用户</label><Switch checkedChildren="开" unCheckedChildren="关"  checked={this.state.cked} onChange={this.switched}/>
             </div>
             <div className="Alignck">
              <label>编辑</label><Switch checkedChildren="开" unCheckedChildren="关"  checked={this.state.bool} onChange={this.booled}/>
            </div>
              <RadioGroup onChange={this.onChange} value={this.state.value}>
                <Radio value={1}>A格式</Radio>
                <Radio value={2}>B格式</Radio>
              </RadioGroup>
        </div>
        <div className="button">
          <a href="javascript:void(0);" onClick={this.props.want}>上一步</a>
          {!this.state.bool && <a href="javascript:void(0);" onClick={this.print.bind(this,this.state.value)}>打印</a>}
        </div>
      </div>
    )
  }
}
export default class Prove extends Component {
  constructor(props) {
    super(props)
    this.state = {
      show: 0,
      details:{},
      printimg:null,
    }
  }
  want=(type,id,ts,numid)=>{
    if(id && ts){
      window.$Funs.$AJAX("prove/"+id,"get",{type:ts},e=>{
        let details=e;
        e.type=ts;
       // e.systemPlatformNumber=parseInt(numid.num)+1
       e.printnum=parseInt(numid.num)+1
        this.setState({
          details:e,
        })
      })
    }
    this.setState({
      show:type,
      id:id
    })
  }
  render() {
    return (
      <div className="provemain">
     
        {
          this.state.show == 0 && <MainList want={this.want.bind(this,1)}  /> || <Details want={this.want.bind(this,0)} details={this.state.details}/>
        }
      </div>
    )
  }
}

