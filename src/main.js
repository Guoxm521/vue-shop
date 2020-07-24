import Vue from "vue";
import App from "./App.vue";
import router from "./router";
// 引入全局的css样式
import '@/assets/css/global.css';
// 引入外部的字体图标样式
import './assets/fonts/iconfont.css';


// 引入elementui
import "./plugins/element.js";


Vue.config.productionTip = false;

new Vue({
	router,
	render: (h) => h(App),
}).$mount("#app");
