import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    alert: {current: {}, next: {}}
  },
  mutations: {
    setUser(state, user) {
      state.user = user
    },
    setAlert(state, alert) {
      state.alert = alert
    }
  }
})
