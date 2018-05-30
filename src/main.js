import Vue from 'vue'
import App from './App.vue'
import router from './router'
import {filter as dateFilter} from '@/filters/date'
import {timeAgo} from '@/client_util'
import store from './store'

Vue.config.productionTip = false

Vue.filter('date', dateFilter)
Vue.filter('timeAgo', timeAgo)

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
