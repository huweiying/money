import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Table , Input , Button , Form , Select , Breadcrumb} from 'antd';
const FormItem = Form.Item;
const Search = Input.Search;
const Option = Select.Option;
// import { renderRoutes } from 'react-router-config'
const columns = [
  { title: '账号ID', width: 200, dataIndex: 'name',align: 'center' },
  { title: '操作员', width: 200, dataIndex: 'age' ,align: 'center' },
  { title: '操作内容', dataIndex: 'address' ,align: 'center' },
  { title: '操作时间', dataIndex: 'address',  width: 250 ,align: 'center' },
];

const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  getCheckboxProps: record => ({
    disabled: record.name === 'Disabled User', // Column configuration not to be checked
    name: record.name,
  }),
};
const data = [];
for (let i = 0; i < 11; i++) {
  data.push({
    key: i,
    name: `Edrward ${i}`,
    age: 32,
    address: `London Park no. ${i}`,
  });
}

function UnabledItem(props){//禁用表单项
  return (
    <FormItem label = {props.label} className = 'formItem clean'>
      {props.tag && (<span className = 'tag'>{props.tag}</span>)}
      <Input disabled placeholder = {props.value} className = 'disabled'/>
    </FormItem>
  )
}
function AbledItem(props){//表单项
  return (
    <FormItem label = {props.label} className = 'formItem clean'>
      <Input placeholder = {props.value} className = 'disabled'/>
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


class Edit extends Component {
  constructor(props) {
    super(props)
    
  }
  
  render(){
    return(
      <div className = 'edit'>
        <Breadcrumb>
          <Breadcrumb.Item><Link to="/system/mainenance">信息维护</Link></Breadcrumb.Item>
          <Breadcrumb.Item>修改</Breadcrumb.Item>
        </Breadcrumb>
        <h2>信息维护详情</h2>
          <div className = "addForm">
            <Form layout="inline" onSubmit={this.handleSubmit} className='clean'>
              <div className = 'row clean'>
                <UnabledItem label='车牌号' value='123213'/>
                <UnabledItem label='公司车队' value='宁波余慈物流有限公司'/>
                <SelectItem label='车牌颜色' handleChange = {this.handleChange}/>
                <UnabledItem label='车辆类型' value='重型载货汽车'/>
              </div>
              <div className = "row clean">
                <AbledItem label='联系电话' value=''/>
                <AbledItem label='所属地区' value=''/>
                <UnabledItem label='安装时间' value='2018/02/01 星期三' tag = '此为出厂安装' />
                <SelectItem label='导航类型' handleChange = {this.handleChange}/>
                </div>
                <div className = "row clean">
                <UnabledItem label='终端说明' value='博实结部标一体机'/>
                <UnabledItem label='SIM卡号' value='12345678900'/>
                <SelectItem label='生产厂家' handleChange = {this.handleChange}/>
                <UnabledItem label='终端类型号' value='我不造'/>
                </div>
                <div className = "row clean">
                <UnabledItem label='厂家编号' value='70111'/>
                <UnabledItem label='终端类型' value='BJS-A6_BD'/>
                <UnabledItem label='终端批次' value='2'/>
                <AbledItem label='终端号' value=''/>
                </div>
                <div className = "row clean">
                <SelectItem label='系统平台' handleChange = {this.handleChange}/>
                <UnabledItem label='平台编号' value='678665'/>
                <UnabledItem label='平台批次' value='6' tag='资料齐全'/>
                </div>
                
                <div className = "row clean">
                  <p className = "note">备注（选填）</p>
                  <AbledItem label='来电人' value=''/>
                  <AbledItem label='来电时间' value=''/>
                  <AbledItem label='记录人' value=''/>
                </div>
                <FormItem className = 'btns'>
                  <Button type="primary"  htmlType="submit"  >确认修改
                  </Button>
                  <Button>取消</Button>
                </FormItem>
            </Form>
          </div>
      </div>
    )
  }
}
function TopForm(props){
  return(
    <Form className = 'topForm clean'>
        <div className = 'fl'>
          <FormItem label = '操作员：' className = 'formItem'>
            <Input placeholder = '' className = ''/>
          </FormItem>
         
        </div>
        <div className = 'fl'>
          <FormItem label = '日期查询：' className = 'formItem'>
            <Input placeholder = '' className = ''/>
          </FormItem>
        </div>
        <div className = 'fl'>
          <a className = 'empty'>清空</a>
        </div>
        <div className = 'fr'>
          <Button type="primary">查询</Button>
          <Button type="primary" onClick = {props.isEdit}>修改</Button>
        </div>

      </Form>
  )
}
export default class Maintenance extends Component {
  constructor(props) {
    super(props)
    this.state = {
      editFlag : true
    }
    this.isEdit = this.isEdit.bind(this)
  }
  isEdit(){
    console.log(this)
    this.setState({
      editFlag : !this.state.editFlag
    })
  }
  componentDidMount(){
  }
  handleChange(){}
  
  render() {
    return (
      <div className = 'maintenance'>
        
        {this.state.editFlag ? <Edit/> : 
          <div>
            <TopForm editFlag = {this.state.editFlag} isEdit = {this.isEdit}/>
            <Table rowSelection={rowSelection} columns={columns} dataSource={data} scroll={{ y:400 }} pagination = {false}/>
          </div>
        }
      </div>
    )
  }
}

