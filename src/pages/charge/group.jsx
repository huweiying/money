import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Table , Input , Button , Upload, message,Icon ,Spin,Modal} from 'antd';
import { Z_DEFAULT_STRATEGY } from 'zlib';
const confirm = Modal.confirm;

class TGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading:false,
      // currPage:1,
      // pageSize:1,
      keyWord:{},//搜索关键字
      data:[],//table数据
      showData:[],//分页显示的数据
      total:'',//总页数 
      selectedRowKeys:[],
      selectedRows:[]
    }
    
  }
  pageChange=(page)=>{
    let data = this.state.data;
    data.splice((page-1) * this.state.pageSize , page * this.state.pageSize -1);
    this.setState({
      showData:data
    })
  }
  confirm = ()=>{//车辆收费\
    if(this.state.selectedRows.length == 0){
      message.error('请选择收费车辆');
      return
    }
      let group = this.state.selectedRows.map((v,i)=>{
        v.deadlineDate = new Date(v.deadlineDate).getTime();
        delete v.key;
        return v
      })
    confirm({
      title: '提示',
      content: '确认提交收费信息？',
      okText:'确认',
      cancelText:'取消',
      onOk:()=> {
        this.setState({
          loading:true
        },()=>{
          window.$Funs.$AJAX('groupCharge','post',group,(res)=>{
            message.success('收费成功');
            this.setState({
              loading:false,
              selectedRowKeys:[],
              selectedRows:[]
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
    const {selectedRowKeys} = this.state;
    const props = {
      name: 'file',
      action: window.$Funs.Basse_Port + 'groupChargeUpload',
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
            v.deadlineDate = window.$Funs.formatDate(v.deadlineDate);
            v.key = i;
            return v
          }) 
          this.setState({
            data:data,
            total:info.file.response.total
          })
          // data = data.splice( 0 , this.state.pageSize -1);
          this.setState({
            showData:data
          })
        } else if (info.file.status === 'error') {
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
      selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        // let data = selectedRows.map((v,i)=>{
        //   v.deadlineDate = new Date(v.deadlineDate).getTime();
        //   delete v.key;
        //   return v
        // })
        // console.log(selectedRows)
        // group = selectedRows;
        this.setState({
          selectedRowKeys,
          selectedRows
        })
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
          <a href= {require('../../assets/img/group.xls')} download='模板.xls' className = 'download'>下载模板</a>
          <Button type="primary" className='fr' onClick={()=>{this.confirm()}}>确认收费</Button>
        </div>
        <Table rowSelection={rowSelection} expandedRowRender={record => <p style={{ margin: 0 }}>备注：{record.remark}</p>} columns={columns} dataSource={this.state.showData} scroll={{y:500}} pagination = {false}/>
      </Spin>
      </div>
    )
  }
}
const Group = withRouter(TGroup)

export default Group