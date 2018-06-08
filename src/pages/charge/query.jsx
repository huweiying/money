import React, { Component } from 'react'
import { Base64 } from 'js-base64';
import { Table , Input , Button , Breadcrumb , Form , Select ,message, DatePicker} from 'antd';
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
        if(arr[i] == 'chargeTime'){
          values[arr[i]] && (data.chargeTimeStart = new Date(values[arr[i]][0]._d).getTime());
          values[arr[i]] && (data.chargeTimeEnd = new Date(values[arr[i]][1]._d).getTime());
        }else if(arr[i] == 'deadlineDate'){
          values[arr[i]] && (data.deadlineDateStart = new Date(values[arr[i]][0]._d).getTime());
          values[arr[i]] && (data.deadlineDateEnd = new Date(values[arr[i]][1]._d).getTime());
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
    const { getFieldDecorator, resetFields } = this.props.form;
    const rangeConfig = {
      rules: [{ type: 'array',  message: 'Please select time!' }],
    };
    return (
      <Form className = 'topForm clean'>
            <div className = 'fl'>
              <FormItem label = '收费日期：' className = 'formItem'>
                {getFieldDecorator('chargeTime', rangeConfig)(
                  <RangePicker format="YYYY-MM-DD" placeholder={['开始时间', '结束时间']}/>
                )}
              </FormItem>
              <FormItem label = '有效日期：' className = 'formItem'>
              {getFieldDecorator('deadlineDate', rangeConfig)(
                <RangePicker format="YYYY-MM-DD" placeholder={['开始时间', '结束时间']}/>
              )}
              </FormItem>
              
              </div>
              <div className = 'fl'>
                <FormItem label = '公司车队：' className = 'formItem'>
                {getFieldDecorator('teamName')(
                  <Input />
                )}
                </FormItem>
                <FormItem label = '收款人：' className = 'formItem'>
                {getFieldDecorator('inputManName')(
                  <Input />
                )}
                </FormItem>
              
              </div>
              <div className = 'fl'>
                <FormItem label = '车牌号码：' className = 'formItem'>
                  {getFieldDecorator('vehicleId')(
                    <Input />
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
      getSearch: Form.createFormField({
        value: props.getSearch,
      }),
      exportForm: Form.createFormField({
        value: props.exportForm,
      }),
    }
  },
})(TopForm)

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
      selectedRows:[]
    }
  }
  componentWillMount(){
    this.init({})
  }
  init=(data)=>{
    !data.currPage && (data.currPage = this.state.currPage);
    data.pageSize = this.state.pageSize;
    window.$Funs.$AJAX('getChargeComplex','get',data,(res)=>{
      let data = res.data.map((v,i)=>{
        v.key = i;
        v.leaveFactoryInstall = v.leaveFactoryInstall == 0 ? '否' : '是';
        v.leaveFactoryDate = v.leaveFactoryDate.split(' ')[0];
        v.stop == 1 ? (v.stop = '是') : (v.stop = '否');
        v.stopTime ? (v.stopTime = window.$Funs.formatDate(v.stopTime)) : (v.stopTime = '无');
        v.chargeTime ? (v.chargeTime = window.$Funs.formatDate(v.chargeTime)) : v.chargeTime = '未收费';
        v.deadlineDate ? (v.deadlineDate = window.$Funs.formatDate(v.deadlineDate)) : v.deadlineDate = '无';
        return v
      })
      this.setState({
        data : data,
        total: res.count
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
  addEntry = (item)=>{
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
  exportForm = ()=>{
      if(this.state.selectedRows.length == 0){
        message.error('未选择导出项');
        return 
      }
      let exslDTO = {}
      exslDTO.ids = this.state.selectedRows.map(v=>{
        return v.chargeid
      })
      exslDTO.maps = {
        "teamName":'公司车队',
        "vehicleId":'车牌号',
        "stopTime":'报停时间',
        "deviceName":'终端说明',
        "chargeTime":'收费日期',
        "deadlineDate":'有效日期',
        "stop":'是否报停',
        "invoiceNum":'发票号',
        "leaveFactoryDate":'安装时间',
        "moneyAmont":'收费金额',
        "payType":'付款方式',
        "typeName":'车辆类型',
        "phone":'联系电话',
        "inputManName":'收款人',
      }
      exslDTO.type = 3;
      let code = Base64.encode(JSON.stringify(exslDTO))
      window.open(window.$Funs.Basse_Port+'saveExsl?exslDTO='+ code)
  }
  render() {
   
    const columns = [
      { title: '公司车队', dataIndex: 'teamName',key:'teamName',  width: 100 ,align: 'center' },
      { title: '车牌号', dataIndex: 'vehicleId',key:'vehicleId',  width: 90 ,align: 'center' },
      { title: '报停时间', dataIndex: 'stopTime',key:'stopTime',  width: 100 ,align: 'center' },
      { title: '终端说明', dataIndex: 'deviceName',key:'deviceName',  width: 150 ,align: 'center' },
      { title: '收费日期', dataIndex: 'chargeTime',key:'chargeTime',  width: 100 ,align: 'center' },
      { title: '有效日期', dataIndex: 'deadlineDate',key:'deadlineDate',  width: 100 ,align: 'center' },
      { title: '是否报停', dataIndex: 'stop', key:'stop', width: 100 ,align: 'center' },
      { title: '发票号', dataIndex: 'invoiceNum',key:'invoiceNum' , width: 100 ,align: 'center' },
      { title: '安装时间', dataIndex: 'leaveFactoryDate',key:'leaveFactoryDate',  width: 100 ,align: 'center' },
      { title: '收费金额', dataIndex: 'moneyAmont',key:'moneyAmont',  width: 100 ,align: 'center' },
      { title: '付款方式', dataIndex: 'payType',key:'payType',  width: 100 ,align: 'center' },
      { title: '车辆类型', dataIndex: 'typeName',key:'typeName',  width: 100 ,align: 'center' },
      { title: '联系电话', dataIndex: 'phone',key:'phone',  width: 100 ,align: 'center' },
      { title: '收款人', dataIndex: 'inputManName',key:'inputManName',  width: 100 ,align: 'center' },
    ];
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRows:selectedRows
        })
      }
    };
    return (
      <div className = 'query'>
        <SearchForm init={this.init} getSearch = {this.getSearch} exportForm = {this.exportForm}/>
        <Table rowSelection={rowSelection} expandedRowRender={record => <p style={{ margin: 0 }}>备注：{record.remark}</p>} columns={columns} dataSource={this.state.data} scroll= {{ x:1600,y:700 }} pagination = {{ defaultPageSize:13,total:this.state.total,onChange:this.pageChange,current:this.state.currPage }}/>
        {this.state.showDiglog && <MsgDetail detail = {this.state.detail} cancel = {this.cancel}/>}
      </div>
    )
  }
}
