webpackJsonp([16],{987:function(e,t,a){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!==typeof t&&"function"!==typeof t?e:t}function l(e,t){if("function"!==typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var r=a(0),o=a.n(r),c=(a(348),a(347)),s=function(){function e(e,t){for(var a=0;a<t.length;a++){var n=t[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,a,n){return a&&e(t.prototype,a),n&&e(t,n),t}}(),d=c.e.Item,m=(c.g.Search,c.k.Option,c.g.TextArea),u=c.i.confirm,p=function(e){function t(e){n(this,t);var a=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return a.handleSearch=function(){a.props.form.validateFields(function(e,t){for(var n=Object.keys(t),i={},l=0;l<n.length;l++)t[n[l]]&&(i[n[l]]=t[n[l]]);i&&a.props.getSearch(i)})},a.clear=function(){a.props.form.resetFields(),a.props.init({})},a}return l(t,e),s(t,[{key:"render",value:function(){var e=this.props.form,t=e.getFieldDecorator;e.resetFields;return o.a.createElement(c.e,{className:"topForm clean"},o.a.createElement("div",{className:"fl"},o.a.createElement(d,{label:"\u8f66\u724c\u53f7\u7801\uff1a",className:"formItem"},t("vehicleId")(o.a.createElement(c.g,null)))),o.a.createElement("div",{className:"fl"},o.a.createElement(d,{label:"\u516c\u53f8\u8f66\u961f\uff1a",className:"formItem"},t("teamName")(o.a.createElement(c.g,null)))),o.a.createElement("div",{className:"fl"},o.a.createElement("a",{className:"empty",onClick:this.clear},"\u6e05\u7a7a")),o.a.createElement("div",{className:"fr"},o.a.createElement(c.b,{type:"primary",onClick:this.handleSearch},"\u67e5\u627e")))}}]),t}(r.Component),f=c.e.create({mapPropsToFields:function(e){return{init:c.e.createFormField({value:e.init}),getSearch:c.e.createFormField({value:e.getSearch})}}})(p),h=function(e){function t(e){n(this,t);var a=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return a.handleSubmit=function(){a.props.form.validateFields(function(e,t){e||u({title:"\u63d0\u793a",content:"\u786e\u8ba4\u63d0\u4ea4\u62a5\u505c\u4fe1\u606f\uff1f",okText:"\u786e\u8ba4",cancelText:"\u53d6\u6d88",onOk:function(){t.newCarId=a.props.detail.newCarId,t.vehicleId=a.props.detail.vehicleId,t.oldVehicleId=a.props.detail.oldVehicleId,t.teamName=a.props.detail.teamName,t.inputMan=window.$Funs.cook.get("id"),window.$Funs.$AJAX("stop","post",t,function(e){a.props.cancel(),c.o.success("\u64cd\u4f5c\u6210\u529f"),a.props.init()})},onCancel:function(){}})})},a.state={data:[]},a}return l(t,e),s(t,[{key:"render",value:function(){var e=this.props.form.getFieldDecorator,t=o.a.createElement("div",{className:"detail"},o.a.createElement(c.e,{layout:"inline",className:"clean"},o.a.createElement("div",{className:"clean"},o.a.createElement(d,{label:"\u8f66\u724c\u53f7",className:"formItem clean"},o.a.createElement(c.g,{value:this.props.detail.vehicleId,disabled:!0,className:"disabled"})),o.a.createElement(d,{label:"\u516c\u53f8\u6216\u8f66\u961f\u540d",className:"formItem clean"},o.a.createElement(c.g,{value:this.props.detail.teamName,disabled:!0,className:"disabled"})),o.a.createElement(d,{label:"\u65e7\u8f66\u724c\u53f7",className:"formItem clean"},o.a.createElement(c.g,{value:this.props.detail.oldVehicleId,disabled:!0,className:"disabled"}))),o.a.createElement("div",{className:"clean"},o.a.createElement(d,{label:"\u62a5\u505c\u7406\u7531\uff1a",className:"formItem fl clean"},e("stopReason",{rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u62a5\u505c\u7406\u7531"}]})(o.a.createElement(m,{rows:3}))))),o.a.createElement("div",{className:"diaBtns fr"},o.a.createElement(c.b,{type:"primary",onClick:this.handleSubmit},"\u786e\u8ba4\u62a5\u505c"),o.a.createElement(c.b,{onClick:this.props.cancel},"\u53d6\u6d88")));return o.a.createElement("div",{className:"dialog"},o.a.createElement("div",{className:"mask"}),o.a.createElement("div",{className:"main"},o.a.createElement("p",{className:"title"},"\u8f66\u8f86\u62a5\u505c"),t))}}]),t}(r.Component),g=c.e.create({mapPropsToFields:function(e){return{detail:c.e.createFormField({value:e.detail}),cancel:c.e.createFormField({value:e.cancel}),init:c.e.createFormField({value:e.init})}}})(h),v=function(e){function t(e){n(this,t);var a=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return a.init=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};a.setState({loading:!0},function(){!e.currPage&&(e.currPage=a.state.currPage),e.pageSize=a.state.pageSize,window.$Funs.$AJAX("getStop","get",e,function(e){var t=e.data.map(function(e,t){return 0==e.stop?e.stop="\u5426":e.stop="\u662f",e.stopTime=window.$Funs.formatDate(e.stopTime),e.key=t,e});a.setState({data:t,total:e.count,loading:!1})})})},a.getSearch=function(e){e&&a.setState({keyWord:e,currPage:1},function(){a.init(e)})},a.pageChange=function(e){a.setState({currPage:e},function(){var e=a.state.keyWord;a.init(e)})},a.handleOk=function(e){window.$Funs.$AJAX(e+"/stopRestore","patch",{stopId:e},function(e){c.o.success("\u64cd\u4f5c\u6210\u529f"),a.init()})},a.edit=function(e,t){0==t?a.setState({showDiglog:!0,detail:e}):c.i.confirm({title:"\u63d0\u793a\u6846",content:"\u786e\u8ba4\u5bf9\u8be5\u8f66\u8f86\u6062\u590d\u62a5\u505c",okText:"\u786e\u8ba4",onOk:a.handleOk.bind(a,e.stopId),cancelText:"\u53d6\u6d88"})},a.cancel=function(){a.setState({showDiglog:!1})},a.state={loading:!0,showDiglog:!1,currPage:1,pageSize:13,keyWord:{},data:[],total:""},a}return l(t,e),s(t,[{key:"componentWillMount",value:function(){this.init({})}},{key:"render",value:function(){var e=this,t=[{title:"\u516c\u53f8\u8f66\u961f",width:100,dataIndex:"teamName",key:"teamName",align:"center"},{title:"\u8f66\u724c\u53f7",width:100,dataIndex:"vehicleId",key:"vehicleId",align:"center"},{title:"\u66fe\u4f7f\u7528\u8f66\u724c\u53f7",dataIndex:"oldVehicleId",width:150,key:"oldVehicleId",align:"center"},{title:"\u7ec8\u7aef\u7c7b\u578b",dataIndex:"terminalType",key:"terminalType",width:150,align:"center"},{title:"\u662f\u5426\u62a5\u505c",dataIndex:"stop",key:"stop",width:100,align:"center"},{title:"\u62a5\u505c\u7406\u7531",dataIndex:"stopReason",key:"stopReason",width:250,align:"center"},{title:"\u64cd\u4f5c",dataIndex:"",key:"action",width:100,align:"center",render:function(t){return"\u5426"==t.stop?o.a.createElement(c.b,{type:"danger",onClick:function(){e.edit(t,0)}},"\u62a5\u505c"):o.a.createElement(c.b,{onClick:function(){e.edit(t,1)}},"\u6062\u590d")}}];return o.a.createElement("div",{className:"stop"},o.a.createElement(c.l,{spinning:this.state.loading,size:"large"},o.a.createElement(f,{init:this.init,getSearch:this.getSearch}),o.a.createElement(c.m,{columns:t,dataSource:this.state.data,pagination:{defaultPageSize:13,total:this.state.total,onChange:this.pageChange,current:this.state.currPage},scroll:{y:400}}),this.state.showDiglog&&o.a.createElement(g,{detail:this.state.detail,cancel:this.cancel,init:this.init})))}}]),t}(r.Component);t.default=v}});
//# sourceMappingURL=16.e81e6b17.chunk.js.map