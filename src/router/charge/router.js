// print页面 二级路由
import AsyncComponents from "../../component/AsyncComponents";

const Routers = [
  {
    path:'/charge/save',
    component:AsyncComponents(()=> import("../../pages/charge/save")),
    routes:[]
  },
  {
    path:'/charge/query',
    component:AsyncComponents(()=> import("../../pages/charge/query")),
    routes:[]
  },
  {
    path:'/charge/group',
    component:AsyncComponents(()=> import("../../pages/charge/group")),
    routes:[]
  },
  {
    path:'/charge/modify',
    component:AsyncComponents(()=> import("../../pages/charge/modify")),
    routes:[]
  }

]



export default Routers;