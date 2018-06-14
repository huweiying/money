import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Table , Input , Button , Form ,Icon ,Spin,Select,Modal} from 'antd';
const FormItem = Form.Item;
const Search = Input.Search;
// import { renderRoutes } from 'react-router-config'

function Nav(props){
    return (
        <div className = 'nav clean'>
            <span className = {props.navIndex == 0 ? 'active' :''} onClick = {props.navChange.bind(this,0)}>安装记录</span>
            <span className = {props.navIndex == 1 ? 'active' :''} onClick = {props.navChange.bind(this,1)}>维修记录</span>
        </div>
    )
}

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
    this.props.history.push('recode?currPage=1&navIndex='+this.state.data.navIndex)
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
                <FormItem label = '工作人员：' className = 'formItem'>
                {getFieldDecorator('name',{
                  initialValue:this.state.data.name
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

class PicDetail extends Component{
  constructor(props) {
    super(props)
    this.state = {
      currPage:1,
      pageSize:4,
      total:this.props.detail.length,
      loading:true,
      show:false,
      path:''
    }
  }
  componentDidMount(){
    this.setState({
      loading:false
    })
  }
  open=(src)=>{
    this.setState({
      show:true,
      path:src
    })
  }
  close=()=>{
    this.setState({
      show:false,
      path:''
    });
  }
  next(isNext){
    if(isNext){//下一页
      totalPage = parseInt(this.state.total / this.state.pageSize);
      if(this.currPage + 1 > totalPage){
        return
      }else{
        this.setState({
          currPage: this.state.currPage + 1
        })
      }
    }else{
      if(this.currPage - 1 < 1){
        return
      }else{
        this.setState({
          currPage:this.state.currPage - 1
        })
      }
    }
  }
  render (){
      let data = this.props.detail.slice((this.state.currPage-1)*this.pageSize,this.state.currPage*this.pageSize)
      data = this.props.detail.map((v,i)=>{
        if(v){
          return(
            <div className = 'item fl' key={i}>
              <span>
                  <p>{v.pictureType}</p>
                  <img src={v.picturePath} onClick={this.open.bind(this,v.picturePath)}/>
                  <p>{v.pictureTime}</p>
                  <p>{v.pictureLocation}</p>
              </span>
            </div>
          )
        }
      })
    return (
      <div className = 'picDialog'>
      <div className = 'mask'></div>
          {this.state.show && <img onClick={this.close} src={this.state.path} className = 'preview'></img>}
          <div className="insetbox">
          <Spin spinning = {this.state.loading} tip="Loading..."></Spin>
              <div className = 'main'>
            
                <Icon type="close" style={{ fontSize: 18, color: '#08c' }} className='close' onClick = {this.props.cancel}/>
                {data }
                {
                this.props.detail.length > 4 && (
                  <div className = 'toggle'>
                    <Icon type="left" style={{ fontSize: 24, color: '#08c' }} onClick = {this.next.bind(this,true)}/>
                    <Icon type="right" style={{  fontSize: 24, color: '#08c' }} onClick = {this.next.bind(this,false)}/>
                  </div>
                )
              }
            
              </div>
            
            
            </div>
      </div>
    )
  }
}




class TRecode extends Component {
  constructor(props) {
    super(props)
    this.state = {
        loading:true,
        navIndex : 0,
        currPage:1,
        pageSize:10,
        keyWord:{},//搜索关键字
        data:[],//table数据
        total:'',//总页数
        detail:{},//录入项对象
        picDetail:false,//查看图片dialog
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
    let navIndex = this.state.navIndex;
    if(url){
      url.slice(1,).split('&').forEach((v,i)=>{
        let key = v.split('=')[0]
        let value = v.split('=')[1]
        if(key == 'navIndex'){
          navIndex = value
        }else{
          data[key] = value
        }
      })
    }
    !data.currPage && (data.currPage = this.state.currPage) 
    !data.pageSize && (data.pageSize = this.state.pageSize) 
    let navurl = navIndex == 1 ? 'getRepairRecord':'getInstallRecord' ;
    window.$Funs.$AJAX(navurl,'get',data,(res)=>{
      let arr = res.data.map((v,i)=>{
        v.key = i;
        v.pictureTime = window.$Funs.formatDate(v.pictureTime)
        return v
      })
      this.setState({
        data : arr,
        total: res.count,
        currPage:Number(data.currPage),
        navIndex:navIndex,
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
    let url = encodeURIComponent('currPage=1&pageSize='+this.state.pageSize+'&navIndex='+this.state.navIndex+str)
    this.props.history.push('recode?'+url)

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
    let url = encodeURIComponent('currPage='+ page + '&pageSize='+this.state.pageSize+'&navIndex='+this.state.navIndex+str)
    this.props.history.push('recode?'+url)
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
  showPic = (item)=>{
    item = item.map((v,i)=>{
      v.key = i;
      v.pictureTime = window.$Funs.formatDate(v.pictureTime)
      return v
    })
    this.setState({
      picDetail: true,
      detail:item
    },()=>{
    })
  }
  cancel =()=>{
    this.setState({
      picDetail:false
    })
  }
  navChange = (i)=>{//切换导航
    let url = encodeURIComponent('currPage=1&pageSize='+this.state.pageSize+'&navIndex='+i)
    this.props.history.push('recode?'+url)
    // this.setState({
    //   navIndex:i,
    //   currPage:1,
    //   keyWord:{}
    // },()=>{
    //   this.init()
    // })
  }
  render() {
    const columns = [
      { title: '车牌号码', width: 100, dataIndex: 'vehicleId',key:'vehicleId',align: 'center' },
      { title: '安装日期', width: 100, dataIndex: 'pictureTime',key:'pictureTime' ,align: 'center' },
      { title: '公司车队', dataIndex: 'teamName',key:'teamName', width: 150 ,align: 'center' },
      { title: '车辆类型', dataIndex: 'typeName',key:'typeName', width: 150 ,align: 'center' },
      { title: '维修照片', dataIndex: '', key: 'action', width: 100 ,align: 'center' , render: (item) =>{ if(item.repairInstallPictureList && item.repairInstallPictureList.length != 0) {return (<a onClick = {()=>{this.showPic(item.repairInstallPictureList)}}>查看</a>)} },  width: 150 ,align: 'center' },
      { title: '工作人员', dataIndex: 'name',key:'name', width: 150 ,align: 'center' },
    ];
    
    return (
      <div className = 'recode'>
        <Spin spinning = {this.state.loading} size='large'>
          <Nav navIndex =  {this.state.navIndex } navChange = {this.navChange}/>
            <div>
              <SearchForm init={this.init} getSearch = {this.getSearch}  clearKeyWord = { this.clearKeyWord }/>
              <Table  columns={columns} dataSource={this.state.data}  pagination = {{ defaultPageSize:this.state.pageSize,total:this.state.total,onChange:this.pageChange,current:this.state.currPage }}/>
              {this.state.picDetail && <PicDetail detail = {this.state.detail} cancel = {this.cancel}/>}
            </div>
          
        </Spin>
      </div>
    )
  }
}

const Recode = withRouter(TRecode)

export default Recode