/*
 * @Author: your name
 * @Date: 2021-02-25 14:24:13
 * @LastEditTime: 2021-03-09 15:14:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \2020\front_java\src\plugins\element.js
 */
import Vue from 'vue'
import { Button,
  Form,
  FormItem,
  Input,
  Message,
  Upload,
  Container,
  Header,
  Aside,
  Main,
  Link,
  Pagination,
  Table,
  Card,
  Dialog,
  TableColumn,
  MessageBox,
  Col,
  Row,
  Menu,
  MenuItem,
  Submenu,
  Switch,
  Tooltip,
  Image,
  Notification } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Upload)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Link)
Vue.use(Pagination)
Vue.use(Table)
Vue.use(Card)
Vue.use(Dialog)
Vue.use(TableColumn)
Vue.use(Col)
Vue.use(Row)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Submenu)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Image)
//  message要进行全局挂载，$message名称可变化
Vue.prototype.$message=Message
Vue.prototype.$confirm=MessageBox
//  notify要进行全局挂载才可以使用
Vue.prototype.$notify = Notification
