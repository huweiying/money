import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Table , Input , Button , Form ,Icon, Select ,message,DatePicker,Spin,Modal } from 'antd';
const FormItem = Form.Item;
const Search = Input.Search;
const Option = Select.Option;
const { TextArea } = Input;
const confirm = Modal.confirm;
// import { renderRoutes } from 'react-router-config'

function Nav(props){
    return (
        <div className = 'nav clean'>
            <span className = {props.navIndex == 0 ? 'active' :''} onClick = {props.navChange.bind(this,0)}>安装通知</span>
            <span className = {props.navIndex == 1 ? 'active' :''} onClick = {props.navChange.bind(this,1)}>维修通知</span>
        </div>
    )
}

class TopForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data:{}
    }
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
  componentWillReceiveProps(nextProps){
    let obj = [];
    decodeURIComponent(nextProps.history.location.search).slice(1,).split('&').forEach((v,i)=>{
      obj[v.split('=')[0]] = v.split('=')[1] ?  v.split('=')[1] : '';
    })
    this.setState({
      data:obj
    })
  }
  clear = ()=>{
    this.props.form.resetFields();
    this.props.clearKeyWord();
    this.props.history.push('notice?currPage=1&navIndex='+this.state.data.navIndex)
  }
  render(){
    const { getFieldDecorator, resetFields } = this.props.form;
 
    return (
      <Form className = 'topForm clean'>
              <div className = 'fl'>
                <FormItem label = '车牌号码：' className = 'formItem'>
                  {getFieldDecorator('vehicleId',{
                    initialValue:this.state.data.vehicleId
                  })(
                    <Input />
                  )}
                </FormItem>
                
                </div>
              <div className = 'fl'>
                <FormItem label = '公司车队：' className = 'formItem'>
                {getFieldDecorator('teamName',{
                  initialValue:this.state.data.teamName
                })(
                  <Input />
                )}
                </FormItem>
                
              </div>
              <div className = 'fl'>
                <FormItem label = '车辆类型：' className = 'formItem'>
                  {getFieldDecorator('carType', {
                    initialValue:this.state.data.carType
                  })(
                    <Select style={{ width: 230 }}>
                      { 
                        this.props.carType.map((v,i)=>{
                          return <Option value={v} key={i}>{v}</Option>
                        })
                      }
                    </Select>
                  )}
                </FormItem>
                
              </div>
            <div className = 'fl'>
              <a className = 'empty' onClick = {this.clear} >清空</a>
            </div>
            <div className = 'fr'>
              <Button type="primary" onClick={this.handleSearch}>查找</Button>
              <Button type="primary" onClick={this.props.postChoose}>发送通知</Button>
            </div>
          </Form>
    )
  }
  
}
const TSearchForm = Form.create({
  mapPropsToFields(props) {
    return {
      init: Form.createFormField({
        value: props.init,
      }),
      getSearch: Form.createFormField({
        value: props.getSearch,
      }),
      postChoose: Form.createFormField({
        value: props.postChoose,
      }),
 
    }
  },
})(TopForm)
const SearchForm = withRouter(TSearchForm)

class TMsgDetail extends Component{
  constructor(props) {
    super(props)
    this.state = {
        user:[]
    }
  }
  
  componentWillMount(){
    window.$Funs.$AJAX('user','get',{roles:2},(res)=>{
        this.setState({
            user:res
        })
    })    
  }
 
  handleSubmit = ()=>{
    this.props.form.validateFields((err, values) => {
      if(!err){
        //   console.log(values)
          values.carframeId = this.props.detail.carframeId;
          values.inputMan = window.$Funs.cook.get('id');
          values.newCarId =  this.props.detail.newCarId;
          values.oldVehicleId = this.props.detail.oldVehicleId;
          values.operationType = this.props.navIndex;
          values.phone = this.props.detail.phone;
          values.vehicleId = this.props.detail.vehicleId;
          values.teamName = this.props.detail.teamName;
        window.$Funs.$AJAX('repairInstall','post',values,(res)=>{
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
    let msgform = (
      <div className = 'detail'>
        <Form layout="inline"  className='clean'>
          <div className = 'clean'>
            <FormItem label='车牌号' className = 'formItem clean'>
              <Input  value={this.props.detail.vehicleId } disabled className = 'disabled'/>
            </FormItem>
            <FormItem label='曾使用车牌号' className = 'formItem clean'>
              <Input  value={this.props.detail.oldVehicleId } disabled className = 'disabled'/>
            </FormItem>
            <FormItem label='公司或车队名' className = 'formItem clean'>
              <Input  value={this.props.detail.teamName } disabled className = 'disabled'/>
            </FormItem>
            <FormItem label='车架号' className = 'formItem clean'>
              <Input  value={this.props.detail.carframeId } disabled className = 'disabled'/>
            </FormItem>
            <FormItem label='联系方式' className = 'formItem clean'>
              <Input  value={this.props.detail.userName } disabled className = 'disabled'/>
            </FormItem>
            <FormItem label='车辆类型' className = 'formItem clean'>
              <Input  value={this.props.detail.typeName } disabled className = 'disabled'/>
            </FormItem>
          </div>
          <div className = ' clean'>
            <FormItem className = 'formItem clean'{...formItemLayout} label="指派人员">
              {getFieldDecorator('userId', {
                rules: [ {
                  required: true, message: '请选择指派人员',
                }],
              })(
                <Select  style={{ width: 200 }} >
                  {this.state.user && this.state.user.map((v,i)=>{
                      return (
                          <Option value={this.state.user[i].id} key={i}>{this.state.user[i].name}</Option>
                      )
                  })}
                </Select>     
              )}
            </FormItem>
            <FormItem className = 'formItem clean location'{...formItemLayout} label="车辆位置">
              {getFieldDecorator('carLocation', {
                rules: [ {
                  required: true, message: '请输入车辆位置',
                }],
              })(
                <Input />
              )}
            </FormItem>
          </div>
          <div className = 'clean'>
            <FormItem className = 'formItem clean'{...formItemLayout} label='安装类型'>
                {getFieldDecorator('repairInstallType', {
                    rules: [ {
                        required: true, message: '请选择安装类型',
                    }],
                    initialValue:'0'
                })(
                    <Select  style={{ width: 200 }}>
                        <Option value="0">监控</Option>
                        <Option value="1">GPS</Option>
                    </Select>     
                )}
            </FormItem>
          </div>
          <FormItem label = '备注：' className = 'formItem fl clean'>
            {getFieldDecorator('repairInstallRemark', {
              rules:[{
                required: true, message: '请输入备注',
              }],
            })(
              <TextArea rows={2} />
            )}
          </FormItem>
        </Form>
        <div className = 'diaBtns fr'>
          <Button type="primary" onClick = {this.handleSubmit}>确认</Button>
          <Button onClick = { this.props.cancel}>取消</Button>
        </div>
      </div>
    )
    return(
      <div className = 'dialog'>
        <div className = 'mask'></div>
        <div className = 'main'>
          <p className = 'title'>{this.props.navIndex == 0 ? '添加安装车辆' : '添加维修车辆'}</p>
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
})(TMsgDetail)

class TNotice extends Component {
  constructor(props) {
    super(props)
    this.state = {
        loading:true,
        navIndex : 0,
        currPage:1,
        pageSize:5,
        keyWord:{},//搜索关键字
        data:[],//table数据
        total:'',//总页数
        detail:{},//录入项对象
        addEntry:false,//弹窗显示
        choose:[],
        carType:[],
        selectedRowKeys:[]
    }
  }
  componentWillMount(){
    window.$Funs.$AJAX('ziDian','get',{type:2},(carType)=>{
      this.setState({
        carType:carType
      },()=>{
        this.init()
      })
    })
  }
  componentWillReceiveProps(nextProps){
    this.init(decodeURIComponent(nextProps.location.search))
  }
  init=(url = decodeURIComponent(this.props.location.search))=>{
    let data = {}
    let navIndex = this.state.navIndex;
    if(url){
      url.slice(1,).split('&').forEach((v,i)=>{
        let key = v.split('=')[0]
        let value = v.split('=')[1]
        if(key == 'navIndex'){
          navIndex = value
        }else{
          data[key] = value
        }
      })
    }
    !data.currPage && (data.currPage = this.state.currPage) 
    !data.pageSize && (data.pageSize = this.state.pageSize)
      !data.currPage && (data.currPage = this.state.currPage);
      data.pageSize = this.state.pageSize;
      let navurl = navIndex == 0 ? 'getInstallNoticeList' : 'getRepairNoticeList';
        window.$Funs.$AJAX(navurl,'get',data,(res)=>{
            let arr = res.data.map((v,i)=>{
              v.key = i;
              v.deadlineDate = window.$Funs.formatDate(v.deadlineDate)
              v.repairInstallType == 0 ? v.repairInstallType = '监控' : v.repairInstallType = 'GPS';
              return v
            })
            this.setState({
              data : arr,
              total: res.count,
              currPage:Number(data.currPage),
              navIndex:navIndex,
              loading:false
            })
        })
  }
  // getSearch=(data)=>{
  //   if(data){
  //     this.setState({
  //       keyWord:data,
  //       currPage:1,
  //       loading:true,
  //     },()=>{
  //       this.init(data)
  //     })
  //   }
  // }
  // pageChange = (page)=>{
  //   this.setState({
  //     currPage:page,
  //   },()=>{
  //     let data = this.state.keyWord;
  //     this.init(data)
  //   })
  // }
  getSearch=(data)=>{
    this.setState({
      keyWord:data
    })
    let str = '';
    for(let v in data){
      str = str + '&' + v + '=' + data[v]
    }
    let url = encodeURIComponent('currPage=1&pageSize='+this.state.pageSize+'&navIndex='+this.state.navIndex+str)
    this.props.history.push('notice?'+url)

  }
  clearKeyWord = ()=>{
    this.setState({
      keyWord:{}
    })
  }
  pageChange = (page)=>{
    let keyWord = this.state.keyWord;
    if(keyWord){
      var str = '';
      for(let v in keyWord){
        str = str + '&' + v + '=' + keyWord[v]
      }
    }
    this.setState({
      selectedRowKeys:[],
      choose:[]
    })
    let url = encodeURIComponent('currPage='+ page + '&pageSize='+this.state.pageSize+'&navIndex='+this.state.navIndex+str)
    this.props.history.push('notice?'+url)
  }
  showDetail = (item)=>{//显示弹窗
    this.setState({
        addEntry:true,
        detail:item
    })
  }
  cancel =()=>{
    this.setState({
      addEntry:false
    })
  }
  navChange = (i)=>{//切换导航
    let url = encodeURIComponent('currPage=1&pageSize='+this.state.pageSize+'&navIndex='+i)
    this.setState({
      selectedRowKeys:[],
      choose:[]
    })
    this.props.history.push('notice?'+url)
  }
  postChoose = ()=>{
    let items = this.state.choose;
    if(items.length == 0 ){
      message.error('请选择需要发送通知的车辆');
    }else{
      confirm({
        title: '提示',
        content: '确认提交通知信息？',
        okText:'确认',
        cancelText:'取消',
        onOk:()=> {
          window.$Funs.$AJAX('repairInstallSendNotice','post',{'repairInstallIdList':items},(res)=>{
            message.success('操作成功');
            this.setState({
              selectedRowKeys:[],
              choose:[]
            })
          })
        },
        onCancel() {
        },
      });
      
    }
  }
  render() {
    const columns = [
      { title: '公司车队', width: 150, dataIndex: 'teamName',key:'teamName',align: 'center' },
      { title: '车牌号', width: 100, dataIndex: 'vehicleId',key:'vehicleId' ,align: 'center' },
      { title: '车架号', dataIndex: 'carframeId',key:'carframeId', width: 150 ,align: 'center' },
      { title: '曾使用车牌号', dataIndex: 'oldVehicleId',key:'oldVehicleId', width: 110 ,align: 'center' },
      { title: '有效期至', dataIndex: 'deadlineDate',key:'deadlineDate', width: 100 ,align: 'center' },
      { title: '联系方式', dataIndex: 'userName',key:'userName', width: 150 ,align: 'center' },
      { title: '车辆类型', dataIndex: 'typeName',key:'typeName', width: 150 ,align: 'center' },
      { title: '指派人员', dataIndex: 'name',key:'name', width: 100 ,align: 'center' },
      { title: '车辆位置', dataIndex: 'carLocation',key:'carLocation' ,align: 'center' },
      { title: '安装类型', dataIndex: 'repairInstallType',key:'repairInstallType', width: 100 ,align: 'center' },
    ];
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        let choose = selectedRows.map((v)=>{
          return v.repairInstallId
        })
        this.setState({
          choose:choose,
          selectedRowKeys
        })
      },
    };
    
    return (
      <div className = 'notice'>
      <Spin spinning = {this.state.loading} size='large'>
        <Nav navIndex =  {this.state.navIndex } navChange = {this.navChange}/>
          <div>
            <SearchForm init={this.init} getSearch = {this.getSearch} showDetail = {this.showDetail} postChoose = {()=>{this.postChoose()}} carType = {this.state.carType} clearKeyWord = { this.clearKeyWord }/>
            <Table  rowSelection={rowSelection} expandedRowRender={record => <p style={{ margin: 0 }}>备注：{record.repairInstallRemark}</p>} columns={columns} dataSource={this.state.data}  pagination = {{ defaultPageSize:this.state.pageSize,total:this.state.total,onChange:this.pageChange,current:this.state.currPage }}/>
            {this.state.addEntry && <MsgDetail detail = {this.state.detail} cancel = {this.cancel} navIndex = {this.state.navIndex}/>}
          </div>
      </Spin>
      </div>
    )
  }
}


const Notice = withRouter(TNotice)

export default Notice 

