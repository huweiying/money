import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Table , Input , Button , Form , Select } from 'antd';
const FormItem = Form.Item;
const Search = Input.Search;
const Option = Select.Option;
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
                {getFieldDecorator('carNum')(
                  <Input />
                )}
              </FormItem>
              <FormItem label = '终端说明：' className = 'formItem'>
                {getFieldDecorator('deviceName')(
                  <Input />
                )}
              </FormItem>
            </div>
            <div className = 'fl'>
              <FormItem label = '公司：' className = 'formItem'>
                {getFieldDecorator('carCompany')(
                  <Input />
                )}
              </FormItem>
              <FormItem label = '车辆类型：' className = 'formItem'>
                {getFieldDecorator('carType', {
                })(
                  <Select  style={{ width: 230 }} onChange={this.handleSelect}>
                    <Option value="重型卸货汽车">重型卸货汽车</Option>
                  </Select>
                )}
              </FormItem>
            </div>
            <div className = 'fl'>
              <FormItem label = '报停状态：' className = 'formItem'>
                {getFieldDecorator('stop', {
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
    }
  },
})(TopForm)

function Picshow(props){
  return (
    <div className = 'dialog'>
      <div className = 'mask'></div>
      <div className = 'main'>
        {props.picArr[0] && 
          <div className = 'first'>
            <img src={props.picArr[0].photoCode} />
          </div>
        }
        {props.picArr[1] && 
          <div className = 'first'>
            <img src={props.picArr[1].photoCode} />
          </div>
        }
        {props.picArr[2] && 
          <div className = 'first'>
            <img src={props.picArr[2].photoCode} />
          </div>
        }
        
      </div>
    </div>)
}
export default class Info extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currPage:1,
      pageSize:13,
      keyWord:{},//搜索关键字
      data:[],//table数据
      total:'',//总页数
      showDialog:false,//图片显示模态框
      picArr:[]//显示的图片路径
    }
  }
  componentWillMount(){
    this.init({})
  }
  init=(data)=>{
    !data.currPage && (data.currPage = this.state.currPage);
    data.pageSize = this.state.pageSize;
    $Funs.$AJAX('newCars','get',data,(res)=>{
      let data = res.data.map((v,i)=>{
        v.carDto.key = i;
        v.carDto.leaveFactoryDate = v.carDto.leaveFactoryDate.split(' ')[0];
        v.stop == 0 ? v.carDto.stop = '否' : v.carDto.stop = '是' 
        v.carDto.photoCodes = v.photoCodes; 
        return v.carDto
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
        keyWord:data
      })
    }
  }
  pageChange = (page)=>{
    this.setState({
      currPage:page
    },()=>{
      this.init({})
    })
  }
 
  photoDetail = (item)=>{
    this.setState({
      showDialog:true,
      picArr:item.photoCodes
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
      { title: '证件详情', key: 'photoCodes', render: (item) => item.photoCodes && <a onClick = {()=>{this.photoDetail(item)}}>点击查看</a> , width: 100 ,align: 'center' },
      { title: '终端号', dataIndex: 'manageNum', key: 'manageNum', width: 100 ,align: 'center' },
      { title: '是否报停', dataIndex: 'stop', key: 'stop' ,width: 100 ,align: 'center'  },
    ];
    return (
      <div className = 'info'>
        <SearchForm init={this.init} getSearch = {this.getSearch} />
        <Table  expandedRowRender={record => <p style={{ margin: 0 }}>备注：{record.comment}</p>} columns={columns} dataSource={this.state.data}  pagination = {{ defaultPageSize:13,total:this.state.total,onChange:this.pageChange }}/>
        {this.state.showDialog && <Picshow picArr={this.state.picArr}/>}
      </div>
    )
  }
}
