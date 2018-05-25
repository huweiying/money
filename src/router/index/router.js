// index页面 二级路由
import AsyncComponents from "../../component/AsyncComponents";

const Routers = [
  {
    path:'/index/child',
    component:AsyncComponents(()=> import("../../pages/index/child")),
    routes:[]
  }

]



export default Routers;