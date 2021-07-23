<template>
  <el-container class="container">
    <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '64px' : '200px'">
      <div class="title">
        <i class="el-icon-pie-chart"></i>
        <a class="nav-logo" href="/">
          <span>{{ title }}</span>
        </a>
      </div>
      <!-- 侧边菜单栏 -->
      <el-menu background-color="#2b4b6b" text-color="#fff" active-text-color="#409eff" :collapse="isCollapse" :collapse-transition="false" router :default-active="navPath">
        <!-- 一级菜单 -->
        <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
          <template slot="title">
            <i :class="iconsObj[item.id]"></i>
            <span>{{ item.authName }}</span>
          </template>
          <!-- 二级菜单 -->
          <el-menu-item-group>
            <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="subNavPath('/' + subItem.path)">
              {{ subItem.authName }}
            </el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-container>
      <!-- 头部 -->
      <el-header>
        <!-- 菜单折叠按钮 -->
        <div class="dislpayArrow">
          <a href="javascript:void(0);" @click="subCollapse"><i :class="isCollapse ? 'el-icon-arrow-right' : 'el-icon-arrow-left'"></i></a>
        </div>
        <div>
          <el-button type="danger" @click="logout" icon="el-icon-switch-button">退出</el-button>
        </div>
      </el-header>
      <!-- 主体 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
      <!-- 底部 -->
      <el-footer><p>Copyright ©2021 电商管理系统 v1.0 All Rights Reserved.</p></el-footer>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      //系统名称
      title: '电商管理系统',
      //菜单列表
      menulist: [],
      //菜单列表icon图标
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      //默认不折叠菜单列表
      isCollapse: false,
      //点击菜单路径
      navPath: ''
    };
  },
  created() {
    this.getMenuList();
  },
  methods: {
    //退出登录监听事件
    logout() {
      //销毁token
      window.sessionStorage.clear();
      this.$router.push('/login');
      this.$message.success('退出成功！');
    },
    //获取菜单列表
    async getMenuList() {
      const { data: res } = await this.$http.get('menus');
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      console.log(res);
      //赋值给菜单列表
      this.menulist = res.data;
    },
    //折叠菜单操作
    subCollapse() {
      this.isCollapse = !this.isCollapse;
      if (this.title === '') {
        this.title = '电商管理系统';
      } else {
        this.title = '';
      }
    },
    //点击菜单触发
    subNavPath(path) {
      this.navPath = path;
    }
  }
};
</script>

<style lang="less" scoped>
.container {
  height: 100%;
}
.el-aside {
  background-color: #2b4b6b;
  .el-menu {
    border-right: none;
  }
}
.el-header {
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0px;
  .dislpayArrow {
    font-size: 20px;
    width: 64px;
    height: 64px;
    a {
      display: flex;
      justify-content: center;
      align-items: center;
      text-decoration: none;
      width: 100%;
      height: 100%;
    }
    a:hover {
      background-color: #eee;
      color: #333;
    }
  }
}
.el-main {
  background-color: #f0f2f5;
}
.el-footer {
  border-top: 1px solid #e8e8e8;
  background-color: #f0f2f5;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #999;
  font-size: 12px;
  font-family: tahoma, Arial;
}
.title {
  color: #fff;
  background-color: #2b4b7b;
  font-size: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 64px;
  i {
    font-size: 30px;
    font-weight: 600;
    margin-right: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    width: 40px;
  }
}
.nav-logo {
  font-weight: 600;
  line-height: 64px;
  color: #fff;
  text-decoration: none;
}
a.logo:hover {
  text-decoration: none;
}
.iconfont {
  margin: 5px;
}
.el-menu-item [class^='el-icon-'] {
  margin: 5px;
  width: 16px;
  font-size: 17px;
}
</style>
