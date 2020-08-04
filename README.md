## Vue-shop 电商后台项目

#### 一.介绍

本项目是自己在学习过程中，仿照借鉴别人写的一个项目，在此仅对开源的伙伴表示衷心的感谢。

####  二.前端项目技术栈

- Vue
- Vue-router
- Element-UI
- Axios
- Echarts

#### 三.学习过程总结

1. 项目通过Vue-cli进行创建，好处是通过可视化面板进行一些操作，方便了我们对插件的安装，项目后期运行分析
2. 安装的插件主要分为两部分，运行依赖和开发依赖，这两部分一定要按自己的需求添加。
   - 运行依赖：
     - axios + echarts + element-ui + nprogress + vue-quill-editor + vue-table-with-tree-grid
   - 开发依赖：
     - babel-plugin-syntax-dynamic-import :实现vue路由懒加载依赖
     - babel-plugin-transform-remove-console ：删除项目当中调试的console.log
     - html: 动态添加属性，如标题
     - less-loader
     - open-browser-complier：自动打开浏览器
     - webpack-dev-serve：

