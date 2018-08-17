import u from './util'
import session from '@/services/session'

export function isLoggedIn () {
  return session.isLoggedIn()
}

export function isAdmin () {
  return session.isAdmin()
}

export function title (schema, doc) {
  const titleProperty = u.getIn(schema, 'x-meta.titleProperty')
  const defaultTitle = [doc.type, doc.id].join('-')
  return doc[titleProperty] || defaultTitle
}

export default {
  isLoggedIn,
  isAdmin,
  title
}
