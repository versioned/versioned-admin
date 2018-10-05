import u from './util'
import {truncated} from '@/client_util'
import session from '@/services/session'
import {languageToCode} from '@/language_codes'
import Swagger from '@/services/swagger'

export function empty (value) {
  return u.empty(value)
}

export function isLoggedIn () {
  return session.isLoggedIn()
}

export function isAdmin (account = null) {
  return session.isAdmin(account)
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

export function stringify (value, schema) {
  if (u.empty(value)) return undefined
  const languages = u.getIn(session.get(), 'space.languages')
  const translated = u.getIn(schema, 'x-meta.translated')
  if ((translated || !schema) && u.notEmpty(languages) && typeof value === 'object') {
    const languageCode = languages.map(languageToCode).find((code) => value[code])
    if (languageCode) value = value[languageCode]
  }
  return truncated(Swagger.stringify(value, schema))
}

export default {
  empty,
  isLoggedIn,
  isAdmin,
  hasCurrentSpace,
  title,
  thumbnailUrl,
  stringify
}
