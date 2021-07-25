import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
//导入属性表格
import ZkTable from 'vue-table-with-tree-grid'

//导入axios
import axios from 'axios'
//挂载到原型对象上
Vue.prototype.$http = axios
//配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
//axios拦截器，给请求头添加一个Authorization，便于授权验证
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config;
})

Vue.use(ZkTable)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
