<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 温馨提示 -->
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" :closable="false"></el-alert>
      <!-- 选择分类 -->
      <el-row class="cate">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader v-model="cateValue" :options="cateList" :props="cateProps" @change="cateHandleChange" expand-trigger="hover"></el-cascader>
        </el-col>
      </el-row>

      <!-- Tabs标签页 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addParamsDialogVisible = true">添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyParamsList" border style="width: 100%">
            <!-- 展开列 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循坏tag标签 -->
                <el-tag @close="handleClose(i, scope.row)" closable v-for="(item, i) in scope.row.attr_vals" :key="i">{{ item }}</el-tag>
                <!-- tag标签输入文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <!-- 添加tag的按钮 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="attr_id" label="ID"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="editParams(scope.row)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteParams(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addParamsDialogVisible = true">添加属性</el-button>
          <!-- 静态属性表格 -->
          <el-table :data="onlyParamsList" border style="width: 100%">
            <!-- 展开列 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循坏tag标签 -->
                <el-tag @close="handleClose(i, scope.row)" closable v-for="(item, i) in scope.row.attr_vals" :key="i">{{ item }}</el-tag>
                <!-- tag标签输入文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <!-- 添加tag的按钮 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="attr_id" label="ID"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="editParams(scope.row)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteParams(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数对话框 -->
    <el-dialog :title="'添加' + titleText" :visible.sync="addParamsDialogVisible" width="50%" @close="addParamsClose">
      <el-form :model="addParamsForm" :rules="addParamsRules" ref="addParamsRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name"><el-input v-model="addParamsForm.attr_name"></el-input></el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑参数对话框 -->
    <el-dialog :title="'编辑' + titleText" :visible.sync="editParamsDialogVisible" width="50%" @close="editParamsClose">
      <el-form :model="editParamsForm" :rules="editParamsRules" ref="editParamsRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name"><el-input v-model="editParamsForm.attr_name"></el-input></el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="subEditParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //存放选中的分类ID
      cateValue: [],
      //分类列表
      cateList: [],
      //级联选择框配置对象
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      //tabs标签页选中的pane
      activeName: 'many',
      //动态参数列表数据
      manyParamsList: [],
      //静态属性列表数据
      onlyParamsList: [],
      //隐藏添加参数的对话框
      addParamsDialogVisible: false,
      //添加参数表单
      addParamsForm: {},
      addParamsRules: {
        attr_name: [{ required: true, message: '请输入参数名称', trigger: 'blur' }]
      },
      // 隐藏编辑参数对话框
      editParamsDialogVisible: false,
      // 编辑参数form表单
      editParamsForm: {},
      //编辑参数表单验证规则
      editParamsRules: {
        attr_name: [{ required: true, message: '请输入参数名称', trigger: 'blur' }]
      },
      //隐藏tag文本输入框
      inputVisible: false,
      //tag文本输入框初始化
      inputValue: ''
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    //获取分类列表数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories');
      if (res.meta.status !== 200) return this.$message.error('获取分类数据失败！');
      this.cateList = res.data;
    },
    //分类选中监听
    cateHandleChange() {
      this.getParamsData();
    },
    //监听tabs点击事件
    handleClick() {
      this.getParamsData();
    },
    //获取参数方法
    async getParamsData() {
      //判断选择的分类是否为三级，只有三级的分类才能被选中
      if (this.cateValue.length !== 3) {
        this.cateValue = [];
        this.manyParamsList = [];
        this.onlyParamsList = [];
        return false;
      }
      //发起获取参数/属性请求
      const { data: res } = await this.$http.get(`categories/${this.getCateId}/attributes`, { params: { sel: this.activeName } });
      if (res.meta.status !== 200) return this.$message.error('获取数据失败！');
      //将整个字符串根据“ ”切割成数组
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : [];
        //控制tag文本框的显示与隐藏
        item.inputVisible = false;
        item.inputValue = '';
      });
      if (this.activeName === 'many') {
        this.manyParamsList = res.data;
      } else {
        this.onlyParamsList = res.data;
      }
    },
    //添加参数
    addParams() {
      //请求
      this.$refs.addParamsRef.validate(async valid => {
        const { data: res } = await this.$http.post(`categories/${this.getCateId}/attributes`, {
          attr_name: this.addParamsForm.attr_name,
          attr_sel: this.activeName
        });
        if (res.meta.status !== 201) return this.$message.error('添加失败！');
        this.$message.success('添加成功！');
        //刷新列表
        this.getParamsData();
        //隐藏添加参数对话框
        this.addParamsDialogVisible = false;
      });
    },
    //关闭添加参数表单监听
    addParamsClose() {
      //重置表单
      this.$refs.addParamsRef.resetFields();
    },
    //展现编辑参数表单
    async editParams(info) {
      const { data: res } = await this.$http.get(`categories/${this.getCateId}/attributes/${info.attr_id}`, { params: { attr_sel: this.activeName } });
      if (res.meta.status !== 200) return this.$message.error('获取数据失败！');
      this.editParamsForm = res.data;
      console.log(this.editParamsForm);
      this.getParamsData();
      //展现编辑对话框
      this.editParamsDialogVisible = true;
    },
    //编辑参数提交表单
    subEditParams() {
      this.$refs.editParamsRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.put(`categories/${this.getCateId}/attributes/${this.editParamsForm.attr_id}`, {
          attr_name: this.editParamsForm.attr_name,
          attr_sel: this.activeName
        });
        if (res.meta.status !== 200) return this.$message.error('更新失败！');
        this.$message.success('更新成功！');
        //刷新列表
        this.getParamsData();
        //关闭对话框
        this.editParamsDialogVisible = false;
      });
    },
    //关闭编辑参数对话框
    editParamsClose() {
      this.$refs.editParamsRef.resetFields();
    },
    //删除参数
    deleteParams(info) {
      this.$confirm('是否继续删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`categories/${this.getCateId}/attributes/${info.attr_id}`);
          if (res.meta.status !== 200) {
            return this.$message({
              type: 'error',
              message: '删除失败!'
            });
          }

          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getParamsData();
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    //tag标签中按下回车键监听事件
    async handleInputConfirm(row) {
      //判断文本输入框的value值是否为空
      if (row.inputValue.trim().length === 0) {
        row.inputValue = '';
        row.inputVisible = false;
        return false;
      }
      //追加新增的tag标签到原来的数组中
      row.attr_vals.push(row.inputValue.trim());
      //完成操作后，清空inputValue的值
      row.inputValue = '';
      //隐藏输入文本框
      row.inputVisible = false;
      //发起请求
      this.saveAttrVals(row);
    },
    async saveAttrVals(row) {
      //发起修改数据请求
      const { data: res } = await this.$http.put(`categories/${this.getCateId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: this.activeName,
        attr_vals: row.attr_vals.join(' ')
      });
      if (res.meta.status !== 200) return this.$message.error('修改失败！');
      this.$message.success('修改成功！');
    },
    //删除tag的标签
    handleClose(i, row) {
      //根据索引删除数组中的指定项
      row.attr_vals.splice(i, 1);
      //发起请求
      this.saveAttrVals(row);
    },
    //点击按钮展现tag文本输入框
    showInput(row) {
      //显示文本框
      row.inputVisible = true;
      //让文本框自动获得焦点
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    }
  },
  computed: {
    //计算是否选中三级分类
    isBtnDisabled() {
      if (this.cateValue.length !== 3) {
        return true;
      }
      return false;
    },
    //计算三级分类的ID
    getCateId() {
      if (this.cateValue.length === 3) {
        return this.cateValue[2];
      }
      return null;
    },
    //计算添加参数对话框标题
    titleText() {
      if (this.activeName === 'many') {
        return '动态参数';
      }
      return '静态属性';
    }
  }
};
</script>

<style lang="less" scoped>
.cate {
  margin-top: 15px;
}
.el-cascader {
  width: 20%;
}
.el-tag {
  margin: 10px;
}
.input-new-tag {
  width: 120px;
}
</style>
