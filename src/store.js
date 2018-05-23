import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loading: false,
    login: null,
    alert: {current: {}, next: {}}
  },
  mutations: {
    setLogin (state, login) {
      state.login = login
    },
    setAlert (state, alert) {
      state.alert = alert
    },
    setLoading (state, loading) {
      state.loading = loading
    }
  }
})
