import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Table , Input , Button , Form , Select , Breadcrumb} from 'antd';
const FormItem = Form.Item;
const Search = Input.Search;
const Option = Select.Option;
// import { renderRoutes } from 'react-router-config'
const columns = [
  { title: '公司车队', width: 150, dataIndex: 'name',align: 'center' },
  { title: '车辆类型', width: 150, dataIndex: 'age' ,align: 'center' },
  { title: '终端说明', dataIndex: 'address', width: 150 ,align: 'center' },
  { title: '车牌号', dataIndex: 'address',  width: 150 ,align: 'center' },
  { title: 'SIM卡类型', dataIndex: 'address',  width: 150 ,align: 'center' },
  { title: '终端号', dataIndex: 'address', width: 150 ,align: 'center' },
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

function TopForm(props){
    return(
        <Form className = 'topForm clean'>
            <div className = 'fl'>
                <FormItem label = '车牌号码：' className = 'formItem'>
                    <Input placeholder = '' className = ''/>
                </FormItem>
                <FormItem label = '公司车队：' className = 'formItem'>
                    <Input placeholder = '' className = ''/>
                </FormItem>
            </div>
            <div className = 'fl'>
                <FormItem label = 'SIM卡号：' className = 'formItem'>
                    <Input placeholder = '' className = ''/>
                </FormItem>
            </div>
            <div className = 'fl'>
                <FormItem label = '终端号：' className = 'formItem'>
                    <Input placeholder = '' className = ''/>
                </FormItem>
            </div>
            <div className = 'fl'>
            <a className = 'empty'>清空</a>
            </div>
            <div className = 'fr'>
                <Button type="primary">查找</Button>
                <Button type="primary" onClick = {props.handleChange}>变更</Button>
            </div>

      </Form>
    )
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
class ChgForm extends Component {
  constructor(props) {
    super(props)
    
  }
  
  render(){
    return (
      <div className='chgForm'>
        <Breadcrumb>
          <Breadcrumb.Item><Link to="/information/change">信息变更</Link></Breadcrumb.Item>
          <Breadcrumb.Item>详情</Breadcrumb.Item>
        </Breadcrumb>
      <div>
        <h2>信息变更</h2>
        <div className = "addForm">
          <Form layout="inline" onSubmit={this.handleSubmit} className='clean'>
            <div>
              <p>移动变更</p>
              <div className = 'row clean'>
                <UnabledItem label='公司（或车队）名' value='123213'/>
                <UnabledItem label='原车牌号' value='宁波余慈物流有限公司'/>
                <UnabledItem label='历史车牌号' value=''/>
                <AbledItem label='新车牌号' value=''/>
              </div>
              <div className = 'row clean'>
                <UnabledItem label='原车架号' value='123213'/>
                <AbledItem label='新车架号' value=''/>
                <UnabledItem label='原联系方式' value='123213'/>
                <AbledItem label='新联系方式' value=''/>
              </div>
            </div>
            <div>
              <p>过户信息</p>
              <div className = 'row clean'>
                <UnabledItem label='原公司名' value='123213'/>
                <AbledItem label='新公司名' value=''/>
                <UnabledItem label='原车牌号' value='宁波余慈物流有限公司'/>
                <AbledItem label='新车牌号' value=''/>
              </div>
              <div className = 'row clean'>
                <UnabledItem label='原车架号' value='123213'/>
                <AbledItem label='新车架号' value=''/>
                <UnabledItem label='原联系方式' value='123213'/>
                <AbledItem label='新联系方式' value=''/>
              </div>
            </div>
            <div>
              <p>终端变更信息</p>
              <div className = 'row clean'>
                <UnabledItem label='原SIM卡号' value='123213'/>
                <AbledItem label='新SIM卡号' value=''/>
                <UnabledItem label='原车牌号' value='宁波余慈物流有限公司'/>
                <AbledItem label='新车牌号' value=''/>
              </div>
              <div className = 'row clean'>
                <UnabledItem label='原终端号' value='123213'/>
                <SelectItem label='新终端类型' handleChange = {this.handleChange}/>
                <AbledItem label='新终端号' value=''/>
              </div>
            </div>
            <div>
              <p>SIM卡变更信息</p>
              <div className = 'row clean'>
                <UnabledItem label='原SIM卡类型' value='123213'/>
                <SelectItem label='新SIM卡类型' handleChange = {this.handleChange}/>
                <UnabledItem label='原SIM卡号' value='123213'/>
                <AbledItem label='新SIM卡类型' value=''/>
              </div>
              <div className = 'row clean'>
                <UnabledItem label='车牌号' value='123213'/>
                <UnabledItem label='原终端号' value='123213'/>
                <AbledItem label='新终端类型' value=''/>
                <AbledItem label='新终端号' value=''/>
              </div>
            </div>
              <FormItem className = 'btns'>
                <Button type="primary"  htmlType="submit"  >确认修改</Button>
                <Button>取消</Button>
              </FormItem>
          </Form>
        </div>
      </div>
    </div>
    )
  }


}



export default class Change extends Component {
    constructor(props) {
      super(props)
      this.state = {
        isChange:true
      }
      this.handleChange = this.handleChange.bind(this)
    }
    handleChange(){
      this.setState({
          isChange: false
      })
    }
    render() {
        return (
            <div className = 'change'>

              {this.state.isChange ? <ChgForm /> :
                <div>
                  <TopForm handleChange = {this.handleChange}/>
                  <Table rowSelection={rowSelection} columns={columns} dataSource={data} scroll={{ y:400}} pagination = {false}/>
                </div>
              }
            </div>
        )
    }
}
