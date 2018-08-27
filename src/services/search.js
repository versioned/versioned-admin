import axios from 'axios'
import u from '@/util'

function toQueryString (obj) {
  return u.keyValues(obj).map(([key, value]) => {
    return `${key}=${encodeURIComponent(value)}`
  }).join('&')
}

function filters (customFilter, spaceId) {
  const result = [`spaceId:${spaceId}`]
  if (customFilter) result.push(`(${customFilter})`)
  return result.join(' AND ')
}

function create (options = {}) {
  const applicationId = u.getIn(options, 'space.algoliaApplicationId') || process.env.VUE_APP_ALGOLIASEARCH_APPLICATION_ID
  const apiKey = u.getIn(options, 'space.algoliaApiKey') || u.getIn(options, 'space.algoliaSharedApiKey')
  const indexName = u.getIn(options, 'space.algoliaIndexName') || u.getIn(options, 'space.algoliaSharedIndexName')
  const spaceId = u.getIn(options, 'space.id')
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
      filters: filters(options.filters, spaceId)
    }))
    const body = {params}
    return axios.post(url, body, {headers})
  }

  return {
    applicationId,
    apiKey,
    indexName,
    search
  }
}

export default create
