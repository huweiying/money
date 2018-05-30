import React, { Component } from 'react'
import { Table , Input , Button , Breadcrumb , Form , Select,message, DatePicker} from 'antd';
const FormItem = Form.Item;
const Search = Input.Search;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
const { TextArea } = Input;

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
      rules: [{ type: 'array',  message: '请选择时间!' }],
    };
    return (
      <Form className = 'topForm clean'>
            <div className = 'fl'>
              <FormItem label = '收费日期：' className = 'formItem'>
                {getFieldDecorator('chargeTime', rangeConfig)(
                  <RangePicker format="YYYY-MM-DD"/>
                )}
              </FormItem>
              <FormItem label = '有效日期：' className = 'formItem'>
              {getFieldDecorator('deadlineDate', rangeConfig)(
                <RangePicker format="YYYY-MM-DD"/>
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
              <Button type="primary" onClick={this.exportForm}>导出</Button>
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
    }
  },
})(TopForm)

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
        values.invoiceNum = values.prefix + values.invoiceNum;
        delete values.prefix;
        values.deadlineDate = new Date(this.props.detail.deadlineDate).getTime();
        values.chargeTime = $Funs.formatDate(values.chargeTime);
        values.id = this.props.detail.chargeid;
        values.newCarId = this.props.detail.newCarId;
        values.vehicleId = this.props.detail.vehicleId;
        values.teamName = this.props.detail.teamName;
        values.inputMan = $Funs.cook.get('id');
        values.inputManName = $Funs.cook.get('name');
        // values.deadlineDate && (values.deadlineDate = new Date(values.deadlineDate._d).getTime())
        // console.log(values)
        $Funs.$AJAX('charge','post',values,(res)=>{
          message.success('操作成功');
          this.props.cancel()
        })      
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





export default class Modify extends Component {
  constructor(props) {
    super(props);
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
    $Funs.$AJAX('getChargeComplex','get',data,(res)=>{
      let data = res.data.map((v,i)=>{
        v.key = i;
        v.leaveFactoryInstall = v.leaveFactoryInstall == 0 ? '否' : '是';
        v.leaveFactoryDate = v.leaveFactoryDate.split(' ')[0];
        v.stop == 1 ? (v.stop = '是') : (v.stop = '否');
        v.stopTime ? (v.stopTime = $Funs.formatDate(v.stopTime)) : (v.stopTime = '无');
        v.chargeTime ? (v.chargeTime = $Funs.formatDate(v.chargeTime)) : v.chargeTime = '未收费';
        v.deadlineDate ? (v.deadlineDate = $Funs.formatDate(v.deadlineDate)) : v.deadlineDate = '无';
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
  render() {
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
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
    };
    
    return (
      <div className = 'modify'>
      <SearchForm init={this.init} getSearch = {this.getSearch}/>
        <Table rowSelection={rowSelection} expandedRowRender={record => <p style={{ margin: 0 }}>备注：{record.remark}</p>} columns={columns} dataSource={this.state.data}  pagination = {{ defaultPageSize:13,total:this.state.total,onChange:this.pageChange,current:this.state.currPage }}/>
        {this.state.showDiglog && <MsgDetail detail = {this.state.detail} cancel = {this.cancel}/>}
      </div>
    )
  }
}
