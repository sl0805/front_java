/*
 * @Author: your name
 * @Date: 2021-02-25 14:21:31
 * @LastEditTime: 2021-03-10 10:44:20
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \2020\front_java\src\router\index.js
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import userLogin from '../components/userLogin.vue'     //  引进普通用户登录界面
import findPassword from '../components/findPassword.vue'     //引进找回密码界面
import Home from '../components/userHome.vue'       //  引进普通用户主页界面
import userRegister from '../components/userRegister.vue'       //  引进用户注册界面
import managerLogin from '../components/managerLogin.vue'       //  引进管理员登录界面
import managerHome from '../components/managerHome.vue'       //  引进管理员主页界面
import resetPassword from '../components/resetPassword.vue'       //  引进修改密码界面
import userExit from '../components/userExit.vue'       //  引进用户退出


Vue.use(VueRouter)

const routes = [
  { path: '/auth/login', component: userLogin },//  普通用户登录界面
  { path: '/auth/findPassword', component: findPassword },//  找回密码界面
  { path: '/home', component: Home },//  普通用户主页界面
  { path: '/auth/register', component: userRegister },//  用户注册界面
  { path: '/manager/login', component: managerLogin },//  管理员登录界面
  { path: '/manager/home', component: managerHome },//  管理员主页界面
  { path: '/auth/resetPassword', component: resetPassword },//  修改密码界面
  { path: '/user/exit', component: userExit },//  退出界面
  { path: '/*', redirect: '/auth/login'},//   出现不正确路径时跳转到普通用户登录界面
]
const router = new VueRouter({
  routes
})

/*
解决NavigationDuplicated: Avoided redundant navigation to current location: "/file/subFile"报错问题
//获取原型对象上的push函数
const originalPush = VueRouter.prototype.push
//修改原型对象中的push方法
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => console.log(err))
}*/


export default router
