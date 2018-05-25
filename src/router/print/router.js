// print页面 二级路由
import AsyncComponents from "../../component/AsyncComponents";

const Routers = [
  {
    path:'/print/prove',
    component:AsyncComponents(()=> import("../../pages/print/prove")),
    routes:[]
  },
  {
    path:'/print/invalid',
    component:AsyncComponents(()=> import("../../pages/print/invalid")),
    routes:[]
  },
  {
    path:'/print/audit',
    component:AsyncComponents(()=> import("../../pages/print/audit")),
    routes:[]
  }

]



export default Routers;