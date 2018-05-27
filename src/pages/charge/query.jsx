import React, { Component } from 'react'
import { Table , Input , Button , Breadcrumb , Form , Select ,message} from 'antd';
const FormItem = Form.Item;
const Search = Input.Search;
const Option = Select.Option;


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
        <div className = 'fr'>
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
export default class Query extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showDiglog:false,
      currPage:1,
      pageSize:13,
      keyWord:{},//搜索关键字
      data:[],//table数据
      total:'',//总页数
      detail:{},//录入项对象
    }
  }
  componentWillMount(){
    this.init({})
  }
  init=(data)=>{
    !data.currPage && (data.currPage = this.state.currPage);
    data.pageSize = this.state.pageSize;
    $Funs.$AJAX('getChargelist','get',data,(res)=>{
      // let data = res.data.map((v,i)=>{
      //   v.key = i;
      //   v.leaveFactoryInstall = v.leaveFactoryInstall == 0 ? '否' : '是';
      //   v.leaveFactoryDate = v.leaveFactoryDate.split(' ')[0];
      //   v.chargeTime ? (v.chargeTime = $Funs.formatDate(v.chargeTime)) : v.chargeTime = '未收费';
      //   v.deadlineDate ? (v.deadlineDate = $Funs.formatDate(v.deadlineDate)) : v.deadlineDate = '无';
      //   return v
      // })
      // this.setState({
      //   data : data,
      //   total: res.count
      // })
    })
  }
  getSearch=(data)=>{
    if(data){
      this.setState({
        keyWord:data
      })
    }
  }
  pageChange = (page)=>{
    this.setState({
      currPage:page
    },()=>{
      this.init({})
    })
  }
  addEntry = (item)=>{
    console.log(item)
    this.setState({
      showDiglog:true,
      detail:item
    })
  }
  cancel = ()=>{
    this.setState({
      showDiglog:false
    })
  }
  render() {
    const columns = [
      { title: '公司车队', dataIndex: 'address',  width: 150 ,align: 'center' },
      { title: '车牌号', dataIndex: 'address',  width: 150 ,align: 'center' },
      { title: '报停时间', dataIndex: 'address',  width: 150 ,align: 'center' },
      { title: '终端说明', dataIndex: 'address',  width: 250 ,align: 'center' },
      { title: '收费日期', dataIndex: 'address',  width: 150 ,align: 'center' },
      { title: '有效日期', dataIndex: 'address',  width: 150 ,align: 'center' },
      { title: '是否报停', dataIndex: 'address',  width: 150 ,align: 'center' },
      { title: '发票号', dataIndex: 'address',  width: 150 ,align: 'center' },
      { title: '安装时间', dataIndex: 'address',  width: 150 ,align: 'center' },
      { title: '金额', dataIndex: 'address',  width: 150 ,align: 'center' },
      { title: '付款时间', dataIndex: 'address',  width: 150 ,align: 'center' },
      { title: '付款方式', dataIndex: 'address',  width: 150 ,align: 'center' },
      { title: '车辆类型', dataIndex: 'address',  width: 150 ,align: 'center' },
      { title: '联系电话', dataIndex: 'address',  width: 150 ,align: 'center' },
      { title: '收款人', dataIndex: 'address',  width: 150 ,align: 'center' },
      { title: '备注', dataIndex: 'address',  width: 150 ,align: 'center' },
    ];
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      }
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
    
    return (
      <div className = 'query'>
        <TopForm />
        <Table rowSelection={rowSelection} columns={columns} dataSource={data} scroll= {{ x:2500,y:700 }} pagination = {false}/>
        
      </div>
    )
  }
}
