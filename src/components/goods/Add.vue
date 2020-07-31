<template>
  <div>
    <!--面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品添加</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片面板 -->
    <el-card class="card-box">
      <!-- 提示 -->
      <el-alert title="添加商品信息" type="info" center show-icon></el-alert>
      <!-- 步骤条 -->
      <el-steps :active="2" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品照片"></el-step>
        <el-step title="商品内容"></el-step>
      </el-steps>
      <!-- 将步骤条包含在表单里面 -->
      <el-form v-model="addForm" ref="addFormRef" label-width="100px" label-position="top">
        <el-tabs tab-position="left">
          <el-tab-pane label="基本信息">
            <el-form-item label="商品名称">
              <el-input v-model="addForm.name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格">
              <el-input type="number" v-model="addForm.region"></el-input>
            </el-form-item>
            <el-form-item label="商品重量">
              <el-input type="number" v-model="addForm.type"></el-input>
            </el-form-item>
            <el-form-item label="商品数量">
              <el-input type="number" v-model="addForm.type"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <el-select v-model="addForm.name" placeholder="请选择活动区域">
                <el-option label="区域一" ></el-option>
                <el-option label="区域二" ></el-option>
              </el-select>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数">商品参数</el-tab-pane>
          <el-tab-pane label="商品属性">商品属性</el-tab-pane>
          <el-tab-pane label="商品照片">商品照片</el-tab-pane>
          <el-tab-pane label="商品内容">商品内容</el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      addForm: {
        name: "",
        region: "",
        type: "",
      },
    };
  },
};
</script>

<style>
</style>