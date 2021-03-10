<!--
 * @Author: your name
 * @Date: 2021-02-28 09:54:03
 * @LastEditTime: 2021-03-10 12:02:40
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \2020\front_java\src\components\addFolder.vue
-->
<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img class="img" src="../assets/image/logo.png" alt="" />
        <span>管理员界面</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!--管理员菜单-->
      <el-aside width="210px">
        <!---->
        <el-col :span="24">
          <el-menu
            default-active="1"
            class="el-menu-vertical-demo"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
          >
            <el-menu-item index="1">
              <i class="el-icon-menu"></i>
              <span slot="title" @click="getAllUser">用户管理</span>
            </el-menu-item>
            <el-submenu index="2">
              <template slot="title">
                <i class="el-icon-menu"></i>文件管理
              </template>
              <el-menu-item index="2-1" @click="getAllChecked(0)"
                >未审核</el-menu-item
              >
              <el-menu-item index="2-2" @click="getAllChecked(1)"
                >已审核</el-menu-item
              >
            </el-submenu>
          </el-menu>
        </el-col>

        <!---->

        <br />
      </el-aside>
      <el-main>
        <!--用户列表-->
        <el-table :data="userList" border stripe v-if="isUser">
          <el-table-column type="index" width="30"></el-table-column>
          <el-table-column
            label="用户id"
            prop="id"
            width="180"
          ></el-table-column>
          <el-table-column label="用户名" prop="username"></el-table-column>
          <el-table-column label="用户密码" prop="password"></el-table-column>
          <el-table-column label="邮箱" prop="email"></el-table-column>
          <el-table-column
            label="用户注册时间"
            prop="registerDate"
          ></el-table-column>
          <el-table-column
            label="是否为管理员"
            prop="isManager"
            :formatter="formatBoolean"
          ></el-table-column>
          <el-table-column label="删除" prop="id">
            <template slot-scope="scope">
              <el-button
                :disabled="scope.row.isManager == 1"
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="delUser(scope.row.id)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--所有用户的文件列表，分为已审核和未审核-->
        <el-table :data="fileList" border stripe v-if="isFile">
          <el-table-column type="index" width="30"></el-table-column>
          <el-table-column
            label="文件id"
            prop="fileId"
            width="180"
          ></el-table-column>
          <el-table-column label="上传者id" prop="uid"></el-table-column>
          <el-table-column label="文件名称" prop="filename"></el-table-column>
          <el-table-column label="文件路径" prop="filePath"></el-table-column>
          <el-table-column
            label="文件大小(bit)"
            prop="fileSize"
          ></el-table-column>
          <el-table-column label="合法性" prop="isValidFile">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.isValidFile"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="validChange(scope.row.isValidFile, scope.row)"
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="删除" prop="fileId">
            <template slot-scope="scope">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="delFile(scope.row.fileId)"
              ></el-button>
            </template>
          </el-table-column>
          <el-table-column label="是否审核过" prop="check">
            <template slot-scope="scope">
              <el-button
                type="success"
                :disabled="scope.row.isChecked == true"
                @click="changeChecked(scope.row)"
                >{{ show(scope.row.isChecked) }}</el-button
              >
            </template>
          </el-table-column>
          <el-table-column label="查看" prop="check">
            <template slot-scope="scope">
              <el-button
                :disabled="scope.row.fileSize == 0"
                @click="showPic(scope.row.fileId)"
                >查看</el-button
              >
              <!--图片预览弹出框-->
              <el-dialog title="图片预览框" :visible.sync="viewPic">
                <el-image
                  style="width: 500px; height: 500px; position: center"
                  :src="picture"
                  alt="正在加载"
                  lazy
                >
                </el-image>
              </el-dialog>
            </template>
          </el-table-column>
        </el-table>
        <!--分页-->
        <el-pagination
          @size-change="HandleSizeChange"
          @current-change="HandleCurrentChange"
          :current-page="index"
          :page-sizes="[5, 10, 15]"
          :page-size="pageSize"
          background
          layout="total,sizes,prev,pager,next,jumper"
          :total="total"
          next-text="下一页"
          prev-text="上一页"
        ></el-pagination>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      userList: [], //每页的用户列表
      allUser: [], //所有的用户列表
      isUser: true, //是否显示用户列表
      fileList: [], //每页的文件列表
      allFile: [], //所有的文件列表
      isFile: false, //是否显示文件列表
      total: 0, //列表中的数据总数（filter前）
      pageSize: 10, //每页条数
      index: 1, //跳转的初始页数
      viewPic: false, //是否图片预览
      picture: '', //图片预览
      checked: 1,
      valid: true,
      model: true
    }
  },
  created() {
    this.getAllUser() //获取总的用户列表
  },
  methods: {
    //预览图片
    async showPic(fileId) {
      console.log(fileId)
      this.viewPic = true
      this.$http({
        url: '/manager/images/' + fileId,
        method: 'get',
        responseType: 'blob'
      }).then((res) => {
        console.log(res)
        this.picture = window.URL.createObjectURL(res.data)
      })
    },
    //table-column中的布尔值无法显示的解决办法
    formatBoolean: function (row, column, cellValue) {
      var ret = '' //你想在页面展示的值
      if (cellValue) {
        ret = '是' //根据自己的需求设定
      } else {
        ret = '否'
      }
      return ret
    },
    //注销
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/user/login')
    },
    //获取总的用户列表
    async getAllUser() {
      this.index = 1
      this.isFile = false
      this.isUser = true
      const { data: res } = await this.$http.get('/manager/getAllUser')
      if (res.code !== 200) return this.$message.error('获取不到用户信息')
      console.log(res)
      this.allUser = res.data
      this.total = res.data.length
      this.getUserList()
    },
    //获取每页的用户列表
    getUserList() {
      this.userList = this.allUser.filter(
        (item, index) =>
          index < this.index * this.pageSize &&
          index >= this.pageSize * (this.index - 1)
      )
      this.total = this.allUser.length
    },
    //获取所有的审核/未审核文件列表
    async getAllChecked(check) {
      if (this.checked != check) this.index = 1
      this.checked = check
      this.isUser = false
      this.isFile = true
      let isChecked = {}
      isChecked.check = check
      const { data: res } = await this.$http.get('/manager/getAllFileByCheck', {
        params: isChecked
      })
      console.log(res)
      if (res.code !== 200) return this.$message.error('获取不到文件数据')
      this.allFile = res.data
      this.total = res.data.length
      //console.log(res.data[0].isValidFile)
      //console.log(res.data[0])
      this.getFileList()
    },
    //获取每页的文件列表
    getFileList() {
      this.fileList = this.allFile.filter(
        (item, index) =>
          index < this.index * this.pageSize &&
          index >= this.pageSize * (this.index - 1)
      )
      this.total = this.allFile.length
    },
    //监测每页条数的变化
    HandleSizeChange(val) {
      this.pageSize = val
      if (this.isUser) this.getUserList()
      else this.getFileList()
    },
    //监测当前页数的变化
    HandleCurrentChange(val) {
      this.index = val
      if (this.isUser == true) this.getUserList()
      else this.getFileList()
    },
    //删除用户
    async delUser(id) {
      const res = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)
      if (res !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      this.$http.delete('/manager/delUser/' + id)
      this.getAllUser()
    },
    async delFile(id) {
      const res = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)
      if (res !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      await this.$http.delete('/manager/delFile/', { params: { fileId: id } })
      this.getAllChecked(this.checked)
    },
    //改变属性
    validChange(valid, file) {
      let postData = new FormData()
      postData.append('fileId', file.fileId)
      postData.append('isValidFile', valid)
      this.$http.patch('/manager/changeFileValid', postData).then((res) => {
        //  console.log(res)
        this.changeChecked(file)
      })
    },
    //改未审核为已审核
    async changeChecked(file) {
      let postData = new FormData()
      postData.append('fileId', file.fileId)
      const { data: res } = await this.$http.patch(
        '/manager/changeFileCheck',
        postData
      )
      file.isChecked = !file.isChecked
      this.$forceUpdate() //强制刷新界面，让未审核变成已审核
    },
    show(check) {
      //  console.log(check)
      if (check === true) return '已审核'
      return '未审核'
    }
  }
}
</script>

<style scoped src="../assets/css/managerHome.css">
</style>
