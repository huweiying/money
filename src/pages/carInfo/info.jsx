import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Table , Input , Button , Form , Select} from 'antd';
const FormItem = Form.Item;
const Search = Input.Search;
const Option = Select.Option;
// import { renderRoutes } from 'react-router-config'
const columns = [
  { title: '安装日期', width: 100, dataIndex: 'name', key: 'name',align: 'center' },
  { title: '公司车队', width: 100, dataIndex: 'age', key: 'age' ,align: 'center' },
  { title: '车辆类型', dataIndex: 'address', key: '1', width: 150 ,align: 'center' },
  { title: '终端说明', dataIndex: 'address', key: '2', width: 150 ,align: 'center' },
  { title: '车牌号', dataIndex: 'address', key: '3', width: 150 ,align: 'center' },
  { title: 'SIM', dataIndex: 'address', key: '4', width: 150 ,align: 'center' },
  { title: 'SIM卡号', dataIndex: 'address', key: '5', width: 150 ,align: 'center' },
  { title: '证件详情', key: '6', width: 150 ,align: 'center' },
  { title: '终端号', dataIndex: 'address', key: '7', width: 150 ,align: 'center' },
  { title: '是否报停', dataIndex: 'address', key: '8' ,width: 150 ,align: 'center'  },
  { title: '备注', dataIndex: 'address', key: '8' ,align: 'center'  },
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

export default class Info extends Component {
  constructor(props) {
    super(props)
    this.state = {
      base_info: true
    }
  }
  init=()=>{
    $Funs.$AJAX('newCars','get',{currPage:this.state.currPage,pageSize:this.state.pageSize,carNumOrName:this.state.search},(res)=>{
      res.data = res.data.map((v,i)=>{
        v.leaveFactoryDate = v.leaveFactoryDate.split(' ')[0]
        v.key = i
        return v
      })
      this.setState({
        carArr: res.data,
        total:res.count
      })
    })
  }
  handleChange(){}
  render() {
    // const bread = (
    //   <Breadcrumb>
    //     <Breadcrumb.Item><Link to="/carInfo/info">车辆资料</Link></Breadcrumb.Item>
    //     <Breadcrumb.Item>车辆详情</Breadcrumb.Item>
    //   </Breadcrumb>
    // );
    const topForm = (
      <Form className = 'topForm clean'>
        <div className = 'fl'>
          <FormItem label = '车牌号码：' className = 'formItem'>
            <Input placeholder = '' className = ''/>
          </FormItem>
          <FormItem label = '终端说明：' className = 'formItem'>
            <Input placeholder = '' className = ''/>
          </FormItem>
        </div>
        <div className = 'fl'>
          <FormItem label = '公司：' className = 'formItem'>
            <Input placeholder = '' className = ''/>
          </FormItem>
          <FormItem label = '区域：' className = 'formItem'>
            <Select defaultValue="" style={{ width: 230 }} onChange={this.handleChange}>
              <Option value="jack">Jack</Option>
              <Option value="jack">Jack</Option>
            </Select>
          </FormItem>
        </div>
        <div className = 'fl'>
          <FormItem label = '车辆类型：' className = 'formItem'>
            <Select defaultValue="" style={{ width: 230 }} onChange={this.handleChange}>
              <Option value="jack">Jack</Option>
              <Option value="jack">Jack</Option>
            </Select>
          </FormItem>
            <FormItem label = '报停状态：' className = 'formItem'>
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
        htmlType="submit"
      >
        查找
      </Button>
        </div>

      </Form>
    )
    return (
      <div className = 'info'>
        {this.state.base_info && topForm}
        <Table rowSelection={rowSelection} columns={columns} dataSource={data} scroll={{ x: 1800 }} pagination = {{ defaultPageSize:13 }}/>
      </div>
    )
  }
}
