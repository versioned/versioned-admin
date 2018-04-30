import algoliaClient from 'algoliasearch'
import u from '@/util'

const ENV_VARIABLES = ['VUE_APP_ALGOLIASEARCH_APPLICATION_ID',
                       'VUE_APP_ALGOLIASEARCH_API_KEY_SEARCH',
                       'VUE_APP_ALGOLIASEARCH_INDEX']

function enabled() {
  return ENV_VARIABLES.map(u.envValue).every(u.notEmpty)
}

var CLIENT = null
var INDEX = null

function getIndex() {
  if (INDEX) return INDEX
  CLIENT = algoliaClient(process.env.VUE_APP_ALGOLIASEARCH_APPLICATION_ID, process.env.VUE_APP_ALGOLIASEARCH_API_KEY_SEARCH)
  INDEX = CLIENT.initIndex(process.env.VUE_APP_ALGOLIASEARCH_INDEX)
  return INDEX
}

// See: https://www.algolia.com/doc/api-reference/api-methods/search/
function search(query) {
  if (!enabled()) return Promise.value([])
  return getIndex().search({query})
}

export default {
  enabled,
  search
}
