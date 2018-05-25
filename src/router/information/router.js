// print页面 二级路由
import AsyncComponents from "../../component/AsyncComponents";

const Routers = [
  {
    path:'/information/stop',
    component:AsyncComponents(()=> import("../../pages/information/stop")),
    routes:[]
  },
  {
    path:'/information/change',
    component:AsyncComponents(()=> import("../../pages/information/change")),
    routes:[]
  },
  {
    path:'/information/recode',
    component:AsyncComponents(()=> import("../../pages/information/recode")),
    routes:[]
  },
  {
    path:'/information/notice',
    component:AsyncComponents(()=> import("../../pages/information/notice")),
    routes:[]
  }

]



export default Routers;