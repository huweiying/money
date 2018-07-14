import React, { Component } from 'react'
import { Link,withRouter } from 'react-router-dom'
import moment from 'moment';
import { Table , Input , Button , Form , Select ,Spin,Modal ,DatePicker,message} from 'antd';
import Avatar from '../../component/upload';
const FormItem = Form.Item;
const Search = Input.Search;
const Option = Select.Option;
const confirm = Modal.confirm;
// import { renderRoutes } from 'react-router-config'

class TopForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data:{}
    }
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
  handleSearch =()=>{
    this.props.form.validateFields((err, values) => {
        let arr = Object.keys(values);
        let data = {}
        for(let i = 0;i<arr.length;i++){
          (values[arr[i]]) && (data[arr[i]] = values[arr[i]])
        }
        typeof(data.carType) == 'object' && (data.carType = this.props.carType[0])
          //默认查找第一页开始
          this.props.getSearch(data);
          // data.currPage = 1;
          // this.props.init(data)
    });
  }
 
  clear = ()=>{
    this.props.form.resetFields();
    this.props.clearKeyWord();
    this.props.history.push('info?currPage=1')
  }
  render(){
    const { getFieldDecorator, resetFields } = this.props.form;
    
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
              <FormItem label = '终端说明：' className = 'formItem'>
                {getFieldDecorator('deviceName',{
                  initialValue:this.state.data.deviceName
                })(
                  <Input />
                )}
              </FormItem>
            </div>
            <div className = 'fl'>
              <FormItem label = '公司名称：' className = 'formItem'>
                {getFieldDecorator('carCompany',{
                  initialValue:this.state.data.carCompany
                })(
                  <Input />
                )}
              </FormItem>
              <FormItem label = '车辆类型：' className = 'formItem'>
                {getFieldDecorator('carType', {
                  initialValue:this.state.data.carType
                })(
                  <Select style={{ width: 230 }}>
                    { 
                      this.props.carType.map((v,i)=>{
                        return <Option value={v} key={i}>{v}</Option>
                      })
                    }
                  </Select>
                )}
              </FormItem>
            </div>
            <div className = 'fl'>
              <FormItem label = '报停状态：' className = 'formItem'>
                {getFieldDecorator('stop', {
                  initialValue:this.state.data.stop
                })(
                  <Select  style={{ width: 230 }} onChange={this.handleSelect}>
                    <Option value="0">否</Option>
                    <Option value="1">是</Option>
                  </Select>
                )}
              </FormItem>
            </div>
            <div className = 'fl'>
              <a className = 'empty' onClick = {this.clear} >清空</a>
            </div>
            <div className = 'fl'>
              <Button type="primary" onClick={this.handleSearch}>查找</Button>
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
      clearKeyWord: Form.createFormField({
        value: props.clearKeyWord,
      }),
      history: Form.createFormField({
        value: props.history,
      }),
    }
  },
})(TopForm)


class Picshow extends Component {
  constructor(props) {
    super(props)
    this.state = {
      show:false,
      path:'',
    }
  }
  open = (src)=>{
    this.setState({
      show:true,
      path:src
    })
    // console.log(this.props.picArr[0].photoCode)
  }
  close = ()=>{
    this.setState({
      show:false,
      path:''
    })
  }
  render (){
    return(
      <div className = 'dialog'>
      <div className = 'mask' onClick = {()=>{this.props.cancel()}}></div>
      {this.state.show && <img onClick={this.close} src={this.state.path} className = 'preview'></img>}
      <div className = 'main'>
        {this.props.picArr[0] && 
          <div className = 'first fl'>
              <span>
                <p>{this.props.picArr[0].type == 0 ?  '车辆登记证书' : (this.props.picArr[0].type == 1 ? '行驶证' : '车身照片')}</p>
                <img src={this.props.picArr[0].photoCode} onClick={this.open.bind(this,this.props.picArr[0].photoCode)} />
              </span>
        
          </div>
        }
        {this.props.picArr[1] && 
          <div className = 'first fl' >
            <span>
               <p>{this.props.picArr[1].type == 0 ? '车辆登记证书' :(this.props.picArr[1].type == 1 ? '行驶证' : '车身照片')}</p>
              <img src={this.props.picArr[1].photoCode} onClick={this.open.bind(this,this.props.picArr[1].photoCode)} />
            </span>
           
          </div>
        }
        {this.props.picArr[2] && 
          <div className = 'first fl' >
            <span>
              <p>{this.props.picArr[2].type == 0 ? '车辆登记证书' :(this.props.picArr[2].type == 1 ? '行驶证' : '车身照片')}</p>
              <img src={this.props.picArr[2].photoCode} onClick={this.open.bind(this,this.props.picArr[2].photoCode)} />
            </span>
           
          </div>
        }
        {this.props.picArr[3] && 
          <div className = 'first fl' >
            <span>
              <p>{this.props.picArr[3].type == 0 ? '车辆登记证书' :(this.props.picArr[3].type == 1 ? '行驶证' : '车身照片')}</p>
              <img src={this.props.picArr[3].photoCode} onClick={this.open.bind(this,this.props.picArr[3].photoCode)} />
            </span>
           
          </div>
        }
        
      </div>
    </div>
    )
  }
}
class AddNew extends Component {
  constructor(props) {
    super(props)
    this.state = {
     photoCodes:[],
     product:[],//生产厂家
     zdType:[],
     subitem:{},//终端厂家
     loading:true,
     editItem:{}//修改后的内容
    }
  }
 
 componentWillMount(){
   window.$Funs.$AJAX('ziDian','get',{type:1},(res)=>{//生产厂家
     window.$Funs.$AJAX('newCar/getTerminal','get',{producerName:res[0]},(data)=>{//z终端生产厂家
       this.setState({
         product:res,
         subitem:data,
         editItem:this.props.newItem,
         photoCodes:this.props.newItem.photoCodes,
         loading:false
       })
      })
   })
 }
 handleSelect=(v)=>{//选择厂家
   window.$Funs.$AJAX('newCar/getTerminal','get',{producerName:v},(res)=>{//生产厂家
     this.setState({
       subitem:res
     })
    })
 }
 handleSubmit=(e)=>{
   e.preventDefault();
   this.props.form.validateFields((err, values) => {
     if (!err) {
       confirm({
         title: '提示',
         content: '确认修改车辆信息？',
         okText:'确认',
         cancelText:'取消',
         onOk:()=> {
           values.carId = this.props.item.id;
           values.photoCodes = this.state.photoCodes.map(v=>{
             v.photoCode = v.photoCode.replace('https://hailiangcaiwu.oss-cn-hangzhou.aliyuncs.com/','');
             (v.photoCode.indexOf('?') != -1) && (v.photoCode = v.photoCode.slice(0,v.photoCode.indexOf('?'))) 
             return v
           });
           values.callDate && (values.callDate = new Date(values.callDate._d).getTime())
           window.$Funs.$AJAX('car/newCar/'+this.props.item.id,'patch',values,(res)=>{
             message.success('操作成功');
             this.props.close()
           })
         },
         onCancel() {
         },
       });
     }
   });

 }
 getPic = (i,obj,type)=>{
   let arr = this.state.photoCodes;
   if(obj){
     arr[i] = obj
    }
   this.setState({
     photoCodes:arr
   })
 }
 render() {
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
  let editItem = this.state.editItem;
  let regPto = this.state.photoCodes.filter(v=>{//车辆登记证书
    return v.type == 0
  });
  let drivePto = this.state.photoCodes.find(v=>{//行驶证
    return v.type == 1
  })
  let carPto = this.state.photoCodes.find(v=>{
    return v.type == 2
  })
   return (
     <div className='addNew'>
       <Spin size="large" spinning={this.state.loading}/>
       <div>
         <h2>修改车辆证明信息</h2>
         <div className = "addForm">
           <Form layout="inline" onSubmit={this.handleSubmit} className='clean'>
             <div className = 'row clean'>
               <FormItem label='车牌号' className = 'formItem clean'>
                 <Input  value={this.props.item.vehicleId} disabled className = 'disabled'/>
               </FormItem>
               <FormItem label='公司车队' className = 'formItem clean'>
                 <Input  value={this.props.item.teamName} disabled className = 'disabled'/>
               </FormItem>
               <FormItem className = 'formItem clean'{...formItemLayout} label="车牌颜色">
                   {getFieldDecorator('carColor', {
                     initialValue:editItem.carColor
                   })(
                     <Select  style={{ width: 120 }} >
                       <Option value="黄色">黄色</Option>
                       <Option value="蓝色">蓝色</Option>
                       <Option value="黑色">黑色</Option>
                       <Option value="白色">白色</Option>
                     </Select>
                   )}
               </FormItem>

               <FormItem  label='车辆类型' className = 'formItem clean'>
                 <Input value={this.props.item.typeName} disabled className = 'disabled'/>
               </FormItem>

             </div>
             <div className = "row clean">
                 <FormItem className = 'formItem clean'{...formItemLayout} hasFeedback label="联系电话">
                   {getFieldDecorator('phone', {
                    initialValue:editItem.phone,
                     rules: [ {
                       required: true, message: '请输入联系电话',
                       pattern: new RegExp(/^1[3|5|7|8|]\d{9}$/) ,message: '手机格式不正确',
                     }],
                   })(
                     <Input  />
                   )}
                 </FormItem>
                 <FormItem className = 'formItem clean'{...formItemLayout} hasFeedback label="所属地区">
                   {getFieldDecorator('address', {
                    initialValue:editItem.address,
                     rules: [ {
                       required: true, message: '请输入所属地区',
                     }],
                   })(
                     <Input  />
                   )}
                 </FormItem>
                 <FormItem  label='安装时间' className = 'formItem clean'>
                   <span className = 'tag'>此为出厂安装</span>
                   <Input value={this.props.item.leaveFactoryDate} disabled className = 'disabled'/>
                 </FormItem>
                 
                 <FormItem className = 'formItem clean'{...formItemLayout} label='导航类型'>
                   {getFieldDecorator('navigationType', {
                     initialValue:editItem.navigationType
                   })(
                     <Select  style={{ width: 120 }} onChange={this.handleSelect}>
                       <Option value="北斗/GPS双模">北斗/GPS双模</Option>
                       <Option value="GPS">GPS</Option>
                     </Select>
                   )}
                 </FormItem>
               </div>

               <div className = "row clean">
                 <FormItem className = 'formItem clean' label='终端说明'>
                   <Input  value={this.props.item.deviceName} disabled className = 'disabled'/>
                 </FormItem>

                 <FormItem  className = 'formItem clean' label='SIM卡号'>
                   <Input  value={this.props.item.sim} disabled className = 'disabled'/>
                 </FormItem>
                 {this.state.product.length > 0 &&
                 <FormItem className = 'formItem clean'{...formItemLayout} label="生产厂家">
                   {getFieldDecorator('manufacturer', {
                     initialValue:editItem.manufacturer
                   })(
                     <Select  style={{ width: 120 }} onChange={this.handleSelect}>
                       { this.state.product.map((v,i)=>{
                         return <Option value={v} key={i}>{v}</Option>
                       })}
                     </Select>
                   )}
                 </FormItem>
                 }
                 <FormItem className = 'formItem clean'{...formItemLayout} label="终端类型号">
                   {getFieldDecorator('terminalTypeNum', {
                     initialValue:this.state.subitem.termTypeID
                   })(
                     <Input  disabled />
                   )}
                 </FormItem>
               </div>
               <div className = "row clean">
                   {
                     this.state.subitem.producerID && (
                       <FormItem className = 'formItem clean'{...formItemLayout}  label="厂家编号">
                         {getFieldDecorator('factoryNumber', {
                           initialValue:this.state.subitem.producerID
                         })(
                           <Input  disabled />
                         )}
                       </FormItem>
                     )
                   }
                   {
                     this.state.subitem.termType && (
                       <FormItem className = 'formItem clean'{...formItemLayout}  label="终端类型">
                         {getFieldDecorator('terminalType', {
                           initialValue:this.state.subitem.termType
                         })(
                           <Input  disabled />
                         )}
                       </FormItem>
                     )
                   }
                   {
                     this.state.subitem.termPici && (
                       <FormItem className = 'formItem clean'{...formItemLayout} label="终端批次">
                         {getFieldDecorator('terminalOrder', {
                           initialValue:this.state.subitem.termPici
                         })(
                           <Input  disabled  />
                         )}
                       </FormItem>
                     )
                   }
                 
                 <FormItem  className = 'formItem clean' label='终端号'>
                   <Input  value={this.props.item.manageNum} disabled className = 'disabled'/>
                 </FormItem>
               </div>
               <div className = "row clean">
                 <FormItem className = 'formItem clean'{...formItemLayout} label='系统平台'>
                   {getFieldDecorator('systemPlatform', {
                     initialValue:editItem.systemPlatform
                   })(
                     <Select  style={{ width: 120 }} onChange={this.handleSelect}>
                       <Option value="马良车辆监控导航系统">马良车辆监控导航系统</Option>
                     </Select>
                   )}
                 </FormItem>

                 <FormItem className = 'formItem clean'{...formItemLayout}  label="平台编号">
                   {getFieldDecorator('systemPlatformNumber', {
                     initialValue:'50627'
                   })(
                     <Input disabled />
                   )}
                 </FormItem>

                 <FormItem className = 'formItem clean'{...formItemLayout} label="平台批次">
                   <span className = 'tag'>资料齐全</span>
                   {getFieldDecorator('systemPlatformOrder', {
                     initialValue:'6'
                   })(
                     <Input disabled />
                   )}
                 </FormItem>
               </div>
               <div className = "row clean">
                 <FormItem label = '车辆登记证书' className = 'formItem clean'>
                   <Avatar type = '0' getPic={this.getPic.bind(this,0)} imgUrl= {regPto.length>0 ? regPto[0].photoCode : null}/>
                 </FormItem>
                 <FormItem label = '车辆登记证书' className = 'formItem clean'>
                   <Avatar type = '0' getPic={this.getPic.bind(this,1)} imgUrl= {regPto.length>1 ? regPto[1].photoCode : null}/>
                 </FormItem>
                 <FormItem label = '行驶证' className = 'formItem clean'>
                   <Avatar type = '1' getPic={this.getPic.bind(this,2)} imgUrl= {drivePto ? drivePto.photoCode : null}/>
                 </FormItem>
                 <FormItem label = '车身照片' className = 'formItem clean'>
                   <Avatar type = '2' getPic={this.getPic.bind(this,3)} imgUrl= {carPto ? carPto.photoCode : null}/>
                 </FormItem>
               </div>
               <div className = "row clean">
                 <p className = "note">备注（选填）</p>
                 <FormItem className = 'formItem clean'{...formItemLayout} label="来电人">
                   {getFieldDecorator('callAPerson', {
                    initialValue:editItem.callAPerson
                   })(
                     <Input  />
                   )}
                 </FormItem>
                 <FormItem className = 'formItem clean'{...formItemLayout} label="来电时间">
                   {getFieldDecorator('callDate', {
                     initialValue: (editItem.callDate) ? moment(new Date(editItem.callDate),'YYYY-MM-DD') : null
                   })(
                     <DatePicker placeholder='选择时间' />
                   )}
                 </FormItem>
                 <FormItem className = 'formItem clean'{...formItemLayout} label="记录人">
                   {getFieldDecorator('recordPerson', {
                    initialValue:editItem.recordPerson
                   })(
                     <Input  />
                   )}
                 </FormItem>
               </div>
               <div className ="row clean">
                 <FormItem  className = 'formItem clean' label='备注'>
                   <Input  value={this.props.item.comment} disabled className = 'disabled comment'/>
                 </FormItem>
               </div>
               <FormItem className = 'btns'>
                 <Button  type="primary"  htmlType="submit">确认修改</Button>
                 <Button onClick = {this.props.close}>取消</Button>
               </FormItem>
           </Form>
         </div>
       </div>
       <Spin />
     </div>
   )
 }
}

const AddForm = Form.create()(AddNew)

class TInfo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading:true,
      currPage:1,
      pageSize:10,
      keyWord:{},//搜索关键字
      data:[],//table数据
      total:0,//总页数
      showDialog:false,//图片显示模态框
      picArr:[],//显示的图片路径
      carType:[],
    }
  }
  componentWillMount(){
    window.$Funs.$AJAX('ziDian','get',{type:2},(res)=>{
      this.setState({
        carType:res
      },()=>{
        this.init()
      })
    })
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
    window.$Funs.$AJAX('newCars','get',data,(res)=>{
      let arr = res.data.map((v,i)=>{
        v.carDto._id = v.id;
        v.carDto.key = i;
        v.carDto.leaveFactoryDate = v.carDto.leaveFactoryDate.split(' ')[0];
        v.stop == 0 ? v.carDto.stop = '否' : v.carDto.stop = '是' 
        v.carDto.photoCodes = v.photoCodes; 
        return v.carDto
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
    this.props.history.push('info?'+url)

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
    this.props.history.push('info?'+url)

  }
  photoDetail = (item)=>{
    this.setState({
      showDialog:true,
      picArr:item.photoCodes
    })
  }
  cancel = ()=>{
    this.setState({
      showDialog:false,
      currPage:1
    })
  }

  render() {
    const columns = [
      { title: '安装日期', width: 150, dataIndex: 'leaveFactoryDate', key: 'leaveFactoryDate',align: 'center' },
      { title: '公司车队', width: 250, dataIndex: 'teamName', key: 'teamName' ,align: 'center' },
      { title: '车辆类型', dataIndex: 'typeName', key: 'typeName', width: 200 ,align: 'center' },
      { title: '终端说明', dataIndex: 'deviceName', key: 'deviceName', width: 150 ,align: 'center' },
      { title: '车牌号', dataIndex: 'vehicleId', key: 'vehicleId', width: 100 ,align: 'center' },
      { title: 'SIM', dataIndex: 'simTypeName', key: 'simTypeName', width: 200 ,align: 'center' },
      { title: 'SIM卡号', dataIndex: 'sim', key: 'sim', width: 110 ,align: 'center' },
      { title: '证件详情', key: 'photoCodes', render: (item) => (item.photoCodes && item.photoCodes.length !=0) && <a onClick = {()=>{this.photoDetail(item)}}>点击查看</a> , width: 100 ,align: 'center' },
      { title: '终端号', dataIndex: 'manageNum', key: 'manageNum', width: 150 ,align: 'center' },
      { title: '是否报停', dataIndex: 'stop', key: 'stop' ,width: 100 ,align: 'center'  },
      { title: '操作', dataIndex: '', key: 'action',align: 'center', render: (item) =>  <Button type = 'primary' onClick = {()=>{this.props.editCar(item)}}>修改</Button> ,width: 150 ,align: 'center'},
    ];
    return (
      <div className = 'info'>
        <Spin spinning = {this.state.loading} size='large'>
            {this.state.carType.length > 0 && <SearchForm init={this.init} getSearch = {this.getSearch} carType = {this.state.carType} history = {this.props.history} clearKeyWord = { this.clearKeyWord }/>}
            <Table  expandedRowRender={record => <p style={{ margin: 0 }}>备注：{record.comment}</p>} columns={columns} dataSource={this.state.data}  pagination = {{ defaultPageSize:this.state.pageSize,total:this.state.total,onChange:this.pageChange,current:this.state.currPage }}/>
            {this.state.showDialog && <Picshow picArr={this.state.picArr} cancel = {this.cancel}/>}
        </Spin>
      </div>
    )
  }
}

const Info = withRouter(TInfo)


class Total extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isEdit:false,
      item:{},
      newItem:{},
    }
  }
  editCar = (item)=>{
    let id = item._id;
    window.$Funs.$AJAX('newCar/'+id,'get',{},(res)=>{
      this.setState({
        isEdit:true,
        item:res.carDto,
        newItem:res.newCarDto
      })

    })
  }
  close = ()=>{
    this.setState({
      isEdit:false,
    })

  }
  render() {
    return (
      <div className = 'entry'>
        {this.state.isEdit ? <AddForm  close = {this.close} item = {this.state.item} newItem = {this.state.newItem}></AddForm> : <Info editCar = {this.editCar}></Info>}
      </div>
    )
  }
}


export default Total