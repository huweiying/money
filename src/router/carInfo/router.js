// carInfo页面 二级路由
import AsyncComponents from "../../component/AsyncComponents";

const Routers = [
  {
    path:'/carInfo/entry',
    component:AsyncComponents(()=> import("../../pages/carInfo/entry")),
    routes:[]
  },
  {
    path:'/carInfo/info',
    component:AsyncComponents(()=> import("../../pages/carInfo/info")),
    routes:[]
  },
  {
    path:'/carInfo/dataQuery',
    component:AsyncComponents(()=> import("../../pages/carInfo/dataQuery")),
    routes:[]
  }

]



export default Routers;