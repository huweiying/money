import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Table , Input , Button , Form } from 'antd';
const FormItem = Form.Item;
const Search = Input.Search;
// import { renderRoutes } from 'react-router-config'
const installCol = [
  { title: '车牌号码', width: 100, dataIndex: 'name',align: 'center' },
  { title: '安装日期', width: 100, dataIndex: 'age' ,align: 'center' },
  { title: '公司车队', dataIndex: 'address', width: 150 ,align: 'center' },
  { title: '车辆类型', dataIndex: 'address',  width: 150 ,align: 'center' },
  { title: '维修照片', dataIndex: 'address',  width: 150 ,align: 'center' },
  { title: '工作人员', dataIndex: 'address', width: 150 ,align: 'center' },
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
            <span className = {props.navIndex == 0 ? 'active' :''}>安装记录</span>
            <span className = {props.navIndex == 1 ? 'active' :''}>维修记录</span>
        </div>
    )
}
function TopForm(props){

}
export default class Recode extends Component {
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
 
    const topForm = (
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
        <div className = 'fl'>
        <Button
        type="primary"
      >
        查找
      </Button>
        </div>

      </Form>
    )
   
    return (
      <div className = 'recode'>
        <Nav navIndex =  {this.state.navIndex } />
        { topForm}
        <Table rowSelection={rowSelection} columns={installCol} dataSource={data} scroll={{ y:400}} pagination = {false}/>
      </div>
    )
  }
}
