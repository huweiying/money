import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Table , Input , Button , Upload, message,Icon ,Spin,Modal} from 'antd';
const confirm = Modal.confirm;

export default class Group extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading:false,
      currPage:1,
      pageSize:13,
      keyWord:{},//搜索关键字
      data:[],//table数据
      showData:[],//分页显示的数据
      total:'',//总页数 
    }
    
  }
  pageChange=(page)=>{
    let data = this.state.data;
    data.splice((page-1) * this.state.pageSize , page * this.state.pageSize -1);
    this.setState({
      showData:data
    })
  }
  confirm = (group)=>{//车辆收费
    if(group == []){
      message.error('请选择收费车辆');
      return
    }
    confirm({
      title: '提示',
      content: '确认提交补全信息？',
      okText:'确认',
      cancelText:'取消',
      onOk:()=> {
        this.setState({
          loading:true
        },()=>{
          $Funs.$AJAX('groupCharge','post',group,(res)=>{
            message.success('收费成功');
            this.setState({
              loading:false
            })
          })
        })
      },
      onCancel() {
      },
    });
    
  }

  render() {
    let group = [];
    const props = {
      name: 'file',
      action: $Funs.Basse_Port + 'groupChargeUpload',
      headers: {
        authorization: 'authorization-text',
      },
      onChange:(info)=> {
        if (info.file.status !== 'uploading') {
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} 上传成功`);
          let data = info.file.response.data;
          data = data.map((v,i)=>{
            v.deadlineDate = $Funs.formatDate(v.deadlineDate);
            v.key = i;
            return v
          }) 
          this.setState({
            data:data,
            total:info.file.response.total
          })
          data = data.splice( 0 , this.state.pageSize -1);
          this.setState({
            showData:data
          })
        } else if (info.file.status === 'error') {
          console.log(info.file.response.message)
          message.error(info.file.response.message);
        }
      },
    };
    const columns = [
      { title: '公司车队', dataIndex: 'teamName',key:'teamName', width: 150 ,align: 'center' },
      { title: '车牌号码', width: 100, dataIndex: 'vehicleId',key:'vehicleId',align: 'center' },
      { title: '付款金额', width: 100, dataIndex: 'moneyAmont',key:'moneyAmont' ,align: 'center' },
      { title: '付款方式', dataIndex: 'payType', key:'payType',  width: 100 ,align: 'center' },
      { title: '有效期至', dataIndex: 'deadlineDate',key:'deadlineDate', width: 100 ,align: 'center' },
      { title: '发票（或收据）号码', dataIndex: 'invoiceNum',key:'invoiceNum', width: 150 ,align: 'center' },
      { title: '收款人', dataIndex: 'inputManName',key:'inputManName', width: 100 ,align: 'center' },
    ];
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        let data = selectedRows.map((v,i)=>{
          v.deadlineDate = new Date(v.deadlineDate).getTime();
          delete v.key;
          return v
        })
        group = data;
      },
    };
    return (
      <div className='group'>
      <Spin spinning = {this.state.loading} size = 'large'>
        <div className='clean'>
          <Upload {...props} className = 'fl'>
            <Button>
              <Icon type="upload" />上传文件
            </Button>
          </Upload>
          <Button type="primary" className='fr' onClick={()=>{this.confirm(group)}}>确认收费</Button>
        </div>
        <Table rowSelection={rowSelection} expandedRowRender={record => <p style={{ margin: 0 }}>备注：{record.remark}</p>} columns={columns} dataSource={this.state.showData}  pagination = {{ defaultPageSize:13,total:this.state.data.length,onChange:this.pageChange,current:this.state.currPage }}/>
      </Spin>
      </div>
    )
  }
}
