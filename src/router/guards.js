import User from '@/services/user'
import Alert from '@/services/alert'

function initUserFromLocalStorage(to, from, next) {
  User.initFromLocalStorage()
  next()
}

function redirectToLogin(router) {
  return (to, from, next) => {
    if (to.path !== '/login' && !User.get()) router.push('/login')
    next()
  }
}

function clearAlerts(to, from, next) {
  Alert.clear()
  next()
}

export default function guards(router) {
  router.beforeEach(initUserFromLocalStorage)
  router.beforeEach(redirectToLogin(router))
  router.beforeEach(clearAlerts)
}
