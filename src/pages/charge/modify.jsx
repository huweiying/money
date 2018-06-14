import React, { Component } from 'react'
import { Base64 } from 'js-base64';
import moment from 'moment';
import { withRouter } from 'react-router-dom'
import { Table , Input , Button , Breadcrumb , Form , Select,message, DatePicker,Spin,Modal} from 'antd';
const FormItem = Form.Item;
const Search = Input.Search;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
const confirm = Modal.confirm;
const { TextArea } = Input;

class TopForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data:{}
    }
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
      }
    });
  }
  componentWillReceiveProps(nextProps){
    let obj = [];
    decodeURIComponent(nextProps.history.location.search).slice(1,).split('&').forEach((v,i)=>{
      obj[v.split('=')[0]] = v.split('=')[1] ?  v.split('=')[1] : '';
    })
    this.setState({
      data:obj
    })
  }
  clear = ()=>{
    this.props.form.resetFields();
    this.props.clearKeyWord();
    this.props.history.push('modify?currPage=1')
  }
  render(){
    const { getFieldDecorator, resetFields } = this.props.form;
    return (
      <Form className = 'topForm clean'>
            <div className = 'fl'>
              <FormItem label = '收费日期：' className = 'formItem'>
                {getFieldDecorator('chargeTime',{
                  initialValue: (this.state.data.chargeTimeStart && this.state.data.chargeTimeEnd) ? [ moment( window.$Funs.formatDate(Number(this.state.data.chargeTimeStart)),'YYYY/MM/DD'), moment( window.$Funs.formatDate(Number(this.state.data.chargeTimeEnd)),'YYYY/MM/DD')] : ''
                })(
                  <RangePicker format="YYYY-MM-DD" placeholder={['开始时间', '结束时间']}/>
                )}
              </FormItem>
              <FormItem label = '有效日期：' className = 'formItem'>
              {getFieldDecorator('deadlineDate', {
                initialValue: (this.state.data.deadlineDateStart && this.state.data.deadlineDateEnd) ? [ moment( window.$Funs.formatDate(Number(this.state.data.deadlineDateStart)),'YYYY/MM/DD'), moment( window.$Funs.formatDate(Number(this.state.data.deadlineDateEnd)),'YYYY/MM/DD')] : ''
              })(
                <RangePicker format="YYYY-MM-DD" placeholder={['开始时间', '结束时间']}/>
              )}
              </FormItem>
              
              </div>
              <div className = 'fl'>
                <FormItem label = '公司车队：' className = 'formItem'>
                {getFieldDecorator('teamName',{
                  initialValue:this.state.data.teamName
                })(
                  <Input />
                )}
                </FormItem>
                <FormItem label = '收款人：' className = 'formItem'>
                {getFieldDecorator('inputManName',{
                  initialValue:this.state.data.inputManName
                })(
                  <Input />
                )}
                </FormItem>
              
              </div>
              <div className = 'fl'>
                <FormItem label = '车牌号码：' className = 'formItem'>
                  {getFieldDecorator('vehicleId',{
                    initialValue:this.state.data.vehicleId
                  })(
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
const TSearchForm = Form.create({
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
      clearKeyWord: Form.createFormField({
        value: props.clearKeyWord,
      }),
    }
  },
})(TopForm)

const SearchForm = withRouter(TSearchForm)


class TMsgDetail extends Component{
  constructor(props) {
    super(props)
    this.state = {
      data:[]
    }
  }
  handleSubmit = ()=>{
    this.props.form.validateFields((err, values) => {
      if(!err){
        confirm({
          title: '提示',
          content: '确认提交补全信息？',
          okText:'确认',
          cancelText:'取消',
          onOk:()=> {
            values.invoiceNum = values.prefix + values.invoiceNum;
            delete values.prefix;
            values.deadlineDate = new Date(this.props.detail.deadlineDate).getTime();
            values.chargeTime = window.$Funs.formatDate(values.chargeTime);
            values.id = this.props.detail.chargeid;
            values.newCarId = this.props.detail.newCarId;
            values.vehicleId = this.props.detail.vehicleId;
            values.teamName = this.props.detail.teamName;
            values.inputMan = window.$Funs.cook.get('id');
            values.inputManName = window.$Funs.cook.get('name');
            window.$Funs.$AJAX('charge','post',values,(res)=>{
              message.success('修改成功');
              this.props.cancel()
            })      
          },
          onCancel() {
          },
        });
        
      }
    });
  }
  render(){
    const { getFieldDecorator} = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: 'F',
    })(
      <Select style={{ width: 50 }}>
        <Option value="F">F</Option>
        <Option value="S">S</Option>
      </Select>
    );
    let msgform = (
      <div className = 'detail'>
        <Form layout="inline"  className='clean'>
          <div className = 'clean'>
            <FormItem label='车牌号' className = 'formItem clean'>
              <Input  value={this.props.detail.vehicleId } disabled className = 'disabled'/>
            </FormItem>
            <FormItem label='公司或车队名' className = 'formItem clean'>
              <Input  value={this.props.detail.teamName } disabled className = 'disabled'/>
            </FormItem>
            <FormItem className = 'formItem clean'{...formItemLayout} label="收费金额">
              {getFieldDecorator('moneyAmont', {
                rules: [ {
                  required: true, message: '请输入收费金额',
                }],
              })(
                <Input className = 'pay' />
              )}
              <span  className = 'unit'>单位：元</span>
            </FormItem>
          </div>
          <div className = ' clean'>
            
            <FormItem className = 'formItem clean'{...formItemLayout} label="支付方式">
              {getFieldDecorator('payType', {
                rules: [ {
                  required: true, message: '请输入收费金额',
                }],
                initialValue:'现金'
              })(
                <Select  style={{ width: 200 }}>
                  <Option value="现金">现金</Option>
                  <Option value="转帐支票">转帐支票</Option>
                  <Option value="网银转账">网银转账</Option>
                  <Option value="支付宝">支付宝</Option>
                  <Option value="微信">微信</Option>
                  <Option value="其他">其他</Option>
                </Select>     
              )}
            </FormItem>
            <FormItem className = 'formItem clean'{...formItemLayout} label="截止时间">
              {getFieldDecorator('deadlineDate', {
                rules: [ {
                  required: true, message: '请输入截止时间',
                }],
              })(
                <DatePicker />
              )}
            </FormItem>
          </div>
          <div className = 'clean'>
            <FormItem className = 'formItem code clean' {...formItemLayout} label="发票（或收据）号码">
              {getFieldDecorator('invoiceNum', {
                rules: [ {
                  required: true, message: '请输入发票（或收据）号码',
                }],
              })(
                <Input  addonBefore={prefixSelector} style={{ width: '100%' }} />
              )}
            </FormItem>
          </div>
          <FormItem label = '收费备注：' className = 'formItem fl clean'>
            {getFieldDecorator('remark', {
              rules: [ {
                required: true, message: '请输入收费备注',
              }],
            })(
              <TextArea rows={3} />
            )}
          </FormItem>
        </Form>
        <div className = 'diaBtns fr'>
          <Button type="primary" onClick = {this.handleSubmit}>确认修改</Button>
          <Button onClick = { this.props.cancel}>取消</Button>
        </div>
      </div>
    )
    return(
      <div className = 'dialog'>
        <div className = 'mask'></div>
        <div className = 'main'>
          <p className = 'title'>修改收费信息</p>
           {  msgform }
        </div>
      </div>
    )
  }
}
const MsgDetail = Form.create({
  mapPropsToFields(props) {
    return {
      detail: Form.createFormField({
        value: props.detail,
      }),
      cancel: Form.createFormField({
        value: props.cancel,
      }),
    }
  },
})(TMsgDetail)





class TModify extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading:true,
      showDiglog:false,
      currPage:1,
      pageSize:10,
      keyWord:{},//搜索关键字
      data:[],//table数据
      total:'',//总页数
      detail:{},//录入项对象
      selectedRows:[],
      electedRowKeys:[]

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
    window.$Funs.$AJAX('getChargeComplex','get',data,(res)=>{
      let arr = res.data.map((v,i)=>{
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
        data : arr,
        total: res.count,
        currPage:Number(data.currPage),
        loading:false
      })
    })
  }
  getSearch=(data)=>{
    this.setState({
      keyWord:data
    })
    let str = '';
    for(let v in data){
      str = str + '&' + v + '=' + data[v]
    }
    let url = encodeURIComponent('currPage=1&pageSize='+this.state.pageSize+str)
    this.props.history.push('modify?'+url)

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
    this.setState({
      selectedRowKeys:[],
      selectedRows:[]
    })
    let url = encodeURIComponent('currPage='+ page + '&pageSize='+this.state.pageSize+str)
    this.props.history.push('modify?'+url)
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
  edit = (item)=>{
    this.setState({
      showDiglog: true,
      detail:item
    })
  }
  cancel =()=>{
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
        "moneyAmont":'付款金额',
        "payType":'付款方式',
        "chargeTime":'付款日期',
        "deadlineDate":'有效期至',
        "invoiceNum":'发票（或收据）号码',
        "inputManName":'收款人',
      }
      exslDTO.type = 2;
      let code = Base64.encode(JSON.stringify(exslDTO))
      window.open(window.$Funs.Basse_Port+'saveExsl?exslDTO='+ code)
  }
  render() {
    const {selectedRowKeys }= this.state
    const columns = [
      { title: '公司车队', dataIndex: 'teamName',key:'teamName',  width: 150 ,align: 'center' },
      { title: '车牌号', dataIndex: 'vehicleId',key:'vehicleId',  width: 100 ,align: 'center' },
      { title: '付款金额', dataIndex: 'moneyAmont',key:'moneyAmont',  width: 100 ,align: 'center' },
      { title: '付款方式', dataIndex: 'payType',key:'payType',  width: 100 ,align: 'center' },
      { title: '付款日期', dataIndex: 'chargeTime',key:'chargeTime' , width: 100 ,align: 'center' },
      { title: '有效期至', dataIndex: 'deadlineDate',key:'deadlineDate',  width: 100 ,align: 'center' },
      { title: '发票（或收据）号码', dataIndex: 'invoiceNum',key:'invoiceNum',  width: 150 ,align: 'center' },
      { title: '收款人', dataIndex: 'inputManName',key:'inputManName', width: 100 ,align: 'center' },
      { title: '操作', dataIndex: '', key: 'action', width: 100 ,align: 'center' , render: (item) => <Button type="primary" onClick = {()=>{this.edit(item)}}>修改</Button> },
    ];
    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRows,
          selectedRowKeys
        })
      },
    };
    
    return (
      <div className = 'modify'>
        <Spin spinning = {this.state.loading} size='large'>
          <SearchForm init={this.init} getSearch = {this.getSearch} exportForm = {this.exportForm}  clearKeyWord = { this.clearKeyWord }/>
          <Table rowSelection={rowSelection} expandedRowRender={record => <p style={{ margin: 0 }}>备注：{record.remark}</p>} columns={columns} dataSource={this.state.data}  pagination = {{ defaultPageSize:this.state.pageSize,total:this.state.total,onChange:this.pageChange,current:this.state.currPage }}/>
          {this.state.showDiglog && <MsgDetail detail = {this.state.detail} cancel = {this.cancel}/>}
        </Spin>
      </div>
    )
  }
}

const Modify = withRouter(TModify)

export default Modify