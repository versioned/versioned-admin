import axios from 'axios'
import User from '@/services/user'
import u from '@/util'
import router from '@/router'

function create(contentType) {
  const listUrl = process.env.VUE_APP_API_URL + '/' + contentType
  function getUrl(id) {
    return listUrl + '/' + id + '?relationships=1'
  }
  function wrap(item) {
    return {data: {attributes: item}}
  }
  function responseDoc(response) {
    return u.getIn(response, 'data', 'data', 'attributes')
  }
  function responseList(response) {
    const data = u.getIn(response, 'data', 'data')
    return data && data.map(u.property('attributes'))
  }
  function errorMessages(error) {
    return u.getIn(error, 'response', 'data', 'errors').map(u.property('message'))
  }
  function handleSaveError(error) {
    if (u.getIn(error, 'response', 'status') === 422) {
      throw {errors: errorMessages(error)}
    } else {
      throw error
    }
  }
  function headers() {
    return User.authHeader()
  }
  function get(id) {
    return axios.get(getUrl(id), {headers: headers()})
      .then(responseDoc)
  }
  function list(options = {}) {
    const params = u.merge({'per-page': 500}, options.params)
    return axios.get(listUrl, {params, headers: headers()})
      .then(responseList)
  }
  function create(doc) {
    return axios.post(listUrl, wrap(doc), {headers: headers()})
      .then(responseDoc)
      .catch(handleSaveError)
  }
  function update(doc) {
    return axios.put(getUrl(doc.id), wrap(doc), {headers: headers()})
      .then(responseDoc)
      .catch(handleSaveError)
  }
  function remove(doc) {
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
