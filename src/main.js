// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Element from 'element-ui'
import 'element-ui/lib/theme-default/index.css'

import axios from 'axios'

if (process.env.NODE_ENV === 'development') {
  axios.defaults.baseURL = 'http://localhost:3000/'
}
Vue.prototype.$http = axios

Vue.use(Element)
Vue.config.productionTip = false

router.beforeEach(function (to, from, next) {
  if (to.path === '/login') {
    next()
  } else {
    if (!sessionStorage.getItem('user')) {
      next({
        path: 'login'
      })
    } else {
      next()
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
