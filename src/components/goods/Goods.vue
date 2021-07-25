<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索 -->
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input placeholder="请输入搜索内容" v-model="queryInfo.query" clearable><el-button slot="append" icon="el-icon-search"></el-button></el-input>
        </el-col>
        <el-col :span="4"><el-button type="primary" @click="addGoodsDialog = true">添加商品</el-button></el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //列表初始化
      goodsList: [],
      //查询参数
      queryInfo: {
        //搜索关键字
        query: '',
        //当前页码
        pagenum: 1,
        //每页显示多少条数据
        pagesize: 2
      }
    };
  },
  created() {},
  methods: {}
};
</script>

<style lang="less" scoped></style>
