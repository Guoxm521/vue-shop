<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 主体部分  卡片视图 -->
    <el-card class="box-card">
      <el-row :gutter="40">
        <el-col :span="6">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="userList" border style="width: 100%">
        <el-table-column type="index" label="id" width="180"></el-table-column>
        <el-table-column prop="username" label="姓名" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="mobile" label="电话" width="180"></el-table-column>
        <el-table-column prop="role_name" label="角色" width="180"></el-table-column>
        <el-table-column label="状态" width="180">
          <template v-slot="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChanged(scope.row)"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button
              type="primary"
              size="small"
              :round="true"
              circle
              icon="el-icon-edit"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              size="small"
              :round="true"
              circle
              icon="el-icon-delete"
              @click="removeUserById(scope.row.id)"
            ></el-button>
            <el-button
              type="warning"
              size="small"
              :round="true"
              circle
              icon="el-icon-setting"
              @click="showSetRole(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="params.pagenum"
        :page-sizes="[2,5,10,15]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加弹窗 -->
    <el-dialog title="用户添加" :visible.sync="addDialogVisible" width="40%">
      <el-form ref="addUserFormRef" :model="addUserForm" :rules="addUserFormRules">
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
          <el-input v-model="addUserForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
          <el-input v-model="addUserForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="addUserForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" :label-width="formLabelWidth" prop="mobile">
          <el-input v-model="addUserForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改用户弹窗 -->
    <el-dialog title="用户信息修改" :visible.sync="editDialogVisible" width="40%">
      <el-form ref="editUserFormRef" :model="editUserForm" :rules="editUserFormRules">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="editUserForm.username" disabled autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="editUserForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" :label-width="formLabelWidth" prop="mobile">
          <el-input v-model="editUserForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 角色分配弹窗 -->
    <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible" width="35%">
      <el-form>
        <el-form-item label="当前用户" :label-width="formLabelWidth">
          <el-input v-model="userInfo.username" disabled autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="当前角色" :label-width="formLabelWidth">
          <el-input v-model="userInfo.role_name" disabled autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="分配角色" :label-width="formLabelWidth">
          <el-select v-model="selectRoleId" default-first-option placeholder="请选择角色标签">
            <el-option
              v-for="item in rolesLsit"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 自定义邮箱规则
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^\w+@\w+(\.\w+)+$/;
      if (regEmail.test(value)) {
        // 合法邮箱
        return callback();
      }
      callback(new Error("请输入合法邮箱"));
    };
    // 自定义手机规则
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^1[34578]\d{9}$/;
      if (regMobile.test(value)) {
        return callback();
      }
      callback(new Error("请输入合法的用户号码"));
    };
    return {
      // 用户列表
      userList: [],
      total: 0,
      //   查询参数
      params: {
        query: "",
        pagenum: 1,
        pagesize: 2,
      },
      //   状态开关
      value1: true,
      value2: false,
      // 用户添加的弹窗
      addDialogVisible: false,
      formLabelWidth: "80px",
      addUserForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      // 用户添加表单的验证规则
      addUserFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "用户名长度3-10", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 6, message: "密码长度3-6", trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      //   角色分配弹框
      setRoleDialogVisible: false,
      userInfo: "",
      rolesLsit: "",
      selectRoleId: "",
      //   用户信息修改
      editDialogVisible: false,
      editUserFormRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      editUserForm: {
        username: "",
        email: "",
        mobile: "",
      },
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    //   获取用户的数据
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.params,
      });
      this.userList = res.data.users;
      this.total = res.data.total;
    },
    // 页码修改
    handleSizeChange(newSize) {
      this.params.pagesize = newSize;
      this.getUserList();
    },
    handleCurrentChange(currenNum) {
      this.params.pagenum = currenNum;
      this.getUserList();
    },
    // 用户信息添加
    addUser() {
      this.$refs.addUserFormRef.validate(async (valid) => {
        if (!valid) {
          this.$message({
            message: "添加失败",
            type: "error",
          });
        } else {
          const backRes = await this.$http.post("users", this.addUserForm);
          console.log(backRes);
          this.addDialogVisible = false;
          this.getUserList();
          this.$message({
            message: "添加成功",
            type: "success",
          });
        }
      });
    },
    //   用户状态的修改
    async userStateChanged(userInfo) {
      const { data: res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      );
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state;
        return this.$message.error("更新用户状态失败");
      }
      this.$message.success("更新用户状态成功！");
    },
    // 根据id删除用户
    async removeUserById(userId) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((error) => error);
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      }
      const { data: res } = await this.$http.delete("users/" + userId);
      if (res.meta.status !== 200) return this.$message.error("删除用户失败！");
      this.$message.success("删除用户成功！");
      this.getUserList();
    },
    // 角色分配框弹出
    async showSetRole(role) {
      this.userInfo = role;
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("获取列表失败！");
      }
      this.rolesLsit = res.data;
      this.setRoleDialogVisible = true;
    },
    // 角色分配存储
    async saveRoleInfo() {
      if (!this.selectRoleId) {
        return this.$message.error("请选择要分配的角色");
      }
      const { data: res } = await this.$http.put(
        `users/${this.userInfo.id}/role`,
        {
          rid: this.selectRoleId,
        }
      );
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("更新用户角色失败！");
      }
      this.$message.success("更新角色成功！");
      this.getUserList();
      this.setRoleDialogVisible = false;
    },
    // 用户信息编辑弹窗
    async showEditDialog(userId) {
      const { data: res } = await this.$http.get("users/" + userId);
      if (res.meta.status !== 200) {
        return this.$message.error("查询用户信息失败！");
      }
      this.editUserForm = res.data;
      this.editDialogVisible = true;
    },
    editUser() {
      this.$refs.editUserFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error("Error Submit");
        }
        const { data: res } = await this.$http.put(
          "users/" + this.editUserForm.id,
          {
            email: this.editUserForm.email,
            mobile: this.editUserForm.mobile,
          }
        );
        if (res.meta.status !== 200) {
          this.$message.error("更新用户信息失败！");
        }
        this.editDialogVisible = false
        this.$message.success('更新用户信息成功！')
        this.getUserList()
      });
    },
  },
};
</script>

<style lang="less" scoped>
</style>