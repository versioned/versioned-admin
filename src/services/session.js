import u from '@/util'
import store from '@/store'
import axios from 'axios'

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

function get (path = null) {
  const data = getStore()
  return path ? u.getIn(data, path) : data
}

function set (data) {
  setLocalStorage(SESSION_KEY, data)
  setStore(data)
}

function headers () {
  const token = getToken()
  if (token) {
    return {
      Authorization: `Bearer ${token}`
    }
  } else {
    return {}
  }
}

function setLogin (token, user) {
  // NOTE: making it convenient to access user fields directly with fields account/space/token added
  const loginData = {
    token: token,
    user: user,
    space: u.getIn(user, 'defaultSpace'),
    account: u.getIn(user, 'defaultSpace.account')
  }
  set(loginData)
}

function login (email, password) {
  const url = process.env.VUE_APP_API_URL + '/login?getUser=1'
  return axios.post(url, {email, password})
    .then(response => {
      const data = u.getIn(response, 'data.data')
      setLogin(data.token, data.user)
      return data
    })
    .catch(error => {
      throw error
    })
}

function refresh () {
  const id = get('user.id')
  const url = process.env.VUE_APP_API_URL + `/users/${id}?relationshipLevels=2`
  return axios.get(url, {headers: headers()})
    .then(response => {
      const data = u.getIn(response, 'data.data')
      setLogin(get('token'), data)
    })
}

function logout () {
  set(null)
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
  headers,
  login,
  refresh,
  logout,
  getToken,
  spaceId,
  accountId
}
