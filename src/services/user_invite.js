import u from '@/util'
import Api from '@/services/api'
import axios from 'axios'
import session from '@/services/session'

export function accept (id) {
  const url = process.env.VUE_APP_API_URL + `/user-invite-accept/${id}`
  return axios.post(url, {}, {headers: session.headers()})
}

function create (accountId) {
  const api = Api.create('user_invites', {scope: {accountId}})
  return u.merge(api, {
    accept
  })
}

export default create
