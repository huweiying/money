import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Table , Input , Button , Form , Select} from 'antd';
const FormItem = Form.Item;
const Search = Input.Search;
const Option = Select.Option;

const columns = [
    { title: '车牌号码', width: 100, dataIndex: 'name',align: 'center' },
    { title: '申请日期', width: 100, dataIndex: 'age' ,align: 'center' },
    { title: '公司车队', dataIndex: 'address', width: 150 ,align: 'center' },
    { title: '车辆类型', dataIndex: 'address',  width: 150 ,align: 'center' },
    { title: '付款时间', dataIndex: 'address',  width: 150 ,align: 'center' },
    { title: '录入员', dataIndex: 'address', width: 150 ,align: 'center' },
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

function Nav(props){
    return (
        <div className = 'nav clean'>
            <span className = {props.navIndex == 0 ? 'active' :''}>待审批</span>
            <span className = {props.navIndex == 1 ? 'active' :''}>已审批</span>
        </div>
    )
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
          <FormItem label = '录入员：' className = 'formItem'>
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
        </div>

      </Form>
    )
}
export default class Audit extends Component {
    constructor(props) {
        super(props)
        this.state = {
            navIndex:0
        }
    }
    
    render() {
        return (
            <div className = 'audit'>
                <Nav navIndex = {this.state.navIndex}/>
                <TopForm />
                <Table rowSelection={rowSelection} columns={columns} dataSource={data} scroll={{ y:400}} pagination = {false}/>
                <div className = 'footer fr'>
                    <Button type="primary">审批通过</Button>
                    <Button>审批驳回</Button>
                </div>
            </div>
        )
    }
}
