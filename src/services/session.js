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
  const defaultSpace = u.getIn(user, 'defaultSpace')
  const defaultAccount = u.getIn(user, 'defaultSpace.account')
  const current = {}
  if (get('user.id') === user.id) {
    const userAccounts = u.getIn(user, 'accounts', [])
    current['account'] = userAccounts.find(a => a.id === get('account.id'))
    current['space'] = u.flatten(userAccounts.map(u.property('spaces'))).find(s => s.id === get('space.id'))
  }
  let account = current['account'] || defaultAccount || u.first(user.accounts)
  let space = current['space'] || defaultSpace
  if (u.getIn(space, 'accountId') !== u.getIn(account, 'id')) {
    space = u.first(account.spaces)
  }
  space = space || {}
  account = account || {}
  const loginData = {
    token: token,
    user: user,
    account,
    space
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

function isLoggedIn () {
  return u.notEmpty(get('user'))
}

function isAdmin () {
  const userId = get('user.id')
  const users = get('account.users')
  return userId && users && users.find(u => u.id === userId && u.role === 'admin')
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
  accountId,
  isLoggedIn,
  isAdmin
}
