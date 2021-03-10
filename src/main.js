/*
 * @Author: your name
 * @Date: 2021-02-25 14:21:31
 * @LastEditTime: 2021-03-10 12:00:27
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \2020\front_java\src\main.js
 */
import Vue from 'vue'
import './plugins/element.js'
import router from './router/index.js'
import './assets/css/global.css'
import App from './App.vue'
//  导入全局css样式



//  全局配置axios
import axios from 'axios'
//  配置请求的根路径
axios.defaults.baseURL = 'http://311l7b5384.goho.co/'
//  把token值传进响应头里面
axios.interceptors.request.use(config=>{
  config.headers.Authorization=window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios
//  另一种写法
/*axios.interceptors.request.use(function(config){
  let token=sessionStorage.getItem('token')
  if(token){
    config.headers['Authorization']=token;
  }
  return config
})*/
//  阻止控制台显示生产模式的消息
Vue.config.productionTip = false

//  全局配置qs，后面用qs.stringfy()把对象序列化成URL的形式，是后端接收到的数据不为null
import qs from 'qs'
Vue.prototype.$qs = qs



//控制没有登录的情况下不能够访问一些页面
//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  //  to代表将要访问的路径
  //  from代表从哪个路径跳转而来
  //  next是一个函数，表示放行
  //  next()放行,next('/login')强制跳转
  if(to.path==='/auth/register'||to.path==='/auth/login'||to.path==='/manager/login'||to.path==='/auth/findPassword')
  return next();
  //  获取token
  const tokenStr=window.sessionStorage.getItem('token')
  //  没有token的情况下跳转到登录界面
  if(!tokenStr)
  return next('/auth/login')
  next()
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
