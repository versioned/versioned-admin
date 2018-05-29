import Api from '@/services/api'
import session from '@/services/session'

function create (key) {
  const scope = {spaceId: session.spaceId()}
  return Api.create(key, {scope})
}

export default create
