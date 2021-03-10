<!--
 * @Author: your name
 * @Date: 2021-03-05 23:11:51
 * @LastEditTime: 2021-03-10 12:33:12
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \2020\front_java\src\components\resetPassword.vue
-->
<template>
  <div class="login_container">
    <el-header>
      <div>
        <img class="img" src="../assets/image/logo.png" alt="" />
        <span class="title">找回密码</span>
      </div>
      <el-link type="info" @click="cancel" class="goback">返回</el-link>
    </el-header>
    <div class="login_box">
      <!--找回密码表单区域-->
      <el-form
        :model="resetForm"
        class="login_form"
        :rules="loginFormRules"
        ref="loginFormRef"
        ><!--loginFormRef是表单的实例对象-->
        <!--用户id-->
        <el-form-item prop="userId">
          <label class="tip">账号</label>
          <el-input
            prefix-icon="el-icon-user-solid"
            v-model="resetForm.userId"
            class="login_input"
          ></el-input>
        </el-form-item>
        <!--邮箱验证码-->
        <el-form-item prop="verifyCode">
          <label class="tip">验证码</label>
          <el-input
            prefix-icon="el-icon-search"
            v-model="resetForm.verifyCode"
            class="verify_input"
          ></el-input>
          <el-button type="info" @click="sendVerify" class="verify_btn">{{
            message
          }}</el-button>
        </el-form-item>
        <!--新密码-->
        <el-form-item prop="password">
          <label class="tip">新密码</label>
          <el-input
            prefix-icon="el-icon-view"
            v-model="resetForm.password"
            type="password"
            class="login_input"
          ></el-input>
        </el-form-item>
        <!--按钮-->
        <el-form-item class="btns">
          <el-button type="primary" @click="resetPassword">确认修改</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
//import '../assets/css/userLogin.css'
export default {
  data() {
    return {
      //   找回密码的表单
      resetForm: {
        userId: 113,
        verifyCode: '',
        password: ''
      },
      //  验证表单内容是否合法
      loginFormRules: {
        userId: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        verifyCode: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      },
      message: '发送验证码'
    }
  },
  methods: {
    //重置密码
    async resetPassword() {
      let postData = new FormData()
      postData.append('userId', this.resetForm.userId)
      postData.append('password', this.resetForm.password)
      postData.append('verifyCode', this.resetForm.verifyCode)
      const { data: res } = await this.$http
        .patch('/auth/resetPassword', postData)
        .catch(() => this.$message.error('找回密码失败'))
      if (res.code !== 200) return this.$message.error('找回密码失败')
      this.$message.success('已找回密码，正在返回登录界面')
      this.$router.push('/auth/login')
    },
    //取消修改密码
    cancel() {
      this.$router.push('/user/subFile')
    },
    sendVerify() {
      this.message = '正在发送'
      this.$http
        .get('/auth/applyForFindPassword', {
          params: { userId: this.resetForm.userId }
        })
        .then(({ data: res }) => {
          if (res.code !== 200) {
            return this.$message.error('邮箱发送失败')
          }
          this.message = '已发送'
        })
        .catch(() => this.$message.error('邮箱发送失败'))
    }
  }
}
</script>
<style scoped src="../assets/css/findPassword.css">
</style>
