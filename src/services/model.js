import Api from '@/services/api'

function create (spaceId) {
  return Api.create('models', {scope: {spaceId}})
}

export default create
