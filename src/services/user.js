import axios from 'axios'
import u from '@/util'
import session from '@/services/session'

function spaceId () {
  return u.getIn(session.get(), 'space.id')
}

function accountId () {
  return u.getIn(session.get(), 'account.id')
}

function login (email, password) {
  const url = process.env.VUE_APP_API_URL + '/login?getUser=1'
  return axios.post(url, {email, password})
    .then(response => {
      const data = u.getIn(response, 'data.data')
      // NOTE: make it convenient to access user fields directly with fields account/space/token added
      const loginData = {
        token: data.token,
        user: data.user,
        space: u.getIn(data, 'user.defaultSpace'),
        account: u.getIn(data, 'user.defaultSpace.account')
      }
      session.set(loginData)
      return data
    })
    .catch(error => {
      throw error
    })
}

function logout () {
  session.set(null)
}

function verifyEmail (email, token) {
  const url = process.env.VUE_APP_API_URL + '/verify-email'
  return axios.post(url, {email, token})
}

function forgotDeliver (email) {
  const url = process.env.VUE_APP_API_URL + '/forgot-password/deliver'
  return axios.post(url, {email})
}

function forgotChange (email, token, password) {
  const url = process.env.VUE_APP_API_URL + '/forgot-password/change'
  return axios.post(url, {email, token, password})
}

export default {
  get: session.get,
  set: session.set,
  spaceId,
  accountId,
  login,
  logout,
  verifyEmail,
  forgotDeliver,
  forgotChange
}
