import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Table , Input , Button , Form , Select,message,Modal} from 'antd';
const FormItem = Form.Item;
const Search = Input.Search;
const Option = Select.Option;
const { TextArea } = Input;
// import { renderRoutes } from 'react-router-config'

class TopForm extends Component {
    constructor(props) {
      super(props)
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
  
      return (
        <Form className = 'topForm clean'>
              <div className = 'fl'>
                <FormItem label = '车牌号码：' className = 'formItem'>
                  {getFieldDecorator('vehicleId')(
                    <Input />
                  )}
                </FormItem>
              </div>
              <div className = 'fl'>
                <FormItem label = '公司车队：' className = 'formItem'>
                  {getFieldDecorator('teamName')(
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
            values.newCarId = this.props.detail.newCarId;
            values.vehicleId = this.props.detail.vehicleId;
            values.oldVehicleId = this.props.detail.oldVehicleId;
            values.teamName = this.props.detail.teamName;
            values.inputMan = $Funs.cook.get('id');
            console.log(values)
            $Funs.$AJAX('stop','post',values,(res)=>{
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
              <FormItem label='旧车牌号' className = 'formItem clean'>
                <Input  value={this.props.detail.oldVehicleId } disabled className = 'disabled'/>
              </FormItem>
            </div>
            <div className = 'clean'>
                <FormItem label = '报停理由：' className = 'formItem fl clean'>
                {getFieldDecorator('stopReason', {
                    rules: [ {
                    required: true, message: '请输入报停理由',
                    }],
                })(
                    <TextArea rows={3} />
                )}
                </FormItem>
             
            </div>
          </Form>
          <div className = 'diaBtns fr'>
            <Button type="primary" onClick = {this.handleSubmit}>确认报停</Button>
            <Button onClick = { this.props.cancel}>取消</Button>
          </div>
        </div>
      )
      return(
        <div className = 'dialog'>
          <div className = 'mask'></div>
          <div className = 'main'>
            <p className = 'title'>车辆报停</p>
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
  
  


  export default class Stop extends Component {
    constructor(props) {
        super(props)
        this.state={
            showDiglog:false,
            currPage:1,
            pageSize:13,
            keyWord:{},//搜索关键字
            data:[],//table数据
            total:'',//总页数
        }
    }
    componentWillMount(){
        this.init({})
      }
      init=(data = {})=>{
        !data.currPage && (data.currPage = this.state.currPage);
        data.pageSize = this.state.pageSize;
        $Funs.$AJAX('getStop','get',data,(res)=>{
          let data = res.data.map((v,i)=>{
            v.stop == 0 ? v.stop = '否' :v.stop = '是';
            v.stopTime = $Funs.formatDate(v.stopTime);
            v.key = i;
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
      handleOk = (id)=>{
        console.log(id)
        $Funs.$AJAX(id+'/stopRestore','patch',{stopId:id},(res)=>{
            message.success('操作成功');
            this.init();
        })
      }
      edit = (item,i)=>{
          if(i == 0){//报停
              this.setState({
                showDiglog: true,
                detail:item
              })
          }else{//恢复报停
            Modal.confirm({
                title: '提示框',
                content: '确认对该车辆恢复报停',
                okText: '确认',
                onOk:this.handleOk.bind(this,item.stopId),
                cancelText: '取消',
              });
          }
      }
      cancel =()=>{
        this.setState({
          showDiglog:false
        })
      }
    render() {
        const columns = [
            { title: '公司车队', width: 100, dataIndex: 'teamName',key:'teamName',align: 'center' },
            { title: '车牌号', width: 100, dataIndex: 'vehicleId',key:'vehicleId' ,align: 'center' },
            { title: '曾使用车牌号', dataIndex: 'oldVehicleId', width: 150 , key:'oldVehicleId',align: 'center' },
            { title: '终端类型', dataIndex: 'terminalType',key:'terminalType', width: 150 ,align: 'center' },
            { title: '是否报停', dataIndex: 'stop',key:'stop', width: 100 ,align: 'center' },
            { title: '报停理由', dataIndex: 'stopReason',key:'stopReason', width: 250 ,align: 'center' },
            { title: '操作', dataIndex: '', key: 'action', width: 100 ,align: 'center' , render: (item) =>{if(item.stop == '否'){return (<Button type="primary" onClick = {()=>{this.edit(item,0)}}>报停</Button>)}else{return (<Button type="primary" onClick = {()=>{this.edit(item,1)}}>恢复</Button>)}} }
          ];
          
        return (
            <div className = 'stop'>
                <SearchForm init={this.init} getSearch = {this.getSearch} />
                <Table columns={columns} dataSource={this.state.data}  pagination = {{ defaultPageSize:13,total:this.state.total,onChange:this.pageChange,current:this.state.currPage }} scroll={{ y:400}} />
                {this.state.showDiglog && <MsgDetail detail = {this.state.detail} cancel = {this.cancel}/>}
            </div>
        )
    }
}
