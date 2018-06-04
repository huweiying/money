// 预留字段 className oftype 
//使用字段 
//  oftype ==> input type
//  name   ==> label
//  value  ==> 对应value
//  key    ==> 对应key

export default {
    prove: [                //对应模块  -----打印证明搜索
        {
            className: 'fl',
            oftype: "div",
            inputlist: [
                { className: 'formItem', oftype: 'input', name: '车牌号码', value: '', key: 'carNum' },
                { className: 'formItem', oftype: 'input', name: '车队名', value: '', key: 'carCompany' }
            ]
        },
        {
            className: 'fl',
            oftype: "div",
            inputlist: [
                { className: 'formItem', oftype: 'input', name: 'SIM卡号', value: '', key: 'sim' },
                { className: 'formItem', oftype: 'RangePicker', name: '付款时间', value: '', key: 'time', another:["paymentDate1","paymentDate2"] }
            ]
        },
        {
            className: 'fl',
            oftype: "div",
            inputlist: [
                { className: 'formItem', oftype: 'input', name: '终端号', value: '', key: 'manageNum' },
            ]
        },
        //   {
        //     className: 'fl',
        //     type: "div",
        //     inputlist: [
        //       { className: 'formItem', oftype: 'select',name: '终端号',key: 'number',selected: "1",
        //         Select: [ 
        //           { name: 'Jack',value: '1'},
        //           { name: 'Jack',value: '2'}
        //         ],
        //       }
        //     ]
        // }
    ],
    audit:[
        {
            className: 'fl',
            oftype: "div",
            inputlist: [
                { className: 'formItem', oftype: 'input', name: '车牌号码', value: '', key: 'carNum' }
            ]
        },
        {
            className: 'fl',
            oftype: "div",
            inputlist: [
                { className: 'formItem', oftype: 'input', name: '录入员', value: '', key: 'inputMan' }
            ]
        },
    ]
}