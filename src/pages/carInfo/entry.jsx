import React, { Component } from 'react'
import Upload from '../../component/upload'
import { Link } from 'react-router-dom'
import { Table , Input , Button , Breadcrumb , Form , Select ,DatePicker , message,Spin ,Modal} from 'antd';
import Avatar from '../../component/upload';
const FormItem = Form.Item;
const Search = Input.Search;
const Option = Select.Option;
const confirm = Modal.confirm;



function CarDetail(props){//查看车辆详情

  const columns = [
    { title: '安装日期', width: 100, dataIndex: 'leaveFactoryDate', key: 'leaveFactoryDate',align: 'center' },
    { title: '公司车队', width: 200, dataIndex: 'teamName', key: 'teamName' ,align: 'center' },
    { title: '车辆类型', dataIndex: 'typeName', key: 'typeName', width: 150 ,align: 'center' },
    { title: '终端说明', dataIndex: 'deviceName', key: 'deviceName', width: 150 ,align: 'center' },
    { title: '车牌号', dataIndex: 'vehicleId', key: 'vehicleId', width: 150 ,align: 'center' },
    { title: 'SIM卡类型', dataIndex: 'simTypeName', key: 'simTypeName', width: 150 ,align: 'center' },
    { title: 'SIM卡号', dataIndex: 'sim', key: 'sim', width: 150 ,align: 'center' },
    { title: '终端号', dataIndex: 'manageNum', key: 'manageNum', width: 150 ,align: 'center' },
    { title: '操作', dataIndex: '',width: 150, key: 'action', render: (item) => <Button type="primary" onClick = {()=>{props.addCarInfo(item)}}>补全</Button> },
  ];
 
  return(
    <div>
      <div className = 'clean top'>
        <Search className="search"
        placeholder="请输入车牌号或车队名字"
        onSearch={value => props.searchCar(value) }
        enterButton/>
        <Button className = 'fr' onClick = {()=>{props.searchCar('')}}>全部</Button>
      </div>
      <Table columns={columns} expandedRowRender={record => <p style={{ margin: 0 }}>备注：{record.comment}</p>} dataSource={props.carArr} pagination = {{defaultPageSize:10,total:props.total,onChange:props.pageChange}}/>
    </div>
  );
}

 class AddNew extends Component {
   constructor(props) {
     super(props)
     this.state = {
      photoCodes:[],
      product:[],
      zdType:[],
     }
   }
  
  componentWillMount(){
    window.$Funs.$AJAX('ziDian','get',{type:1},(res)=>{
      window.$Funs.$AJAX('ziDian','get',{type:3},(data)=>{
        this.setState({
          zdType:data,
          product:res
        })
      })
    })
  }
  handleSubmit=(e)=>{
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        confirm({
          title: '提示',
          content: '确认提交补全信息？',
          okText:'确认',
          cancelText:'取消',
          onOk:()=> {
            values.carId = this.props.item.id;
            values.photoCodes = this.state.photoCodes;
            values.callDate && (values.callDate = new Date(values.callDate._d).getTime())
            window.$Funs.$AJAX('car/newCar','post',values,(res)=>{
              message.success('操作成功');
              this.props.cancel()
            })
          },
          onCancel() {
          },
        });
      }
    });

  }
  getPic = (obj)=>{
    let arr = this.state.photoCodes;
    if(obj){
      arr.push(obj) 
    }
    this.setState({
      photoCodes:arr
    },()=>{
      console.log(this.state.photoCodes)
    })
  }
  render() {
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
    return (
      <div className='addNew'>
        <Breadcrumb>
          <Breadcrumb.Item><a onClick = {this.props.cancel}>车辆录入</a></Breadcrumb.Item>
          <Breadcrumb.Item>补全车辆信息</Breadcrumb.Item>
        </Breadcrumb>
        <div>
          <h2>补全车辆证明信息</h2>
          <div className = "addForm">
            <Form layout="inline" onSubmit={this.handleSubmit} className='clean'>
              <div className = 'row clean'>
                <FormItem label='车牌号' className = 'formItem clean'>
                  <Input  value={this.props.item.vehicleId} disabled className = 'disabled'/>
                </FormItem>
                <FormItem label='公司车队' className = 'formItem clean'>
                  <Input  value={this.props.item.teamName} disabled className = 'disabled'/>
                </FormItem>
                <FormItem className = 'formItem clean'{...formItemLayout} label="车牌颜色">
                    {getFieldDecorator('carColor', {
                      initialValue:'黄色'
                    })(
                      <Select  style={{ width: 120 }} onChange={this.handleSelect}>
                        <Option value="黄色">黄色</Option>
                        <Option value="蓝色">蓝色</Option>
                        <Option value="黑色">黑色</Option>
                        <Option value="白色">白色</Option>
                      </Select>
                    )}
                </FormItem>

                <FormItem  label='车辆类型' className = 'formItem clean'>
                  <Input value={this.props.item.typeName} disabled className = 'disabled'/>
                </FormItem>

              </div>
              <div className = "row clean">
                  <FormItem className = 'formItem clean'{...formItemLayout} hasFeedback label="联系电话">
                    {getFieldDecorator('phone', {
                      rules: [ {
                        required: true, message: '请输入联系电话',
                        pattern: new RegExp(/^1[3|5|7|8|]\d{9}$/) ,message: '手机格式不正确',
                      }],
                    })(
                      <Input  />
                    )}
                  </FormItem>
                  <FormItem className = 'formItem clean'{...formItemLayout} hasFeedback label="所属地区">
                    {getFieldDecorator('address', {
                      rules: [ {
                        required: true, message: '请输入所属地区',
                      }],
                    })(
                      <Input  />
                    )}
                  </FormItem>
                  <FormItem  label='安装时间' className = 'formItem clean'>
                    <span className = 'tag'>此为出厂安装</span>
                    <Input value={this.props.item.leaveFactoryDate} disabled className = 'disabled'/>
                  </FormItem>
                  
                  <FormItem className = 'formItem clean'{...formItemLayout} label='导航类型'>
                    {getFieldDecorator('navigationType', {
                      initialValue:'北斗/GPS双模'
                    })(
                      <Select  style={{ width: 120 }} onChange={this.handleSelect}>
                        <Option value="北斗/GPS双模">北斗/GPS双模</Option>
                        <Option value="GPS">GPS</Option>
                      </Select>
                    )}
                  </FormItem>
                </div>

                <div className = "row clean">
                  <FormItem className = 'formItem clean' label='终端说明'>
                    <Input  value={this.props.item.deviceName} disabled className = 'disabled'/>
                  </FormItem>

                  <FormItem  className = 'formItem clean' label='SIM卡号'>
                    <Input  value={this.props.item.sim} disabled className = 'disabled'/>
                  </FormItem>
                  {this.state.product.length > 0 &&
                  <FormItem className = 'formItem clean'{...formItemLayout} label="生产厂家">
                    {getFieldDecorator('manufacturer', {
                      rules: [ {
                        required: true, message: '请输入生产厂家',
                      }],
                      initialValue:this.state.product[0]
                    })(
                      <Select  style={{ width: 120 }} onChange={this.handleSelect}>
                        { this.state.product.map((v,i)=>{
                          return <Option value={v} key={i}>{v}</Option>
                        })}
                      </Select>
                    )}
                  </FormItem>
                  }
                  <FormItem className = 'formItem clean'{...formItemLayout} hasFeedback label="终端类型号">
                    {getFieldDecorator('terminalTypeNum', {
                      rules: [ {
                        required: true, message: '请输入终端类型号',
                      }],
                    })(
                      <Input  />
                    )}
                  </FormItem>
                </div>
                <div className = "row clean">
                  <FormItem className = 'formItem clean'{...formItemLayout} hasFeedback label="厂家编号">
                    {getFieldDecorator('factoryNumber', {
                      rules: [ {
                        required: true, message: '请输入厂家编号',
                      }],
                    })(
                      <Input  />
                    )}
                  </FormItem>
                  <FormItem className = 'formItem clean'{...formItemLayout} label="终端类型">
                    {getFieldDecorator('terminalType', {
                      rules: [ {
                        required: true, message: '请输入终端类型',
                      }],
                      initialValue:this.state.zdType[0]
                    })(
                      <Select  style={{ width: 120 }} onChange={this.handleSelect}>
                        { this.state.zdType.map((v,i)=>{
                          return <Option value={v} key={i}>{v}</Option>
                        })}
                      </Select>
                    )}
                  </FormItem>
                  <FormItem className = 'formItem clean'{...formItemLayout} hasFeedback label="终端批次">
                    {getFieldDecorator('terminalOrder', {
                      rules: [ {
                        required: true, message: '请输入终端批次',
                      }],
                    })(
                      <Input  />
                    )}
                  </FormItem>
                  <FormItem  className = 'formItem clean' label='终端号'>
                    <Input  value={this.props.item.manageNum} disabled className = 'disabled'/>
                  </FormItem>
                </div>
                <div className = "row clean">
                  <FormItem className = 'formItem clean'{...formItemLayout} label='导航类型'>
                    {getFieldDecorator('systemPlatform', {
                      initialValue:'马良车辆监控导航系统'
                    })(
                      <Select  style={{ width: 120 }} onChange={this.handleSelect}>
                        <Option value="马良车辆监控导航系统">马良车辆监控导航系统</Option>
                      </Select>
                    )}
                  </FormItem>

                  <FormItem className = 'formItem clean'{...formItemLayout} hasFeedback label="平台编号">
                    {getFieldDecorator('systemPlatformNumber', {
                      rules: [ {
                        required: true, message: '请输入平台编号',
                      }],
                    })(
                      <Input  />
                    )}
                  </FormItem>

                  <FormItem className = 'formItem clean'{...formItemLayout} hasFeedback label="平台批次">
                    <span className = 'tag'>资料齐全</span>
                    {getFieldDecorator('systemPlatformOrder', {
                      rules: [ {
                        required: true, message: '请输入平台批次',
                      }],
                    })(
                      <Input  />
                    )}
                  </FormItem>
                </div>
                <div className = "row clean">
                  <FormItem label = '车辆登记证书' className = 'formItem clean'>
                    <Avatar type = '0' getPic={this.getPic}/>
                  </FormItem>
                  <FormItem label = '行驶证' className = 'formItem clean'>
                    <Avatar type = '1' getPic={this.getPic}/>
                  </FormItem>
                  <FormItem label = '车身照片' className = 'formItem clean'>
                    <Avatar type = '2' getPic={this.getPic}/>
                  </FormItem>
                </div>
                <div className = "row clean">
                  <p className = "note">备注（选填）</p>
                  <FormItem className = 'formItem clean'{...formItemLayout} label="来电人">
                    {getFieldDecorator('callAPerson', {
                    })(
                      <Input  />
                    )}
                  </FormItem>
                  <FormItem className = 'formItem clean'{...formItemLayout} label="来电时间">
                    {getFieldDecorator('callDate', {
                    })(
                      <DatePicker />
                    )}
                  </FormItem>
                  <FormItem className = 'formItem clean'{...formItemLayout} label="记录人">
                    {getFieldDecorator('recordPerson', {
                    })(
                      <Input  />
                    )}
                  </FormItem>
                </div>
                <div className ="row clean">
                  <FormItem  className = 'formItem clean' label='备注'>
                    <Input  value={this.props.item.comment} disabled className = 'disabled comment'/>
                  </FormItem>
                </div>
                <FormItem className = 'btns'>
                  <Button  type="primary"  htmlType="submit"  >确认修改
                  </Button>
                  <Button onClick = {this.props.cancel}>取消</Button>
                </FormItem>
            </Form>
          </div>
        </div>
      </div>
    )
  }
}

const AddForm = Form.create()(AddNew)

export default class Entry extends Component {
  constructor(props) {
    super(props)
    this.state = {
      addFlag : false,
      currPage:1,
      pageSize:10,
      carArr:[],
      total:'',
      search:'',
      item:{},//选中的补全车辆信息,
      loading:true,
    }
  }
  addCarInfo = (item)=>{
    this.setState({
      addFlag : true,
      item:item
    })
  }
  cancel = ()=>{
    this.setState({
      addFlag : false
    })
  }
// 切换页面
  pageChange = (page)=>{
    this.setState({
      currPage:page
    },()=>{
      this.init()
    })
  }
  //搜索车辆
  searchCar = (v)=>{
     this.setState({
       search:v,
       loading:true
      
    },()=>{this.init()})
  }
// 数据请求
  init=()=>{
    window.$Funs.$AJAX('cars','get',{currPage:this.state.currPage,pageSize:this.state.pageSize,carNumOrName:this.state.search},(res)=>{
      res.data = res.data.map((v,i)=>{
        v.leaveFactoryDate = v.leaveFactoryDate.split(' ')[0]
        v.key = i
        return v
      })
      this.setState({
        carArr: res.data,
        total:res.count,
        loading:false
      })
    })
  }
  componentWillMount(){
    this.init()
  }
  render() {
    return (
      <div className = 'entry'>
        <Spin spinning = {this.state.loading} size='large'>
          {this.state.addFlag ? <AddForm cancel = {this.cancel}  item = {this.state.item}/> : <CarDetail addCarInfo = {this.addCarInfo}  carArr = {this.state.carArr} total = {this.state.total} pageChange = {this.pageChange} searchCar = {this.searchCar} ></CarDetail>}
        </Spin>
      </div>

    )
  }
}
