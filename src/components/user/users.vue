<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索 -->
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input placeholder="请输入搜索内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4"><el-button type="primary" @click="addUserDialog = true">添加用户</el-button></el-col>
      </el-row>

      <!-- 列表 -->
      <el-table :data="userList" border stripe style="width: 100%">
        <el-table-column prop="id" label="ID" width="180"></el-table-column>
        <el-table-column prop="username" label="用户名" width="180"></el-table-column>
        <el-table-column prop="mobile" label="手机" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="create_time" label="创建时间">
          <template slot-scope="scope">
            {{ scope.row.create_time | date }}
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStatusChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-tooltip :enterable="false" effect="dark" content="编辑" placement="top">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="editUserDialog(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip :enterable="false" effect="dark" content="删除" placement="top">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip :enterable="false" effect="dark" content="分配权限" placement="top">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分配角色对话框 -->
      <el-dialog title="分配角色" :visible.sync="setRoleVisible" width="50%" @close="setRoleClose">
        <div>
          <p>当前用户：{{ userInfo.username }}</p>
          <p>当前角色：{{ userInfo.role_name }}</p>
          <p>
            分配角色：
            <el-select v-model="selectRole" placeholder="请选择"><el-option v-for="item in roleList" :key="item.id" :label="item.roleName" :value="item.id"></el-option></el-select>
          </p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRoleVisible = false">取 消</el-button>
          <el-button type="primary" @click="subUserRole">确 定</el-button>
        </span>
      </el-dialog>

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

    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addUserDialog" width="50%" @close="addUserClosed">
      <!-- 主体信息 -->
      <el-form ref="addUserRefs" :model="addUserForm" :rules="addUserRules" label-width="70px">
        <el-form-item label="用户名" prop="username"><el-input v-model="addUserForm.username" placeholder="请输入用户名"></el-input></el-form-item>
        <el-form-item label="密码" prop="password"><el-input v-model="addUserForm.password" placeholder="请输入密码"></el-input></el-form-item>
        <el-form-item label="邮箱" prop="email"><el-input v-model="addUserForm.email" placeholder="请输入邮箱"></el-input></el-form-item>
        <el-form-item label="手机" prop="mobile"><el-input v-model="addUserForm.mobile" placeholder="请输入手机号码"></el-input></el-form-item>
      </el-form>
      <!-- 底部信息 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUserDialog = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑用户对话框 -->
    <el-dialog title="编辑用户" :visible.sync="editUserVisible" width="50%" @close="editUserClosed">
      <!-- 主体信息 -->
      <el-form ref="editUserRefs" :model="editUserForm" :rules="editUserRules" label-width="70px">
        <el-form-item label="用户名"><el-input v-model="editUserForm.username" placeholder="请输入用户名" disabled></el-input></el-form-item>
        <el-form-item label="邮箱" prop="email"><el-input v-model="editUserForm.email" placeholder="请输入邮箱"></el-input></el-form-item>
        <el-form-item label="手机" prop="mobile"><el-input v-model="editUserForm.mobile" placeholder="请输入手机号码"></el-input></el-form-item>
      </el-form>
      <!-- 底部信息 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editUserVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    //邮箱格式验证
    var checkEmail = (rule, value, callback) => {
      //邮箱正则表达式
      let reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (reg.test(value)) {
        //放行
        callback();
      } else {
        callback(new Error('邮箱格式不正确'));
      }
    };

    var checkMobile = (rule, value, callback) => {
      //手机正则表达式
      let reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (reg.test(value)) {
        //放行
        callback();
      } else {
        callback(new Error('手机号码格式不正确'));
      }
    };
    return {
      //初始化用户列表
      userList: [],
      //查询的参数
      queryInfo: {
        //搜索关键字
        query: '',
        //当前页码
        pagenum: 1,
        //每页显示多少条数据
        pagesize: 2
      },
      total: 0,
      //隐藏添加用户对话框
      addUserDialog: false,
      //隐藏编辑用户对话框
      editUserVisible: false,
      //添加用户表单
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      //展现用户编辑表单
      editUserForm: {},
      //添加表单验证规则
      addUserRules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }, { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }, { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }],
        email: [{ validator: checkEmail, trigger: 'blur' }],
        mobile: [{ validator: checkMobile, trigger: 'blur' }]
      },
      //编辑用户表单验证
      editUserRules: {
        email: [{ validator: checkEmail, trigger: 'blur' }],
        mobile: [{ validator: checkMobile, trigger: 'blur' }]
      },
      //隐藏分配角色对话框
      setRoleVisible: false,
      //需要分配权限的用户信息
      userInfo: {},
      //角色的所有信息
      roleList: [],
      //选中重新的角色
      selectRole: ''
    };
  },
  created() {
    //获取用户列表信息
    this.getUserList();
  },
  methods: {
    //发起获取用户列表请求
    async getUserList() {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo });

      this.userList = res.data.users;
      this.total = res.data.total;
    },
    //每页显示多少条信息监听事件
    handleSizeChange(val) {
      this.queryInfo.pagesize = val;
      this.getUserList();
    },
    //当前页监听事件
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val;
      this.getUserList();
    },
    //用户状态变更
    async userStatusChange(userInfo) {
      // console.log(userInfo);
      const { data: res } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`);
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state;
        return this.$message.error('状态变更失败！');
      }
      this.$message.success('状态变更成功！');
    },
    //关闭添加用户表单监听事件
    addUserClosed() {
      //关闭后重置表单所有项
      this.$refs.addUserRefs.resetFields();
    },
    //关闭编辑用户表单监听事件
    editUserClosed() {
      //关闭后重置表单所有项
      this.$refs.editUserRefs.resetFields();
    },
    //添加用户
    addUser() {
      this.$refs.addUserRefs.validate(async valid => {
        if (!valid) return;
        //发起添加用户请求
        const { data: res } = await this.$http.post('users', this.addUserForm);

        if (res.meta.status !== 201) return this.$message.error('添加失败！');
        this.$message.success('添加成功！');

        //隐藏添加用户对话框
        this.addUserDialog = false;
        //刷新用户列表
        this.getUserList();
      });
    },
    //打开编辑用户对话框
    async editUserDialog(id) {
      this.editUserVisible = true;
      // 根据ID查询用户
      const { data: res } = await this.$http.get(`users/${id}`);
      if (res.meta.status !== 200) return this.$message.error('获取用户信息失败！');
      this.editUserForm = res.data;
    },
    //编辑用户
    editUser() {
      this.$refs.editUserRefs.validate(async valid => {
        if (!valid) return;
        //发起请求
        const { data: res } = await this.$http.put(`users/${this.editUserForm.id}`, this.editUserForm);
        if (res.meta.status !== 200) return this.$message.error('更新失败！');
        this.$message.success('更新成功');
        //关闭对话框
        this.editUserVisible = false;
        //刷新列表
        this.getUserList();
      });
    },
    //删除用户
    deleteUser(id) {
      this.$confirm('是否继续删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          //发起删除请求
          const { data: res } = await this.$http.delete(`users/${id}`);
          if (res.meta.status !== 200) {
            return this.$message({
              type: 'error',
              message: '删除失败!'
            });
          }
          //刷新列表
          this.getUserList();
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
    //给用户分配角色
    async setRole(user) {
      //分配角色的用户信息
      this.userInfo = user;
      //获取角色所有信息请求
      const { data: res } = await this.$http.get('roles');
      if (res.meta.status !== 200) return this.$message.error('获取角色数据失败！');
      this.roleList = res.data;
      //展现对话框
      this.setRoleVisible = true;
    },
    //提交用户分配角色请求
    async subUserRole() {
      //判断是否已选择角色
      if (!this.selectRole) {
        return this.$message.error('请选择角色');
      }
      const { data: res } = await this.$http.put(`users/${this.userInfo.id}/role`, { rid: this.selectRole });
      if (res.meta.status !== 200) return this.$message.error('更新失败！');
      this.$message.success('更新成功！');
      //更新列表
      this.getUserList();
      //隐藏分配角色对话框
      this.setRoleVisible = false;
    },
    //关闭分配角色对话框
    setRoleClose() {
      this.userInfo = {};
      this.selectRole = '';
    }
  }
};
</script>

<style lang="less" scoped></style>
