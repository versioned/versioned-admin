import Api from '@/services/api'

function create (accountId) {
  return Api.create('models', {scope: {accountId}})
}

export default create
