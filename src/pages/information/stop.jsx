import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Table , Input , Button , Form , Select} from 'antd';
const FormItem = Form.Item;
const Search = Input.Search;
const Option = Select.Option;
// import { renderRoutes } from 'react-router-config'
const columns = [
  { title: '车牌号码', width: 100, dataIndex: 'name',align: 'center' },
  { title: '车辆ID', width: 100, dataIndex: 'age' ,align: 'center' },
  { title: 'SIM卡号', dataIndex: 'address', width: 150 ,align: 'center' },
  { title: '证明编号', dataIndex: 'address',  width: 150 ,align: 'center' },
  { title: '打印时间', dataIndex: 'address',  width: 150 ,align: 'center' },
  { title: '是否已作废', dataIndex: 'address', width: 150 ,align: 'center' },
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
            </div>
            <div className = 'fl'>
                <FormItem label = '公司车队：' className = 'formItem'>
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
            <div className = 'fl'>
                <Button type="primary">查找</Button>
                <Button type="primary">报停/报停恢复</Button>
            </div>

      </Form>
    )
}
export default class Stop extends Component {
    render() {
        return (
            <div className = 'stop'>
                <TopForm />
                <Table rowSelection={rowSelection} columns={columns} dataSource={data} scroll={{ y:400}} pagination = {false}/>
            </div>
        )
    }
}
