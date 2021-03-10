<!--
 * @Author: your name
 * @Date: 2021-03-05 23:11:51
 * @LastEditTime: 2021-03-10 12:06:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \2020\front_java\src\components\resetPassword.vue
-->
<template>
  <div class="login_container">
    <el-header>
      <div>
        <img class="img" src="../assets/image/logo.png" alt="" />
        <span class="title">修改密码</span>
      </div>
      <div>
        <el-link to="" @click.native="cancel" class="register_btn"
          >返回</el-link
        >
      </div>
    </el-header>
    <div class="login_box">
      <!--头像区域-->
      <div class="avatar_box">
        <img src="../assets/image/login_form.png" alt="" />
      </div>
      <!--登录表单区域-->
      <el-form
        :model="resetForm"
        label-width="0px"
        class="login_form"
        :rules="loginFormRules"
        ref="loginFormRef"
        ><!--loginFormRef就是表单的实例对象-->
        <!--用户名-->
        <el-form-item prop="originPassword">
          <label class="tip">原密码</label>
          <el-input
            prefix-icon="el-icon-search"
            v-model="resetForm.originPassword"
            class="login_input"
          ></el-input>
        </el-form-item>
        <!--密码-->
        <el-form-item prop="password">
          <label class="tip">新密码</label>
          <el-input
            class="login_input"
            prefix-icon="el-icon-search"
            v-model="resetForm.password"
            type="password"
          ></el-input>
        </el-form-item>
        <!--验证码-->
        <el-form-item prop="commit">
          <label class="tip">再次输入新密码</label>
          <el-input
            prefix-icon="el-icon-search"
            v-model="resetForm.commit"
            class="login_input"
          ></el-input>
        </el-form-item>
        <!--按钮-->
        <el-form-item>
          <div class="btns">
            <el-button type="primary" @click="resetPassword" class="btn"
              >确认修改</el-button
            >
            <el-button type="info" @click="cancel" class="btn">取消</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      userInfo: {},
      resetForm: {
        originPassword: '',
        password: '',
        commit: ''
      },
      loginFormRules: {
        //  验证账号是否合法
        originPassword: [
          { required: true, message: '请输入原密码', trigger: 'blur' }
        ],
        //  验证密码是否合法
        password: [
          { required: true, message: '请输入新密码', trigger: 'blur' }
          //
          //
          //验证密码是否合法，未完成！！！
        ],
        commit: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' },
          { validator: this.passwordAgain, trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    //检验两次密码是否一致
    passwordAgain(rule, value, callback) {
      if (this.resetForm.password !== this.resetForm.commit)
        callback(new Error('两次密码不一致！'))
      else callback()
    },
    //获取用户信息
    async getUserInfo() {
      const { data: res } = await this.$http.get('/user/getUserInfo')
      this.userInfo = res.data
    },
    //修改密码
    resetPassword() {
      let postData = new FormData()
      postData.append('originPassword', this.resetForm.originPassword)
      postData.append('password', this.resetForm.password)
      this.$http
        .patch('/user/applyForResetPassword', postData)
        .then(({ data: res }) => {
          if (res.code !== 200) return this.$message.error('原密码错误！')
          this.$message.success('密码修改成功，正在返回登录界面重新登录')
          window.sessionStorage.clear()
          this.$router.push('/auth/login')
          console.log(res)
        })
      //.catch((err) => alert('请求失败！'))
    },
    //取消修改
    cancel() {
      this.$router.push('/home')
    }
  },
  created() {
    this.getUserInfo()
  }
}
</script>
<style scoped src="../assets/css/resetPassword.css">
</style>
