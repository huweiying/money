import React, { Component } from 'react'
import { Base64 } from 'js-base64';
import moment from 'moment';
import { withRouter} from 'react-router-dom'
import { Table , Input , Button , Breadcrumb , Form , Select , DatePicker ,message ,Spin ,Divider } from 'antd';
const FormItem = Form.Item;
const Search = Input.Search;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

class TopForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data:{}
    }
  }
  componentWillReceiveProps(nextProps){
    let obj = [];
    if(nextProps.history.location.search){
      decodeURIComponent(nextProps.history.location.search).slice(1,).split('&').forEach((v,i)=>{
        obj[v.split('=')[0]] = v.split('=')[1] ?  v.split('=')[1] : '';
      })
      console.log(obj)
      this.setState({
        data:obj
      })
    }
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
        // data.currPage = 1;
        // this.props.init(data)
        }
    });
  }
  clear = ()=>{
    this.props.form.resetFields();
    this.props.clearKeyWord();
    this.props.history.push('dataQuery?currPage=1')
  }
  render(){
    const { getFieldDecorator, resetFields} = this.props.form;
    const rangeConfig = {
      // rules: [{ type: 'array',  message: 'Please select time!' }],
     // initialValue:[moment('2015/01/01','YYYY/MM/DD'), moment('2015/01/01','YYYY/MM/DD')+ '']
      initialValue: (this.state.data.paymentDate1 && this.state.data.paymentDate2) ? [ moment( window.$Funs.formatDate(Number(this.state.data.paymentDate1)),'YYYY/MM/DD'), moment( window.$Funs.formatDate(Number(this.state.data.paymentDate2)),'YYYY/MM/DD')] : ''
      // initialValue:[window.$Funs.formatDate(this.state.data.paymentDate1),window.$Funs.formatDate(this.state.data.paymentDate1)]
    };
    return (
      <Form className = 'topForm clean'>
            <div className = 'fl'>
              <FormItem label = '车牌号码：' className = 'formItem'>
                {getFieldDecorator('carNum',{
                  initialValue:this.state.data.carNum
                })(
                  <Input />
                )}
              </FormItem>
              <FormItem label = '公司车队：' className = 'formItem'>
                {getFieldDecorator('carCompany',{
                  initialValue:this.state.data.carCompany
                })(
                  <Input />
                )}
              </FormItem>
            </div>
            <div className = 'fl'>
              <FormItem label = 'SIM卡号：' className = 'formItem'>
                {getFieldDecorator('sim',{
                  initialValue:this.state.data.sim
                })(
                  <Input />
                )}
              </FormItem>
              <FormItem label = '终端号：' className = 'formItem'>
                {getFieldDecorator('deviceNum',{
                  initialValue:this.state.data.deviceNum
                })(
                  <Input />
                )}
              </FormItem>
              </div>
              <div className = 'fl'>
                <FormItem label = '变更时间：' className = 'formItem'>
                  {getFieldDecorator('paymentDate', rangeConfig)(
                    <RangePicker  placeholder={['开始时间', '结束时间']}/>
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
const TSearchForm = Form.create({
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
      clearKeyWord: Form.createFormField({
        value: props.clearKeyWord,
      }),
    }
  },
})(TopForm)

const SearchForm = withRouter(TSearchForm)

// export default SearchForm

// import { renderRoutes } from 'react-router-config'
class TDataQuery extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading:true,
      currPage:1,
      pageSize:13,
      keyWord:{},//搜索关键字
      data:[],//table数据
      total:'',//总页数
      selectedRows:[],//选中项
      selectedRowKeys:[]
      
    }
  }
  componentWillMount(){
    this.init()
  }
  componentWillReceiveProps(nextProps){
    this.init(decodeURIComponent(nextProps.location.search))
  }
  init=(url = decodeURIComponent(this.props.location.search))=>{
    let data = {}
    if(url){
      url.slice(1,).split('&').forEach((v,i)=>{
        let key = v.split('=')[0]
        let value = v.split('=')[1]
        data[key] = value
      })
    }
    !data.currPage && (data.currPage = this.state.currPage) 
    !data.pageSize && (data.pageSize = this.state.pageSize) 
    window.$Funs.$AJAX('carUpd','get',data,(res)=>{
      let arr = res.data.map((v,i)=>{
        v.changeTime = window.$Funs.formatDate(v.changeTime)
        v.key = i;
        v.changeDetail = v.changeDetail.reverse();
        v.changeDetail = v.changeDetail.map((v,i)=>{
          v = v.split(';')
          return v
        })
        return v
      })
      this.setState({
        data:arr,
        total:res.count,
        currPage:Number(data.currPage),
        loading:false
      })
    })
  }
  // getSearch=(data)=>{
  //   if(data){
  //     this.setState({
  //       keyWord:data,
  //       currPage:1,
  //       loading:true
  //     },()=>{
  //       this.init(data)
  //     })
  //   }
  // }
  // pageChange = (page)=>{
  //   this.setState({
  //     currPage:page,
  //     loading:true
  //   },()=>{
  //     let data = this.state.keyWord;
  //     this.init(data)
  //   })
  // }
  getSearch=(data)=>{
    this.setState({
      keyWord:data
    })
    let str = '';
    for(let v in data){
      str = str + '&' + v + '=' + data[v]
    }
    let url = encodeURIComponent('currPage=1&pageSize='+this.state.pageSize+str)
    this.props.history.push('dataQuery?'+url)
  }
  clearKeyWord = ()=>{
    this.setState({
      keyWord:{}
    })
  }
  pageChange = (page)=>{
    let keyWord = this.state.keyWord;
    if(keyWord){
      var str = '';
      for(let v in keyWord){
        str = str + '&' + v + '=' + keyWord[v]
      }
    }
    // this.setState({
    //   selectedRowKeys:[],
    //   selectedRows:[]
    // })
    let url = encodeURIComponent('currPage='+ page + '&pageSize='+this.state.pageSize+str)
    this.props.history.push('dataQuery?'+url)
  }
  exportForm = ()=>{
    if(this.state.selectedRows.length == 0){
      message.error('未选择导出项');
      return 
    }
    let exslDTO = {}
    exslDTO.ids = this.state.selectedRows.map(v=>{
      return v.id 
    })
    exslDTO.maps = {
      "vehicleId":'车牌号',
      "sim":'SIM卡号',
      "manageNum":'终端号',
      "teamName":'公司车队',
      "changeTime":'变更时间',
    }
    exslDTO.type = 1;
    let code = Base64.encode(JSON.stringify(exslDTO))
    window.open(window.$Funs.Basse_Port+'saveExsl?exslDTO='+ code)
  }
  render() {
    const { selectedRowKeys }= this.state
    const columns = [
      { title: '车牌号', dataIndex: 'vehicleId', key: 'vehicleId', width: 200 ,align: 'center' },
      { title: 'SIM卡号', dataIndex: 'sim', key: 'sim', width: 200 ,align: 'center' },
      { title: '终端号', dataIndex: 'manageNum', key: 'manageNum', width: 200 ,align: 'center' },
      { title: '公司车队', dataIndex: 'teamName', key: 'teamName', width: 200 ,align: 'center' },
      { title: '变更时间', dataIndex: 'changeTime', key: 'changeTime', width: 200 ,align: 'center' },
    ];
    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRows,
          selectedRowKeys
        })
      }
    };
    
    return (
      <div className = 'dataQuery'>
        <Spin spinning = {this.state.loading} size = 'large'>
          <SearchForm init={this.init} exportForm = {this.exportForm} getSearch = {this.getSearch} clearKeyWord = { this.clearKeyWord }/>
          <Table rowSelection={rowSelection} columns={columns} expandedRowRender={record => {return (<div>{record.changeDetail.map((v,i)=>{return (<div style={{ margin: 0 }} key = {i}>{v.map((sub,i)=>{return (<p key={i}>{sub}</p>)})}<Divider /></div>)})}</div>) }} dataSource={this.state.data}  pagination = {{ defaultPageSize:this.state.pageSize,total:this.state.total,onChange:this.pageChange ,current:this.state.currPage}}/>
        </Spin>
      </div>
    )
  }
}
const DataQuery = withRouter(TDataQuery)

export default DataQuery