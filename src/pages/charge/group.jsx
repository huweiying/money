import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Table , Input , Button , Upload, message,Icon} from 'antd';
const props = {
  name: 'file',
  action: '//jsonplaceholder.typicode.com/posts/',
  headers: {
    authorization: 'authorization-text',
  },
  onChange(info) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};
const columns = [
  { title: '车牌号码', width: 100, dataIndex: 'name',align: 'center' },
  { title: '车辆类型', width: 150, dataIndex: 'age' ,align: 'center' },
  { title: '公司车队', dataIndex: 'address', width: 150 ,align: 'center' },
  { title: '收费日期', dataIndex: 'address',  width: 150 ,align: 'center' },
  { title: '联系电话', dataIndex: 'address',  width: 150 ,align: 'center' },
  { title: '有效期至', dataIndex: 'address', width: 150 ,align: 'center' },
  { title: '安装日期', dataIndex: 'address', width: 150 ,align: 'center' },
  { title: '是否出厂安装', dataIndex: 'address', width: 150 ,align: 'center' },
  { title: '厂家编号', dataIndex: 'address', width: 150 ,align: 'center' },
  { title: '生产厂家', dataIndex: 'address', width: 150 ,align: 'center' },
];
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  getCheckboxProps: record => ({
    disabled: record.name === 'Disabled User', // Column configuration not to be checked
    name: record.name,
  }),
};
const data = [];
for (let i = 0; i < 11; i++) {
  data.push({
    key: i,
    name: `Edrward ${i}`,
    age: 32,
    address: `London Park no. ${i}`,
  });
}
export default class Group extends Component {
  constructor(props) {
    super(props);
    
  }
  
  render() {
    return (
      <div className='group'>
        <div className='clean'>
          <Upload {...props} className = 'fl'>
            <Button>
              <Icon type="upload" />上传文件
            </Button>
          </Upload>
          <Button type="primary" className='fr'>确认收费</Button>
        </div>
        <Table rowSelection={rowSelection} columns={columns} dataSource={data}  pagination = {{defaultPageSize:14}}/>
      </div>
    )
  }
}
