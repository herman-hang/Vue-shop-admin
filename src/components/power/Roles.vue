<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col><el-button type="primary" @click="addRole">添加角色</el-button></el-col>
      </el-row>
      <!-- 列表 -->
      <el-table :data="rolesList" style="width: 100%" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']" v-for="(item, i1) in scope.row.children" :key="item.id">
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeTagThree(scope.row, item.id)">{{ item.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二三级权限 -->
              <el-col :span="19">
                <!-- 渲染二级权限 -->
                <el-row :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']" v-for="(item2, i2) in item.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeTagThree(scope.row, item2.id)">{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <!-- 渲染三级权限 -->
                    <el-tag v-for="(item3, i3) in item2.children" :key="item3.id" type="warning" closable @close="removeTagThree(scope.row, item3.id)">{{ item3.authName }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="ID" prop="id"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="editRoles(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteRole(scope.row)">删除</el-button>
            <el-button type="warning" size="mini" icon="el-icon-setting" @click="rightsTree(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限 -->
    <el-dialog title="分配权限" :visible.sync="rightsVisible" width="50%" @close="rightsCloseDialog">
      <el-tree
        :data="rightsTreeList"
        show-checkbox
        node-key="id"
        :default-expanded-keys="checkedRightsArray"
        :default-checked-keys="checkedRightsArray"
        :props="rightsProps"
        ref="rightsRef"
      ></el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button @click="rightsVisible = false">取 消</el-button>
        <el-button type="primary" @click="subRights">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加角色 -->
    <el-dialog title="添加角色" :visible.sync="addRoleDialogVisible" width="50%" @close="addRoleClose">
      <el-form :model="addRoleForm" :rules="addRoleRules" ref="addRoleRef" label-width="100px">
        <el-form-item label="角色名称" prop="roleName"><el-input v-model="addRoleForm.roleName"></el-input></el-form-item>
        <el-form-item label="角色描述" prop="roleDesc"><el-input v-model="addRoleForm.roleDesc"></el-input></el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="subAddRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色 -->
    <el-dialog title="编辑角色" :visible.sync="editRoleDialogVisible" width="50%" @close="editRoleClose">
      <el-form :model="editRoleForm" :rules="editRoleRules" ref="editRoleRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="角色名称" prop="roleName"><el-input v-model="editRoleForm.roleName"></el-input></el-form-item>
        <el-form-item label="角色描述" prop="roleDesc"><el-input type="textarea" v-model="editRoleForm.roleDesc"></el-input></el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="subEditRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //列表初始化
      rolesList: [],
      //隐藏分配权限对话框
      rightsVisible: false,
      //分配权限树形列表
      rightsTreeList: [],
      //分配权限树形控件属性绑定
      rightsProps: {
        children: 'children',
        label: 'authName'
      },
      //默认权限节点选中数组
      checkedRightsArray: [],
      //存放等待分配权限的角色ID
      roleId: '',
      //隐藏添加角色对话框
      addRoleDialogVisible: false,
      //添加角色表单
      addRoleForm: {},
      //添加角色验证表单规则
      addRoleRules: {
        roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }]
      },
      //编辑角色表单
      editRoleForm: {},
      //隐藏编辑角色对话框
      editRoleDialogVisible: false,
      //编辑角色表单验证
      editRoleRules: {
        roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }]
      }
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    async getRolesList() {
      //发起获取列表请求
      const { data: res } = await this.$http.get('roles');
      if (res.meta.status !== 200) return this.$message.error('获取列表失败！');
      this.rolesList = res.data;
    },
    //根据ID删除三级权限
    removeTagThree(roles, threeId) {
      this.$confirm('是否继续删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          //发起删除请求
          const { data: res } = await this.$http.delete(`roles/${roles.id}/rights/${threeId}`);
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
          //更新角色权限
          roles.children = res.data;
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    //分配权限对话框触发
    async rightsTree(role) {
      this.roleId = role.id;
      //发起请求
      const { data: res } = await this.$http.get('rights/tree');
      if (res.meta.status !== 200) return this.$message.error('获取权限数据失败!');
      this.rightsTreeList = res.data;
      //调用三级权限获取递归函数
      this.getTreeRights(role, this.checkedRightsArray);

      //展现分配权限对话框
      this.rightsVisible = true;
    },
    //递归获取三级权限ID
    getTreeRights(node, arr) {
      if (!node.children) {
        //将ID存入arr数组中
        return arr.push(node.id);
      }
      //继续递归
      node.children.forEach(item => this.getTreeRights(item, arr));
    },
    //权限关闭对话框
    rightsCloseDialog() {
      //选中的节点权限清零，防止再次打开选中出现BUG
      this.checkedRightsArray = [];
    },
    //分配权限提交
    async subRights() {
      //获取三级选中权限节点
      const checkedArr = [...this.$refs.rightsRef.getCheckedKeys(), ...this.$refs.rightsRef.getHalfCheckedKeys()];
      const checkedString = checkedArr.join(',');
      //发起请求
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: checkedString });
      if (res.meta.status !== 200) return this.$message.error('更新失败！');
      this.$message.success('更新成功！');
      //隐藏对话框
      this.rightsVisible = false;
      //刷新列表
      this.getRolesList();
    },
    //添加角色
    addRole() {
      //显示添加角色对话框
      this.addRoleDialogVisible = true;
    },
    //角色添加提交请求
    subAddRole() {
      this.$refs.addRoleRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post('roles', { roleName: this.addRoleForm.roleName, roleDesc: this.addRoleForm.roleDesc });
        if (res.meta.status !== 201) return this.$message.error('添加失败！');
        this.$message.success('添加成功！');
        //刷新列表
        this.getRolesList();
        //关闭对话框
        this.addRoleDialogVisible = false;
      });
      //隐藏添加角色对话框
      this.addRoleDialogVisible = true;
    },
    //关闭添加角色表单对话框
    addRoleClose() {
      //重置表单
      this.$refs.addRoleRef.resetFields();
    },
    //删除角色操作
    deleteRole(info) {
      this.$confirm(' 是否继续删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          // 发起删除请求
          const { data: res } = await this.$http.delete(`roles/${info.id}`);
          if (res.meta.status !== 200) {
            return this.$message({
              type: 'error',
              message: '删除失败!'
            });
          }
          //刷新列表
          this.getRolesList();
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
    //编辑角色数据渲染
    async editRoles(info) {
      const { data: res } = await this.$http.get(`roles/${info.id}`);
      if (res.meta.status !== 200) return this.$message.error('获取数据失败！');
      this.editRoleForm = res.data;
      //展现编辑角色对话框
      this.editRoleDialogVisible = true;
    },
    //提交编辑分类表单数据
    subEditRole() {
      console.log(this.editRoleForm);
      this.$refs.editRoleRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.put(`roles/${this.editRoleForm.roleId}`, this.editRoleForm);
        if (res.meta.status !== 200) return this.$message.error('更新失败！');
        this.$message.success('更新成功！');
        //更新列表
        this.getRolesList();
        //隐藏编辑角色对话框
        this.editRoleDialogVisible = false;
      });
    },
    //关闭角色对话框
    editRoleClose() {
      //重置表单
      this.$refs.editRoleRef.resetFields();
    }
  }
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
