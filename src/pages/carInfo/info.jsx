import React, { Component } from 'react'
import { Link,withRouter } from 'react-router-dom'
import { Table , Input , Button , Form , Select ,Spin,Modal} from 'antd';
const FormItem = Form.Item;
const Search = Input.Search;
const Option = Select.Option;
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
    // if(data){
    //   this.setState({
    //     keyWord:data,
    //     currPage:1,
    //     loading:true
    //   },()=>{
    //     this.init(data)
    //   })
    // }
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
    // this.setState({
    //   currPage:page,
    //   loading:true,
    // },()=>{
    //   let data = this.state.keyWord;
    //   data.currPage = page
    //   this.init(data)
    // })
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
      { title: '安装日期', width: 100, dataIndex: 'leaveFactoryDate', key: 'leaveFactoryDate',align: 'center' },
      { title: '公司车队', width: 100, dataIndex: 'teamName', key: 'teamName' ,align: 'center' },
      { title: '车辆类型', dataIndex: 'typeName', key: 'typeName', width: 100 ,align: 'center' },
      { title: '终端说明', dataIndex: 'deviceName', key: 'deviceName', width: 100 ,align: 'center' },
      { title: '车牌号', dataIndex: 'vehicleId', key: 'vehicleId', width: 100 ,align: 'center' },
      { title: 'SIM', dataIndex: 'simTypeName', key: 'simTypeName', width: 100 ,align: 'center' },
      { title: 'SIM卡号', dataIndex: 'sim', key: 'sim', width: 100 ,align: 'center' },
      { title: '证件详情', key: 'photoCodes', render: (item) => (item.photoCodes && item.photoCodes.length !=0) && <a onClick = {()=>{this.photoDetail(item)}}>点击查看</a> , width: 100 ,align: 'center' },
      { title: '终端号', dataIndex: 'manageNum', key: 'manageNum', width: 100 ,align: 'center' },
      { title: '是否报停', dataIndex: 'stop', key: 'stop' ,width: 100 ,align: 'center'  },
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

export default Info