import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Table, Input, Button, Form, Select, Pagination, Modal, message, Breadcrumb ,Radio,Spin} from 'antd';
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
      close: true
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
  list(data) {
    $Funs.$AJAX('proves', 'get', data, res => {
      res.data = res.data.map((v, i) => {
        // $Funs.format(v.paymentDate)
        v.paymentDate = $Funs.formatDate(v.paymentDate)
        v.deadlineDate = $Funs.formatDate(v.deadlineDate)
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
  sh(id,index) {
    let data = this.state.list, _this = this;
    Modal.confirm({
      title: '申请打印',
      content: '确认提交？',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        $Funs.$AJAX("prove/" + id + "/" + $Funs.cook.get('name'), "post", null, e => {
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
    for(let val of list){
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
        $Funs.$AJAX('prove/'+id+'/delete', 'post', null, e => {
          message.success('已取消')
          setTimeout(() => {
            location.reload();
          }, 500);
        })
      }
    });
  }
  want=()=>{
    this.props.want(this.state.print.id);
  }
  render() {
    // const bread = (
    //   <Breadcrumb>
    //     <Breadcrumb.Item><Link to="/carInfo/info">车辆资料</Link></Breadcrumb.Item>
    //     <Breadcrumb.Item>车辆详情</Breadcrumb.Item>
    //   </Breadcrumb>
    // );
    const columns = [
      { title: '车牌号', width: 100, dataIndex: 'vehiclePlate', key: 'vehiclePlate', align: 'center' },
      { title: 'SIM卡号', width: 100, dataIndex: 'sim', key: 'sim', align: 'center' },
      { title: '终端号', dataIndex: 'manageNum', key: 'manageNum', width: 150, align: 'center' },
      { title: '公司车队', dataIndex: 'teamName', key: 'teamName', width: 150, align: 'center' },
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
        title: '操作', key: 'operation', width: 150, align: 'center', fixed: 'right', render: (res, index) => {
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
      },
      // { title: '出厂状态', dataIndex: 'address',  width: 150 ,align: 'center'  },
      // { title: '备注', dataIndex: 'address',  align: 'center'  },
    ];
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
      <Spin spinning={this.state.loading} size='large'>
        <Finds Formbody={Arrs.prove} sub={mode => this.sub(mode)} />
        <Table columns={columns} dataSource={this.state.list} scroll={{ x: 2100}} pagination={{ defaultPageSize: 10, current: this.state.nowpage, total: this.state.total, onChange: this.pageChange }} />
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
      value:1
    }
  }
  onChange=(e)=>{
    this.setState({
      value: e.target.value,
    });
  }
  print=(value)=>{
      this.setState({
        print:true,
      })
     setTimeout(e => {
       var node =value==1?document.getElementById("printA"):document.getElementById("printB");
       domtoimage.toPng(node).then(dataUrl => {
         //load.close();
         // let newWindow = "<div style='width='100%;'><img runat='server' src='"+dataUrl+"' style='width='100%;'></div>";   //打开新窗口
         this.setState({
            printimg:dataUrl
         })
         //let codestr = document.getElementById("node").innerHTML;   //获取需要生成pdf页面的div代码
         // document.write("");   //向文档写入HTML表达式或者JavaScript代码
         setTimeout(e => {
           console.log( document.getElementById("printimg"))
         
           var printHtml = document.getElementById("printimg").innerHTML;
           var wind = window.open(
             "",
             "newwindow",
             "height=720, width=1920, top=100, left=100, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=n o, status=no"
           );
           wind.document.body.innerHTML = printHtml;
           wind.print();
           this.setState({
            print:false,
          })
           return false;
         }, 1000);
       });
     }, 1000);
  }
  render() {
    const details=this.props.details;
    return (
      <div className="privemain">
        {
          this.state.print && <div id="printimg">
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
              <div className="bhnum">编号:<span>{details.systemPlatformNumber}</span></div>
              <div className="tit">道路运输车辆卫星定位装置安装证明</div>
              <div className="say">
                <div className="absoubox">运营商存根</div>
                <div className="p">兹有 <span>{details.teamName}</span> 车牌牌号 <span>{details.vehicleId}</span>,车牌颜色 <span>{details.carColor}</span>,已于<span>{$Funs.format(details.leaveFactoryDate)}</span>
                  安装 <span>{details.terminalType}</span> 卫星定位装置,终端型号为 <span>{details.terminalTypeNum}</span> 
                  (为第<span>{details.terminalOrder}</span>批符合道路运输车辆卫星定位系统标准的车载终端，生产厂家名称为<span>{details.manufacturer}</span>,厂家编号为<span>{details.factoryNumber}</span>,车载终端序列号为
                  <span>{details.manageNum}</span>),SIM卡号为<span>{details.sim}</span>,采用<span>{details.systemPlatform}</span>(第<span>{details.systemPlatformOrder}</span>
                  批符合道路运输车辆卫星定位系统标准的平台,平台编号<span>{details.systemPlatformNumber}</span>)作为企业监控平台，并已接入政府监管平台,运行正常。
                  </div>
                <div className="p">
                  特此证明。
                    </div>
              </div>
              <div className="bot">
                  <p>运营商盖章（盖章)</p>
                  <p>{$Funs.format(new Date().getTime())}</p>
              </div>
            </div>
            <div className="middsolide hide">
              浙江马良通讯科技有限公司余慈分公司 <i></i>
            </div>
            <div className="conent hdbot hide">
              <div className="bhnum">编号:<span>{details.systemPlatformNumber}</span></div>
              <div className="tit">道路运输车辆卫星定位装置安装证明</div>
              <div className="say">
                <div className="absoubox">管理部门存根</div>
                <div className="p">兹有 <span>{details.teamName}</span> 车牌牌号 <span>{details.vehicleId}</span>,车牌颜色 <span>{details.carColor}</span>,已于<span>{$Funs.format(details.leaveFactoryDate)}</span>
                  安装 <span>{details.terminalType}</span> 卫星定位装置,终端型号为 <span>{details.terminalTypeNum}</span> 
                  (为第<span>{details.terminalOrder}</span>批符合道路运输车辆卫星定位系统标准的车载终端,生产厂家名称为<span>{details.manufacturer}</span>,厂家编号为<span>{details.factoryNumber}</span>,车载终端序列号为
                  <span>{details.manageNum}</span>),SIM卡号为<span>{details.sim}</span>,采用<span>{details.systemPlatform}</span>(第<span>{details.systemPlatformOrder}</span>
                  批符合道路运输车辆卫星定位系统标准的平台,平台编号<span>{details.systemPlatformNumber}</span>)作为企业监控平台，并已接入政府监管平台,运行正常。
                  </div>
                <div className="p">
                  特此证明。
                    </div>
              </div>
              <div className="bot">
                <p>运营商盖章（盖章)</p>
                <p>{$Funs.format(new Date().getTime())}</p>
              </div>
            </div>
          </div>
          <div className="rtbox" id="printB">
            <div className="conent">
              <div className="tit">浙江马良通讯科技有限公司余慈分公司<br/>证  明</div>
              <div className="bhnum">编号:{details.systemPlatformNumber}</div>
              <div className="say">
                <div className="p">兹有<span>{details.teamName}</span>所属车辆共<span>一</span>台已于<span>{$Funs.format(details.leaveFactoryDate)}</span>安装我公司GPS监控,终端型号为<span>{details.terminalTypeNum}</span>，为第<span>{details.terminalOrder}</span>批符合道路运输车辆卫星定位系统标准车载终端，生产厂家为<span>{details.manufacturer}</span>，厂家编号为<span>{details.factoryNumber}</span>。截止日期为<span>{$Funs.format(details.deadlineDate)}</span> 经核查于省市运管GPS监控平台实现数据联网联控，且使用正常，望运管局给予办理相关手续!
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
                      <td rowspan="2">{details.vehicleId}</td>
                      <td rowspan="2">{details.carColor}</td>
                      <td rowspan="2">{details.typeName}</td>
                      <td rowspan="2">{details.teamName}</td>
                      <td rowspan="2">浙江马良通讯科技有限公司余慈分公司</td>
                      <td>设备号 <br/>{details.manageNum}</td>
                      <td rowspan="2"></td>
                    </tr>
                    <tr>
                      <td>卡号{details.sim}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="bot hide">
                <div className="bz">(附钢印有效)</div>
                <p>GPS运营商:_ _ _ _ _ _(盖章)</p> 
                <p>{$Funs.format(new Date().getTime())}</p> 
                </div>
            </div>
          </div>
        </div>
        <div className="ckbox">
              <RadioGroup onChange={this.onChange} value={this.state.value}>
                <Radio value={1}>A格式</Radio>
                <Radio value={2}>B格式</Radio>
              </RadioGroup>
        </div>
        <div className="button">
          <a href="javascript:void(0);" onClick={this.props.want}>上一步</a>
          <a href="javascript:void(0);" onClick={this.print.bind(this,this.state.value)}>打印</a>
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
  want=(type,id,ts)=>{
    if(id && !ts){
      $Funs.$AJAX("prove/"+id,"get",null,e=>{
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
          this.state.show == 0 && <MainList want={this.want.bind(this,1)}  /> || <Details want={this.want.bind(this,0,9)} details={this.state.details}/>
        }
      </div>
    )
  }
}

