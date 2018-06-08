import React, { Component } from 'react'
import { Link } from 'react-router-dom'
<<<<<<< HEAD
import { Table , Input , Button , Form ,Icon ,Spin,Select,Modal} from 'antd';
=======
import { Table , Input , Button , Form ,Icon ,Spin,Select} from 'antd';
>>>>>>> 6e91800f9eda543b8c73c96e67130cea2e6ee560
const FormItem = Form.Item;
const Search = Input.Search;
// import { renderRoutes } from 'react-router-config'

function Nav(props){
    return (
        <div className = 'nav clean'>
            <span className = {props.navIndex == 0 ? 'active' :''} onClick = {props.navChange.bind(this,0)}>安装记录</span>
            <span className = {props.navIndex == 1 ? 'active' :''} onClick = {props.navChange.bind(this,1)}>维修记录</span>
        </div>
    )
}

class TopForm extends Component {
  constructor(props) {
    super(props)
  }
  handleSearch =()=>{
    this.props.form.validateFields((err, values) => {
      let arr = Object.keys(values);
      let data = {}
      for(let i = 0;i<arr.length;i++){
        if(arr[i] == 'chargeTime'){
          values[arr[i]] && (data.chargeTimeStart = new Date(values[arr[i]][0]._d).getTime());
          values[arr[i]] && (data.chargeTimeEnd = new Date(values[arr[i]][1]._d).getTime());
        }else if(arr[i] == 'deadlineDate'){
          values[arr[i]] && (data.deadlineDateStart = new Date(values[arr[i]][0]._d).getTime());
          values[arr[i]] && (data.deadlineDateEnd = new Date(values[arr[i]][1]._d).getTime());
        }else{
          (values[arr[i]]) && (data[arr[i]] = values[arr[i]])
        }
      }
      if(data){
        //默认查找第一页开始
        this.props.getSearch(data);

        }
    });
  }
  clear = ()=>{
    this.props.form.resetFields();
    this.props.init({})
  }
  render(){
    const { getFieldDecorator, resetFields } = this.props.form;
    return (
      <Form className = 'topForm clean'>
              <div className = 'fl'>
                <FormItem label = '车牌号码：' className = 'formItem'>
                  {getFieldDecorator('vehicleId')(
                    <Input />
                  )}
                </FormItem>
                
                </div>
              <div className = 'fl'>
                <FormItem label = '工作人员：' className = 'formItem'>
                {getFieldDecorator('name')(
                  <Input />
                )}
                </FormItem>
                
              </div>
            <div className = 'fl'>
              <a className = 'empty' onClick = {this.clear} >清空</a>
            </div>
            <div className = 'fr'>
              <Button type="primary" onClick={this.handleSearch}>查找</Button>
            </div>
          </Form>
    )
  }
  
}
const SearchForm = Form.create({
  mapPropsToFields(props) {
    return {
      init: Form.createFormField({
        value: props.init,
      }),
      getSearch: Form.createFormField({
        value: props.getSearch,
      }),
    }
  },
})(TopForm)

/*class TMsgDetail extends Component{
  constructor(props) {
    super(props)
    this.state = {
       
    }
  }
  handleSubmit = ()=>{
    this.props.form.validateFields((err, values) => {
      if(!err){
        values.invoiceNum = values.prefix + values.invoiceNum;
        delete values.prefix;
        values.deadlineDate = new Date(this.props.detail.deadlineDate).getTime();
        values.chargeTime = window.$Funs.formatDate(values.chargeTime);
        values.id = this.props.detail.chargeid;
        values.newCarId = this.props.detail.newCarId;
        values.vehicleId = this.props.detail.vehicleId;
        values.teamName = this.props.detail.teamName;
        values.inputMan = window.$Funs.cook.get('id');
        values.inputManName = window.$Funs.cook.get('name');
        // values.deadlineDate && (values.deadlineDate = new Date(values.deadlineDate._d).getTime())
        // console.log(values)
        window.$Funs.$AJAX('charge','post',values,(res)=>{
          message.success('操作成功');
          this.props.cancel()
        })      
      }
    });
  }
  render(){
    const { getFieldDecorator} = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: 'F',
    })(
      <Select style={{ width: 50 }}>
        <Option value="F">F</Option>
        <Option value="S">S</Option>
      </Select>
    );
    let msgform = (
      <div className = 'detail'>
        <Form layout="inline"  className='clean'>
          <div className = 'clean'>
            <FormItem label='车牌号' className = 'formItem clean'>
              <Input  value={this.props.detail.vehicleId } disabled className = 'disabled'/>
            </FormItem>
            <FormItem label='公司或车队名' className = 'formItem clean'>
              <Input  value={this.props.detail.teamName } disabled className = 'disabled'/>
            </FormItem>
            <FormItem className = 'formItem clean'{...formItemLayout} label="收费金额">
              {getFieldDecorator('moneyAmont', {
                rules: [ {
                  required: true, message: '请输入收费金额',
                }],
              })(
                <Input className = 'pay' />
              )}
              <span  className = 'unit'>单位：元</span>
            </FormItem>
          </div>
          <div className = ' clean'>
            
            <FormItem className = 'formItem clean'{...formItemLayout} label="支付方式">
              {getFieldDecorator('payType', {
                rules: [ {
                  required: true, message: '请输入收费金额',
                }],
                initialValue:'现金'
              })(
                <Select  style={{ width: 200 }}>
                  <Option value="现金">现金</Option>
                  <Option value="转帐支票">转帐支票</Option>
                  <Option value="网银转账">网银转账</Option>
                  <Option value="支付宝">支付宝</Option>
                  <Option value="微信">微信</Option>
                  <Option value="其他">其他</Option>
                </Select>     
              )}
            </FormItem>
            <FormItem className = 'formItem clean'{...formItemLayout} label="截止时间">
              {getFieldDecorator('deadlineDate', {
                rules: [ {
                  required: true, message: '请输入截止时间',
                }],
              })(
                <DatePicker />
              )}
            </FormItem>
          </div>
          <div className = 'clean'>
            <FormItem className = 'formItem code clean' {...formItemLayout} label="发票（或收据）号码">
              {getFieldDecorator('invoiceNum', {
                rules: [ {
                  required: true, message: '请输入发票（或收据）号码',
                }],
              })(
                <Input  addonBefore={prefixSelector} style={{ width: '100%' }} />
              )}
            </FormItem>
          </div>
          <FormItem label = '收费备注：' className = 'formItem fl clean'>
            {getFieldDecorator('remark', {
              rules: [ {
                required: true, message: '请输入收费备注',
              }],
            })(
              <TextArea rows={3} />
            )}
          </FormItem>
        </Form>
        <div className = 'diaBtns fr'>
          <Button type="primary" onClick = {this.handleSubmit}>确认修改</Button>
          <Button onClick = { this.props.cancel}>取消</Button>
        </div>
      </div>
    )
    return(
      <div className = 'dialog'>
        <div className = 'mask'></div>
        <div className = 'main'>
          <p className = 'title'>修改收费信息</p>
           {  msgform }
        </div>
      </div>
    )
  }
}
const MsgDetail = Form.create({
  mapPropsToFields(props) {
    return {
      detail: Form.createFormField({
        value: props.detail,
      }),
      cancel: Form.createFormField({
        value: props.cancel,
      }),
    }
  },
})(TMsgDetail)*/

//维修图片组件
class PicDetail extends Component{
  constructor(props) {
    super(props)
    this.state = {
      currPage:1,
      pageSize:4,
      total:this.props.detail.length,
      loading:true,
<<<<<<< HEAD
      show:false,
      path:''
=======
>>>>>>> 6e91800f9eda543b8c73c96e67130cea2e6ee560
    }
  }
  componentDidMount(){
    this.setState({
      loading:false
    })
  }
<<<<<<< HEAD
  open=(src)=>{
    this.setState({
      show:true,
      path:src
    })
  }
  close=()=>{
    this.setState({
      show:false,
      path:''
    });
  }
=======
>>>>>>> 6e91800f9eda543b8c73c96e67130cea2e6ee560
  next(isNext){
    if(isNext){//下一页
      totalPage = parseInt(this.state.total / this.state.pageSize);
      if(this.currPage + 1 > totalPage){
        return
      }else{
        this.setState({
          currPage: this.state.currPage + 1
        })
      }
    }else{
      if(this.currPage - 1 < 1){
        return
      }else{
        this.setState({
          currPage:this.state.currPage - 1
        })
      }
    }
  }
  render (){
      let data = this.props.detail.slice((this.state.currPage-1)*this.pageSize,this.state.currPage*this.pageSize)
      data = this.props.detail.map((v,i)=>{
        if(v){
          return(
            <div className = 'item fl' key={i}>
<<<<<<< HEAD
              <span>
                  <p>{v.pictureType}</p>
                  <img src={v.picturePath} onClick={this.open.bind(this,v.picturePath)}/>
                  <p>{v.pictureTime}</p>
                  <p>{v.pictureLocation}</p>
              </span>
            </div>
=======
            <span>
                  <p>{v.pictureType}</p>
                  <img src={v.picturePath} />
                  <p>{v.pictureTime}</p>
                  <p>{v.pictureLocation}</p>
            </span>
              </div>
>>>>>>> 6e91800f9eda543b8c73c96e67130cea2e6ee560
          )
        }
      })
    return (
      <div className = 'picDialog'>
      <div className = 'mask'></div>
<<<<<<< HEAD
          {this.state.show && <img onClick={this.close} src={this.state.path} className = 'preview'></img>}
=======
        
>>>>>>> 6e91800f9eda543b8c73c96e67130cea2e6ee560
          <div className="insetbox">
          <Spin spinning = {this.state.loading} tip="Loading..."></Spin>
              <div className = 'main'>
            
                <Icon type="close" style={{ fontSize: 18, color: '#08c' }} className='close' onClick = {this.props.cancel}/>
                {data }
                {
                this.props.detail.length > 4 && (
                  <div className = 'toggle'>
                    <Icon type="left" style={{ fontSize: 24, color: '#08c' }} onClick = {this.next.bind(this,true)}/>
                    <Icon type="right" style={{  fontSize: 24, color: '#08c' }} onClick = {this.next.bind(this,false)}/>
                  </div>
                )
              }
            
              </div>
            
            
            </div>
      </div>
    )
  }
}




export default class Recode extends Component {
  constructor(props) {
    super(props)
    this.state = {
        loading:true,
        navIndex : 0,
        currPage:1,
        pageSize:13,
        keyWord:{},//搜索关键字
        data:[],//table数据
        total:'',//总页数
        detail:{},//录入项对象
        picDetail:false,//查看图片dialog
    }
  }
  componentWillMount(){
    this.init()
  }
  init=(data={})=>{
    !data.currPage && (data.currPage = this.state.currPage);
    data.pageSize = this.state.pageSize;
    let url = this.state.navIndex == 0 ? 'getInstallRecord' : 'getRepairRecord';
    window.$Funs.$AJAX(url,'get',data,(res)=>{
      let data = res.data.map((v,i)=>{
        v.key = i;
        v.pictureTime = window.$Funs.formatDate(v.pictureTime)
        return v
      })
      this.setState({
        data : data,
        total: res.count,
        loading:false
      })
    })
  }
  getSearch=(data)=>{
    if(data){
      this.setState({
        keyWord:data,
        currPage:1,
        loading:true,
      },()=>{
        this.init(data)
      })
    }
  }
  pageChange = (page)=>{
    this.setState({
      currPage:page,
      loading:true
    },()=>{
      let data = this.state.keyWord;
      this.init(data)
    })
  }
  showPic = (item)=>{
    item = item.map((v,i)=>{
      v.key = i;
      v.pictureTime = window.$Funs.formatDate(v.pictureTime)
      return v
    })
    this.setState({
      picDetail: true,
      detail:item
    },()=>{
    })
  }
  cancel =()=>{
    this.setState({
      picDetail:false
    })
  }
  navChange = (i)=>{//切换导航
    this.setState({
      navIndex:i,
      currPage:1,
      keyWord:{}
    },()=>{
      this.init()
    })
  }
  render() {
    const columns = [
      { title: '车牌号码', width: 100, dataIndex: 'vehicleId',key:'vehicleId',align: 'center' },
      { title: '安装日期', width: 100, dataIndex: 'pictureTime',key:'pictureTime' ,align: 'center' },
      { title: '公司车队', dataIndex: 'teamName',key:'teamName', width: 150 ,align: 'center' },
      { title: '车辆类型', dataIndex: 'typeName',key:'typeName', width: 150 ,align: 'center' },
      { title: '维修照片', dataIndex: '', key: 'action', width: 100 ,align: 'center' , render: (item) =>{ if(item.repairInstallPictureList && item.repairInstallPictureList.length != 0) {return (<a onClick = {()=>{this.showPic(item.repairInstallPictureList)}}>查看</a>)} },  width: 150 ,align: 'center' },
      { title: '工作人员', dataIndex: 'name',key:'name', width: 150 ,align: 'center' },
    ];
    
    return (
      <div className = 'recode'>
        <Spin spinning = {this.state.loading} size='large'>
          <Nav navIndex =  {this.state.navIndex } navChange = {this.navChange}/>
            <div>
              <SearchForm init={this.init} getSearch = {this.getSearch}/>
              <Table  columns={columns} dataSource={this.state.data}  pagination = {{ defaultPageSize:13,total:this.state.total,onChange:this.pageChange,current:this.state.currPage }}/>
              {this.state.picDetail && <PicDetail detail = {this.state.detail} cancel = {this.cancel}/>}
            </div>
          
        </Spin>
      </div>
    )
  }
}
