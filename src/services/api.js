import session from '@/services/session'
import axios from 'axios'
import router from '@/router'
import store from '@/store'
import u from '@/util'
const {getIn, merge} = u

function listPath (contentType, options = {}) {
  const {accountId, spaceId} = (getIn(options, 'scope') || {})
  if (spaceId) {
    return `/data/${spaceId}/${contentType}`
  } else if (accountId) {
    return `/${accountId}/${contentType}`
  } else {
    return `/${contentType}`
  }
}

function create (contentType, options = {}) {
  const listUrl = process.env.VUE_APP_API_URL + listPath(contentType, options)
  function getUrl (id) {
    return listUrl + '/' + id + '?relationshipLevels=1'
  }
  function responseDoc (response) {
    return getIn(response, 'data.data')
  }
  function responseList (response) {
    return getIn(response, 'data.data')
  }
  function handleSaveError (error) {
    throw getIn(error, 'response.data')
  }
  function authHeader () {
    const token = session.getToken()
    if (token) {
      return {
        Authorization: `Bearer ${token}`
      }
    } else {
      return {}
    }
  }
  function headers () {
    return authHeader()
  }
  function get (id) {
    return axios.get(getUrl(id), {headers: headers()})
      .then(responseDoc)
  }
  function list (options = {}) {
    const defaultParams = {}
    const params = merge(defaultParams, options.params)
    return axios.get(listUrl, {params, headers: headers()})
      .then(responseList)
  }
  function create (doc) {
    return axios.post(listUrl, doc, {headers: headers()})
      .then(responseDoc)
      .catch(handleSaveError)
  }
  function update (doc) {
    return axios.put(getUrl(doc.id), doc, {headers: headers()})
      .then(responseDoc)
      .catch(handleSaveError)
  }
  function remove (doc) {
    return axios.delete(getUrl(doc.id), {headers: headers()})
      .then(responseDoc)
  }
  return {
    get,
    list,
    create,
    update,
    remove
  }
}

axios.interceptors.request.use(function (config) {
  store.commit('setLoading', true)
  return config
})

// Redirect auth failures to login page
// https://gist.github.com/yajra/5f5551649b20c8f668aec48549ef5c1f
axios.interceptors.response.use(function (response) {
  store.commit('setLoading', false)
  return response
}, function (error) {
  store.commit('setLoading', false)
  if (error.response.status === 401) {
    session.set(null)
    router.push('/login')
  }
  return Promise.reject(error)
})

export default {
  create
}
