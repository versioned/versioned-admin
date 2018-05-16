import User from '@/services/user'
import Alert from '@/services/alert'
import u from '@/util'

function initUserFromLocalStorage (to, from, next) {
  User.initFromLocalStorage()
  next()
}

function redirectToLogin (router) {
  return (to, from, next) => {
    if (u.getIn(to, 'meta.requiresAuth') !== false && !User.get()) router.push('/login')
    next()
  }
}

function clearAlerts (to, from, next) {
  Alert.clear()
  next()
}

export default function guards (router) {
  router.beforeEach(initUserFromLocalStorage)
  router.beforeEach(redirectToLogin(router))
  router.beforeEach(clearAlerts)
}
