import axios from 'axios'
import u from '@/util'
import store from '@/store'

function getLocalStorage (key) {
  const data = localStorage.getItem(key)
  try {
    return data && JSON.parse(data)
  } catch (err) {
    console.log(`Error in User.getLocalStorage(${key}) JSON.parse data=${data} err=${err}`)
    return undefined
  }
}

function setLocalStorage (key, data) {
  localStorage.setItem(key, (data && JSON.stringify(data)))
}

function getStore () {
  return store.state.login
}

function setStore (login) {
  store.commit('setLogin', login)
}

function authHeader () {
  const login = get()
  if (login) {
    return {
      Authorization: `Bearer ${login.token}`
    }
  } else {
    return {}
  }
}

function get () {
  const login = getStore()
  return expired(login) ? null : login
}

function set (login) {
  setLocalStorage('login', login)
  setStore(login)
}

function spaceId () {
  return u.getIn(get(), 'space', 'id')
}

function accountId () {
  return u.getIn(get(), 'account', 'id')
}

function initFromLocalStorage () {
  const login = getLocalStorage('login')
  if (login && !getStore()) set(login)
}

function expired (login) {
  // TODO: check exp in JWT login.token?
  if (!login) return true
  return false
}

function login (email, password) {
  const url = process.env.VUE_APP_API_URL + '/login'
  return axios.post(url, {email, password})
    .then(response => {
      const data = u.getIn(response, 'data', 'data')
      // NOTE: make it convenient to access user fields directly with fields account/space/token added
      const user = u.merge(data, data.user)
      set(user)
      return data
    })
    .catch(error => {
      throw error
    })
}

function logout () {
  set(null)
}

export default {
  initFromLocalStorage,
  get,
  spaceId,
  accountId,
  authHeader,
  login,
  logout
}
