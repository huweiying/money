import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Table , Input , Button , Form } from 'antd';
const FormItem = Form.Item;
const Search = Input.Search;
// import { renderRoutes } from 'react-router-config'
const installCol = [
  { title: '公司车队', width: 100, dataIndex: 'name',align: 'center' },
  { title: '车牌号', width: 100, dataIndex: 'age' ,align: 'center' },
  { title: '车架号', dataIndex: 'address', width: 150 ,align: 'center' },
  { title: '曾使用车牌号', dataIndex: 'address',  width: 150 ,align: 'center' },
  { title: '有效期至', dataIndex: 'address',  width: 150 ,align: 'center' },
  { title: '联系方式', dataIndex: 'address', width: 150 ,align: 'center' },
  { title: '车辆类型', dataIndex: 'address', width: 150 ,align: 'center' },
  { title: '备注', dataIndex: 'address', width: 150 ,align: 'center' },
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
  return (
      <Form className = 'topForm clean'>
        <div className = 'fl'>
          <FormItem label = '车牌号码：' className = 'formItem'>
            <Input placeholder = '' className = ''/>
          </FormItem>
        </div>
        <div className = 'fl'>
          <FormItem label = '工作人员：' className = 'formItem'>
            <Input placeholder = '' className = ''/>
          </FormItem>
          
        </div>
      
        <div className = 'fl'>
          <a className = 'empty'>清空</a>
        </div>
        <div className = 'fr'>
          <Button type="primary">添加</Button>
          <Button type="primary">发送通知</Button>
        </div>

      </Form>
  )
}
export default class Notice extends Component {
  constructor(props) {
    super(props)
    this.state = {
        navIndex : 0
    }
  }
  handleChange(){}
  handleNav(){
    
  }
  render() {
 
    
   
    return (
      <div className = 'notice'>
        <TopForm />
        <Table rowSelection={rowSelection} columns={installCol} dataSource={data} scroll={{ y:400}} pagination = {false}/>
      </div>
    )
  }
}
