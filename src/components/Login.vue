<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区 -->
      <div class="avatar_box">
          <img src="./../assets/img/avatar.jpeg" alt="">
      </div>
      <!-- 登录表单 -->
      <div>
        <el-form :label-position="labelPosition" label-width="80px" :model="formLabelAlign">
          <el-form-item label="用户名">
            <el-input prefix-icon="iconfont icon-user" v-model="formLabelAlign.name"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input prefix-icon="iconfont icon-3702mima"  v-model="formLabelAlign.region"></el-input>
          </el-form-item>
          <el-form-item class="btns">
            <el-button type="primary" >登录</el-button>
            <el-button type="info">重置</el-button>
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
      formLabelAlign: {
        name: "",
        region: "",
        type: "",
      },
    };
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
    background-color:#ffffff;
    border-radius: 5px;
    padding: 40px;
    box-sizing: border-box;
    box-shadow: 0 0 10px #999999;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
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
        transform: translate(-50%,-70%);
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