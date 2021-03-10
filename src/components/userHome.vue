<!--
 * @Author: your name
 * @Date: 2021-02-28 09:54:03
 * @LastEditTime: 2021-03-10 12:07:23
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \2020\front_java\src\components\addFolder.vue
-->
<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img class="img" src="../assets/image/logo.png" alt="" />
        <span>用户界面</span>
      </div>
      <el-link type="info" @click="logout">注销</el-link>
    </el-header>
    <el-container>
      <!--侧边栏区-->
      <el-aside width="200px">
        <!--用户头像获取和修改-->
        <div class="avatar_box">
          <el-upload
            action="/file/updateIcon"
            class="upload-demo"
            :show-file-list="false"
            :before-upload="uploadAvatar"
            :on-success="handleOnSuccess"
          >
            <el-tooltip
              class="item"
              effect="dark"
              content="单击可更改头像"
              placement="right"
            >
              <img :src="avatarIcon" alt="头像获取失败" />
            </el-tooltip>
          </el-upload>
        </div>
        <!--用户信息获取和修改-->
        <div class="userInfo">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <i
                class="el-icon-edit"
                style="float: right"
                @click="editUserInfo = true"
              ></i>
              <!--用户信息修改弹出框-->
              <el-dialog title="用户信息修改" :visible.sync="editUserInfo">
                <el-form :model="editInfo" :rules="editRule">
                  <el-form-item class="login_input" prop="username">
                    <span>用户名</span>
                    <el-input
                      prefix-icon="el-icon-search"
                      v-model="editInfo.username"
                    ></el-input>
                  </el-form-item>
                  <el-form-item class="login_input" prop="email">
                    <span>邮箱</span>
                    <el-input
                      prefix-icon="el-icon-search"
                      v-model="editInfo.email"
                    ></el-input>
                  </el-form-item>
                </el-form>
                <!--确认修改/取消修改键-->
                <div slot="footer" class="dialog-footer">
                  <el-button @click="cancelEdit">取 消</el-button>
                  <el-button type="primary" @click="submitChange"
                    >确 定</el-button
                  >
                </div>
              </el-dialog>
            </div>
            <!--用户信息展示-->
            <form :model="userInfo">
              <div class="infoDiv">
                <span class="infoTip">用户名</span>
                <!--readonly为只读文本框-->
                <input
                  v-model="userInfo.username"
                  readonly="readonly"
                  class="info"
                />
              </div>
              <div>
                <span class="infoTip">邮箱</span>
                <input
                  v-model="userInfo.email"
                  readonly="readonly"
                  class="info"
                />
              </div>
            </form>
            <!--密码修改按钮-->
            <el-button type="text" @click="editPassword">修改密码</el-button>
          </el-card>
        </div>
      </el-aside>
      <!--文件展示和操作区域-->
      <el-main>
        <el-card shadow="always">
          <!--返回上层文件夹-->
          <i class="el-icon-back" @click="goBack"></i>
          <!--文件上传按钮（可以上传图片和压缩包）-->
          <div class="upload">
            <i class="el-icon-upload"></i>
            <el-button type="text" @click="dialogFormVisible = true">
              上传文件
            </el-button>
          </div>
          <!--图片上传对话框-->
          <el-dialog
            title="文件上传"
            :visible.sync="dialogFormVisible"
            class="fileUpload"
          >
            <!--accept为上传文件类型的限制，accept="..."-->
            <el-upload
              action="/home"
              :file-list="fileList"
              file-style=""
              :before-upload="onBeforeUpload"
              :on-success="handleOnSuccess"
            >
              <el-button type="primary" size="small">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传图片和压缩包</div>
            </el-upload>
          </el-dialog>
          <div class="upload">
            <i class="el-icon-link"></i>
            <el-button type="text" @click="getShareFormVisible = true">
              获取文件
            </el-button>
            <!--输入分享文件的链接及提取码-->
            <el-dialog title="文件提取" :visible.sync="getShareFormVisible">
              <el-form :model="getShare">
                <el-form-item class="login_input">
                  <span>用户名</span>
                  <el-input
                    prefix-icon="el-icon-search"
                    v-model="getShare.uuid"
                  ></el-input>
                </el-form-item>
                <!--密码-->
                <el-form-item class="login_input">
                  <span>邮箱</span>
                  <el-input
                    prefix-icon="el-icon-search"
                    v-model="getShare.verifyCode"
                  ></el-input>
                </el-form-item>
              </el-form>
              <!--确认修改/取消修改键-->
              <div slot="footer" class="dialog-footer">
                <el-button @click="cancelEdit">取 消</el-button>
                <el-button type="primary" @click="gotShare">确 定</el-button>
              </div>
            </el-dialog>
          </div>
          <!--新建文件夹-->
          <el-form :inline="true" :model="formInline" class="newFolderForm">
            <el-form-item label="在当前目录下新建文件夹">
              <el-input
                v-model="formInline.foldName"
                placeholder="文件夹名称"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="folderAdd">确定</el-button>
            </el-form-item>
          </el-form>
        </el-card>
        <!--文件列表-->
        <!--加上index可以让文件上传之后列表更新-->
        <div class="fileList">
          <div
            style="background-color: red"
            :data="folders"
            v-for="(folder, index) in folders"
            :key="index"
          >
            <!--文件夹类型-->
            <el-card v-if="!folder.contentType">
              <i class="el-icon-folder-opened"></i>
              <router-link
                to=""
                @click.native="HandlePidChange(folder.fileId)"
                class="fileName"
              >
                {{ folder.filename }}
              </router-link>
              <!--对文件夹的操作-->
              <div class="btns">
                <el-button
                  type="success"
                  plain
                  icon="el-icon-document-copy"
                  circle
                  @click.native="copyFile(folder.fileId)"
                  class="btn"
                ></el-button>
                <el-button
                  type="success"
                  plain
                  icon="el-icon-share"
                  circle
                  @click.native="shareFile(folder.fileId)"
                  class="btn"
                ></el-button>
                <el-button
                  type="success"
                  plain
                  icon="el-icon-download"
                  circle
                  @click.native="fileDownload(folder.fileId)"
                  class="btn"
                ></el-button>
                <el-button
                  type="danger"
                  plain
                  icon="el-icon-delete"
                  circle
                  @click.native="delFile(folder.fileId)"
                  class="btn"
                ></el-button>
              </div>
            </el-card>
            <!--文件类型-->
            <el-card v-else>
              <i class="el-icon-picture"></i>
              <router-link
                to=""
                @click.native="showPic(folder.fileId)"
                class="fileName"
              >
                {{ folder.filename }}
              </router-link>
              <!--图片预览弹出框-->
              <el-dialog title="图片预览框" :visible.sync="viewPic">
                <el-image
                  style="width: 500px; height: 500px; position: center"
                  :src="picture"
                >
                </el-image>
              </el-dialog>
              <!--对文件的操作-->
              <div class="btns">
                <el-button
                  type="success"
                  plain
                  icon="el-icon-document-copy"
                  circle
                  @click.native="copyFile(folder.fileId)"
                  class="btn"
                ></el-button>
                <el-button
                  type="success"
                  plain
                  icon="el-icon-share"
                  circle
                  @click.native="shareFile(folder.fileId)"
                  class="btn"
                ></el-button>
                <el-button
                  type="primary"
                  plain
                  icon="el-icon-download"
                  circle
                  @click.native="PicDownload(folder.fileId)"
                  class="btn"
                ></el-button>
                <el-button
                  type="danger"
                  plain
                  icon="el-icon-delete"
                  circle
                  @click.native="delFile(folder.fileId)"
                  class="btn"
                ></el-button>
              </div>
            </el-card>
          </div>
          <!--分页-->
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.curPage"
            :page-sizes="[5]"
            :page-size="queryInfo.pagesize"
            layout="total, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </div>
        <div class="copy">
          <el-button :disabled="isCopyEmpty === true" @click="moveTo()"
            >复制到当前文件夹下</el-button
          >
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  created() {
    this.getUserInfo()
    this.getFolder()
  },
  data() {
    return {
      queryInfo: {
        query: '',
        curPage: 1,
        pagesize: 5,
        pid: -1
      }, //分页设置
      folders: [], //文件列表，一次5条
      total: 0, //文件总数，用于分页设置
      formInline: { foldName: '', pid: -1 }, //在当前文件夹目录下新建文件夹
      oldPid: [], //记录父文件夹
      files: [],
      dialogFormVisible: false, //上传文件的对话框是否弹出
      getShareFormVisible: false, //获取文件的对话框是否弹出
      formLabelWidth: '120px', //宽度设置
      userInfo: {}, //用户信息
      param: {}, //保存下载时的文件id
      editUserInfo: false, //是否修改用户信息
      username: '',
      email: '',
      editInfo: [], //修改用户信息界面
      avatarIcon: '', //用户头像
      changeAvatar: false, //是否更改头像
      move: [], //文件复制（移动）
      viewPic: false, //是否图片预览
      picture: '', //图片预览
      editRule: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { validator: this.checkEmail, trigger: 'change' }
        ]
      },
      getShare: {
        verifyCode: '',
        uuid: '',
        path: '',
        wantDownload: true
      },
      isCopyEmpty: true,
      picture: '',
      pictureList: [],
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      fileList: [], //文件上传成功列表
      uploadData: []
    }
  },
  methods: {
    //验证邮箱是否合法
    checkEmail(rule, value, callback) {
      var judge =
        '^\\s*\\w+(?:\\.?[\\w-]+)*@[a-zA-Z0-9]+(?:[-.][a-zA-Z0-9]+)*\\.[a-zA-Z]+\\s*$'
      if (value.match(judge) != value) callback(new Error('请输入正确的邮箱！'))
      // 使用valiator校验规则时，一定要返回一个回调函数
      //  就算没有else需求也要写else，这样子validate方法进行表单预校验才能生效
      else callback()
    },
    //获取文件列表
    async getFolder() {
      const { data: res } = await this.$http.get('/file/subFile', {
        params: this.queryInfo
      })
      if (res.code !== 200) return
      this.folders = res.data
      this.total = res.pageBean.totalPage * 5
      //this.$forceUpdate()
    },
    //注销
    logout() {
      this.$router.push('/user/exit')
    },
    //返回上层文件夹
    async goBack() {
      if (this.oldPid.length != 0) {
        this.queryInfo.pid = this.oldPid[0]
        this.oldPid.splice(0, 1)
        this.queryInfo.curPage = 1
        this.getFolder()
      } else return this.$message.error('没有上层文件夹')
    },
    //
    //
    //
    //文件上传
    async onBeforeUpload(file) {
      //限制文件大小和类型，不符合要求的不予展示
      /*
      const fileSuffix = file.name.substring(file.name.lastIndexOf(".") + 1);
      const whiteList = ["pdf", "doc", "docx", "xls", "xlsx"];
      if (whiteList.indexOf(fileSuffix) === -1) {
        this.$msg("上传文件只能是 pdf、doc、docx、xls、xlsx格式", "error");
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$msg("上传文件大小不能超过 2MB", "error");
        return false
      */
      let ff = new FormData()
      ff.append('uploadFile', file)
      ff.append('pid', this.queryInfo.pid)
      this.uploadData.splice(0, 0, ff)
      const { data: res } = await this.$http.post('/file/upload', ff)
      if (res.code !== 200) return this.$message.error('上传失败')
      this.$message.success('上传成功')
      this.getFolder()
      //  fileList为只读的，在修改fileList的值时会报错Cannot set property 'status' of null，还没解决
      //  this.fileList.splice(0, 0, ff)
    },
    //
    //
    //
    //
    handleOnSuccess() {},
    //删除文件
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
      //  加上await和async修饰符可以让方法的调用和执行同步，否则可能在删除操作之前就进行文件列表的获取，导致文件列表无法更新
      await this.$http.delete('/file/delFile', { params: { fileId: id } })
      this.getFolder()
    },
    //分页设置
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getFolder()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.curPage = newPage
      this.getFolder()
    },
    HandlePidChange(newPid) {
      this.oldPid.splice(0, 0, this.queryInfo.pid)
      this.queryInfo.pid = newPid
      this.queryInfo.curPage = 1
      this.getFolder()
    },
    //新建文件夹
    async folderAdd() {
      this.formInline.pid = this.queryInfo.pid
      let postData = this.$qs.stringify(this.formInline)
      const { data: res } = await this.$http.post('/file/addFolder', postData)
      this.$message.success('新建成功')
      this.formInline.foldName = ''
      this.getFolder()
    },
    //图片下载
    PicDownload(fileId) {
      this.param.fileId = fileId
      this.$http({
        url: '/file/download',
        method: 'get',
        responseType: 'blob',
        params: this.param
      })
        .then((res) => {
          let url = window.URL.createObjectURL(res.data)
          const a = document.createElement('a')
          a.href = url
          a.download = fileId
          a.click()
        })
        .catch((err) => {
          console.log('下载失败')
        })
    },
    //文件下载
    fileDownload(fileId) {
      this.param.fileId = fileId
      this.$http({
        url: '/file/download',
        method: 'get',
        responseType: 'blob',
        params: this.param
      })
        .then((res) => {
          //下载压缩包要用type: 'application/zip'
          /*let blob = new Blob([res.data], { type: 'application/zip' })
          let url = window.URL.createObjectURL(blob)
          window.location.href = url*/
          const blob = new Blob([res.data], { type: 'application/zip' })
          const a = document.createElement('a')
          a.download = fileId
          a.href = URL.createObjectURL(blob)
          a.click()
        })
        .catch((err) => {
          console.log(err)
        })
    },
    //  获取用户信息
    async getUserInfo() {
      const { data: res } = await this.$http.get('/user/getUserInfo')
      this.editInfo = res.data
      //这样子可以解决两个userInfo和editInfo同时变化的问题，因为直接赋值的时候指向的是地址
      this.userInfo = JSON.parse(JSON.stringify(this.editInfo))
      this.getAvatar()
    },
    //提交用户信息修改
    submitChange() {
      this.$http.patch('/user/resetEmail/' + this.editInfo.email)
      this.$http.patch('/user/resetUsername/' + this.editInfo.username)
      this.editUserInfo = false
      this.$message.success('修改成功')
      this.userInfo = JSON.parse(JSON.stringify(this.editInfo))
    },
    //取消用户信息修改
    cancelEdit() {
      this.editUserInfo = false
      this.editInfo = JSON.parse(JSON.stringify(this.userInfo))
    },
    //获取头像
    async getAvatar() {
      this.$http({
        url: '/file/icon/' + this.userInfo.id,
        method: 'get',
        responseType: 'blob'
      }).then((res) => {
        this.avatarIcon = window.URL.createObjectURL(res.data)
      })
    },
    //更换头像
    uploadAvatar(file) {
      let ff = new FormData()
      ff.append('multipartFile', file)
      this.uploadData.splice(0, 0, ff)
      this.$http
        .post('/file/updateIcon', ff)
        .then((res) => {
          this.getAvatar()
          this.$message.success('更换头像成功')
        })
        .catch((err) => {
          this.$message.error('更换头像失败')
        })
    },
    //预览图片
    async showPic(fileId) {
      this.viewPic = true
      this.$http({
        url: '/file/images/' + fileId,
        method: 'get',
        responseType: 'blob'
      }).then((res) => {
        console.log(res)
        this.picture = window.URL.createObjectURL(res.data)
      })
    },

    //修改密码
    editPassword() {
      this.$router.push({
        path: '/auth/resetPassword',
        query: { userId: this.userInfo.id }
      })
    },
    //
    //
    //获取文件的分享链接
    async shareFile(fileId) {
      console.log(fileId)
      const { data: res } = await this.$http.get('/file/share', {
        params: { file: fileId }
      })
      //console.log(res)
      let message = '分享链接：\n' + res.data[0] + '\n提取码：\n ' + res.data[1]
      this.$notify({
        //  iconClass: "el-icon-bell",//自定义icon
        //  offset: 100,
        title: '文件分享',
        message: message,
        duration: 0
        //  customClass: 'notify'
      })
    },
    //  文件复制
    copyFile(fileId) {
      this.move[0] = fileId
      this.isCopyEmpty = false
    },
    //  文件移动
    async moveTo() {
      this.move[1] = this.queryInfo.pid
      let moveForm = new FormData()
      moveForm.append('curFileId', this.move[0])
      moveForm.append('targetFileId', this.move[1])
      const { data: res } = await this.$http.post('/file/copyFileTo', moveForm)
      console.log(res)
      if (res.code !== 200)
        return this.$message.error('该文件夹下已有同名文件！')
      this.$message.success('复制成功')
      this.getFolder()
    },
    //
    //
    //获取分享文件，未完成！！！
    async gotShare() {
      const { data: res } = await this.$http({
        url: '/file/getShare',
        method: 'get',
        //responseType: 'blob',
        params: {
          uuid: this.getShare.uuid,
          verifyCode: this.getShare.verifyCode,
          path: '1/IMG_0250.JPG',
          wantDownload: true
        }
      })
      console
        .log(res)
        .then((res) => {
          //下载压缩包要用type: 'application/zip'

          const blob = new Blob([res.data], { type: 'application/zip' })
          const a = document.createElement('a')
          //a.download = fileId
          a.href = URL.createObjectURL(blob)
          a.click()
        })
        .catch((err) => {
          console.log(err)
        })
      /*.then((res) => {
          let url = window.URL.createObjectURL(res.data)
          const a = document.createElement('a')
          a.href = url
          a.download = fileId
          a.click()
        })
        .catch((err) => {
          console.log('下载失败')
        })*/
    }
  }
}
</script>

<style scoped src="../assets/css/userHome.css">
</style>
