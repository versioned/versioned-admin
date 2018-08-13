import u from '@/util'
import axios from 'axios'
import Api from '@/services/api'

const api = Api.create('users')

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

export default u.merge(api, {
  verifyEmail,
  forgotDeliver,
  forgotChange
})
