import Vue from "vue";
import VueRouter from "vue-router";
import Login from "@/components/Login";
import Home from "@/components/Home";
import User from "@/components/user/User";
import Welcome from "@/components/Welcome";
import Rights from "@/components/power/Rights";
import Roles from "@/components/power/Roles";
import List from "@/components/goods/List";
import GoodPage from "@/components/goods/Add";
import Cate from "@/components/goods/Cate";
import Params from "@/components/goods/Params";
import Order from "@/components/order/Order";
import Report from "@/components/report/Report";
Vue.use(VueRouter);

// 解决Vue-router重复点击报错的问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
const routes = [
	{
		path: "/",
		redirect: "login",
	},
	{
		path: "/login",
		name: "login",
		component: Login,
	},
	{
		path:"/home",
		component:Home,
		children:[
			{
				path:'/users',
				component:User
			},
			{
				path:'/home',
				component:Welcome
			},
			{
				path:'/rights',
				component:Rights
			},
			{
				path:'/roles',
				component:Roles
			},{
				path:'/goods',
				component:List
			},{
				path:'/goods/add',
				component:GoodPage
			},{
				path:'/categories',
				component:Cate
			},{
				path:"/params",
				component:Params
			},{
				path:'/orders',
				component:Order
			},{
				path:'/reports',
				component:Report
			}
		]
	}
];

const router = new VueRouter({
	routes,
});

// 导航守卫
router.beforeEach((to,from,next) => {
	if(to.path === '/login'){
		window.sessionStorage.clear();
		//阻止页面的后退
		history.pushState(null,null,location.hash);
		return next();
	}
	const tokenStr = window.sessionStorage.getItem('token');
	if(!tokenStr) return next('/login');
	next();
});

export default router;
