import u from './util'
import session from '@/services/session'

export function isLoggedIn () {
  return session.isLoggedIn()
}

export function isAdmin () {
  return session.isAdmin()
}

export function hasCurrentSpace () {
  return u.notEmpty(session.get('space'))
}

export function title (schema, doc) {
  const titleProperty = u.getIn(schema, 'x-meta.titleProperty')
  const defaultTitle = [doc.type, doc.id].join('-')
  return doc[titleProperty] || defaultTitle
}

export function thumbnailUrl (asset) {
  const IMAGE_PATH = '/image/upload/'
  if (asset.url && asset.url.includes(IMAGE_PATH) && asset.fileType === 'image' && asset.fileExtension !== 'pdf') {
    return asset.url.replace(IMAGE_PATH, `${IMAGE_PATH}g_face,c_thumb,w_150,h_150/`)
  } else {
    return undefined
  }
}

export default {
  isLoggedIn,
  isAdmin,
  hasCurrentSpace,
  title,
  thumbnailUrl
}
