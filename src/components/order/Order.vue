<template>
  <div>
    <!--面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-input placeholder="请输入内容" v-model="search" style="width:350px" clearable>
        <el-button icon="el-icon-search" slot="append" @click="searchOrderList"></el-button>
      </el-input>
      <!-- 表单 -->
      <el-table :data="orderList" stripe border style="width: 100%" size="small">
        <el-table-column type="index" prop="#"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格"></el-table-column>
        <el-table-column prop="pay_status" label="是否付款">
          <template slot-scope="scope">
            <div>
              <el-tag type="danger" v-if="scope.row.pay_status">未付款</el-tag>
              <el-tag type="success" v-else>未付款</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="order_pay" label="支付方式">
          <template slot-scope="scope">
            <div>
              <el-tag v-if="scope.row.order_pay == 1">支付宝</el-tag>
              <el-tag type="success" v-if="scope.row.order_pay == 2">微信</el-tag>
              <el-tag type="info" v-if="scope.row.order_pay == 3">银行卡</el-tag>
              <el-tag type="danger" v-if="scope.row.order_pay == 0">未付款</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"></el-table-column>
        <el-table-column prop="create_time" label="下单时间">
          <template slot-scope="scope">{{scope.row.create_time|dataFormat}}</template>
        </el-table-column>
        <el-table-column prop="address" label="操作">
          <template>
            <div>
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="small"
                @click="dialogFormVisible=true"
                circle
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-s-promotion"
                size="small"
                circle
                @click="showProgressDialog"
              ></el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[5, 10, 15, 20]"
        :current-page="pagenum"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 修改地址 -->
    <el-dialog title="收货地址" width="45%" :visible.sync="dialogFormVisible">
      <el-form :model="addressForm" :rules="addFormRules">
        <el-form-item label="省市区/县" label-width="120px" prop="address1">
          <el-cascader v-model="selectCity" :options="cityData" :props="{ expandTrigger: 'hover' }"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" label-width="120px" prop="address2">
          <el-input v-model="addressForm.address2" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 物流时间线 -->
    <el-dialog title="物流进度" width="45%" :visible.sync="timedialogFormVisible">
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
          :timestamp="activity.ftime"
        >{{activity.context}}</el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from "./citydata";
export default {
  data() {
    return {
      // 搜索框的文字
      search: "",
      //   订单列表数据
      orderList: [],
      //   获取订单列表参数
      getOrderListParams: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      //   分页参数
      total: 0,
      pagenum: 0,
      //   修改地址的表单
      dialogFormVisible: false,
      addressForm: {
        address1: "",
        address2: "",
      },
      addFormRules: {
        address1: [
          { required: true, message: "轻松选择省市区/县地址", trigger: "blur" },
        ],
        address2: [
          { required: true, message: "请填入详细的地址", trigger: "blur" },
        ],
      },
      cityData,
      selectCity: [],
      //   时间线
      timedialogFormVisible: false,
      activities: [],
    };
  },
  created() {
    this.getOrderList();
  },
  methods: {
    //   获取订单参数列表
    async getOrderList() {
      const { data: res } = await this.$http.get("orders", {
        params: this.getOrderListParams,
      });
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("订单列表获取失败");
      }
      this.total = res.data.total;
      this.pagenum = this.total.pagenum;
      this.orderList = res.data.goods;
    },
    // 分页操作
    handleSizeChange(val) {
      this.getOrderListParams.pagesize = val;
      this.getOrderList();
    },
    handleCurrentChange(val) {
      this.getOrderListParams.pagenum = val;
      this.getOrderList();
    },
    // 搜索订单
    searchOrderList() {
      this.$message("订单搜索功能未完善");
      if (this.search.trim.length === 0) {
        return;
      }
      this.getOrderListParams.query = this.search;
      this.getOrderList();
    },
    // 获取物流消息
    async showProgressDialog() {
      const { data: res } = await this.$http.get("/kuaidi/1106975712662");
      if (res.meta.status !== 200) {
        return this.$message.error("获取物流进度失败!");
      }
      this.activities = res.data;
      console.log(res.data)
      this.timedialogFormVisible = true;
    },
  },
};
</script>

<style>
</style>