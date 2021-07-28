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
//导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
//富文本编辑器的样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
//导入nprogress的js和css
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
//导入axios
import axios from 'axios'
//挂载到原型对象上
Vue.prototype.$http = axios
//配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
//axios请求拦截器，给请求头添加一个Authorization，便于授权验证
axios.interceptors.request.use(config => {
  //展现进度条
  NProgress.start();
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config;
})
//axios响应拦截器
axios.interceptors.response.use(config => {
  //隐藏进度条
  NProgress.done();
  return config;
})
Vue.use(VueQuillEditor)
Vue.use(ZkTable)
Vue.config.productionTip = false

//全局时间过滤器
Vue.filter('date', function(originVal) {
  const dt = new Date(originVal);
  //年
  const y = dt.getFullYear();
  //月    这里加1时因为Month是从0开始，月份没有0月，后面的padStart代表如果时间不足两位则用0补充
  const m = (dt.getMonth() + 1 + '').padStart(2, '0');
  //日
  const d = (dt.getDay() + '').padStart(2, '0');
  //时
  const hh = (dt.getHours() + '').padStart(2, '0');
  //分
  const mm = (dt.getMinutes() + '').padStart(2, '0');
  //秒
  const ss = (dt.getSeconds() + '').padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
