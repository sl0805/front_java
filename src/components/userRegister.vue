<template>
  <div class="register_container">
    <el-header>
      <div>
        <img class="img" src="../assets/image/logo.png" alt="" />
        <span class="title">注册</span>
      </div>
      <div>
        <el-link @click="login" class="register_btn">登录</el-link>
        <el-link @click="manager">管理员登陆入口</el-link>
      </div>
    </el-header>
    <!---->
    <div class="register_box">
      <!--头像区域-->
      <div class="avatar_box">
        <img src="../assets/image/login.png" alt="" />
      </div>
      <!--登录表单区域-->
      <el-form
        :model="registerForm"
        label-width="0px"
        class="register_form"
        :rules="registerFormRules"
        ref="registerFormRef"
        ><!--registerFormRef就是表单的实例对象-->
        <!--email-->
        <el-form-item prop="email">
          <label class="tip">邮箱</label>
          <el-input
            prefix-icon="el-icon-search"
            v-model="registerForm.email"
            class="register_input"
          ></el-input>
        </el-form-item>
        <!--用户名-->
        <el-form-item prop="username">
          <label class="tip">用户名</label>
          <el-input
            prefix-icon="el-icon-search"
            v-model="registerForm.username"
            class="register_input"
          ></el-input>
        </el-form-item>
        <!--密码-->
        <el-form-item prop="password">
          <label class="tip">密码</label>
          <el-input
            prefix-icon="el-icon-search"
            v-model="registerForm.password"
            type="password"
            class="register_input"
          ></el-input>
        </el-form-item>
        <!--确认密码-->
        <el-form-item prop="passwordAgain">
          <label class="tip">确认密码</label>
          <el-input
            prefix-icon="el-icon-search"
            v-model="registerForm.passwordAgain"
            type="password"
            class="register_input"
          ></el-input>
        </el-form-item>
        <!--按钮-->
        <el-form-item class="btns">
          <el-button type="primary" @click="register">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
    <img src="../assets/image/register.png" class="background" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      //  这是登录表单的数据绑定对象
      registerForm: {
        email: '33311111@qq.com',
        username: 'test333',
        password: '123456',
        passwordAgain: '123456'
      },
      //  这是表单的验证规则对象
      registerFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: this.judgeEmail, trigger: 'change' }
        ],
        username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        //验证两次密码是否一致
        passwordAgain: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: this.passwordTwice, trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    //  两次密码是否一致的验证规则
    passwordTwice(rule, value, callback) {
      if (value !== this.registerForm.password)
        callback(new Error('两次密码不一致！'))
      else callback()
    },
    //  邮箱是否合法
    judgeEmail(rule, value, callback) {
      //  var judge = /[a-zA-Z0-9_]{1,}[@][a-z0-9]{2,3}[.][a-z]{2,3}/g
      var judge =
        '^\\s*\\w+(?:\\.?[\\w-]+)*@[a-zA-Z0-9]+(?:[-.][a-zA-Z0-9]+)*\\.[a-zA-Z]+\\s*$'
      if (value.match(judge) != value) callback(new Error('请输入正确的邮箱！'))
      // 使用valiator校验规则时，一定要返回一个回调函数
      //  就算没有else需求也要写else，这样子validate方法进行表单预校验才能生效
      else callback()
    },
    //跳转到登录界面
    login() {
      this.$router.push('/auth/login')
    },
    //跳转到管理员登录界面
    manager() {
      this.$router.push('/manager/login')
    },
    //注册
    register() {
      //  访问到表单的引用对象this.$refs.registerFormRef, validate进行表单的预校验，validate中接收一个回调函数，valid为布尔值，判断表单是否通过验证
      this.$refs.registerFormRef.validate(async (valid) => {
        console.log('!')
        if (!valid) return false
        //  把传输的数据从json格式改成form-data格式，才可以成功被后台数据接收
        let postData = this.$qs.stringify(this.registerForm)
        //  解构data数据
        const { data: res } = await this.$http.post('/auth/register', postData)
        if (res.code != 201) return this.$message.error('该邮箱已被注册')
        alert('注册成功，您的账号为：' + res.data)
        this.$router.push('/auth/login')
      })
    }
  }
}
</script>

<style scoped src="../assets/css/userRegister.css">

</style>
