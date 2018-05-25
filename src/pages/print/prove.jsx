import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Table , Input , Button , Form , Select} from 'antd';
const FormItem = Form.Item;
const Search = Input.Search;
const Option = Select.Option;
// import { renderRoutes } from 'react-router-config'
const columns = [
  { title: '车牌号', width: 100, dataIndex: 'name', key: 'name',align: 'center' },
  { title: 'SIM卡号', width: 100, dataIndex: 'age', key: 'age' ,align: 'center' },
  { title: '终端号', dataIndex: 'address', width: 150 ,align: 'center' },
  { title: '公司车队', dataIndex: 'address',  width: 150 ,align: 'center' },
  { title: '付款时间', dataIndex: 'address',  width: 150 ,align: 'center' },
  { title: '有效期', dataIndex: 'address', width: 150 ,align: 'center' },
  { title: '车辆类型', dataIndex: 'address',  width: 150 ,align: 'center' },
  { title: '审核状态', dataIndex: 'address',  width: 150 ,align: 'center' },
  { title: '联系方式', dataIndex: 'address', width: 150 ,align: 'center' },
  { title: '终端说明', dataIndex: 'address',  width: 150 ,align: 'center'  },
  { title: '颜色', dataIndex: 'address',  width: 150 ,align: 'center'  },
  { title: '发票号', dataIndex: 'address' ,width: 150 ,align: 'center'  },
  { title: '安装时间', dataIndex: 'address',  width: 150 ,align: 'center'  },
  { title: '出厂状态', dataIndex: 'address',  width: 150 ,align: 'center'  },
  { title: '备注', dataIndex: 'address',  align: 'center'  },
];
const itemColumns = [
  { title: '证明编号', dataIndex: 'address',  width: 150 ,align: 'center' },
  { title: '打印时间', dataIndex: 'address',  width: 200 ,align: 'center' },
  { title: '打印说明', dataIndex: 'address', width: 150 ,align: 'center' },
  { title: '是否作废', dataIndex: 'address', width: 150 ,align: 'center' }
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

export default class Prove extends Component {
  constructor(props) {
    super(props)
    this.state = {
      base_info: true
    }
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
          <FormItem label = '车队名：' className = 'formItem'>
            <Input placeholder = '' className = ''/>
          </FormItem>
        </div>
        <div className = 'fl'>
          <FormItem label = 'SIM卡号：' className = 'formItem'>
            <Input placeholder = '' className = ''/>
          </FormItem>
          <FormItem label = '付款时间：' className = 'formItem'>
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
        </div>

      </Form>
    )
    function PrintHistory(){
        return (
            <div className = 'fl history'>
                <p>打印历史</p>
                <div style = {{marginBottom:'10px'}}><span>车牌号：</span><Input disabled style={{width: '140px'}} /></div>
                <Table columns={itemColumns} dataSource={data} scroll={{ y:130}} pagination = {false}/>
            </div>
        )
    }
 
    function Apply(){
        return(
           <div className = 'fr apply'>
                <div className = 'applyBtn clean'>
                    <Button type="primary" className = 'fl'>打印申请</Button>
                    <Button className = 'fr'>取消申请</Button>
                </div>
                <div className = 'isApply'>
                    审核中...
                </div>
                <p style= {{marginTop:'20px'}}>审核通过后变成“审核通过 进行下一步”</p>
           </div> 
        )
    }
    return (
      <div className = 'prove'>
        {this.state.base_info && topForm}
        <Table rowSelection={rowSelection} columns={columns} dataSource={data} scroll={{ x: 2500 ,y:280}} pagination = {false}/>
        <div className = 'clean'>
            <PrintHistory />
            <Apply />
        </div>
      </div>
    )
  }
}
