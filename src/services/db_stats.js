import Api from '@/services/api'

function create (spaceId) {
  function get () {
    const url = `${process.env.VUE_APP_API_URL}/data/${spaceId}/dbStats.json`
    return Api.getRequest(url)
  }

  return {
    get
  }
}

export default create
