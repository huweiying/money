import React, { Component } from 'react'
import { Link , withRouter } from 'react-router-dom'
import moment from 'moment';
import { Table , Input , Button , Form , Select,DatePicker ,message,Spin , Modal} from 'antd';
const FormItem = Form.Item;
const Search = Input.Search;
const Option = Select.Option;
const { TextArea } = Input;
const confirm = Modal.confirm;


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
          (values[arr[i]]) && (data[arr[i]] = values[arr[i]])
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
    this.props.history.push('save?currPage=1')
  }
  render(){
    const { getFieldDecorator, resetFields } = this.props.form;

    return (
      <Form className = 'topForm clean'>
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
              <FormItem label = '公司车队：' className = 'formItem'>
                {getFieldDecorator('teamName',{
                  initialValue:this.state.data.teamName
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
      clearKeyWord: Form.createFormField({
        value: props.clearKeyWord,
      }),
    }
  },
})(TopForm)

const SearchForm = withRouter(TSearchForm)




// 收费信息弹窗
class TMsgDetail extends Component{
  constructor(props) {
    super(props)
    this.state = {
      navIndex : 0,
      data:[]
    }
    
  }
  componentWillMount(){
    this.initTable()
  }
  initTable=()=>{
    window.$Funs.$AJAX('getChargeByNewCarId','get',{newCarId:this.props.detail.newCarId},(res)=>{
      let data = res.data.map((v,i)=>{
        v.key = i;
        v.chargeTime = window.$Funs.formatDate(v.chargeTime);
        v.deadlineDate = window.$Funs.formatDate(v.deadlineDate);
        return v
      })
      this.setState({
        data:data
      })
    })  
  }
  handleNav = ()=>{
    this.setState({
      navIndex: this.state.navIndex == 0 ? 1 : 0
    })
  }
  handleSubmit = ()=>{
    this.props.form.validateFields((err, values) => {
      if(!err){
        confirm({
          title: '提示',
          content: '确认提交收费信息？',
          okText:'确认',
          cancelText:'取消',
          onOk:() =>{
            values.invoiceNum = values.prefix + values.invoiceNum;
            delete values.prefix;
            values.newCarId = this.props.detail.newCarId;
            values.vehicleId = this.props.detail.vehicleId;
            values.teamName = this.props.detail.teamName;
            values.inputMan = window.$Funs.cook.get('id');
            values.inputManName = window.$Funs.cook.get('name');
            values.deadlineDate && (values.deadlineDate = new Date(values.deadlineDate._d).getTime())
            window.$Funs.$AJAX('charge','post',values,(res)=>{
              message.success('操作成功');
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
    
    const recodeColumns = [
      { title: '公司车队', width: 250, dataIndex: 'teamName' , key:'teamName',align: 'center' },
      { title: '车牌号码', dataIndex: 'vehicleId',key:'vehicleId', width: 100 ,align: 'center' },
      { title: '收费日期', dataIndex: 'chargeTime',key:'chargeTime', width: 100 ,align: 'center' },
      { title: '收费金额', dataIndex: 'moneyAmont',key:'moneyAmont',  width: 100 ,align: 'center' },
      { title: '有效期至', dataIndex: 'deadlineDate',key:'deadlineDate', width: 100 ,align: 'center' },
      { title: '发票号码', dataIndex: 'invoiceNum',key:'invoiceNum', width: 100 ,align: 'center' },
      { title: '支付方式', dataIndex: 'payType',key:'payType', width: 100 ,align: 'center' },
      { title: '收款人', dataIndex: 'inputManName',key:'inputManName', width: 100 ,align: 'center' },
    ];
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
                initialValue:(this.props.detail.deadlineDate != '无') ? moment(this.props.detail.deadlineDate,'YYYY-MM-DD') : ''
              })(
                <DatePicker placeholder='选择时间' disabledDate={(current)=>{ if(this.props.detail.deadlineDate == '无'){return false}
                  return current && current < moment(this.props.detail.deadlineDate,'YYYY-MM-DD').endOf('day')
                }}/>
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
          <Button type="primary" onClick = {this.handleSubmit}>缴费确认</Button>
          <Button onClick = { this.props.cancel}>取消</Button>
        </div>
      </div>
    )
    let recode = (
      <div>
        <Table  columns={recodeColumns} dataSource={this.state.data} scroll={{ y:380}} pagination = {false} expandedRowRender={record => <p style={{ margin: 0 }}>备注：{record.remark}</p>}/>
        <Button type="primary" className = 'confirm' onClick = { this.props.cancel}>确认</Button>
      </div>
    )
    return(
      <div className = 'dialog'>
        <div className = 'mask'></div>
        <div className = 'main'>
          <div className = 'nav clean'>
            <span className = {this.state.navIndex == 0 ? 'active' :''} onClick = {this.handleNav}>收费信息填写</span>
            <span className = {this.state.navIndex == 1 ? 'active' :''} onClick = {this.handleNav}>收费记录</span>
          </div>
            {this.state.navIndex == 0 ? msgform : recode}
        </div>
      </div>
    )
  }
}
const MsgDetail = Form.create()(TMsgDetail)

class TSave extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading:true,
      showDiglog:false,
      currPage:1,
      pageSize:10,
      keyWord:{},//搜索关键字
      data:[],//table数据
      total:'',//总页数
      detail:{},//录入项对象
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
    window.$Funs.$AJAX('getChargelist','get',data,(res)=>{
      let arr = res.data.map((v,i)=>{
        v.key = i;
        v.leaveFactoryInstall = v.leaveFactoryInstall == 0 ? '否' : '是';
        v.leaveFactoryDate = v.leaveFactoryDate.split(' ')[0];
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
    this.props.history.push('save?'+url)

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
    let url = encodeURIComponent('currPage='+ page + '&pageSize='+this.state.pageSize+str)
    this.props.history.push('save?'+url)
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
  //     loading:true,
  //   },()=>{
  //     let data = this.state.keyWord;
  //     this.init(data)
  //   })
  // }
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
  render() {
    const columns = [
      { title: '车牌号码', width: 100, dataIndex: 'vehicleId',key: 'vehicleId',align: 'center' },
      { title: '车辆类型', width: 150, dataIndex: 'typeName' ,align: 'center' },
      { title: '公司车队', dataIndex: 'teamName', width: 150 ,align: 'center' },
      { title: '收费日期', dataIndex: 'chargeTime',  width: 150 ,align: 'center' },
      { title: '联系电话', dataIndex: 'phone',  width: 120 ,align: 'center' },
      { title: '有效期至', dataIndex: 'deadlineDate', width: 150 ,align: 'center' },
      { title: '安装日期', dataIndex: 'leaveFactoryDate', width: 150 ,align: 'center' },
      { title: '是否出厂安装', dataIndex: 'leaveFactoryInstall', width: 120 ,align: 'center' },
      { title: '厂家编号', dataIndex: 'factoryNumber', width: 100 ,align: 'center' },
      { title: '生产厂家', dataIndex: 'manufacturer', width: 100 ,align: 'center' },
      { title: '操作', dataIndex: '', key: 'action', render: (item) => <Button type="primary" onClick = {()=>{this.addEntry(item)}}>录入</Button> },
    ];
    
    return (
      <div className = 'save'>
        <Spin spinning = {this.state.loading} size='large'>
        <SearchForm init={this.init} getSearch = {this.getSearch} clearKeyWord = { this.clearKeyWord }/>
          <Table  columns={columns} dataSource={this.state.data} scroll={{y:400}}  pagination = {{ defaultPageSize:this.state.pageSize,total:this.state.total,onChange:this.pageChange,current:this.state.currPage }}/>
          {this.state.showDiglog && <MsgDetail detail = {this.state.detail} cancel = {this.cancel}/>}
        </Spin>
      </div>
    )
  }
}

const Save = withRouter(TSave)

export default Save