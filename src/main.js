import Vue from "vue";
import App from "./App.vue";
import router from "./router";
// 引入全局的css样式
import "@/assets/css/global.css";
// 引入外部的字体图标样式
import "./assets/fonts/iconfont.css";

import VueQuillEditor from "vue-quill-editor";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

Vue.use(VueQuillEditor);

// 导入表格树
import TreeTable from "vue-table-with-tree-grid";
Vue.component("tree-table", TreeTable);
// 引入elementui
import "./plugins/element.js";
//引入axios包  并且挂载到vue上面
import axios from "axios";
// 设置axios请求的根路径
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/";
// 对所有的axios 进行拦截请求
axios.interceptors.request.use((config) => {
	config.headers.Authorization = window.sessionStorage.getItem("token");
	return config;
});
Vue.prototype.$http = axios;

// 格式化时间的全局过滤器
Vue.filter("dataFormat", function(orginVal) {
	const val = orginVal * 1000;
	const dt = new Date(val);

	const y = dt.getFullYear();
	const m = (dt.getMonth() + 1 + "").padStart(2, "0");
	const d = (dt.getDate() + "").padStart(2, "0");

	const hh = (dt.getHours() + "").padStart(2, "0");
	const mm = (dt.getMinutes() + "").padStart(2, "0");
	const ss = (dt.getSeconds() + "").padStart(2, "0");
	// yyyy-mm-dd hh:mm:ss
	return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
});

Vue.config.productionTip = false;

new Vue({
	router,
	render: (h) => h(App),
}).$mount("#app");
