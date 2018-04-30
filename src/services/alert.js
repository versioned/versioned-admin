import store from '@/store'

function get() {
  return store.state.alert
}

function set(alertType, message) {
  store.commit('setAlert', {current: {[alertType]: message}})
}

function setNext(alertType, message) {
  store.commit('setAlert', {next: {[alertType]: message}})
}

function clear() {
  const alert = get()
  store.commit('setAlert', {current: alert.next, next: {}})
}

export default {
  get,
  set,
  setNext,
  clear
}
