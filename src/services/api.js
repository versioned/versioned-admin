import session from '@/services/session'
import axios from 'axios'
import router from '@/router'
import store from '@/store'
import u from '@/util'
const {getIn, merge} = u

function urlWithQuery (url, query) {
  if (u.notEmpty(query)) {
    const sep = (url.includes('?') ? '&' : '?')
    const queryString = Object.entries(query).map(([key, value]) => {
      return `${key}=${encodeURIComponent(value)}`
    }).join('&')
    return url + sep + queryString
  } else {
    return url
  }
}

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

function headers () {
  return session.headers()
}

function responseDoc (response) {
  return getIn(response, 'data.data')
}

function responseList (response) {
  return getIn(response, 'data')
}

function validateStatus (status) {
  // return status >= 200 && status < 300 // default
  return status >= 200 && status < 500
}

function getRequest (url) {
  return axios.get(url, {validateStatus, headers: headers()})
    .then(responseDoc)
}

function listRequest (url) {
  return axios.get(url, {headers: headers()})
    .then(responseList)
}

function httpie (url, options = {}) {
  if (options.apiKey) {
    return `http GET '${urlWithQuery(url, {apiKey: options.apiKey, published: 1})}'`
  } else {
    const headerString = Object.entries(headers()).map(([key, value]) => {
      return `${key}:"${value}"`
    }).join(' ')
    return `http GET '${url}' ${headerString}`
  }
}

function create (contentType, options = {}) {
  function listUrl (params = {}) {
    const url = process.env.VUE_APP_API_URL + listPath(contentType, options)
    return urlWithQuery(url, params)
  }

  function getUrl (id, params = {}) {
    const url = listUrl() + '/' + id
    return urlWithQuery(url, params)
  }

  function handleSaveError (error) {
    throw getIn(error, 'response.data')
  }

  function get (id, params = {}) {
    const defaultParams = {relationshipLevels: 1}
    params = merge(defaultParams, params)
    const url = getUrl(id, params)
    return getRequest(url)
  }

  function list (options = {}) {
    const defaultParams = {}
    const params = merge(defaultParams, options.params)
    const url = listUrl(params)
    return listRequest(url)
  }

  function create (doc) {
    return axios.post(listUrl(), doc, {headers: headers()})
      .then(responseDoc)
      .catch(handleSaveError)
  }

  function update (doc) {
    return axios.put(getUrl(doc.id), doc, {headers: headers()})
      .then(responseDoc)
      .catch(handleSaveError)
  }

  function remove (id) {
    return axios.delete(getUrl(id), {headers: headers()})
      .then(responseDoc)
  }

  return {
    listUrl,
    getUrl,
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
  urlWithQuery,
  create,
  headers,
  responseDoc,
  getRequest,
  listRequest,
  httpie
}
