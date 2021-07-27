<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input placeholder="请输入搜索内容" v-model="queryInfo.query" clearable @clear="getOrderList">
            <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="orderList" border style="width: 100%">
        <el-table-column prop="order_id" label="ID" width="90px"></el-table-column>
        <el-table-column prop="order_number" label="订单号"></el-table-column>
        <el-table-column prop="order_price" label="价格(元)"></el-table-column>
        <el-table-column label="是否付款">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.order_pay === '1'">支付宝</el-tag>
            <el-tag type="success" v-else-if="scope.row.order_pay === '2'">微信</el-tag>
            <el-tag type="success" v-else-if="scope.row.order_pay === '3'">银行卡</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"></el-table-column>
        <el-table-column label="下单时间">
          <template slot-scope="scope">
            {{ scope.row.create_time | date }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editOrderDialog(scope.row)">编辑</el-button>
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

    <!-- 编辑对话框 -->
    <el-dialog title="编辑订单" :visible.sync="editOrderDialogVisible" width="50%">
      <el-form :model="editOrderForm" :rules="editOrdeRules" ref="editOrdeRef" label-width="100px">
        <el-form-item label="订单号" prop="order_number"><el-input v-model="editOrderForm.order_number" :disabled="true"></el-input></el-form-item>
        <el-form-item label="是否发货" prop="is_send">
          <el-radio v-model="editOrderForm.is_send" label="0">否</el-radio>
          <el-radio v-model="editOrderForm.is_send" label="1">是</el-radio>
        </el-form-item>
        <el-form-item label="是否付款" prop="order_pay">
          <el-radio v-model="editOrderForm.order_pay" label="0">未支付</el-radio>
          <el-radio v-model="editOrderForm.order_pay" label="1">支付宝</el-radio>
          <el-radio v-model="editOrderForm.order_pay" label="2">微信</el-radio>
          <el-radio v-model="editOrderForm.order_pay" label="3">银行卡</el-radio>
        </el-form-item>
        <el-form-item label="订单价格" prop="order_price"><el-input type="number" v-model="editOrderForm.order_price"></el-input></el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editOrderDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="subEditOrder">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //条件初始化
      queryInfo: {
        //查询关键词
        query: '',
        //当前页码
        pagenum: 1,
        //每页显示条数
        pagesize: 2
      },
      //总数据条数
      total: 0,
      //列表初始化
      orderList: [],
      //隐藏订单编辑对话框
      editOrderDialogVisible: false,
      //编辑表单
      editOrderForm: {
        //是否发货
        is_send: '0',
        //是否付款
        order_pay: '0',
        //订单号
        order_number: '',
        //订单价格
        order_price: 0
      },
      //编辑表单验证规则
      editOrdeRules: {
        order_number: [{ required: true, message: '订单号不能为空', trigger: 'blur' }],
        is_send: [{ required: true, message: '发货状态不能为空', trigger: 'blur' }],
        order_pay: [{ required: true, message: '付款状态不能为空', trigger: 'blur' }],
        order_price: [{ required: true, message: '订单价格不能为空', trigger: 'blur' }]
      }
    };
  },
  created() {
    this.getOrderList();
  },
  methods: {
    //请求获取订单列表信息
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', { params: this.queryInfo });
      if (res.meta.status !== 200) return this.$message.error('获取订单信息失败！');
      //赋值列表
      this.orderList = res.data.goods;
      //总数据条数
      this.total = res.data.total;
    },
    //每页显示多少条
    handleSizeChange(val) {
      this.queryInfo.pagesize = val;
      this.getOrderList();
    },
    //跳转到第几页
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val;
      this.getOrderList();
    },
    //编辑订单
    async editOrderDialog(info) {
      const { data: res } = await this.$http.get(`orders/${info.order_id}`);
      if (res.meta.status !== 200) return this.$message.error('获取订单详细信息失败！');
      this.editOrderForm = res.data;
      this.editOrderForm.is_send = this.editOrderForm.is_send === '否' ? '0' : '1';
      //显示订单详情对话框
      this.editOrderDialogVisible = true;
    },
    //修改订单提叫
    subEditOrder() {
      this.$refs.editOrdeRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.put(`orders/${this.editOrderForm.order_id}`, this.editOrderForm);
        if (res.meta.status !== 201) return this.$message.error('更新失败！');
        this.$message.success('更新成功！');
        this.getOrderList();
        //隐藏编辑订单对话框
        this.editOrderDialogVisible = false;
      });
    }
  }
};
</script>

<style lang="less" scoped></style>
