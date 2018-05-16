import Api from '@/services/api'

function create (accountId) {
  return Api.create('spaces', {scope: {accountId}})
}

export default create
