import store from '@/store'
import axios from 'axios'
import router from '@/router'
import u from '@/util'
const {getIn, property, merge} = u

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
    return listUrl + '/' + id + '?relationships=1'
  }
  function responseDoc (response) {
    return getIn(response, 'data.data')
  }
  function responseList (response) {
    return getIn(response, 'data.data')
  }
  function errorMessages (error) {
    return getIn(error, 'response.data.errors').map(property('message'))
  }
  function handleSaveError (error) {
    if (getIn(error, 'response.status') === 422) {
      throw {errors: errorMessages(error)}
    } else {
      throw error
    }
  }
  function authHeader () {
    const token = u.getIn(store, 'state.login.token')
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

// Redirect auth failures to login page
// https://gist.github.com/yajra/5f5551649b20c8f668aec48549ef5c1f
axios.interceptors.response.use(function (response) {
  return response
}, function (error) {
  if (error.response.status === 401) router.push('/login')
  return Promise.reject(error)
})

export default {
  create
}
