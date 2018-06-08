import React, { Component } from 'react'
import { Link } from 'react-router-dom'
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
        data.currPage = 1;
        this.props.init(data)
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
                <FormItem label = '公司车队：' className = 'formItem'>
                {getFieldDecorator('teamName')(
                  <Input />
                )}
                </FormItem>
                
              </div>
              <div className = 'fl'>
                <FormItem label = '车辆类型：' className = 'formItem'>
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
              <Button type="primary" onClick={this.props.postChoose}>发送通知</Button>
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
      postChoose: Form.createFormField({
        value: props.postChoose,
      }),
 
    }
  },
})(TopForm)

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
              rules: [ {
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


export default class addNotice extends Component {
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
        addEntry:false,//弹窗显示
        choose:[]
    }
  }
  componentWillMount(){
    this.init({})
  }
  init=(data={})=>{
    this.setState({
      loading:true
    },()=>{
      !data.currPage && (data.currPage = this.state.currPage);
      data.pageSize = this.state.pageSize;
      let url = this.state.navIndex == 0 ? 'getInstallNoticeList' : 'getRepairNoticeList';
        window.$Funs.$AJAX(url,'get',data,(res)=>{
            let data = res.data.map((v,i)=>{
              v.key = i;
              v.deadlineDate = window.$Funs.formatDate(v.deadlineDate)
              v.repairInstallType == 0 ? v.repairInstallType = '监控' : v.repairInstallType = 'GPS';
              return v
            })
            this.setState({
              data : data,
              total: res.count,
              loading:false
            })
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
    },()=>{
      let data = this.state.keyWord;
      this.init(data)
    })
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
    this.setState({
      navIndex:i,
      currPage:1,
    },()=>{
        this.init({})
    })
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
            this.init();
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
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        let choose = selectedRows.map((v)=>{
          return v.repairInstallId
        })
        this.setState({
          choose:choose
        })
      },
    };
    
    return (
      <div className = 'addNotice'>
      <Spin spinning = {this.state.loading} size='large'>
        <Nav navIndex =  {this.state.navIndex } navChange = {this.navChange}/>
          <div>
            <SearchForm init={this.init} getSearch = {this.getSearch} showDetail = {this.showDetail} postChoose = {()=>{this.postChoose()}}/>
            <Table  rowSelection={rowSelection} expandedRowRender={record => <p style={{ margin: 0 }}>备注：{record.repairInstallRemark}</p>} columns={columns} dataSource={this.state.data}  pagination = {{ defaultPageSize:13,total:this.state.total,onChange:this.pageChange,current:this.state.currPage }}/>
            {this.state.addEntry && <MsgDetail detail = {this.state.detail} cancel = {this.cancel} navIndex = {this.state.navIndex}/>}
          </div>
      </Spin>
      </div>
    )
  }
}
