// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import {Pagination, Notification} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
Vue.config.productionTip = false
require('./assets/index.scss')
require('./assets/font-vnnox/style.css')
Vue.prototype.$notify = Notification;
/* eslint-disable no-new */
Vue.use(Pagination)
//按需加载Element组件
// Object.keys(EleComponents).forEach((key) => Vue.use(EleComponents[key]))
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
