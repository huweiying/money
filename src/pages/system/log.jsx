import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Table , Input , Button , Form , Select,message, DatePicker} from 'antd';
const FormItem = Form.Item;
const Search = Input.Search;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
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
      const rangeConfig = {
        rules: [{ type: 'array',  message: '请选择时间!' }],
      };
      return (
        <Form className = 'topForm clean'>
              <div className = 'fl'>
                <FormItem label = '操作员：' className = 'formItem'>
                  {getFieldDecorator('vehicleId')(
                    <Input />
                  )}
                </FormItem>
              </div>
              <div className = 'fl'>
              <FormItem label = '有效日期：' className = 'formItem'>
                {getFieldDecorator('deadlineDate', rangeConfig)(
                  <RangePicker format="YYYY-MM-DD"/>
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



  export default class Log extends Component {
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
        !data.currPage && (data.page = this.state.currPage);
        data.size = this.state.pageSize;
        $Funs.$AJAX('log','get',data,(res)=>{
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
            { title: '账号ID', width: 100, dataIndex: 'teamName',key:'teamName',align: 'center' },
            { title: '操作员', width: 100, dataIndex: 'vehicleId',key:'vehicleId' ,align: 'center' },
            { title: '操作内容', dataIndex: 'oldVehicleId', key:'oldVehicleId',align: 'center' },
            { title: '操作时间', dataIndex: 'terminalType',key:'terminalType', width: 150 ,align: 'center' },
          ];
          
        return (
            <div className = 'log'>
                <SearchForm init={this.init} getSearch = {this.getSearch} />
                <Table columns={columns} dataSource={this.state.data}  pagination = {{ defaultPageSize:13,total:this.state.total,onChange:this.pageChange,current:this.state.currPage }} scroll={{ y:400}} />
                {this.state.showDiglog && <MsgDetail detail = {this.state.detail} cancel = {this.cancel}/>}
            </div>
        )
    }
}
