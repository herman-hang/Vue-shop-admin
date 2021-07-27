<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>我的桌面</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="card-body">
            <div class="icon order"><i class="el-icon-sold-out"></i></div>
            <div class="data">
              <p>
                订单量:
                <span>9,9999</span>
              </p>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="card-body">
            <div class="icon market"><i class="el-icon-goods"></i></div>
            <div class="data">
              <p>
                销售额:
                <span>9,9999</span>
              </p>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="card-body">
            <div class="icon user"><i class="iconfont icon-user"></i></div>
            <div class="data">
              <p>
                用户量:
                <span>9,9999</span>
              </p>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="card-body">
            <div class="icon goods"><i class="el-icon-document"></i></div>
            <div class="data">
              <p>
                商品量:
                <span>9,9999</span>
              </p>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <div class="panel">
        <div class="panel-body">
          <p class="welcome">欢迎您使用电商管理系统v1.0</p>
          <p>登录次数：99次</p>
          <p>上次登录IP：222.35.131.79.1 上次登录时间：2014-6-14 11:19:55</p>
          <el-table :data="paramsList" style="width: 100%" stripe border show-header>
            <el-table-column prop="key" label="服务器信息"></el-table-column>
            <el-table-column prop="value" label="配置参数"></el-table-column>
          </el-table>
        </div>
      </div>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      paramsList: [
        { key: '服务器计算机名', value: 'http://127.0.0.1/' },
        { key: '服务器IP地址', value: '192.168.1.1' },
        { key: '服务器域名', value: 'www.yundaohang.net' },
        { key: '服务器端口 ', value: '80' },
        { key: '服务器IIS版本', value: 'Microsoft-IIS/6.0' },
        { key: '服务器脚本超时时间', value: '30000秒' },
        { key: '服务器的语言种类', value: 'PHP' },
        { key: '服务器当前时间', value: '2021-07-27 22:20:12' },
        { key: '服务器IE版本', value: '6.0000' },
        { key: '服务器上次启动到现在已运行', value: '7210分钟' },
        { key: 'CPU 总数', value: '4' },
        { key: 'CPU 类型', value: 'x86 Family 6 Model 42 Stepping 1, GenuineIntel' },
        { key: '虚拟内存', value: '52480M' },
        { key: '当前程序占用内存 ', value: '3.29M' },
        { key: '当前Session数量 ', value: '5' },
        { key: '当前SessionID', value: 'gznhpwmp34004345jz2q3l45' },
        { key: '当前系统用户名', value: 'NETWORK SERVICE' }
      ]
    };
  }
};
</script>

<style lang="less" scoped>
.grid-content {
  width: 400px;
  height: 110px;
  background-color: #fff;
  box-shadow: 0 0 10px #ddd;
}
.card-body {
  display: flex;
  padding: 15px;
}

.icon {
  color: #fff;
  font-size: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 80px;
  position: relative;
  border-radius: 3px;
}
.market {
  background-color: #177dff;
}
.order {
  background-color: #36a3f7;
}
.user {
  background-color: #35cd3a;
}
.goods {
  background-color: #716aca;
}
.data {
  width: 70%;
  margin: 0 10px 0 10px;
  font-size: 20px;
  color: #999;
  p > span {
    font-size: 30px;
    height: 40px;
    color: #575962;
    font-weight: bold;
  }
}
.panel {
  margin-top: 20px;
  background-color: #fff;
  border: solid 1px transparent;
  width: 100%;
}
.panel-body {
  padding: 15px;
  .welcome {
    font-size: 20px;
    color: #333;
    margin-bottom: 10px;
    font-weight: 550;
  }
  p {
    font-size: 12px;
    color: #333;
  }
}
.icon-user{
  font-size: 39px;
}
</style>
