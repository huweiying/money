import React, { Component } from 'react'
import { Table , Input , Button , Breadcrumb , Form , Select} from 'antd';
const FormItem = Form.Item;
const Search = Input.Search;
const Option = Select.Option;

const columns = [
  { title: '公司车队', dataIndex: 'address',  width: 150 ,align: 'center' },
  { title: '车牌号', dataIndex: 'address',  width: 150 ,align: 'center' },
  { title: '付款金额', dataIndex: 'address',  width: 150 ,align: 'center' },
  { title: '付款方式', dataIndex: 'address',  width: 150 ,align: 'center' },
  { title: '付款方式', dataIndex: 'address',  width: 150 ,align: 'center' },
  { title: '有效期至', dataIndex: 'address',  width: 150 ,align: 'center' },
  { title: '发票（或收据）号码', dataIndex: 'address',  width: 150 ,align: 'center' },
  { title: '收款人', dataIndex: 'address',  width: 150 ,align: 'center' },
  { title: '备注', dataIndex: 'address',  width: 150 ,align: 'center' },
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
for (let i = 0; i < 100; i++) {
  data.push({
    key: i,
    name: `Edrward ${i}`,
    age: 32,
    address: `London Park no. ${i}`,
  });
}

function TopForm(){
  return (
    <Form className = 'topForm clean'>
        <div className = 'fl'>
          <FormItem label = '收费日期：' className = 'formItem'>
            <Input placeholder = '' className = ''/>
          </FormItem>
          <FormItem label = '公司车队：' className = 'formItem'>
            <Input placeholder = '' className = ''/>
          </FormItem>
        </div>
        <div className = 'fl'>
          <FormItem label = '有效日期：' className = 'formItem'>
            <Input placeholder = '' className = ''/>
          </FormItem>
          <FormItem label = '收款人：' className = 'formItem'>
          <Input placeholder = '' className = ''/>
          </FormItem>
        </div>
        <div className = 'fl'>
          <FormItem label = '车牌号：' className = 'formItem'>
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
        查找
      </Button>
        <Button
        type="primary"
      >
        导出
      </Button>
        </div>

      </Form>
  )
}
export default class Modify extends Component {
  render() {
    return (
      <div className = 'query'>
        <TopForm />
        <Table rowSelection={rowSelection} columns={columns} dataSource={data} scroll= {{ y:500 }} pagination = {false}/>
        
      </div>
    )
  }
}
