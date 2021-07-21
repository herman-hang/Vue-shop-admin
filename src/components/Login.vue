<template>
  <div class="login">
    <div class="box">
      <!-- 头像区域 -->
      <div class="avatar"><img src="../assets/logo.png" alt="" /></div>

      <!-- 表单区域 -->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="form">
        <!-- 用户名 -->
        <el-form-item prop="username"><el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input></el-form-item>

        <!-- 密码 -->
        <el-form-item prop="password"><el-input v-model="loginForm.password" prefix-icon="iconfont icon-3702mima" type="password"></el-input></el-form-item>

        <!-- 按钮 -->
        <el-form-item class="btn">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //表单绑定数据的对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      //表单数据验证
      loginFormRules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          {
            min: 5,
            max: 15,
            message: '长度在 5 到 15 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 15,
            message: '长度在 6 到 15 个字符',
            trigger: 'blur'
          }
        ]
      }
    };
  },
  methods: {
    //监听重置按钮重置表单事件
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields();
    },
    //监听登录按钮登录事件
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post('login', this.loginForm);
        if (res.meta.status !== 200) return this.$message.error('登录失败！');
        this.$message.success('登录成功！');
        //保存token值
        window.sessionStorage.setItem('token', res.data.token);
        this.$router.push('/home');
      });
    }
  }
}
</script>

<!-- scoped只在当前组件内生效 -->
<style lang="less" scoped>
.login {
  width: 100%;
  height: 100%;
  display: inline-block;
  background-color: #2b4b6b;
}

.box {
  height: 300px;
  width: 450px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.avatar {
  width: 130px;
  height: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}

.btn {
  display: flex;
  justify-content: flex-end;
}

.form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>
