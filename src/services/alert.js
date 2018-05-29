import store from '@/store'

function get () {
  return store.state.alert
}

function makeAlert (alertType, message) {
  if (!message) {
    message = alertType
    alertType = 'success'
  }
  if (alertType === 'error') {
    alertType = 'errors'
    message = {title: message}
  }
  return {[alertType]: message}
}

function set (alertType, message) {
  store.commit('setAlert', {current: makeAlert(alertType, message)})
}

function setNext (alertType, message) {
  store.commit('setAlert', {next: makeAlert(alertType, message)})
}

function clear () {
  const alert = get()
  store.commit('setAlert', {current: alert.next, next: {}})
}

export default {
  get,
  set,
  setNext,
  clear
}
