import u from '@/util'
import store from '@/store'

const SESSION_KEY = 'login'

function getLocalStorage (key) {
  const data = localStorage.getItem(key)
  try {
    return data && JSON.parse(data)
  } catch (err) {
    console.log(`Error in getLocalStorage(${key}) JSON.parse data=${data} err=${err}`)
    return undefined
  }
}

function initFromLocalStorage () {
  const login = getLocalStorage(SESSION_KEY)
  if (login && !getStore()) setStore(login)
}

function getStore () {
  return store.state[SESSION_KEY]
}

function setStore (data) {
  store.commit('setLogin', data)
}

function setLocalStorage (key, data) {
  localStorage.setItem(key, (data && JSON.stringify(data)))
}

function get () {
  return getStore()
}

function set (data) {
  setLocalStorage(SESSION_KEY, data)
  setStore(data)
}

function getToken () {
  return u.getIn(getStore(), 'token')
}

function spaceId () {
  return u.getIn(get(), 'space.id')
}

function accountId () {
  return u.getIn(get(), 'account.id')
}

export default {
  initFromLocalStorage,
  getStore,
  get,
  set,
  getToken,
  spaceId,
  accountId
}
