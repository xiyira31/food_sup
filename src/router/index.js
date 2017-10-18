import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    }, {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/home',
      component: require('../components/home/index'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '/', component: require('../components/home/children/main')
        },
        {
          path: 'company', component: require('../components/home/children/company')
        },
        {
          path: 'order', component: require('../components/home/children/order')
        },
        {
          path: 'orderPrint', component: require('../components/home/children/orderPrint')
        },
        {
          path: 'orderModify', component: require('../components/home/children/orderModify')
        },
        {
          path: 'producer', component: require('../components/home/children/producer')
        },
        {
          path: 'product', component: require('../components/home/children/product')
        },
        {
          path: 'school', component: require('../components/home/children/school')
        },
        {
          path: 'type', component: require('../components/home/children/type')
        },
        {
          path: 'role', component: require('../components/home/children/role')
        },
        {
          path: 'user', component: require('../components/home/children/user')
        },
        {
          path: 'schoolSummary', component: require('../components/home/children/schoolSummary')
        },
        {
          path: 'producerSummary', component: require('../components/home/children/producerSummary')
        },
        {
          path: 'typeSummary', component: require('../components/home/children/typeSummary')
        },
        {
          path: 'dailyPrice', component: require('../components/home/children/dailyPrice')
        },
        {
          path: 'checkOrder', component: require('../components/home/children/checkOrder')
        },
        {
          path: 'orderShow', component: require('../components/home/children/orderShow')
        },
        {
          path: 'dataBackup', component: require('../components/home/children/dataBackup')
        }
      ]
    }
  ]
})
