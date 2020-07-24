import Vue from "vue";
import App from "./App.vue";
import router from "./router";
// 引入全局的css样式
import '@/assets/css/global.css';
// 引入外部的字体图标样式
import './assets/fonts/iconfont.css';

// 引入elementui
import "./plugins/element.js";
//引入axios包  并且挂载到vue上面
import axios from 'axios';
// 设置axios请求的根路径
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/";
Vue.prototype.$http = axios;


Vue.config.productionTip = false;

new Vue({
	router,
	render: (h) => h(App),
}).$mount("#app");
