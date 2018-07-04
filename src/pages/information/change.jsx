import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Table , Input , Button , Form , Select , Breadcrumb,message, DatePicker,Spin,Modal} from 'antd';
const FormItem = Form.Item;
const Search = Input.Search;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
const confirm = Modal.confirm;
const { TextArea } = Input;
// import { renderRoutes } from 'react-router-config'


class TopForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data:[]
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
    this.props.history.push('change?currPage=1')
  }
  render(){
    const { getFieldDecorator, resetFields } = this.props.form;
    const rangeConfig = {
      rules: [{ type: 'array',  message: 'Please select time!' }],
    };
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
              <FormItem label = '公司车队：' className = 'formItem'>
                {getFieldDecorator('teamName',{
                  initialValue:this.state.data.teamName
                })(
                  <Input />
                )}
              </FormItem>
            </div>
            <div className = 'fl'>
              <FormItem label = 'SIM卡号' className = 'formItem'>
                {getFieldDecorator('sim',{
                  initialValue:this.state.data.sim
                })(
                  <Input />
                )}
              </FormItem>
              
              </div>
              <div className = 'fl'>
                <FormItem label = '终端号' className = 'formItem'>
                  {getFieldDecorator('manageNum',{
                    initialValue:this.state.data.manageNum
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

function UnabledItem(props){//禁用表单项
  return (
    <FormItem label = {props.label} className = 'formItem clean'>
      {props.tag && (<span className = 'tag'>{props.tag}</span>)}
      <Input disabled placeholder = {props.value} className = 'disabled'/>
    </FormItem>
  )
}



function SelectItem(props){//下拉表单项
  return (
    <FormItem label = {props.label} className = 'formItem clean'>
      <Select defaultValue="" style={{ width: 120 }} onChange={props.handleChange}>
        <Option value="jack">Jack</Option>
        <Option value="jack">Jack</Option>
      </Select>
    </FormItem>
  )
}
class TChgForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      // terminalType:[],
      simTypeName:[],
      product:[],
      termType3:'',
      termType4:'',

    }
  }
  componentWillMount(){
    window.$Funs.$AJAX('ziDian','get',{type:1},(res)=>{//生产厂家
      window.$Funs.$AJAX('newCar/getTerminal','get',{producerName:res[0]},(data)=>{//z终端生产厂家
        this.setState({
          product:res,
          subitem:data
        },()=>{
          window.$Funs.$AJAX('ziDian','get',{type:4},(res)=>{
            this.setState({
              simTypeName:res
            })
          })
        })
       })
    })
  }
  handleSelect=(type,v)=>{
    window.$Funs.$AJAX('newCar/getTerminal','get',{producerName:v},(data)=>{//
      if(type == 3){
        this.setState({
          termType3:data.termType
        })
      }else{
        this.setState({
          termType4:data.termType
        })
      }
    })
  }
  handleSubmit=()=>{
    this.props.form.validateFields((err, values) => {
      if(!err){
        confirm({
          title: '提示',
          content: '确认提交更改信息？',
          okText:'确认',
          cancelText:'取消',
          onOk:() => {
            let informationChangeDto = {
              relocationChangeDto:{},
              transferChangeDto:{},
              terminalChangeDto:{},
              simChangeDto:{}
            };
            informationChangeDto.inputMan = window.$Funs.cook.get('id');
            informationChangeDto.newCarId = this.props.detail.newCarId;
            let keys = Object.keys(values)
            keys.forEach((v,i)=>{
              if(v.split('_')[0] == 1){
                values[v] && (informationChangeDto.relocationChangeDto[v.split('_')[1]] = values[v]);
              }else if(v.split('_')[0] == 2){
                values[v] && (informationChangeDto.transferChangeDto[v.split('_')[1]] = values[v]);
              }else if(v.split('_')[0] == 3){
                // if(v == '3_newProduct' && values[v]){
                //   informationChangeDto.terminalChangeDto.newTerminalType = this.state.termType3;
                //   // window.$Funs.$AJAX('newCar/getTerminal','get',{producerName:values[v]},(data)=>{//
                //   //   informationChangeDto.terminalChangeDto.newTerminalType = data.termType;
                //   // })
                // }else{
                  values[v] && (informationChangeDto.terminalChangeDto[v.split('_')[1]] = values[v]);
                // }
              }else{
                // if(v == '4_newProduct' && values[v]){
                //   informationChangeDto.simChangeDto.newTerminalType = this.state.termType4;
                //   // window.$Funs.$AJAX('newCar/getTerminal','get',{producerName:values[v]},(data)=>{//
                //   //   informationChangeDto.simChangeDto.newTerminalType = data.termType;
                //   // })
                // }else{
                  values[v] && (informationChangeDto.simChangeDto[v.split('_')[1]] = values[v]);
                // }
              }
            })
            let obj = {}
            this.state.termType3 && (informationChangeDto.terminalChangeDto.newTerminalType = this.state.termType3);
            this.state.termType4 && (informationChangeDto.simChangeDto.newTerminalType = this.state.termType4);
            for(var p in informationChangeDto){
              !(JSON.stringify(informationChangeDto[p])=="{}") && (obj[p] = informationChangeDto[p])
            }
            window.$Funs.$AJAX('informationChange','post',obj,(res)=>{
              message.success('操作成功');
              this.props.cancel();
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
    return (
      <div className='chgForm'>
        <Breadcrumb>
          <Breadcrumb.Item><span onClick = {this.props.cancel}>信息变更</span></Breadcrumb.Item>
          <Breadcrumb.Item>详情</Breadcrumb.Item>
        </Breadcrumb>
      <div>
        <h2>信息变更</h2>
        <div className = "addForm">
          <Form layout="inline" onSubmit={this.handleSubmit} className='clean'>
            <div>
              <p>移机变更</p>
              <div className = 'row clean'>
                <UnabledItem label='公司（或车队）名' value={this.props.detail.teamName}/>
                <UnabledItem label='原车牌号' value={this.props.detail.oldVehicleId}/>
                <UnabledItem label='历史车牌号' value=''/>
                <FormItem className = 'formItem clean'{...formItemLayout} label="新车牌号">
                    {getFieldDecorator('1_newVehicleId', {
                    
                    })(
                      <Input  />
                    )}
                </FormItem>
              </div>
              <div className = 'row clean'>
                <UnabledItem label='原车架号' value={this.props.detail.carframeId}/>
                <FormItem className = 'formItem clean'{...formItemLayout} label="新车架号">
                    {getFieldDecorator('1_newCarframeId', {
                     
                    })(
                      <Input  />
                    )}
                </FormItem>
                <UnabledItem label='原联系方式' value={this.props.detail.phone}/>
                <FormItem className = 'formItem clean'{...formItemLayout} hasFeedback label="新联系方式">
                    {getFieldDecorator('1_newPhone', {
                      rules: [ {
                        pattern: new RegExp(/^1[3|5|7|8|]\d{9}$/) ,message: '手机格式不正确',
                      }],
                    })(
                      <Input  />
                    )}
                </FormItem>
              </div>
              <div className = 'row clean'>
              <UnabledItem label='原所属区域' value={this.props.detail.address}/>
                <FormItem className = 'formItem clean'{...formItemLayout} label="新所属区域">
                    {getFieldDecorator('1_address', {
                    
                    })(
                      <Input  />
                    )}
                </FormItem>
              </div>
            </div>
            <div>
              <p>过户信息</p>
              <div className = 'row clean'>
                <UnabledItem label='原公司名' value={this.props.detail.teamName}/>
                <FormItem className = 'formItem clean'{...formItemLayout}  label="新公司名">
                    {getFieldDecorator('2_newTeamname', {
                    
                    })(
                      <Input  />
                    )}
                </FormItem>
                <UnabledItem label='原车牌号' value={this.props.detail.oldVehicleId}/>
                <FormItem className = 'formItem clean'{...formItemLayout}  label="新车牌号">
                    {getFieldDecorator('2_newVehicleId', {
                     
                    })(
                      <Input  />
                    )}
                </FormItem>
              </div>
              <div className = 'row clean'>
                <UnabledItem label='原车架号' value={this.props.detail.carframeId}/>
                <FormItem className = 'formItem clean'{...formItemLayout}   label="新车架号">
                    {getFieldDecorator('2_newCarframeId', {
                  
                    })(
                      <Input  />
                    )}
                </FormItem>
                <UnabledItem label='原联系方式' value={this.props.detail.phone}/>
                <FormItem className = 'formItem clean'{...formItemLayout} hasFeedback label="新联系方式">
                    {getFieldDecorator('2_newPhone', {
                      rules: [ {
                        pattern: new RegExp(/^1[3|5|7|8|]\d{9}$/) ,message: '手机格式不正确',
                      }],
                    })(
                      <Input  />
                    )}
                </FormItem>
              </div>
            </div>
            <div>
              <p>终端变更信息</p>
              <div className = 'row clean'>
                <UnabledItem label='原SIM卡号' value={this.props.detail.sim}/>
                <FormItem className = 'formItem clean'{...formItemLayout}  label="新SIM卡号">
                    {getFieldDecorator('3_newSim', {
                    
                    })(
                      <Input  />
                    )}
                </FormItem>
                <UnabledItem label='原车牌号' value={this.props.detail.oldVehicleId}/>
                <FormItem className = 'formItem clean'{...formItemLayout}  label="新车牌号">
                    {getFieldDecorator('3_newVehicleId', {
                      
                    })(
                      <Input  />
                    )}
                </FormItem>
              </div>
              <div className = 'row clean'>
                <UnabledItem label='原终端号' value={this.props.detail.manageNum}/>
                  { this.state.product.length > 0 && <FormItem className = 'formItem clean'{...formItemLayout} label='新生产厂家'>
                
                      <Select  style={{ width: 120 }} onChange={this.handleSelect.bind(this,3)}>
                        {
                          this.state.product.map((v,i)=>{
                            return <Option value={v} key={i}>{v}</Option>
                          })
                        }
                      </Select>
                  </FormItem>}
                <FormItem className = 'formItem clean'{...formItemLayout}  label="新终端号">
                    {getFieldDecorator('3_newManageNum', {
                   
                    })(
                      <Input  />
                    )}
                </FormItem>
              </div>
            </div>
            <div>
              <p>SIM卡变更信息</p>
              <div className = 'row clean'>
                <UnabledItem label='原SIM卡类型' value={this.props.detail.simTypeName}/>
                { this.state.simTypeName.length > 0 && <FormItem className = 'formItem clean'{...formItemLayout} label='新SIM卡类型'>
                    {getFieldDecorator('4_simTypeName', {
                      // initialValue:this.state.simTypeName[0]
                    })(
                      <Select  style={{ width: 120 }}>
                        {
                          this.state.simTypeName.map((v,i)=>{
                            return <Option value={v} key={i}>{v}</Option>

                          })
                        }
                      </Select>
                    )}
                  </FormItem>}
                <UnabledItem label='原SIM卡号' value={this.props.detail.sim}/>
                <FormItem className = 'formItem clean'{...formItemLayout}  label="新SIM卡号">
                    {getFieldDecorator('4_newSim', {
                 
                    })(
                      <Input  />
                    )}
                </FormItem>
              </div>
              <div className = 'row clean'>
                <UnabledItem label='车牌号' value={this.props.detail.vehicleId}/>
                <UnabledItem label='原终端号' value='123213'/>
                { this.state.product.length > 0 && <FormItem className = 'formItem clean'{...formItemLayout} label='新生产厂家'>
                 
                      <Select  style={{ width: 120 }}  onChange={this.handleSelect.bind(this,4)}>
                        {
                          this.state.product.map((v,i)=>{
                            return <Option value={v} key={i}>{v}</Option>
                          })
                        }
                      </Select>
                  </FormItem>}
                <FormItem className = 'formItem clean'{...formItemLayout}  label="新终端号">
                    {getFieldDecorator('4_newManageNum', {
                  
                    })(
                      <Input  />
                    )}
                </FormItem>
              </div>
            </div>
              <FormItem className = 'btns'>
                <Button type="primary"  htmlType="submit" >确认修改</Button>
                <Button onClick = {this.props.cancel}>取消</Button>
              </FormItem>
          </Form>
        </div>
      </div>
      </div>
    )
  }


}

const  ChgForm  = Form.create({
  mapPropsToFields(props) {
    return {
      detail: Form.createFormField({
        value: props.detail,
      })
      // getSearch: Form.createFormField({
      //   value: props.getSearch,
      // }),
    }
  },
})( TChgForm )

class TChange extends Component {
    constructor(props) {
      super(props)
      this.state = {
        loading:true,
        isChange:false,
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
      window.$Funs.$AJAX('getInformationChangeList/getCarList','get',data,(res)=>{
        let arr = res.data.map((v,i)=>{
          v.key = i;
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
      this.props.history.push('change?'+url)
  
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
      this.props.history.push('change?'+url)
    }
    // getSearch=(data)=>{
    //   if(data){
    //     this.setState({
    //       keyWord:data,
    //       currPage:1,
    //       loading:true,
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
    update = (item)=>{
      this.setState({
        isChange: true,
        detail:item
      })
    }
    cancel =()=>{
      this.setState({
        isChange:false
      })
    }
    render() {
      const columns = [
        { title: '公司车队', width: 150, dataIndex: 'teamName',key:'teamName',align: 'center' },
        { title: '车辆类型', width: 150, dataIndex: 'typeName',key:'typeName' ,align: 'center' },
        { title: '终端说明', dataIndex: 'deviceName',key:'deviceName', width: 150 ,align: 'center' },
        { title: '车牌号', dataIndex: 'vehicleId',key:'vehicleId',  width: 150 ,align: 'center' },
        { title: 'SIM卡类型', dataIndex: 'simTypeName',key:'simTypeName',  width: 150 ,align: 'center' },
        { title: 'SIM卡号', dataIndex: 'sim',key:'sim',  width: 150 ,align: 'center' },
        { title: '终端号', dataIndex: 'manageNum',key:'manageNum', width: 150 ,align: 'center' },
        { title: '操作', dataIndex: '',width: 150 , key: 'action', render: (item) => <Button type="primary" onClick = {()=>{this.update(item)}}>变更</Button> },
      ];
      
        return (
            <div className = 'change'>
              <Spin spinning = {this.state.loading} size='large'>
              {this.state.isChange ? <ChgForm detail = {this.state.detail} cancel = {this.cancel}/> :
                <div>
                  <SearchForm init={this.init} getSearch = {this.getSearch}   clearKeyWord = { this.clearKeyWord }/>
                  <Table columns={columns} dataSource={this.state.data}  pagination = {{ defaultPageSize:this.state.pageSize,total:this.state.total,onChange:this.pageChange,current:this.state.currPage }}/>
                </div>
              }
              </Spin>
            </div>
        )
    }
}

const Change = withRouter(TChange)

export default Change