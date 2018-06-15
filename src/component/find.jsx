import React, { Component } from 'react';
import { Input, Form, Select, Button,DatePicker } from 'antd';
const Option = Select.Option;
const { RangePicker } = DatePicker;
const FormItem = Form.Item;


class findbox extends Component {          
    constructor(props) {
        super(props);
        this.state = {
            form:{}
        }
    }
    setStateByKey=(k,type,e,time)=>{
        let newForm = this.state.form;  
        if(type =='input'){
            newForm[k] = e.target.value;  
        }else if(type =='RangePicker'){
            newForm[k[0]]=new Date(time[0]).getTime()
            newForm[k[1]]=new Date(time[1]).getTime()
        }
        else{
            newForm[k] = e;  
        }
        this.setState({  
          form: newForm  
        }); 
    }
    handleReset=()=>{         // 重置按钮
        document.getElementById("form").reset()
        this.setState({
            form:{}
        },()=>{
            this.props.sub(this.state.form)
        })
    }
    render() {
        const Arr=this.props.Formbody;      //表单数组  !!!!
        return (
            <Form className='topForm clean printbox' id="form">             
                {
                    Arr.map((item,i) => {
                        return <div className='fl' key={i}>
                            {
                                item.inputlist.map((ele,i) => {
                                    return (
                                        <FormItem label={ele.name + ':'} className='formItem' key={i}>
                                        {
                                            ele.oftype == 'input' &&  <Input placeholder={'请输入' + ele.name} className='' onChange={this.setStateByKey.bind(this, ele.key,ele.oftype) } /> ||
                                            ele.oftype == 'select' && <Select onChange={this.setStateByKey.bind(this, ele.key,ele.oftype) }  >{ 
                                                ele.Select.map((v,i) => { 
                                                    return <Option value={v.value} key={i}>{v.name}</Option> 
                                                }) 
                                            }</Select> ||
                                            ele.oftype == 'RangePicker' && <RangePicker showTime={{ format: 'HH:mm' }} format="YYYY-MM-DD" placeholder={['开始时间', '结束时间']} onChange={this.setStateByKey.bind(this, ele.another,ele.oftype)}/>
                                        }
                                        </FormItem>
                                    )
                                })
                            }
                        </div>
                    })
                }
                <div className='fl'>
                    <a className='empty' onClick={this.handleReset}>清空</a>
                </div>
                <div className='fl'>
                    <Button type="primary" onClick={()=>{this.props.sub(this.state.form)}}>查找</Button>
                </div>

            </Form>
        );
    }
}
export default findbox;