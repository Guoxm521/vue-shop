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
      <el-steps :active="activeIndex - 0" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品照片"></el-step>
        <el-step title="商品内容"></el-step>
      </el-steps>
      <!-- 将步骤条包含在表单里面 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          tab-position="left"
          v-model="activeIndex"
          :before-leave="beforeTabLeave"
          @tab-click="tabClick"
        >
          <el-tab-pane label="基本信息">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input type="number" v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input type="number" v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input type="number" v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="cascaderProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数">
            <el-form-item v-for="item in manyTableData" :key="item.attr_id" :label="item.attr_name">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cb" v-for="(cb, i) in item.attr_vals" :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性">
            <el-form-item
              v-for="(item,i) in onlyTableData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-input v-model="item.attr_vals[0]" :key="i"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品照片">
            <el-upload
              class="upload-demo"
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :file-list="fileList"
              :on-success="handleSuccess"
              list-type="picture"
              :headers="headerObj"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容">
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button type="primary" @click="addGoods" class="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览框 -->
    <el-dialog title="图片预览" :visible.sync="imgDialogVisible" width="30%">
      <img :src="previewImgSrc" class="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 步骤条默认激活 与左侧Tab联动
      activeIndex: "0",
      // 添加商品表单对象
      addForm: {
        goods_name: "",
        goods_price: "",
        goods_weight: "",
        goods_number: "",
        // 商品所属分类数组
        goods_cat: [],
        // 图片的数组
        pics: [],
        // 商品详情描述
        goods_introduce: "",
        attrs: [],
      },
      //添加表单对象的验证规则
      addFormRules: {
        goods_name: [
          { required: true, message: "请输入正确的商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" },
        ],
      },
      // 可供选择的商品列表
      cateList: [],
      cascaderProps: {
        expandTrigger: "hover",
        label: "cat_name",
        value: "cat_id",
        children: "children",
      },
      // 商品参数
      manyTableData: "",
      // 商品属性
      onlyTableData: "",
      // 图片上传路径
      uploadURL: "http://127.0.0.1:8888/api/private/v1/upload",
      // 图片上传携带的请求头
      headerObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      // 商品图片
      fileList: [],
      // 图片预览
      imgDialogVisible: false,
      previewImgSrc: "",
    };
  },
  created() {
    this.getCateList();
  },
  computed: {
    getCateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2];
      }
      return null;
    },
  },
  methods: {
    // 获取可供选择商品列表
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品列表失败");
      }
      this.cateList = res.data;
    },
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [];
      }
    },
    // 点击标签页跳转的判断
    beforeTabLeave(activeName, odlActiveName) {
      if (odlActiveName === "0" && this.addForm.goods_cat.length !== 3) {
        this.$message.error("请先选择商品分类");
        return false;
      }
    },
    // 页签点击切换的时候触发的事件
    async tabClick() {
      if (this.activeIndex === "1") {
        const { data: res } = await this.$http.get(
          `categories/${this.getCateId}/attributes`,
          {
            params: { sel: "many" },
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("获取动态参数列表失败");
        }
        res.data.forEach((item) => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ");
        });
        this.manyTableData = res.data;
      } else if (this.activeIndex === "2") {
        const { data: res } = await this.$http.get(
          `categories/${this.getCateId}/attributes`,
          {
            params: { sel: "only" },
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("获取动态参数列表失败");
        }
        res.data.forEach((item) => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ");
        });
        this.onlyTableData = res.data;
      }
    },
    // 图片预览事件
    handlePreview(file) {
      this.imgDialogVisible = true;
      this.previewImgSrc = file.response.data.url;
    },
    // 移除图片事件
    handleRemove(file) {
      const filePath = file.response.data.tmp_path;
      const index = this.addForm.pics.findIndex(
        (item) => item.pic === filePath
      );
      this.addForm.pics.splice(index, 1);
    },
    handleSuccess(response) {
      const picInfo = { pic: response.data.tmp_path };
      this.addForm.pics.push(picInfo);
    },
    // 表单添加
    addGoods() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error("请填写表单的必填项");

        const form = JSON.parse(JSON.stringify(this.addForm));
        form.goods_cat = form.goods_cat.join(",");
        this.manyTableData.forEach((item) => {
          const newsInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(" "),
          };
          this.addForm.attrs.push(newsInfo);
        });
        this.onlyTableData.forEach((item) => {
          const newsInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(" "),
          };
          this.addForm.attrs.push(newsInfo);
        });
        form.attrs = this.addForm.attrs;
        const { data: res } = await this.$http.post("goods", form);
        if (res.meta.status !== 201)
          return this.$message.error("添加商品失败！");
        this.$message.success("添加商品成功!");
        this.$router.push("/goods");
      });
    },
  },
};
</script>

<style lang="less" scoped>
.previewImg {
  width: 100%;
}

.addGoods {
  margin-top: 15px;
}
</style>