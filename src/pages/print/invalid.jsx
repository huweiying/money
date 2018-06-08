import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Table, Input, Button, Form, Select, Pagination, Modal, message ,Spin } from 'antd';
const FormItem = Form.Item;
const Search = Input.Search;
const Option = Select.Option;
import Finds from "../../component/find"
import Arrs from "../../assets/js/formArray"
// import { renderRoutes } from 'react-router-config'
const columns = [
  { title: '车牌号码', width: 100, dataIndex: 'vehiclePlate', key: '', align: 'center' },
  { title: 'SIM卡号', dataIndex: 'sim', key: 'sim', width: 150, align: 'center' },
  { title: '证明编号', dataIndex: 'num', key: 'num', width: 150, align: 'center' },
  { title: '打印时间', dataIndex: 'createTime', key: 'createTime', width: 150, align: 'center' },
  { title: '是否已作废', dataIndex: 'status', key: 'status', width: 150, align: 'center' },
];


export default class Invalid extends Component {
  constructor(props) {
    super(props)
    this.state = {
      nav: [
        { tit: '未作废', Selected: true, value: 0 },
        { tit: '已作废', Selected: false, value: 1 },
      ],
      form:{},
      loading:true,
      navcur: 0
    }
  }
  componentWillMount() {
    this.list({
      status: 0,
      currPage: 1,
      pageSize: 10
    })
  }
  sub(e) {
    let index = this.state.nav.findIndex(e => {
      return e.Selected
    })
    let Arr = e;
    Arr.status = index
    Arr.currPage = 1;
    Arr.pageSize = 10;
    this.setState({
      nowpage: 1,
      form: Arr,
      loading:false
    },()=>{
      this.list(Arr)
    })
  }
  list(data) {
    window.$Funs.$AJAX('printHistorys', 'get', data, res => {
      res.data = res.data.map((v, i) => {
        // window.$Funs.format(v.paymentDate)
        v.createTime = window.$Funs.format(v.createTime)
        v.status == 1 ? v.status = '是' : v.status = '否';
        v.key = i
        return v
      })
      this.setState({
        list: res.data,
        total: res.count,
        loading:false
      })
    })
  }
  pageChange = (page) => {
    let index = this.state.nav.findIndex(e => {
      return e.Selected
    })
    this.setState({
      nowpage: page,
      loading:true
    },()=>{
      let Brr = this.state.form;
      Object.assign(Brr, {
        currPage: page,
        pageSize: 10,
        status: this.state.nav[index].value,
      });
      this.list(Brr)
    })
  }
  handleClick(i,e){
    let arr=this.state.nav;
    for(let val of arr){
      val.Selected=false;
    }
    arr[i].Selected=true;
    this.setState({
      nav:arr,
      navcur:arr[i].value,
      loading:true
    },()=>{
      this.list({
        status:arr[i].value,
        currPage:1,
        pageSize:10
      })
    })
  }
  rows = (type) => {
    let Ids = this.state.ck, newArr = [];
    for (let val of Ids) {
      newArr.push(val.id)
    }
    Modal.confirm({
      title: '申请作废',
      content: '确认提交？',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        window.$Funs.$AJAX('printHistorys', 'patch', newArr, e => {
          message.success('操作成功')
          setTimeout(() => {
            location.reload();
          }, 500);
        })
      }
    });
  }
  render() {
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          ck: selectedRows
        })
      },
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
      }),
    };
    return (
      <div className='invalid prove'>
        <div className='nav clean'>
          {
            this.state.nav.map((e, i) => {
              return (
                <span className={e.Selected ? 'active' : ''} onClick={this.handleClick.bind(this, i)} key={i}>{e.tit}</span>
              )
            })
          }
        </div>
        <Spin spinning={this.state.loading} size='large'>
        <Finds Formbody={Arrs.prove} sub={mode => this.sub(mode)} />
        {
          this.state.navcur==0 && <div className="fath">
            <Table rowSelection={rowSelection} columns={columns} dataSource={this.state.list} scroll={{ y: 400 }} pagination={{ defaultPageSize: 10, current: this.state.nowpage, total: this.state.total, onChange: this.pageChange }} />
            <Button type="primary" className='submit fr' onClick={this.rows} >作废该证明</Button>
          </div>
          ||
          <Table columns={columns} dataSource={this.state.list} scroll={{ y: 400 }} pagination={{ defaultPageSize: 10, current: this.state.nowpage, total: this.state.total, onChange: this.pageChange }} />
       }
       </Spin>
      </div>
    )
  }
}
