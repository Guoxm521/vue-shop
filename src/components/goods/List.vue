<template>
  <div>
    <!--面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <el-row :gutter="40">
        <el-col :span="6">
          <el-input placeholder="请输入内容" @keyup.enter.native="searchGoods" v-model="input" clearable>
            <el-button slot="append" icon="el-icon-search" @click.enter="searchGoods"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 主题表格部分 -->
      <div>
        <el-table
          :data="goodsList"
          header-align="center"
          size="mini"
          border
          stripe
          style="width: 100%"
        >
          <el-table-column type="index"></el-table-column>
          <el-table-column prop="goods_name" label="商品名称"></el-table-column>
          <el-table-column prop="goods_price" label="商品价格（元）" width="110"></el-table-column>
          <el-table-column prop="goods_weight" label="商品重量" width="70"></el-table-column>
          <el-table-column prop="goods_number" label="商品数量" width="70"></el-table-column>
          <el-table-column prop="upd_time" label="创建时间" width="140">
            <template v-slot="scope">{{scope.row.upd_time|dataFormat}}</template>
          </el-table-column>
          <el-table-column prop="address" label="操作" width="130">
            <template v-slot="scope">
              <el-button type="primary" size="mini" icon="el-icon-edit"></el-button>
              <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeById(scope.row.goods_id)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="params.pagenum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="params.pageize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      input: "",
      // 商品列表
      goodsList: [],
      //   商品总数
      total: 0,
      // 当前页码
      pagenum: 0,
      //   获取商品列表的参数
      params: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
    };
  },
  created() {
    this.getGoodsLit();
  },
  methods: {
    //   获取商品的列表数据
    async getGoodsLit() {
      const { data: res } = await this.$http.get("goods", {
        params: this.params,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取数据失败！");
      }
      this.goodsList = res.data.goods;
      this.total = res.data.total;
      this.pagenum = res.data.pagenum;
    },
    // 分页
    handleSizeChange(newsize) {
      this.params.pagesize = newsize;
      this.getGoodsLit();
    },
    handleCurrentChange(currentpage) {
      this.params.pagenum = currentpage;
      this.getGoodsLit();
    },
    // 搜索商品
    searchGoods() {
        if(!this.input) {
            this.params.query = '';
            this.getGoodsLit()
            return this.$message.info('请输入搜索的内容')
            
        }
        this.params.query = this.input;
        this.getGoodsLit();
    },
    // 前往商品添加页面
    goAddPage() {
        this.$router.push("/goods/add")
    },
      // 通过Id删除商品
    async removeById (id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该商品, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除！')
      }
      const { data: res } = await this.$http.delete('goods/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除商品失败！')
      }
      this.$message.success('删除商品成功！')
      this.getGoodsLit()
    },
  },
};
</script>

<style>
</style>