import Api from '@/services/api'

function create (scope) {
  return Api.create('changelog', {scope})
}

export default create
