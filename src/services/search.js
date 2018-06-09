import axios from 'axios'
import u from '@/util'

function toQueryString (obj) {
  return u.keyValues(obj).map(([key, value]) => {
    return `${key}=${encodeURIComponent(value)}`
  }).join('&')
}

function getConfig (key, options = {}) {
  return u.getIn(options, `space.config.${key}`, process.env[`VUE_APP_${key}`])
}

function getIndexName (config, options = {}) {
  if (u.getIn(options, 'space.config.ALGOLIASEARCH_APPLICATION_ID')) {
    return u.getIn(options, 'space.dbKey')
  } else {
    return process.env.VUE_APP_ALGOLIASEARCH_INDEX_NAME || `versioned2-${process.env.VUE_APP_ENV}`
  }
}

function create (options = {}) {
  const applicationId = getConfig('ALGOLIASEARCH_APPLICATION_ID', options)
  const apiKey = getConfig('ALGOLIASEARCH_API_KEY_SEARCH', options)
  const indexName = getIndexName(options)
  const baseUrl = `https://${applicationId}.algolia.net`
  const headers = {
    'X-Algolia-Application-Id': applicationId,
    'X-Algolia-API-Key': apiKey
  }
  const enabled = applicationId && apiKey

  function search (query, options = {}) {
    if (!enabled) return Promise.resolve({})
    const url = `${baseUrl}/1/indexes/${indexName}/query`
    const params = toQueryString(u.compact({
      query,
      // See: https://www.algolia.com/doc/guides/searching/filtering
      filters: options.filters
    }))
    const body = {params}
    return axios.post(url, body, {headers})
  }

  return {
    search
  }
}

export default create
