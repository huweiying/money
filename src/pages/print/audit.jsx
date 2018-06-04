import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Table , Input , Button , Form , Select,Modal,notification} from 'antd';
const FormItem = Form.Item;
const Search = Input.Search;
const Option = Select.Option;
import Finds from "../../component/find"
import Arrs from "../../assets/js/formArray"
const columns = [
    { title: '车牌号码', width: 100, dataIndex: 'vehiclePlate',align: 'center' },
    // { title: '申请日期', width: 100, dataIndex: 'paymentDate' ,align: 'center' },
    { title: '公司车队', dataIndex: 'teamName', width: 150 ,align: 'center' },
    { title: '车辆类型', dataIndex: 'typeName',  width: 150 ,align: 'center' },
    { title: '付款时间', dataIndex: 'paymentDate',  width: 150 ,align: 'center' },
    { title: '录入员', dataIndex: 'inputMan', width: 150 ,align: 'center' },
];

  
  
export default class Audit extends Component {
    constructor(props) {
        super(props)
        this.state = {
           nav:[
             {tit:'待审批',Selected:true,value:0},
             {tit:'已审批',Selected:false,value:1},
           ],
           navcur:0,
           form:{}
        }
    }
    componentWillMount() {
      this.list({
        type:0,
        currPage:1,
        pageSize:10
      })
    }
    sub(e) {
      let index = this.state.nav.findIndex(e => {
        return e.Selected
       })
      let Arr=e;
      Arr.type=index
      Arr.currPage=1;
      Arr.pageSize=10;
      this.setState({
        nowpage:1,
        form:Arr
      })
      this.list(Arr)
    }
    list(data){
      $Funs.$AJAX('printApplyFors','get',data,res=>{
        res.data = res.data.map((v,i)=>{
         // $Funs.format(v.paymentDate)
          // v.paymentDate=$Funs.format(v.paymentDate)
          // v.deadlineDate=$Funs.format(v.deadlineDate)
          v.key = i
          return v
        })
        this.setState({
          list: res.data,
          total:res.count,
        })
      })
    }
    pageChange=(page)=>{ 
      let index = this.state.nav.findIndex(e => {
        return e.Selected
       })
      this.setState({
        nowpage:page,
      })
      let Brr=this.state.form;
      Object.assign(Brr, {
        currPage:page,
        pageSize:10,
        type:this.state.nav[index].value,
      });
      this.list(Brr)
    }
    handleClick(i,e){
      let arr=this.state.nav;
      for(let val of arr){
        val.Selected=false;
      }
      arr[i].Selected=true;
      this.setState({
        nav:arr,
        navcur:arr[i].value
      })
      this.list({
        type:arr[i].value,
        currPage:1,
        pageSize:10
      })
    }
    rows=(type)=>{
      let Ids=this.state.ck,newArr=[];
      for(let val of Ids){
        newArr.push(val.id)
      }
      Modal.confirm({
        title: '申请打印',
        content: '确认提交？',
        okText: '确认',
        cancelText: '取消',
        onOk(){
          $Funs.$AJAX('printApplyFors?status='+type,'patch',newArr,e=>{
            notification.open({
              message: '审核通过',
            });
            setTimeout(() => {
              location.reload();
            }, 500);
          })
        }
      });
    }
    render() {
        const rowSelection= {
          onChange: (selectedRowKeys, selectedRows) => {
            console.log(selectedRowKeys, selectedRows)
            this.setState({
              ck:selectedRows
            })
          },
          getCheckboxProps: record => ({
            disabled: record.name === 'Disabled User', // Column configuration not to be checked
            name: record.name,
          }),
        };
        let current=this.state.navcur;
        return (
            <div className = 'audit'>
              <div className = 'nav clean'>
                {
                  this.state.nav.map((e,i)=>{
                    return(
                      <span className={e.Selected?'active':''} onClick={this.handleClick.bind(this,i)} key={i}>{e.tit}</span>
                    )
                  })
                }
              </div>
                <Finds Formbody={Arrs.audit} sub={mode => this.sub(mode)} />
                {/*<TopForm />*/}
                {
                  current==0 && <div>
                    <Table  rowSelection={rowSelection} columns={columns} dataSource={this.state.list} scroll={{y:400 }}  pagination = {{defaultPageSize:10,current:this.state.nowpage,total:this.state.total,onChange:this.pageChange}} />
                    <div className = 'footer fr'>
                        <Button type="primary" onClick={this.rows.bind(this,1)}>审批通过</Button>
                        <Button  onClick={this.rows.bind(this,2)}>审批驳回</Button>
                    </div>
                  </div>
                  || <Table columns={columns} dataSource={this.state.list} scroll={{y:400 }}  pagination = {{defaultPageSize:10,current:this.state.nowpage,total:this.state.total,onChange:this.pageChange}} />
                }
            </div>
        )
    }
}
