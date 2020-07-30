<template>
  <el-container>
    <el-header>
      <div>
        <img src="./../assets/logo.png" alt />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="danger" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="collapse ? '64px':'200px'">
        <div class="toggle-button" @click="toggleButton">|||</div>
        <el-menu
          :default-active="activePath"
          class="el-menu-vertical-demo"
          unique-opened
          router
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          :collapse="collapse"
          :collapse-transition="false"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="item.id+' '" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class="menuListIcon[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/'+subitem.path"
              v-for="subitem in item.children"
              :key="subitem.id"
              @click="saveNavState('/' + subitem.path)"
            >{{subitem.authName}}</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <!-- 子元素的出口 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menuList: "",
      menuListIcon: {
        "125": "iconfont icon-user",
        "103": "iconfont icon-tijikongjian",
        "101": "iconfont icon-shangpin",
        "102": "iconfont icon-danju",
        "145": "iconfont icon-baobiao",
      },
      activePath: "",
      collapse:true
    };
  },
  created() {
    this.getMenuList();
  },
  methods: {
    //   退出事件
    logout() {
      window.sessionStorage.clear();
      this.$message({
        message: "退出成功",
        duration: 2000,
      });
      this.$router.push("/login");
    },
    // 请求左侧菜单的数据
    async getMenuList() {
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.menuList = res.data;
    },
    // 保存连接的激活地址
    saveNavState(activePath) {
      window.sessionStorage.setItem("activePath", activePath);
    },
    // 左侧导航栏点击缩放事件
    toggleButton() {
      this.collapse = !this.collapse;
      console.log(this.collapse);
    }
  },
};
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
}
.el-header {
  background-color: #373f41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  div {
    display: flex;
    align-items: center;
    img {
      height: 40px;
    }
    span {
      font-size: 24px;
      font-weight: 700;
      margin-left: 15px;
      color: #ffffff;
    }
  }
  .el-button {
    float: right;
    height: 40px;
  }
}
.el-aside {
  background-color: #545c64;
  .el-menu {
    border-right: none;
  }
  .iconfont {
    padding-right: 10px;
  }
  .toggle-button {
    text-align: center;
    color: #ffffff;
    background-color: #4A5064;
    font-size: 10px;
    line-height: 24px;
    letter-spacing: .2em;
    cursor: pointer;
  }
}
.el-main {
  background-color: #eaedf1;
}
//影藏中间的main区域的局部滚动条
.el-main::-webkit-scrollbar {
  display: none;
}
</style>