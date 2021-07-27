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
          <el-input placeholder="请输入搜索内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4"><el-button type="primary" @click="addGoods">添加商品</el-button></el-col>
      </el-row>

      <!-- 表格 -->
      <el-table :data="goodsList" border style="width: 100%">
        <el-table-column prop="goods_id" label="ID" width="90px"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="90px"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="90px"></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="200px">
          <template slot-scope="scope">
            {{ scope.row.add_time | date }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editGoods(scope.row)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteGoods(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 10, 100]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
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
      },
      total: 0
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    //获取商品所有数据
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', { params: this.queryInfo });
      if (res.meta.status !== 200) return this.$message.error('获取列表数据失败！');
      this.goodsList = res.data.goods;
      this.total = res.data.total;
      console.log(this.goodsList);
    },
    //每页显示多少条信息监听事件
    handleSizeChange(val) {
      this.queryInfo.pagesize = val;
      this.getGoodsList();
    },
    //当前页监听事件
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val;
      this.getGoodsList();
    },
    //根据ID删除指定商品
    deleteGoods(info) {
      this.$confirm('是否继续删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`goods/${info.goods_id}`);
          if (res.meta.status !== 200) {
            return this.$message({
              type: 'error',
              message: '删除失败!'
            });
          }
          //刷新列表
          this.getGoodsList();
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    //添加商品
    addGoods() {
      this.$router.push('/goods/add');
    },
    //编辑商品
    editGoods(info) {
      console.log(info);
      this.$router.push({ path: '/goods/edit', query: { goods_id: info.goods_id } });
    }
  }
};
</script>

<style lang="less" scoped></style>
