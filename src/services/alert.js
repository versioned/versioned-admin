import u from '@/util'
import store from '@/store'

const DEFAULT_POSITION = 'top'

function get () {
  return store.state.alert || {}
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
  return {
    [alertType]: message
  }
}

function set (alertType, message, options = {}) {
  const when = options.when || 'current'
  const position = options.position || DEFAULT_POSITION
  store.commit('setAlert', u.deepMerge(get(), {
    [position]: {
      [when]: makeAlert(alertType, message)
    }
  }))
}

function setBoth (alertType, message, options = {}) {
  set(alertType, message, u.merge(options, {position: 'top'}))
  set(alertType, message, u.merge(options, {position: 'bottom'}))
}

function setNext (alertType, message, options = {}) {
  set(alertType, message, u.merge(options, {when: 'next'}))
}

function clear () {
  store.commit('setAlert', {current: {}, next: {}})
}

function makeNextCurrent () {
  const alerts = get()
  store.commit('setAlert', Object.keys(alerts).reduce((acc, position) => {
    const alert = alerts[position]
    acc[position] = {current: alert.next, next: {}}
    return acc
  }, {}))
}

export default {
  get,
  set,
  setBoth,
  setNext,
  clear,
  makeNextCurrent
}
