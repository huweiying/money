import React, { Component } from "react";
import { Base64 } from 'js-base64';
import { renderRoutes } from "react-router-config";
import {
  Input,
  Button,
  Menu,
  Icon,
  Table,
  Form,
  Select,
  DatePicker,
  message,
  Modal,
  Spin,
  Divider
} from "antd";
const Search = Input.Search;
const { SubMenu } = Menu;
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;

class Sider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openKeys: ["0"]
    };
  }

  // componentWillMount(){
  //   console.log(this.props.detail.nav)
  //   let department = this.props.detail.nav.map((v)=>{
  //     v.departmentName
  //     return {'department' : v.departmentName,'id':v.id}
  //   })
  //   let obj = {};
  //   department.forEach(v=>{
  //     obj[v]=
  //   })
  // }
  onOpenChange = openKeys => {};
  render() {
    let navModel = this.props.nav.map((v, i) => {
      if (v.groupListDtoList.length == 0) {
        return (
          <Menu.Item key={i} onClick={this.props.getIndex.bind(this, i)}>
            {v.departmentName}
          </Menu.Item>
        );
      } else {
        let sub = v.groupListDtoList.map((subv, subi) => {
          return <Menu.Item onClick={this.props.getIndex.bind(this, i + "-" + subi)} key={i + "-" + subi} >{subv.groupName}</Menu.Item>;
        });
        return (
          <SubMenu key={i} title={<span>{v.departmentName}</span>}>
            {sub}
          </SubMenu>
        );
      }
    });
    return (
      <Menu
        mode="inline"
        defaultOpenKeys={["0"]}
        defaultSelectedKeys={["0"]}
        onOpenChange={this.onOpenChange}
        style={{ width: 256 }}
      >
        {navModel}
      </Menu>
    );
  }
}

class TMsgDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      group: [],
      departmentid: this.props.detail.department
    };
  }

  handleSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.id = this.props.detail.id;
        values.department = this.state.departmentid;
        if (this.state.group.length == 0) {
          //如果没有二级部门 就为空 妈卖批
          values.group = "";
        }
        if (this.props.isEdit) {
          //修改人员
          Modal.confirm({
            title: "确认修改该人员信息吗？",
            okText: "确认",
            cancelText: "取消",
            onOk() {
              $Funs.$AJAX("user", "patch", values, e => {
                message.success('修改成功！');
                setTimeout(e => {
                  location.reload();
                }, 400);
              });
            }
          });
        } else {
          values.inputMan = $Funs.cook.get("id");
          $Funs.$AJAX("user", "post", values, e => {
            message.success('添加成功！');
            setTimeout(e => {
              location.reload();
            }, 400);
          });
        }
        // $Funs.$AJAX('charge','post',values,(res)=>{
        //   message.success('操作成功');
        //   this.props.cancel()
        // })
      }
    });
  };
  handleDepartmentChange = (item, values, e) => {
    //一级
    let Arr = this.props.nav;
    if (item == 0) {
      //一级
      let index = Arr.findIndex((v, i) => {
        return v.id == values;
      });
      this.setState({
        departmentid: values,
        group: this.props.nav[index].groupListDtoList
      });
    } else {
    }
    // let Arr=this.props.nav;
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };
    const department = this.props.nav.map((v, i) => (
      <Option key={i} value={v.id}>
        {v.departmentName}
      </Option>
    ));
    const group =
      this.state.group.length > 0 &&
      this.state.group.map((v, i) => (
        <Option key={i} value={v.id}>
          {v.groupName}
        </Option>
      ));
    let msgform = (
      <div className="detail">
        <Form layout="inline" className="clean">
          <div className="clean">
            <FormItem
              className="formItem clean"
              {...formItemLayout}
              label="职业等级"
            >
              {getFieldDecorator("jurisdiction", {
                initialValue: this.props.detail.jurisdiction
                  ? String(this.props.detail.jurisdiction)
                  : "0"
              })(
                <Select style={{ width: 200 }} onChange={this.handleSelect}>
                  <Option value="0">LV1</Option>
                  <Option value="1">LV2</Option>
                  <Option value="2">LV3</Option>
                  <Option value="3">LV4</Option>
                </Select>
              )}
            </FormItem>
            <FormItem
              className="formItem clean"
              {...formItemLayout}
              label="员工姓名"
            >
              {getFieldDecorator("name", {
                rules: [
                  {
                    required: true,
                    message: "请输入员工姓名"
                  }
                ],
                initialValue: this.props.detail.name
              })(<Input />)}
            </FormItem>
          </div>
          <div className="clean">
            <FormItem
              className="formItem clean department"
              {...formItemLayout}
              label="所属部门"
            >
              {getFieldDecorator("department", {
                rules: [
                  {
                    required: true,
                    message: "请输入员工姓名"
                  }
                ],
                initialValue: this.props.nav[0].id
              })(
                <div>
                  <Select
                    style={{ width: 200 }}
                    onChange={this.handleDepartmentChange.bind(this, 0)}
                    defaultValue={this.props.detail.department}
                  >
                    {department}
                  </Select>
                </div>
              )}
            </FormItem>
            {this.state.group.length > 0 && (
              <FormItem
                className="formItem clean department"
                {...formItemLayout}
                label="所属分组"
              >
                {getFieldDecorator("group", {
                  initialValue: this.state.group[0].id
                })(
                  <div>
                    <Select
                      style={{ width: 200 }}
                      onChange={this.handleDepartmentChange.bind(this, 1)}
                      defaultValue={this.state.group[0].id}
                    >
                      {group}
                    </Select>
                  </div>
                )}
              </FormItem>
            )}
            <FormItem
              className="formItem clean"
              {...formItemLayout}
              label="联系方式"
            >
              {getFieldDecorator("userName", {
                rules: [
                  {
                    required: true,
                    message: "请输入联系方式"
                  }
                ],
                initialValue: this.props.detail.userName
              })(<Input />)}
            </FormItem>
          </div>
          <div className="clean">
            <FormItem
              className="formItem clean"
              {...formItemLayout}
              label="职位名称"
            >
              {getFieldDecorator("roles", {
                initialValue: "0"
              })(
                <Select style={{ width: 200 }} onChange={this.handleSelect}>
                  <Option value="0">管理员</Option>
                  <Option value="1">操作员</Option>
                  <Option value="2">安装师傅</Option>
                </Select>
              )}
            </FormItem>
            {!this.props.isEdit && (
              <FormItem
                className="formItem clean"
                {...formItemLayout}
                label="密码"
              >
                {getFieldDecorator("password", {
                  rules: [
                    {
                      required: true,
                      message: "请输入密码"
                    }
                  ],
                  initialValue: ""
                })(<Input />)}
              </FormItem>
            )}
            {this.props.isEdit && (
              <FormItem
                className="formItem clean"
                {...formItemLayout}
                label="在职状态"
              >
                {getFieldDecorator("status", {
                  initialValue: String(this.props.detail.status)
                })(
                  <Select style={{ width: 200 }} onChange={this.handleSelect}>
                    <Option value="0">在职</Option>
                    <Option value="1">调休</Option>
                    <Option value="2">外派</Option>
                    <Option value="3">离职</Option>
                  </Select>
                )}
              </FormItem>
            )}
          </div>
        </Form>
        <div className="diaBtns fr">
          <Button type="primary" onClick={this.handleSubmit}>
            确认
          </Button>
          <Button onClick={this.props.cancel}>取消</Button>
        </div>
      </div>
    );

    return (
      <div className="dialog">
        <div className="mask" />
        <div className="main">
          {this.props.isEdit ? (
            <p className="topTitle">修改人员</p>
          ) : (
            <p className="topTitle">新增人员</p>
          )}
          {msgform}
        </div>
      </div>
    );
  }
}
const MsgDetail = Form.create()(TMsgDetail);

class Department extends Component{
  constructor(props) {
    super(props);
    this.state={
      id:'',//旧部门id
      departmentName:'',
      groupName:'',
      newGroupName:'',//旧部门新分组
    }
  }
  handleChange=(v)=>{
    this.setState({
      id:v
    })
  }
  confirm=()=>{
    if(this.state.departmentName == '' && this.state.newGroupName == ''){
      message.error('未添加部门')
    }
    if(this.state.departmentName){//添加部门
      $Funs.$AJAX('department','post',{'departmentName':this.state.departmentName,'inputMan':$Funs.cook.get('id')},(res)=>{
        console.log(res)
        if(this.state.groupName){//添加部门分组
          $Funs.$AJAX('group','post',{'department':res.id,'groupName':this.state.groupName,'inputMan':$Funs.cook.get('id')},(res)=>{
            if(this.state.newGroupName){
              $Funs.$AJAX('group','post',{'department':this.state.id,'groupName':this.state.newGroupName,'inputMan':$Funs.cook.get('id')},(res)=>{
                message.success('添加成功')
              })
            }else{
              message.success('添加成功')
            }
          })
        }else{
          message.success('添加成功')
        }
      })
      this.props.close();
      setTimeout(e => {
        location.reload();
      }, 400);
    }else if(this.state.newGroupName){
      $Funs.$AJAX('group','post',{'department':this.state.id,'groupName':this.state.newGroupName,'inputMan':$Funs.cook.get('id')},(res)=>{
        message.success('添加成功')
      })
      this.props.close();
      setTimeout(e => {
        location.reload();
      }, 400);
    }

  }
  render(){
    let select = this.props.nav.map((v,i)=>{
      return <Option value={v.id} key = {i}>{v.departmentName}</Option>
    })
    return (
      <div className = 'depModal'>
        <div className = 'mask'></div>
        <div className = 'main'>
          <h3 className = 'addTitle'>新增部门或分组</h3>
          <Divider>新增部门及分组</Divider>
          <div className='group clean'>
            <Input className = 'fl' placeholder="请输入部门名称" onChange={(e)=>{this.setState({departmentName:e.target.value})}}/> 
            <Input className = 'fr' placeholder="请输入部门名称" onChange={(e)=>{this.setState({groupName:e.target.value})}}/> 
          </div>
          <Divider>新增现有部门分组</Divider>
          <div className = 'group clean'>
            <Select defaultValue={this.props.nav[0].id} style={{ width: 200 }} onChange={this.handleChange} className='fl'>
              {select}
            </Select>
            <Input placeholder="请输入分组名称" style={{ width: 200 }} className='fr' onChange={(e)=>{this.setState({newGroupName:e.target.value})}} /> 
          </div>
          <div className = 'btns clean'>
            <Button className="fr" onClick = {this.props.close}>取消</Button>
            <Button type="primary" className="fr" onClick = {this.confirm}>确认</Button>
          </div>
        </div>
      </div>
    )
  }
}

export default class Person extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading:true,
      currPage: 1,
      pageSize: 13,
      keyWord: {}, //搜索关键字
      data: [], //table数据
      total: "", //总页数
      detail: {}, //录入项对象
      isAdd: false,
      isEdit: false,
      nav: [],
      navIndex: "", //当前导航,
      ofsj:{},   //数据
      selectedRows:[],
      department:false,//新增部门模态框
    };
  }
  componentWillMount = () => {
    $Funs.$AJAX("department", "get", "", res => {
      this.setState({
        nav: res
      });
      let post = {
        department: res[0].id,
        page: this.state.currPage,
        size: this.state.pageSize,
      };
      this.init(post);
    });
  };
  init = obj => {
    if (this.state.nav[0].groupListDtoList.length == 0) {
      $Funs.$AJAX("user/" + $Funs.cook.get("id"), "get", obj, res => {
        let data = res.data.map((v, i) => {
          v.key = i;
          v.state =
            v.status == 0
              ? "在职"
              : v.status == 1
                ? "调休"
                : v.status == 2
                  ? "外派"
                  : "离职";
          v.roles =
            v.roles == 0 ? "管理员" : v.roles == 1 ? "操作员" : "安装师傅";
          v.level =
            v.jurisdiction == 0
              ? "LV1"
              : v.jurisdiction == 1
                ? "LV2"
                : v.jurisdiction == 2
                  ? "LV3"
                  : "LV4";
          return v;
        });
        this.setState({
          data: data,
          total: res.count,
          loading:false
        });
      });
    }
  };
  getIndex = i => {
    this.setState({
      navIndex: i
    });
    let data={
      page: 1,
      size: this.state.pageSize
    };
    if(i.length>=3){
      let Aindex=i.split("-")[0],Bindex=i.split("-")[1];
      data.department=this.state.nav[Aindex].id;
      data.group=this.state.nav[Aindex].groupListDtoList[Bindex].id;
    }else{
      data.department=this.state.nav[i].id;
    }
    this.setState({
      ofsj:data,
      loading:true
    })
    this.init(data);
  };
  search=data => {
    if (data) {
      this.setState({
        keyWord: data,
        currPage: 1,
        loading:true
      },()=>{
        let newdata = this.state.ofsj;
        if(newdata.department){
          newdata.name=data;
          newdata.page=1;
          this.init(newdata)
        }else{
          this.init({
            name:data,
            department:this.state.nav[0].id,
            page: 1,
            size: this.state.pageSize
          })
        }
      });
      
    }
   

  };
  pageChange = page => {
    this.setState(
      {
        currPage: page,
        loading:true
      },()=>{
        let data = this.state.ofsj;
        if(data.department){
          data.keyWord=this.state.keyWord;
          data.page=page;
          this.init(data)
        }else{
          this.init({
            department:this.state.nav[0].id,
            page: page,
            size: this.state.pageSize
          })
        }
      }
    );
    
  
  };
  addNew = () => {
    this.setState({
      isAdd: true,
      detail: {}
    });
  };
  del=item=>{
      Modal.confirm({
        title: "确认删除该人员信息吗？",
        okText: "确认",
        cancelText: "取消",
        onOk() {
          $Funs.$AJAX("user?userId="+item.id,"DELETE",null,e=>{
            message.success('删除成功');
            setTimeout(e => {
              location.reload();
            }, 400);
          });
        }
    })
  }
  update = item => {
    this.setState({
      isAdd: true,
      isEdit: true,
      detail: item
    });
  };
  addDepartment = ()=>{
    this.setState({
      department:true
    })
  }
  close = ()=>{
    this.setState({
      department:false
    })
  }
  cancel = () => {
    this.setState({
      isAdd: false,
      isEdit: false
    });
  };
  exportForm = ()=>{
    if(this.state.selectedRows.length == 0){
      message.error('未选择导出项');
      return 
    }
    let exslDTO = {}
    exslDTO.ids = this.state.selectedRows.map(v=>{
      return v.id
    })
    exslDTO.maps = {
      "jurisdiction":'职位等级',
      "name":'员工姓名',
      "departmentName":'所属部门',
      "roles":'职位名称',
      "userName":'联系方式',
      "status":'在职状态'
    }
    exslDTO.type = 4;
    let code = Base64.encode(JSON.stringify(exslDTO));
    window.open($Funs.Basse_Port+'saveExsl?exslDTO='+ code)
}
  render() {
    const columns = [
      {
        title: "职位等级",
        width: 150,
        dataIndex: "level",
        key: "level",
        align: "center"
      },
      {
        title: "员工姓名",
        width: 150,
        dataIndex: "name",
        key: "name",
        align: "center"
      },
      {
        title: "所属部门",
        dataIndex: "departmentName",
        key: "departmentName",
        width: 150,
        align: "center"
      },
      {
        title: "职位名称",
        dataIndex: "roles",
        key: "roles",
        width: 150,
        align: "center"
      },
      {
        title: "联系方式",
        dataIndex: "userName",
        key: "userName",
        width: 150,
        align: "center"
      },
      {
        title: "在职状态",
        dataIndex: "state",
        key: "state",
        width: 150,
        align: "center"
      },
      {
        title: "操作",
        dataIndex: "",
        width: 150,
        key: "action",
        render: item => {
          return (
            <div>
              <a
                onClick={() => {
                  this.update(item);
                }}
              >
                编辑
              </a>{" "}
              <a
                onClick={() => {
                  this.del(item);
                }}
              >
                删除
              </a>
            </div>
          );
        }
      }
    ];
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRows:selectedRows
        })
      }
    };
    return (
      <div className="person">
        <Spin spinning = {this.state.loading} size='large'>
        <div className="top">
          <Search
            placeholder="请输入搜索的职员"
            enterButton="查询"
            style={{ width: 240 }}
            onSearch={this.search}
          />
          <Button type="primary" className="fr" onClick = {this.exportForm}>
            导出
          </Button>
          <Button type="primary" className="fr" onClick={this.addNew}>
          <Icon type="user-add" />
            新增职员
          </Button>
        </div>
        <div className="main_con">
          <div className="fl left">
            <p className="title">部门列表<Icon type="form" onClick={this.addDepartment}/></p>
            {this.state.nav.length > 0 && (
              <Sider nav={this.state.nav} getIndex={this.getIndex} />
            )}
          </div>
          <div className="fr right">
            <Table
              rowSelection={rowSelection}
              columns = {columns}
              dataSource={this.state.data}
              pagination={{
                defaultPageSize: 13,
                total: this.state.total,
                onChange: this.pageChange,
                current: this.state.currPage
              }}
            />
            {this.state.isAdd && (
              <MsgDetail
                detail={this.state.detail}
                cancel={this.cancel}
                isEdit={this.state.isEdit}
                nav={this.state.nav}
              />
            )}
            {
              this.state.department && <Department close={this.close} nav={this.state.nav}/>
            }
          </div>
        </div>
        </Spin>
      </div>
    );
  }
}
