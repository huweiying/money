import React, { Component } from 'react'
import { Table , Input , Button , Breadcrumb , Form , Select} from 'antd';
const FormItem = Form.Item;
const Search = Input.Search;
const Option = Select.Option;

const columns = [
  { title: '车牌号', dataIndex: 'address', key: '1', width: 150 ,align: 'center' },
  { title: 'SIM卡号', dataIndex: 'address', key: '2', width: 150 ,align: 'center' },
  { title: '终端号', dataIndex: 'address', key: '3', width: 150 ,align: 'center' },
  { title: '公司车队', dataIndex: 'address', key: '4', width: 150 ,align: 'center' },
  { title: '变更详情', dataIndex: 'address', key: '5', width: 250 ,align: 'center' },
  { title: '变更时间', dataIndex: 'address', key: '6', width: 150 ,align: 'center' },
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

// import { renderRoutes } from 'react-router-config'
export default class DataQuery extends Component {
  constructor(props) {
    super(props)
    
  }
  
  render() {
    const topForm = (
      <Form className = 'topForm clean'>
        <div className = 'fl'>
          <FormItem label = '车牌号码：' className = 'formItem'>
            <Input placeholder = '' className = ''/>
          </FormItem>
          <FormItem label = '公司说明：' className = 'formItem'>
            <Input placeholder = '' className = ''/>
          </FormItem>
        </div>
        <div className = 'fl'>
          <FormItem label = 'SIM卡号：' className = 'formItem'>
            <Input placeholder = '' className = ''/>
          </FormItem>
          <FormItem label = '变更时间：' className = 'formItem'>
            <Select defaultValue="" style={{ width: 230 }} onChange={this.handleChange}>
              <Option value="jack">Jack</Option>
              <Option value="jack">Jack</Option>
            </Select>
          </FormItem>
        </div>
        <div className = 'fl'>
          <FormItem label = '终端号：' className = 'formItem'>
            <Select defaultValue="" style={{ width: 230 }} onChange={this.handleChange}>
              <Option value="jack">Jack</Option>
              <Option value="jack">Jack</Option>
            </Select>
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
    return (
      <div className = 'dataQuery'>
        {topForm}
        <Table rowSelection={rowSelection} columns={columns} dataSource={data}  pagination = {{defaultPageSize:15}}/>
      </div>
    )
  }
}
