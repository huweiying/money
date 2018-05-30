import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Table , Input , Button , Form , Select , Breadcrumb,message, DatePicker} from 'antd';
const FormItem = Form.Item;
const Search = Input.Search;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
const { TextArea } = Input;
// import { renderRoutes } from 'react-router-config'


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
    const rangeConfig = {
      rules: [{ type: 'array',  message: 'Please select time!' }],
    };
    return (
      <Form className = 'topForm clean'>
            <div className = 'fl'>
              <FormItem label = '车牌号码：' className = 'formItem'>
                {getFieldDecorator('vehicleId')(
                  <Input />
                )}
              </FormItem>
              <FormItem label = '公司车队：' className = 'formItem'>
                {getFieldDecorator('teamName')(
                  <Input />
                )}
              </FormItem>
            </div>
            <div className = 'fl'>
              <FormItem label = 'SIM卡号' className = 'formItem'>
                {getFieldDecorator('sim')(
                  <Input />
                )}
              </FormItem>
              
              </div>
              <div className = 'fl'>
                <FormItem label = '终端号' className = 'formItem'>
                  {getFieldDecorator('s')(
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

function UnabledItem(props){//禁用表单项
  return (
    <FormItem label = {props.label} className = 'formItem clean'>
      {props.tag && (<span className = 'tag'>{props.tag}</span>)}
      <Input disabled placeholder = {props.value} className = 'disabled'/>
    </FormItem>
  )
}



function SelectItem(props){//下拉表单项
  return (
    <FormItem label = {props.label} className = 'formItem clean'>
      <Select defaultValue="" style={{ width: 120 }} onChange={props.handleChange}>
        <Option value="jack">Jack</Option>
        <Option value="jack">Jack</Option>
      </Select>
    </FormItem>
  )
}
class TChgForm extends Component {
  constructor(props) {
    super(props)
    
  }
  handleSubmit(){
    this.props.form.validateFields((err, values) => {
      if(!err){
        console.log(values)
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
    return (
      <div className='chgForm'>
        <Breadcrumb>
          <Breadcrumb.Item><span onClick = {this.props.cancel}>信息变更</span></Breadcrumb.Item>
          <Breadcrumb.Item>详情</Breadcrumb.Item>
        </Breadcrumb>
      <div>
        <h2>信息变更</h2>
        <div className = "addForm">
          <Form layout="inline" onSubmit={this.handleSubmit} className='clean'>
            <div>
              <p>移动变更</p>
              <div className = 'row clean'>
                <UnabledItem label='公司（或车队）名' value={this.props.detail.teamName}/>
                <UnabledItem label='原车牌号' value={this.props.detail.oldVehicleId}/>
                <UnabledItem label='历史车牌号' value=''/>
                <FormItem className = 'formItem clean'{...formItemLayout} label="新车牌号">
                    {getFieldDecorator('newVehicleId', {
                      rules: [ {
                        required: true, message: '请输入新车牌号',
                      }],
                    })(
                      <Input  />
                    )}
                </FormItem>
              </div>
              <div className = 'row clean'>
                <UnabledItem label='原车架号' value={this.props.detail.carframeId}/>
                <FormItem className = 'formItem clean'{...formItemLayout} label="新车架号">
                    {getFieldDecorator('newCarframeId', {
                      rules: [ {
                        required: true, message: '请输入新车架号',
                      }],
                    })(
                      <Input  />
                    )}
                </FormItem>
                <UnabledItem label='原联系方式' value={this.props.detail.phone}/>
                <FormItem className = 'formItem clean'{...formItemLayout} label="新联系方式">
                    {getFieldDecorator('newPhone', {
                      rules: [ {
                        required: true, message: '请输入新联系方式',
                      }],
                    })(
                      <Input  />
                    )}
                </FormItem>
              </div>
            </div>
            <div>
              <p>过户信息</p>
              <div className = 'row clean'>
                <UnabledItem label='原公司名' value={this.props.detail.teamName}/>
                <FormItem className = 'formItem clean'{...formItemLayout} label="新公司名">
                    {getFieldDecorator('newTeamname', {
                      rules: [ {
                        required: true, message: '请输入新公司名',
                      }],
                    })(
                      <Input  />
                    )}
                </FormItem>
                <UnabledItem label='原车牌号' value={this.props.detail.oldVehicleId}/>
                <FormItem className = 'formItem clean'{...formItemLayout} label="新车牌号">
                    {getFieldDecorator('newCarframeId', {
                      rules: [ {
                        required: true, message: '请输入新车牌号',
                      }],
                    })(
                      <Input  />
                    )}
                </FormItem>
              </div>
              <div className = 'row clean'>
                <UnabledItem label='原车架号' value={this.props.detail.carframeId}/>
                <FormItem className = 'formItem clean'{...formItemLayout} label="新车架号">
                    {getFieldDecorator('newCarframeId', {
                      rules: [ {
                        required: true, message: '请输入新车架号',
                      }],
                    })(
                      <Input  />
                    )}
                </FormItem>
                <UnabledItem label='原联系方式' value={this.props.detail.phone}/>
                <FormItem className = 'formItem clean'{...formItemLayout} label="新联系方式">
                    {getFieldDecorator('newPhone', {
                      rules: [ {
                        required: true, message: '请输入新联系方式',
                      }],
                    })(
                      <Input  />
                    )}
                </FormItem>
              </div>
            </div>
            <div>
              <p>终端变更信息</p>
              <div className = 'row clean'>
                <UnabledItem label='原SIM卡号' value={this.props.detail.sim}/>
                <FormItem className = 'formItem clean'{...formItemLayout} label="新SIM卡号">
                    {getFieldDecorator('newSim', {
                      rules: [ {
                        required: true, message: '请输入新SIM卡号',
                      }],
                    })(
                      <Input  />
                    )}
                </FormItem>
                <UnabledItem label='原车牌号' value={this.props.detail.oldVehicleId}/>
                <FormItem className = 'formItem clean'{...formItemLayout} label="新车牌号">
                    {getFieldDecorator('newVehicleId', {
                      rules: [ {
                        required: true, message: '请输入新车牌号',
                      }],
                    })(
                      <Input  />
                    )}
                </FormItem>
              </div>
              <div className = 'row clean'>
                <UnabledItem label='原终端号' value={this.props.detail.manageNum}/>
                  <FormItem className = 'formItem clean'{...formItemLayout} label='新终端类型'>
                    {getFieldDecorator('newTerminalType', {
                      initialValue:'马良车辆监控导航系统'
                    })(
                      <Select  style={{ width: 120 }}>
                        <Option value="马良车辆监控导航系统">马良车辆监控导航系统</Option>
                      </Select>
                    )}
                  </FormItem>
                <FormItem className = 'formItem clean'{...formItemLayout} label="新终端号">
                    {getFieldDecorator('newManageNum', {
                      rules: [ {
                        required: true, message: '请输入新终端号',
                      }],
                    })(
                      <Input  />
                    )}
                </FormItem>
              </div>
            </div>
            <div>
              <p>SIM卡变更信息</p>
              <div className = 'row clean'>
                <UnabledItem label='原SIM卡类型' value={this.props.detail.simTypeName}/>
                <FormItem className = 'formItem clean'{...formItemLayout} label='新SIM卡类型'>
                    {getFieldDecorator('simTypeName', {
                      initialValue:'马良车辆监控导航系统'
                    })(
                      <Select  style={{ width: 120 }}>
                        <Option value="马良车辆监控导航系统">马良车辆监控导航系统</Option>
                      </Select>
                    )}
                  </FormItem>
                <UnabledItem label='原SIM卡号' value={this.props.detail.sim}/>
                <FormItem className = 'formItem clean'{...formItemLayout} label="新SIM卡号">
                    {getFieldDecorator('newSim', {
                      rules: [ {
                        required: true, message: '请输入新SIM卡号',
                      }],
                    })(
                      <Input  />
                    )}
                </FormItem>
              </div>
              <div className = 'row clean'>
                <UnabledItem label='车牌号' value={this.props.detail.vehicleId}/>
                <UnabledItem label='原终端号' value='123213'/>
                <FormItem className = 'formItem clean'{...formItemLayout} label="新终端类型">
                    {getFieldDecorator('newTerminalType', {
                      rules: [ {
                        required: true, message: '请输入新终端类型',
                      }],
                    })(
                      <Input  />
                    )}
                </FormItem>
                <FormItem className = 'formItem clean'{...formItemLayout} label="新终端号">
                    {getFieldDecorator('newManageNum', {
                      rules: [ {
                        required: true, message: '请输入新终端号',
                      }],
                    })(
                      <Input  />
                    )}
                </FormItem>
              </div>
            </div>
              <FormItem className = 'btns'>
                <Button type="primary"  htmlType="submit" >确认修改</Button>
                <Button>取消</Button>
              </FormItem>
          </Form>
        </div>
      </div>
      </div>
    )
  }


}

const  ChgForm  = Form.create({
  mapPropsToFields(props) {
    return {
      detail: Form.createFormField({
        value: props.detail,
      })
      // getSearch: Form.createFormField({
      //   value: props.getSearch,
      // }),
    }
  },
})( TChgForm )

export default class Change extends Component {
    constructor(props) {
      super(props)
      this.state = {
        isChange:false,
        currPage:1,
        pageSize:13,
        keyWord:{},//搜索关键字
        data:[],//table数据
        total:'',//总页数
        detail:{},//录入项对象
      }
    }
    componentWillMount(){
      this.init({})
    }
    init=(data)=>{
      !data.currPage && (data.currPage = this.state.currPage);
      data.pageSize = this.state.pageSize;
      $Funs.$AJAX('getInformationChangeList/getCarList','get',data,(res)=>{
        let data = res.data.map((v,i)=>{
          v.key = i;
          return v
        })
        this.setState({
          data : data,
          total: res.count
        })
      })
    }
    getSearch=(data)=>{
      if(data){
        this.setState({
          keyWord:data,
          currPage:1
        })
      }
    }
    pageChange = (page)=>{
      this.setState({
        currPage:page,
      },()=>{
        let data = this.state.keyWord;
        data.currPage = page
        this.init(data)
      })
    }
    update = (item)=>{
      this.setState({
        isChange: true,
        detail:item
      })
    }
    cancel =()=>{
      this.setState({
        isChange:false
      })
    }
    render() {
      const columns = [
        { title: '公司车队', width: 150, dataIndex: 'teamName',key:'teamName',align: 'center' },
        { title: '车辆类型', width: 150, dataIndex: 'typeName',key:'typeName' ,align: 'center' },
        { title: '终端说明', dataIndex: 'deviceName',key:'deviceName', width: 150 ,align: 'center' },
        { title: '车牌号', dataIndex: 'vehicleId',key:'vehicleId',  width: 150 ,align: 'center' },
        { title: 'SIM卡类型', dataIndex: 'simTypeName',key:'simTypeName',  width: 150 ,align: 'center' },
        { title: 'SIM卡号', dataIndex: 'sim',key:'sim',  width: 150 ,align: 'center' },
        { title: '终端号', dataIndex: 'manageNum',key:'manageNum', width: 150 ,align: 'center' },
        { title: '操作', dataIndex: '',width: 150 , key: 'action', render: (item) => <Button type="primary" onClick = {()=>{this.update(item)}}>变更</Button> },
      ];
      
        return (
            <div className = 'change'>
              {this.state.isChange ? <ChgForm detail = {this.state.detail} cancel = {this.cancel}/> :
                <div>
                  <SearchForm init={this.init} getSearch = {this.getSearch}/>
                  <Table columns={columns} dataSource={this.state.data}  pagination = {{ defaultPageSize:13,total:this.state.total,onChange:this.pageChange,current:this.state.currPage }}/>
                </div>
              }
            </div>
        )
    }
}
