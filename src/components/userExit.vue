<!--
 * @Author: your name
 * @Date: 2021-02-26 17:59:32
 * @LastEditTime: 2021-02-28 23:12:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \2020\front_java\src\components\loginUI.vue
-->
<template>
  <div>
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
  created () {
    this.logout()
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/user/login')
    }
  }
}
</script>

<style lang="less" scoped>
</style>
