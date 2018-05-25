// print页面 二级路由
import AsyncComponents from "../../component/AsyncComponents";

const Routers = [
  {
    path:'/system/log',
    component:AsyncComponents(()=> import("../../pages/system/log")),
    routes:[]
  },
  {
    path:'/system/maintenance',
    component:AsyncComponents(()=> import("../../pages/system/maintenance")),
    routes:[]
  }
]



export default Routers;