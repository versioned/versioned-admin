import axios from 'axios'
import u from '@/util'
import store from '@/store'

function getLocalStorage() {
  const data = localStorage.getItem('user')
  try {
    return data && JSON.parse(data)
  } catch (err) {
    console.log(`Error in User.getLocalStorage JSON.parse data=${data} err=${err}`)
    return null
  }
}

function setLocalStorage(user) {
  localStorage.setItem('user', (user && JSON.stringify(user)))
}

function getStore() {
  return store.state.user
}

function setStore(user) {
  store.commit('setUser', user)
}

function authHeader() {
  const user = get()
  if (user) {
    return {
      Authorization: `Bearer ${user.access_token}`
    }
  } else {
    return {}
  }
}

function get() {
  const user = getStore()
  return expired(user) ? null : user
}

function set(user) {
  setLocalStorage(user)
  setStore(user)
}

function initFromLocalStorage() {
  const user = getLocalStorage()
  if (user && !getStore()) set(user)
}

function expired(user) {
  if (!user) return true
  return false
  // NOTE: we don't necessarily have access_token_created_at
  // const loginDate = new Date(user.access_token_created_at)
  // const expiryDate = loginDate.setDate(loginDate.getDate() + 10)
  // return expiryDate < new Date()
}

function login(email, password) {
  const url = process.env.VUE_APP_API_URL + '/login'
  return axios.post(url, {email, password})
    .then(response => {
      const user = u.getIn(response, 'data', 'data', 'attributes')
      set(user)
      return user
    })
    .catch(error => {
      throw error
    })
}

function logout() {
  set(null)
}

export default {
  initFromLocalStorage,
  get,
  authHeader,
  login,
  logout
}
