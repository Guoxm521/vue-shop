<template>
  <div>
    <!--面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <el-button type="primary" @click="showAddDialog">添加分类</el-button>
      <div>
        <tree-table
          class="treetable"
          :data="cateList"
          :columns="columns"
          :show-index="true"
          :selection-type="false"
          :expand-type="false"
          index-text="#"
          border
        >
          <!-- 是否有效 -->
          <template slot="isOk" slot-scope="scope">
            <i
              class="el-icon-success"
              style="color: lightgreen"
              v-if="scope.row.cat_deleted === false"
            ></i>
          </template>
          <!-- 排序 -->
          <template slot="order" slot-scope="scope">
            <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
            <el-tag size="mini" type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
            <el-tag size="mini" type="warning" v-else>三级</el-tag>
          </template>
          <!-- 操作 -->
          <template slot="opt" slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEdit(scope.row.cat_id)"
            >编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeCate(scope.row.cat_id)"
            >删除</el-button>
          </template>
        </tree-table>
      </div>
      <!--分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="this.queryInfo.pagenum"
        :page-sizes="[2, 4, 5, 10]"
        :page-size="this.queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="this.total"
      ></el-pagination>
    </el-card>

    <!-- 编辑页面的对话框 -->
    <el-dialog title="类别修改" :visible.sync="editDialogFormVisible" width="30%">
      <el-form
        :model="editForm"
        :rules="editFormRules"
        label-position="left"
        ref="editFormRef"
        label-width="80px"
      >
        <el-form-item :model="editForm" prop="cat_name" label="分类名称">
          <el-input v-model="editForm.cat_name" @keyup.enter.native="editCate" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加类别页面的对话框 -->
    <el-dialog title="类别添加" :visible.sync="addDialogFormVisible" width="40%">
      <el-form :model="addForm" ref="addFormRef" :rules="addFormRules">
        <el-form-item label="分类名称" label-width="80px" prop="cat_name">
          <el-input v-model="addForm.cat_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类名称" label-width="80px">
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            @change="parentCateChanged"
            :props="cascaderProps"
            clearable
            filterable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCat">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 分类列表
      cateList: [],
      // 总数
      total: 0,
      // 自定义展开列
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          type: "template",
          template: "isOk",
        },
        {
          label: "排序",
          type: "template",
          template: "order",
        },
        {
          label: "操作",
          type: "template",
          template: "opt",
        },
      ],
      // 分类查询参数
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },

      // 编辑页面的对话框
      editDialogFormVisible: false,
      formLabelWidth: "120px",
      editFormRules: {
        cat_name: [
          {
            required: true,
            message: "请输入类别名称",
            trigger: "blur",
          },
          {
            min: 2,
            max: 10,
            message: "长度在2-10个字符",
            trigger: "blur",
          },
        ],
      },
      editForm: "",

      // 添加页面的对话框
      addDialogFormVisible: false,
      addForm: {
        cat_pid: 0,
        cat_name: "",
        cat_level: "",
      },
      addFormRules: {
        cat_name: [
          {
            required: true,
            message: "请输入类别名称",
            trigger: "blur",
          },
          {
            min: 2,
            max: 10,
            message: "长度在2-10个字符",
            trigger: "blur",
          },
        ],
      },
      // 选中的数据
      selectedKeys: [],
      // 供选择的数据源
      parentCateList: [],
      visibleChange:false,
      // 指定级联选择器的配置对象
      cascaderProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
        checkStrictly: true,
      },
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("请求分类列表数据失败！");
      }
      this.cateList = res.data.result;
      this.total = res.data.total;
    },
    // 编辑信息
    async showEdit(id) {
      const { data: res } = await this.$http.get("categories/" + id);
      this.editForm = res.data;
      this.editDialogFormVisible = true;
    },
    // 信息保存
    editCate() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error("分类名称错误");
        const { data: res } = await this.$http.put(
          "categories/" + this.editForm.cat_id,
          {
            cat_name: this.editForm.cat_name,
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("类别修改失败");
        }
        this.$message.success("类别修改成功");
        this.getCateList();
        this.editDialogFormVisible = false;
      });
    },
    // 删除信息
    async removeCate(id) {
      const confimRes = await this.$confirm(
        "您确定永久删除该分类吗？",
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((error) => error);
      if (confimRes !== "confirm") {
        return this.$message.info("您已经取消删除");
      }
      const { data: res } = await this.$http.delete("categories/" + id);
      if (res.meta.status !== 200) {
        return this.$message.info("删除失败");
      }
      this.$message.success("删除成功");
      this.getCateList();
    },
    // 添加信息
    async showAddDialog() {
      const { data: res } = await this.$http.get("categories",{
        params:{type:2}
      });
      if (res.meta.status !== 200)
        return this.$message.error("分类数据请求失败");
      this.parentCateList = res.data;
      this.addDialogFormVisible = true;
    },
    // 添加分类 选项选择发生变化时
    parentCateChanged() { 
      if (this.selectedKeys.length > 0) {
        this.addForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1];
        this.addForm.cat_level = this.selectedKeys.length;
      } else {
        this.addForm.cat_id = 0;
        this.addForm.cat_level = 0;
      }
      
    },
    addCat() {
      this.parentCateChanged();
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post("categories", this.addForm);
        if (res.meta.status !== 201) {
          return this.$message.error("商品分类创建失败");
        }
        this.$message.success("商品分类添加成功");
        this.getCateList();
        this.addDialogFormVisible = false;
      });
    },
    // 分页
    handleSizeChange(val) {
      this.queryInfo.pagesize = val;
      this.getCateList();
    },
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val;
      this.getCateList();
    },
  },
  watch: {
    selectedKeys() {
       if (this.$refs.addFormRef) {
        this.$refs.addFormRef.dropDownVisible = false; //监听值发生变化就关闭它
      }
    }
  },
};
</script>

<style lang="less" scoped>
.treetable {
  margin-top: 15px;
}
</style>