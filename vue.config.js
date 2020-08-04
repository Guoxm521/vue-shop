module.exports = {
	publicPath:
		process.env.NODE_ENV === "production" ? "./" : "./",
	chainWebpack: (config) => {
		// 发布模式
		config.when(process.env.NODE_ENV === "production", (config) => {
			config
				.entry("app")
				.clear()
				.add("./src/main-prod.js");

			config.set("externals", {
				vue: "Vue",
				"vue-router": "VueRouter",
				axios: "axios",
				echarts: "echarts",
				nprogress: "NProgress",
				"vue-quill-editor": "VueQuillEditor",
			});
			config.plugin("html").tap((args) => {
				args[0].isProd = true;
				return args;
			});
		});
		// 生产模式
		config.when(process.env.NODE_ENV === "development", (config) => {
			config
				.entry("app")
				.clear()
				.add("./src/main-dev.js");
			config.plugin("html").tap((args) => {
				args[0].isProd = false;
				return args;
			});

		});
	},
};
