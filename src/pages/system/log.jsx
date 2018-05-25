import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Table , Input , Button , Form , Select} from 'antd';
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

export default class Log extends Component {
  constructor(props) {
    super(props)
    
  }
  handleChange(){}
  
  render() {
 
    const topForm = (
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
        <div className = 'fl'>
        <Button
        type="primary"
      >
        查询
      </Button>
        </div>

      </Form>
    )
   
    return (
      <div className = 'log'>
        { topForm}
        <Table rowSelection={rowSelection} columns={columns} dataSource={data} scroll={{ y:400}} pagination = {false}/>
      </div>
    )
  }
}

