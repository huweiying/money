import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Table , Input , Button , Form , Select } from 'antd';
const FormItem = Form.Item;
const Search = Input.Search;
const Option = Select.Option;
const { TextArea } = Input;
const columns = [
  { title: '车牌号码', width: 100, dataIndex: 'name',align: 'center' },
  { title: '车辆类型', width: 150, dataIndex: 'age' ,align: 'center' },
  { title: '公司车队', dataIndex: 'address', width: 150 ,align: 'center' },
  { title: '收费日期', dataIndex: 'address',  width: 150 ,align: 'center' },
  { title: '联系电话', dataIndex: 'address',  width: 150 ,align: 'center' },
  { title: '有效期至', dataIndex: 'address', width: 150 ,align: 'center' },
  { title: '安装日期', dataIndex: 'address', width: 150 ,align: 'center' },
  { title: '是否出厂安装', dataIndex: 'address', width: 150 ,align: 'center' },
  { title: '厂家编号', dataIndex: 'address', width: 150 ,align: 'center' },
  { title: '生产厂家', dataIndex: 'address', width: 150 ,align: 'center' },
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

const recodeColumns = [
  { title: '车辆ID', width: 100, dataIndex: 'name',align: 'center' },
  { title: '公司车队', width: 150, dataIndex: 'age' ,align: 'center' },
  { title: '车牌号码', dataIndex: 'address', width: 150 ,align: 'center' },
  { title: '安装时间', dataIndex: 'address',  width: 150 ,align: 'center' },
  { title: '收费金额', dataIndex: 'address',  width: 150 ,align: 'center' },
  { title: '有效期至', dataIndex: 'address', width: 150 ,align: 'center' },
  { title: '发票号码', dataIndex: 'address', width: 150 ,align: 'center' },
  { title: '支付方式', dataIndex: 'address', width: 150 ,align: 'center' },
  { title: '收费备注', dataIndex: 'address', width: 150 ,align: 'center' },
  { title: '收款人', dataIndex: 'address', width: 150 ,align: 'center' },
];

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
// 收费信息弹窗
function MsgDetail(props){
  let navIndex = 0; 
  let msgform = (
        <div className = 'detail'>
          <Form layout="inline"  className='clean'>
            <div className = 'clean'>
              <FormItem label = '车辆ID：' className = 'formItem fl clean'>
              <Input disabled  className = 'disabled'/>
              </FormItem>
              <FormItem label = '车牌号：' className = 'formItem fl clean'>
              <Input disabled  className = 'disabled'/>
              </FormItem>
              <FormItem label = '公司（或车队名）：' className = 'formItem fl clean'>
              <Input disabled  className = 'disabled'/>
              </FormItem>
            </div>
            <div className = 'clean'>
              <FormItem label = '收费金额' className = 'formItem fl clean'>
                <Input  className = 'pay'/>
                <span  className = 'unit'>单位：元</span>
              </FormItem>
              <FormItem label = '支付方式：' className = 'formItem fl clean'>
                <Select defaultValue="" style={{ width: 120 }} onChange={props.handleChange}>
                  <Option value="jack">Jack</Option>
                  <Option value="jack">Jack</Option>
                </Select>
              </FormItem>
              <FormItem label = '截止时间：' className = 'formItem fl clean'>
                <Select defaultValue="" style={{ width: 120 }} onChange={props.handleChange}>
                  <Option value="jack">Jack</Option>
                  <Option value="jack">Jack</Option>
                </Select>
              </FormItem>
            </div>
            <div className = 'clean'>
              <FormItem label = '发票（或收据）号码：' className = 'formItem fl clean'>
                <Select defaultValue="" style={{ width: 120 }} onChange={props.handleChange}>
                  <Option value="jack">Jack</Option>
                  <Option value="jack">Jack</Option>
                </Select>
              </FormItem>
            </div>
            <FormItem label = '收费备注：' className = 'formItem fl clean'>
              <TextArea rows={3} />
            </FormItem>
          </Form>
          <div className = 'diaBtns fr'>
            <Button type="primary">缴费确认</Button>
            <Button>取消</Button>
          </div>
        </div>
  )
  let recode = (
    <div>
      <Table  columns={recodeColumns} dataSource={data} scroll={{ x:1300,y:280}} pagination = {false}/>
      <Button type="primary" className = 'confirm'>确认</Button>
    </div>
  )
  return(
    <div className = 'dialog'>
      <div className = 'mask'></div>
      <div className = 'main'>
        <div className = 'nav clean'>
          <span className = {navIndex == 0 ? 'active' :''}>收费信息填写</span>
          <span className = {navIndex == 1 ? 'active' :''}>收费记录</span>
        </div>
          {navIndex == 0 ? msgform : recode}
      </div>
    </div>
  )
}
export default class Save extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showDiglog:false
    }
  }
  
  render() {
    return (
      <div className = 'save'>
        <TopForm />
        <Table rowSelection={rowSelection} columns={columns} dataSource={data} scroll={{ x:1500,y:400}} pagination = {false}/>
        {this.state.showDiglog ? <MsgDetail /> : ''}
      </div>
    )
  }
}
