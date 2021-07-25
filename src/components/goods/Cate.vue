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
      <el-row>
        <el-col><el-button type="primary" @click="addCate">添加分类</el-button></el-col>
      </el-row>

      <!-- 表格 -->
      <zk-table :data="cateList" :columns="columns" :selection-type="false" :expand-type="false" border show-index>
        <!-- 是否有效作用域插槽 -->
        <template slot="isOk" slot-scope="scope">
          <i style="color:springgreen" class="el-icon-success" v-if="scope.row.cat_deleted === false"></i>
          <i style="color: red;" class="el-icon-error" v-else></i>
        </template>
        <!-- 排序作用域插槽 -->
        <template slot="level" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作作用域插槽 -->
        <template slot="opt" slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="editCate(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
        </template>
      </zk-table>
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

    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close="addCateDialogClose">
      <el-form :model="addCateForm" :rules="addCateRules" ref="addCateRef" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name"><el-input v-model="addCateForm.cat_name"></el-input></el-form-item>
        <el-form-item label="父分类">
          <el-cascader v-model="parentArray" :options="parentCateList" :props="parentCateProps" @change="parentCateChange" clearable></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="subAddCateForm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑分类对话框 -->
    <el-dialog title="编辑分类" :visible.sync="editCateDialogVisible" width="50%" @close="editCateClose">
      <el-form :model="editCateForm" :rules="editCateRules" ref="editCateRef" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name"><el-input v-model="editCateForm.cat_name"></el-input></el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="subEditCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //初始化列表
      cateList: [],
      //查询参数
      queryInfo: {
        //1，2，3 分别表示显示一层二层三层分类列表
        type: 3,
        //当前页码值
        pagenum: 1,
        //每页显示多少条数据
        pagesize: 2
      },
      //总数据条数
      total: 0,
      //表格显示的列
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
          align: 'center',
          headerAlign: 'center'
        },
        {
          label: '是否有效',
          prop: 'cat_deleted',
          align: 'center',
          headerAlign: 'center',
          type: 'template',
          template: 'isOk'
        },
        {
          label: '排序',
          align: 'center',
          headerAlign: 'center',
          type: 'template',
          template: 'level'
        },
        {
          label: '操作',
          align: 'center',
          headerAlign: 'center',
          type: 'template',
          template: 'opt'
        }
      ],
      //初始化父分类列表
      parentCateList: [],
      //选中的父分类
      parentArray: [],
      //展现父分类列表的对象绑定
      parentCateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      //添加分类表单
      addCateForm: {
        //父ID,默认为0
        cat_pid: 0,
        //分类名称
        cat_name: '',
        //分类级别,默认为0
        cat_level: 0
      },
      //添加分类表单验证
      addCateRules: {
        cat_name: [{ required: true, message: '请输入活动名称', trigger: 'blur' }]
      },
      //隐藏添加分类对话框
      addCateDialogVisible: false,
      //隐藏编辑分类对话框
      editCateDialogVisible: false,
      //编辑分类Form表单
      editCateForm: {},
      //编辑分类form表单验证
      editCateRules: {
        cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      }
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    //获取商品分类信息请求
    async getCateList() {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo });
      if (res.meta.status !== 200) return this.$message.error('获取商品分类失败！');
      this.cateList = res.data.result;
      this.total = res.data.total;
    },
    //每页显示多少条信息监听事件
    handleSizeChange(val) {
      this.queryInfo.pagesize = val;
      this.getCateList();
    },
    //当前页监听事件
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val;
      this.getCateList();
    },
    //添加分类
    addCate() {
      this.getParentCateList();
      //展现对话框
      this.addCateDialogVisible = true;
    },
    //关闭添加分类对话框
    addCateDialogClose() {
      //重置选中父分类数组
      this.parentArray = [];
      this.addCateForm.cat_pid = 0;
      this.addCateForm.cat_level = 0;
      //重置表单
      this.$refs.addCateRef.resetFields();
    },
    //获取父分类数据
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } });
      if (res.meta.status !== 200) return this.$message.error('获取父分类数据失败!');
      this.parentCateList = res.data;
    },
    //选中父ID事件监听
    parentCateChange() {
      //如果this.parentArray.length大于0证明已选中父分类,反之为空
      if (this.parentArray.length > 0) {
        this.addCateForm.cat_pid = this.parentArray[this.parentArray.length - 1];
        this.addCateForm.cat_level = this.parentArray.length;
      } else {
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
      }
    },
    //提交分类表单数据
    subAddCateForm() {
      this.$refs.addCateRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post('categories', this.addCateForm);
        if (res.meta.status !== 201) return this.$message.error('添加失败!');
        this.$message.success('添加成功!');
        //刷新列表
        this.getCateList();
        //隐藏对话框
        this.addCateDialogVisible = false;
      });
    },
    //编辑分类数据渲染
    async editCate(info) {
      const { data: res } = await this.$http.get(`categories/${info.cat_id}`);
      if (res.meta.status !== 200) return this.$message.error('获取数据失败！');
      this.editCateForm = res.data;
      //显示编辑分类对话框
      this.editCateDialogVisible = true;
    },
    //提交编辑分类form表单
    subEditCate() {
      this.$refs.editCateRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.put(`categories/${this.editCateForm.cat_id}`, { cat_name: this.editCateForm.cat_name });
        if (res.meta.status !== 200) return this.$message.error('更新失败！');
        this.$message.success('更新成功！');
        //刷新列表
        this.getCateList();
        //隐藏编辑分类对话框
        this.editCateDialogVisible = false;
      });
    },
    //关闭编辑对话框
    editCateClose() {
      //重置表单
      this.$refs.editCateRef.resetFields();
    }
  }
};
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
