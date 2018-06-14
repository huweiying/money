import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import moment from 'moment';
import { Table , Input , Button , Form , Select,message, DatePicker,Spin} from 'antd';
const FormItem = Form.Item;
const Search = Input.Search;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
const { TextArea } = Input;
// import { renderRoutes } from 'react-router-config'

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
            if(arr[i] == 'date'){
              values[arr[i]] && (data.dateStart = new Date(values[arr[i]][0]._d).getTime());
              values[arr[i]] && (data.dateEnd = new Date(values[arr[i]][1]._d).getTime());
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
      this.props.history.push('log?page=1')
    }
    render(){
      const { getFieldDecorator, resetFields } = this.props.form;

      return (
        <Form className = 'topForm clean'>
              <div className = 'fl'>
                <FormItem label = '操作员：' className = 'formItem'>
                  {getFieldDecorator('inputMan',{
                    initialValue:this.state.data.inputMan
                  })(
                    <Input />
                  )}
                </FormItem>
              </div>
              <div className = 'fl'>
              <FormItem label = '有效日期：' className = 'formItem'>
                {getFieldDecorator('date', {
                  initialValue: (this.state.data.dateStart && this.state.data.dateEnd) ? [ moment( window.$Funs.formatDate(Number(this.state.data.dateStart)),'YYYY/MM/DD'), moment( window.$Funs.formatDate(Number(this.state.data.dateEnd)),'YYYY/MM/DD')] : ''
                })(
                  <RangePicker format="YYYY-MM-DD" placeholder={['开始时间', '结束时间']}/>
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

class TLog extends Component {
    constructor(props) {
        super(props)
        this.state={
            loading:true,
            showDiglog:false,
            page:1,
            size:13,
            keyWord:{},//搜索关键字
            data:[],//table数据
            total:'',//总页数
        }
    }
    componentWillMount(){
      this.init()
    }
    componentWillReceiveProps(nextProps){
      this.init(decodeURIComponent(nextProps.location.search))
      console.log(decodeURIComponent(nextProps.location.search))
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
        !data.page && (data.page = this.state.page) 
        !data.size && (data.size = this.state.size) 
        window.$Funs.$AJAX('log','get',data,(res)=>{
          let arr = res.data.map((v,i)=>{
            v.stop == 0 ? v.stop = '否' :v.stop = '是';
            v.stopTime = window.$Funs.formatDate(v.stopTime);
            v.key = i;
            return v
          })
          this.setState({
            data : arr,
            total: res.count,
            page:Number(data.page),
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
        let url = encodeURIComponent('page=1&size='+this.state.size+str)
        this.props.history.push('log?'+url)
    
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
        let url = encodeURIComponent('page='+ page + '&size='+this.state.size+str)
        this.props.history.push('log?'+url)
      }
      handleOk = (id)=>{
        window.$Funs.$AJAX(id+'/stopRestore','patch',{stopId:id},(res)=>{
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
            { title: '账号ID', width: 100, dataIndex: 'teamName',key:'teamName',align: 'center' },
            { title: '操作员', width: 100, dataIndex: 'vehicleId',key:'vehicleId' ,align: 'center' },
            { title: '操作内容', dataIndex: 'oldVehicleId', key:'oldVehicleId',align: 'center' },
            { title: '操作时间', dataIndex: 'terminalType',key:'terminalType', width: 150 ,align: 'center' },
          ];
          
        return (
            <div className = 'log'>
            <Spin spinning = {this.state.loading} size = 'large'>
                <SearchForm init={this.init} getSearch = {this.getSearch}  clearKeyWord = { this.clearKeyWord } />
                <Table columns={columns} dataSource={this.state.data}  pagination = {{ defaultsize:13,total:this.state.total,onChange:this.pageChange,current:this.state.page }} pagination = {{ defaultPageSize:this.state.pageSize,total:this.state.total,onChange:this.pageChange ,current:this.state.currPage}}/>
                {this.state.showDiglog && <MsgDetail detail = {this.state.detail} cancel = {this.cancel}/>}
            </Spin>
            </div>
        )
    }
}


const Log = withRouter(TLog)

export default Log
