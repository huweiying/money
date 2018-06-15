// 预留字段 className oftype 
//使用字段 
//  oftype ==> input type
//  name   ==> label
//  value  ==> 对应value
//  key    ==> 对应key

export default {
    prove:{                //对应模块  -----打印证明搜索
       prove:[{
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
                { className: 'formItem', oftype: 'input', name: '终端号', value: '', key: 'manageNum' },
                
            ]
        },
        {
            className: 'fl',
            oftype: "div",
            inputlist: [
                { className: 'formItem', oftype: 'RangePicker', name: '付款时间', value: '', key: 'time', another:["paymentDate1","paymentDate2"] }
            ]
        }],
        entry:[
            {
                className: 'fl',
                oftype: "div",
                inputlist: [
                    { className: 'formItem', oftype: 'input', name: '车队', value: '', key: 'carNumOrName'}
                ]
            }
        ],
        info:[
            {
                className: 'fl',
                oftype: "div",
                inputlist: [
                    { className: 'formItem', oftype: 'input', name: '车牌号码', value: '', key: 'carNum'},
                    { className: 'formItem', oftype: 'input', name: '终端说明', value: '', key: 'deviceName'}
                ]
            },
            {
                className: 'fl',
                type: "div",
                inputlist: [
                  { className: 'formItem', oftype: 'input', name: '公司', value: '', key: 'carCompany'},
                  { className: 'formItem', oftype: 'select',name: '车辆类型',value: '',key: 'carType',selected: "重型卸货汽车",
                    Select: [ 
                      { name: '重型卸货汽车',value: '重型卸货汽车'}
                    ],
                  },
                ]
            },
            {
                className: 'fl',
                oftype: "div",
                inputlist: [
                    { className: 'formItem', oftype: 'select',name: '停报状态',key: 'stop',value: '',selected: "0",
                        Select: [ 
                            { name: '否',value: '0'},
                            { name: '是',value: '1'}
                        ],
                    },
                ]
            }
        ]
      
    },   
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