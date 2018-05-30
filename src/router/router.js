import AsyncComponents from "../component/AsyncComponents";
const Login=AsyncComponents(()=> import("../pages/login")) 
const Register=AsyncComponents(()=> import("../pages/register"))
const App=AsyncComponents(()=> import("../pages/app"))

// const Index = AsyncComponents(()=> import("../pages/index/index"))//首页
const carInfo = AsyncComponents(()=> import("../pages/carInfo/carInfo"));//车辆基本资料
const print = AsyncComponents(()=> import("../pages/print/print"));//打印审核
const charge = AsyncComponents(()=> import("../pages/charge/charge"));//收费管理
const information = AsyncComponents(()=> import("../pages/information/information"));//信息管理
const system = AsyncComponents(()=> import("../pages/system/system"));//信息管理
const person = AsyncComponents(()=> import("../pages/person/person"));//信息管理
// const person = AsyncComponents(()=> import("../pages/person/person"));//人员管理
import indexRouter from "../router/index/router";//index页面二级路由
import carInfoRouter from "../router/carInfo/router";//carInfo页面二级路由
import printRouter from "../router/print/router";//print页面二级路由
import chargeRouter from "../router/charge/router";//print页面二级路由
import informationRouter from "../router/information/router";//print页面二级路由
import systemRouter from "../router/system/router";//print页面二级路由
const Routers = [
  {
    path:'/login',
    component:Login,
    routes:[]
  },
  {
    path:'/register',
    component:Register,
    routes:[]
  },
  {
    path:'/',
    component:App,
    routes:[
      {
        path:'/carInfo',
        component:carInfo,
        routes:[...carInfoRouter]
      },
      {
        path:'/print',
        component:print,
        routes:[...printRouter]
      },
      {
        path:'/charge',
        component:charge,
        routes:[...chargeRouter]
      },
      {
        path:'/information',
        component:information,
        routes:[...informationRouter]
      },
      {
        path:'/system',
        component:system,
        routes:[...systemRouter]
      },
      {
        path:'/person',
        component:person
      },
    ]
  },

]



export default Routers;