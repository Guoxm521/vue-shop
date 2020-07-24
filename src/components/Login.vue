<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区 -->
      <div class="avatar_box">
        <img src="./../assets/img/avatar.jpeg" alt />
      </div>
      <!-- 登录表单 -->
      <div>
        <el-form
          :label-position="labelPosition"
          ref="loginForm"
          :rules="loginFormRules"
          label-width="80px"
          :model="loginForm"
        >
          <el-form-item label="用户名" prop="username">
            <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              type="password"
              prefix-icon="iconfont icon-3702mima"
              v-model="loginForm.password"
            ></el-input>
          </el-form-item>
          <el-form-item class="btns">
            <el-button type="primary" @click="submitForm('loginForm')">登录</el-button>
            <el-button type="info" @click="restForm('loginForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      labelPosition: "top",
      loginForm: {
        username: "admin",
        password: "123456",
      },
      // 表单验证
      loginFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 5, message: "长度应该在3到5之间", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入用户密码", trigger: "blur" },
          { min: 3, max: 6, message: "长度应该在3到6之间", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    submitForm(loginForm) {
      this.$refs[loginForm].validate(async (valid) => {
        if (valid) {
          const { data: res } = await this.$http.post("login", this.loginForm);
          if(res.meta.status !== 200) {
            this.$message({
              message:'登录失败',
              type:'warning'
            })
          }else {
            this.$message({
              message:'登录成功',
              type:'success'
            });
            window.sessionStorage.setItem('token',res.data.token);
            this.$router.push('/home');
          }
        } else {
          console.log("error submit");
        }
      });
    },
    restForm(loginForm) {
      this.$refs[loginForm].resetFields();
    },
  },
};
</script>

<style lang="less" scoped>
.login_container {
  height: 100%;
  background-color: pink;
  position: relative;
  .login_box {
    width: 450px;
    height: 360px;
    background-color: #ffffff;
    border-radius: 5px;
    padding: 40px;
    box-sizing: border-box;
    box-shadow: 0 0 10px #999999;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .btns {
      display: flex;
      justify-content: center;
    }
    .el-button--info {
      margin-left: 50px;
    }
    // 头像
    .avatar_box {
      position: absolute;
      top: 0;
      left: 50%;
      width: 150px;
      height: 150px;
      border-radius: 75px;
      overflow: hidden;
      transform: translate(-50%, -70%);
      z-index: 20;
      border: 10px solid #ffffff;
      box-sizing: border-box;
      img {
        display: block;
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>