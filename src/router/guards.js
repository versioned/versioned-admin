import session from '@/services/session'
import Alert from '@/services/alert'
import u from '@/util'

function initUserFromLocalStorage (to, from, next) {
  session.initFromLocalStorage()
  next()
}

function redirectToLogin (router) {
  return (to, from, next) => {
    if (u.getIn(to, 'meta.requiresAuth') !== false && !session.isLoggedIn()) {
      router.push('/login')
    }
    next()
  }
}

function getAlerts (to, from, next) {
  Alert.makeNextCurrent()
  next()
}

export default function guards (router) {
  router.beforeEach(initUserFromLocalStorage)
  router.beforeEach(redirectToLogin(router))
  router.beforeEach(getAlerts)
}
