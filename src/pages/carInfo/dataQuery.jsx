import React, { Component } from 'react'
import { Table , Input , Button , Breadcrumb , Form , Select , DatePicker} from 'antd';
const FormItem = Form.Item;
const Search = Input.Search;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

class TopForm extends Component {
  constructor(props) {
    super(props)
  }
  handleSearch =()=>{
    this.props.form.validateFields((err, values) => {
      let arr = Object.keys(values);
      let data = {}
      for(let i = 0;i<arr.length;i++){
        if(arr[i] == 'paymentDate'){
          values[arr[i]] && (data.paymentDate1 = new Date(values[arr[i]][0]._d).getTime());
          values[arr[i]] && (data.paymentDate2 = new Date(values[arr[i]][1]._d).getTime());
        }else{
          (values[arr[i]]) && (data[arr[i]] = values[arr[i]])
        }
      }
      if(data){
        //默认查找第一页开始
        this.props.getSearch(data);
        data.currPage = 1;
        this.props.init(data)
        }
    });
  }
  clear = ()=>{
    this.props.form.resetFields();
    this.props.init({})
  }
  render(){
    const { getFieldDecorator, resetFields} = this.props.form;
    const rangeConfig = {
      rules: [{ type: 'array',  message: 'Please select time!' }],
    };
    return (
      <Form className = 'topForm clean'>
            <div className = 'fl'>
              <FormItem label = '车牌号码：' className = 'formItem'>
                {getFieldDecorator('carNum')(
                  <Input />
                )}
              </FormItem>
              <FormItem label = '公司车队：' className = 'formItem'>
                {getFieldDecorator('deviceName')(
                  <Input />
                )}
              </FormItem>
            </div>
            <div className = 'fl'>
              <FormItem label = 'SIM卡号：' className = 'formItem'>
                {getFieldDecorator('carCompany')(
                  <Input />
                )}
              </FormItem>
              <FormItem label = '终端号：' className = 'formItem'>
                {getFieldDecorator('manageNum')(
                  <Input />
                )}
              </FormItem>
              </div>
              <div className = 'fl'>
                <FormItem label = '变更时间：' className = 'formItem'>
                  {getFieldDecorator('paymentDate', rangeConfig)(
                    <RangePicker format="YYYY-MM-DD"/>
                  )}
                </FormItem>
              </div>
            <div className = 'fl'>
              <a className = 'empty' onClick = {this.clear} >清空</a>
            </div>
            <div className = 'fr'>
              <Button type="primary" onClick={this.handleSearch}>查找</Button>
              <Button type="primary" onClick={this.props.exportForm}>导出</Button>
            </div>
          </Form>
    )
  }
  
}
const SearchForm = Form.create({
  mapPropsToFields(props) {
    return {
      init: Form.createFormField({
        value: props.init,
      }),
      exportForm: Form.createFormField({
        value: props.exportForm,
      }),
      getSearch: Form.createFormField({
        value: props.getSearch,
      }),
    }
  },
})(TopForm)

// import { renderRoutes } from 'react-router-config'
export default class DataQuery extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currPage:1,
      pageSize:13,
      keyWord:{},//搜索关键字
      data:[],//table数据
      total:'',//总页数
      selectedRows:[],//选中项
      
    }
  }
  componentWillMount(){
    this.init()
  }

  init=(data = {})=>{
    !data.currPage && (data.currPage = this.state.currPage);
    data.pageSize = this.state.pageSize;
    $Funs.$AJAX('carUpd','get',data,(res)=>{
      let data = res.data.map((v,i)=>{
        v.changeTime = $Funs.formatDate(v.changeTime)
        v.key = i;
        return v
      })
      this.setState({
        data:data,
        total:res.count
      })
    })
  }
  getSearch=(data)=>{
    if(data){
      this.setState({
        keyWord:data,
        currPage:1
      })
    }
  }
  pageChange = (page)=>{
    this.setState({
      currPage:page,
    },()=>{
      let data = this.state.keyWord;
      data.currPage = page
      this.init(data)
    })
  }
 
  exportForm = ()=>{
    console.log(this.state.selectedRows)
    $Funs.$AJAX('getChargeComplexToExcel','get',data,(res)=>{
      
    })
  }
  render() {
    const columns = [
      { title: '车牌号', dataIndex: 'vehicleId', key: 'vehicleId', width: 200 ,align: 'center' },
      { title: 'SIM卡号', dataIndex: 'sim', key: 'sim', width: 200 ,align: 'center' },
      { title: '终端号', dataIndex: 'manageNum', key: 'manageNum', width: 200 ,align: 'center' },
      { title: '公司车队', dataIndex: 'teamName', key: 'teamName', width: 200 ,align: 'center' },
      { title: '变更时间', dataIndex: 'changeTime', key: 'changeTime', width: 200 ,align: 'center' },
    ];
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRows:selectedRows
        })
      },
    };
    
    return (
      <div className = 'dataQuery'>
        <SearchForm init={this.init} exportForm = {this.exportForm} getSearch = {this.getSearch} />
        <Table rowSelection={rowSelection} columns={columns} expandedRowRender={record => {return (<div><span>变更详情{record.changeDetail.map((v,i)=>{return (<p style={{ margin: 0 }} key = {i}>{v}</p>)})}</span></div>) }} dataSource={this.state.data}  pagination = {{ defaultPageSize:13,total:this.state.total,onChange:this.pageChange ,current:this.state.currPage}}/>
      </div>
    )
  }
}
