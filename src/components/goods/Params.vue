<template>
  <div>
    <!--面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!-- 提示 -->
      <el-alert title="注意：只允许为第三级分类设置相关的参数！" type="warning" left show-icon></el-alert>
      <!-- 选择商品区域 -->
      <el-row class="selectGoods">
        <el-col>
          <span>
            选择商品分类：
            <el-cascader
              v-model="selectCateList"
              :props="catePros"
              :options="cateList"
              @change="cateChange"
              clearable
            ></el-cascader>
          </span>
        </el-col>
      </el-row>
      <el-tabs v-model="activename" @tab-click="tableHandleClick">
        <!-- 动态参数 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            :disabled="isBtnDisabled"
            @click="addDialogFormVisible = true"
            size="small"
          >添加属性</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border style="width: 100%" size="small">
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-tag
                  :key="tag"
                  v-for="(tag,i) in props.row.attr_vals"
                  closable
                  @close="handleClose(i,props.row)"
                  :disable-transitions="false"
                >{{tag}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="props.row.inputVisible"
                  v-model="props.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(props.row)"
                  @blur="handleInputConfirm(props.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(props.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="small" @click="showEditDialog(scope.row.attr_id)">修改</el-button>
                <el-button type="warning" size="small" @click="removeParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 静态参数 -->
        <el-tab-pane label="静态属性" name="only" size="small">
          <el-button
            type="primary"
            :disabled="isBtnDisabled"
            @click="addDialogFormVisible = true"
            size="small"
          >添加属性</el-button>
          <!-- 静态参数 -->
          <el-table :data="onlyTableData" border style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-tag
                  :key="tag"
                  v-for="(tag,i) in props.row.attr_vals"
                  closable
                  @close="handleClose(i,props.row)"
                  :disable-transitions="false"
                >{{tag}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="props.row.inputVisible"
                  v-model="props.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(props.row)"
                  @blur="handleInputConfirm(props.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(props.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="small" @click="showEditDialog(scope.row.attr_id)">修改</el-button>
                <el-button type="warning" size="small" @click="removeParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加属性的弹出框 -->
    <el-dialog :title="'添加'+ getTextTitle" width="35%" :visible.sync="addDialogFormVisible">
      <el-form :model="addForm" :rules="addFormRules" ref="addForm">
        <el-form-item :label="getTextTitle" prop="attr_name" :label-width="formLabelWidth">
          <el-input v-model="addForm.attr_name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改属性的弹出框 -->
    <el-dialog :title="'修改'+ getTextTitle" width="35%" :visible.sync="editDialogFormVisible">
      <el-form :model="editForm" :rules="addFormRules" ref="editFromRef">
        <el-form-item :label="getTextTitle" prop="attr_name" :label-width="formLabelWidth">
          <el-input v-model="editForm.attr_name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 当前选中的标签页
      activename: "many",
      //  可供选择的商品列表
      cateList: [],
      // 选中的商品
      selectCateList: "",
      catePros: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      // 添加属性模态框
      addDialogFormVisible: false,
      addForm: {
        attr_name: "",
      },
      addFormRules: {
        attr_name: [
          { required: true, message: "请输入参数的名称", trigger: "blur" },
        ],
      },
      formLabelWidth: "80px",
      //   修改属性的模态框
      editDialogFormVisible: false,
      editForm: {},
      // 动态参数表格数据
      manyTableData: [],
      //   静态参数表格数据
      onlyTableData: [],
    };
  },
  created() {
    this.getCateList();
    this.getParamsData();
  },
  computed: {
    //   按钮是否禁用
    isBtnDisabled() {
      if (this.selectCateList.length === 3) {
        return false;
      }
      return true;
    },
    //  计算属性  获取商品的id
    getCateId() {
      if (this.selectCateList.length === 3) {
        return this.selectCateList[2];
      }
      return null;
    },
    // 获取tab页的标题
    getTextTitle() {
      if (this.activename === "many") {
        return "动态属性";
      }
      return "静态属性";
    },
  },
  methods: {
    //   获取选择商品分类
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200)
        return this.$message.error("获取商品列表失败");
      this.cateList = res.data;
    },
    // 获取商品的参数
    async getParamsData() {
      if (this.selectCateList.length !== 3) {
        this.selectCateList = [];
        this.manyTableData = [];
        this.onlyTableData = [];
        return;
      }
      const { data: res } = await this.$http.get(
        `categories/${this.getCateId}/attributes`,
        {
          params: { sel: this.activename },
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("获取参数列表失败");
      }
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
        // 控制文本框的显示与隐藏
        item.inputVisible = false;
        // 文本框的输入值
        item.inputValue = "";
      });
      if (this.activename === "many") {
        this.manyTableData = res.data;
      } else {
        this.onlyTableData = res.data;
      }
    },
    // 商品选择后的函数
    cateChange() {
      this.getParamsData();
      if (this.selectCateList.length !== 3) {
        this.selectCateList = [];
        return this.$message.info("请选择一个三级的商品");
      }
    },
    // 标签页点击
    tableHandleClick() {
      this.getParamsData();
    },
    // 添加属性
    addParams() {
      this.$refs.addForm.validate(async (valid) => {
        if (!valid) return this.$message.error("请输入正确的属性");
        const { data: res } = await this.$http.post(
          `categories/${this.getCateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activename,
          }
        );
        if (res.meta.status !== 201) {
          return this.$message.error("添加参数失败！");
        }
        this.addForm.attr_name = "";
        this.$message.success("添加参数成功！");
        this.addDialogFormVisible = false;
        this.getParamsData();
      });
    },
    // 修改属性弹出框
    async showEditDialog(attrId) {
      const { data: res } = await this.$http.get(
        `categories/${this.getCateId}/attributes/${attrId}`,
        {
          params: { attr_sel: this.activeTabsName },
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("获取分类失败！");
      }

      this.editForm = res.data;
      this.editDialogFormVisible = true;
    },
    // 修改属性
    editParams() {
      this.$refs.editFromRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          `categories/${this.getCateId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activename,
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("修改参数失败！");
        }
        this.$message.success("修改参数成功！");
        this.getParamsData();
        this.editDialogFormVisible = false;
      });
    },
    // 删除属性
    async removeParams(attrId) {
      const confirm = await this.$confirm(
        "你确定要删除这一个属性吗？",
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirm !== "confirm") {
        return this.$message.info("已取消删除！");
      }
      const { data: res } = await this.$http.delete(
        `categories/${this.getCateId}/attributes/${attrId}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("删除参数失败！");
      }
      this.$message.success("删除参数成功！");
      this.getParamsData();
    },
    // 点击按钮显示输入框
    showInput(row) {
      row.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // input框失去焦点的时候
    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue == "";
        row.inputVisible == false;
        return;
      }
      row.attr_vals.push(row.inputValue);
      this.saveAttrVals(row);
      row.inputValue = "";
      row.inputVisible = false;
    },
    // 将对attr_vals（Tag） 的操作 保存到数据库
    async saveAttrVals(row) {
      const { data: res } = await this.$http.put(
        `categories/${this.getCateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(" "),
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("修改参数项失败！");
      }
      this.$message.success("修改参数项成功！");
    },
    // 点击删除标签的时候
    handleClose(i, row) {
      row.attr_vals.splice(i, 1);
      this.saveAttrVals(row);
    },
  },
};
</script>

<style lang="less" scoped>
.selectGoods {
  margin-top: 15px;
}
.el-tag {
  margin: 10px;
}
.input-new-tag {
  width: 90px;
  margin: 10px;
}
</style>