<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 警告提示 -->
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
      <!-- 步骤条 -->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- tabs标签页 -->
      <el-form :model="addGoodsForm" :rules="addGoodsRules" ref="addGoodsRef" label-width="100px" label-position="top">
        <el-tabs v-model="activeIndex" :tab-position="'left'" :before-leave="beforeTabLeave" @tab-click="tabClicked">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name"><el-input v-model="addGoodsForm.goods_name"></el-input></el-form-item>
            <el-form-item label="商品价格" prop="goods_price"><el-input type="number" v-model="addGoodsForm.goods_price"></el-input></el-form-item>
            <el-form-item label="商品数量" prop="goods_number"><el-input type="number" v-model="addGoodsForm.goods_number"></el-input></el-form-item>
            <el-form-item label="商品重量" prop="goods_weight"><el-input type="number" v-model="addGoodsForm.goods_weight"></el-input></el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader expand-trigger="hover" :options="cateList" v-model="addGoodsForm.goods_cat" :props="cateProps" @change="handleChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item v-for="(item, i) in manyListData" :label="item.attr_name" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals"><el-checkbox border :label="cb" v-for="(cb, i) in item.attr_vals" :key="i"></el-checkbox></el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyListData" :key="item.attr_id"><el-input v-model="item.attr_vals"></el-input></el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload :on-success="handleSuccess" :action="updateUrl" :headers="headers" :on-preview="handlePreview" :on-remove="handleRemove" list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor ref="goodsRef" v-model="addGoodsForm.goods_introduce" />
            <!-- 添加商品的按钮 -->
            <el-button type="primary" class="goods-btn" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="imgDialogVisible" width="50%"><img :src="tempPath" alt="" class="img" /></el-dialog>
  </div>
</template>
<script>
import _ from 'lodash';
export default {
  data() {
    return {
      //步骤条默认为第一步
      activeIndex: '0',
      //初始化表单
      addGoodsForm: {
        //商品名称
        goods_name: '',
        //商品价格
        goods_price: 1,
        //商品数量
        goods_number: 1,
        //商品重量
        goods_weight: 1,
        //商品分类
        goods_cat: [],
        //存放图片上传成功的数组
        pics: [],
        //商品的详细介绍
        goods_introduce: '',
        //存放动态参数和静态属性的数组
        attrs: []
      },
      //验证表单规则
      addGoodsRules: {
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }],
        goods_cat: [{ required: true, message: '请选择商品分类', trigger: 'blur' }]
      },
      //商品分类列表
      cateList: [],
      //绑定数据项
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      //动态参数列表
      manyListData: [],
      //静态属性列表
      onlyListData: [],
      //定义图片上传URL
      updateUrl: 'http://127.0.0.1:8888/api/private/v1/upload',
      //设置上传请求头
      headers: {
        Authorization: window.sessionStorage.getItem('token')
      },
      //隐藏图片预览对话框
      imgDialogVisible: false,
      //保存图片预览的临时地址
      tempPath: ''
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    //请求分类列表数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories');
      if (res.meta.status !== 200) return this.$message.error('获取商品分类数据失败！');
      this.cateList = res.data;
    },
    //选择分类触发绑定事件
    handleChange() {
      if (this.addGoodsForm.goods_cat.length !== 3) {
        this.addGoodsForm.goods_cat = [];
      }
    },
    //tabs标签页切换钩子
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addGoodsForm.goods_cat.length !== 3) {
        this.$message.error('请选择商品分类！');
        return false;
      }
    },
    //tab标签页切换监听事件
    async tabClicked() {
      if (this.activeIndex === '1') {
        //发起获取参数列表请求
        const { data: res } = await this.$http.get(`categories/${this.getCateId}/attributes`, { params: { sel: 'many' } });
        if (res.meta.status !== 200) return this.$message.error('获取参数列表数据失败！');
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(',');
        });
        this.manyListData = res.data;
      } else if (this.activeIndex === '2') {
        //发起获取参数列表请求
        const { data: res } = await this.$http.get(`categories/${this.getCateId}/attributes`, { params: { sel: 'only' } });
        if (res.meta.status !== 200) return this.$message.error('获取参数列表数据失败！');

        this.onlyListData = res.data;
      }
    },
    //预览已上传图片钩子
    handlePreview(file) {
      this.tempPath = file.response.data.url;
      //展现图片预览对话框
      this.imgDialogVisible = true;
    },
    //删除已上传图片
    handleRemove(file) {
      const filePath = file.response.data.tmp_path;
      //获取删除图片在数组的索引值
      const i = this.addGoodsForm.pics.findIndex(x => x.pic === filePath);
      //删除图片
      this.addGoodsForm.pics.splice(i, 1);
    },
    //图片上传成功的钩子
    handleSuccess(response) {
      //拼接对象
      const imagObj = { pic: response.data.tmp_path };
      this.addGoodsForm.pics.push(imagObj);
    },
    //提交商品
    addGoods() {
      this.$refs.addGoodsRef.validate(async valid => {
        if (!valid) return;
        //处理动态参数
        this.manyListData.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals.join(',') };
          this.addGoodsForm.attrs.push(newInfo);
        });
        //处理静态属性
        this.onlyListData.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals };
          this.addGoodsForm.attrs.push(newInfo);
        });
        //深拷贝
        const form = _.cloneDeep(this.addGoodsForm);
        form.goods_cat = form.goods_cat.join(',');
        const { data: res } = await this.$http.post('goods', form);
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg);
        this.$message.success('添加成功！');
        //跳转到商品列表
        this.$router.push('/goods');
      });
    }
  },
  computed: {
    getCateId() {
      if (this.addGoodsForm.goods_cat.length === 3) {
        return this.addGoodsForm.goods_cat[2];
      }
      return null;
    }
  }
};
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.img {
  width: 100%;
}
.goods-btn {
  margin: 10px;
}
</style>
