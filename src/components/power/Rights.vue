<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 列表 -->
      <el-table :data="rightList" border stripe style="width: 100%">
        <el-table-column prop="id" label="ID"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //权限列表
      rightList: []
    };
  },
  created() {
    this.getRightList();
  },
  methods: {
    //请求权限列表信息
    async getRightList() {
      const { data: res } = await this.$http.get('rights/list');
      if (res.meta.status !== 200) return this.$message.error('获取列表失败！');
      this.rightList = res.data;
    }
  }
};
</script>

<style lang="less" scoped></style>
