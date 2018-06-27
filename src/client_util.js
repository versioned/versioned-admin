import u from './util'

export function capitalize (string) {
  if (u.empty(string)) return string
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export function timeAgo (time) {
  if (!time) return undefined
  const date = (typeof time === 'string' ? new Date(time) : time)
  const now = new Date()
  const minutes = (now - date) / 60000
  if (minutes < 0) return undefined
  if (minutes < 1) {
    return 'less than a minute ago'
  } else if (minutes < 45) {
    return `${minutes.toFixed()} minutes ago`
  } else if (minutes < 1200) { // 20 hours
    return `${(minutes / 60).toFixed()} hours ago`
  } else if (minutes < 40320) { // 28 days
    return `${(minutes / 1440).toFixed()} days ago`
  } else if (minutes < 475200) { // 11 months
    return `${(minutes / 43200).toFixed()} months ago`
  } else {
    return `${(minutes / 525600).toFixed()} years ago`
  }
}

export function debounce (fn, interval = 200) {
  let timeout = null
  return function () {
    const args = arguments
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => fn.apply(this, args), interval)
  }
}

export function truncated (value, limit = 50) {
  if (u.nil(value)) return ''
  const string = typeof value === 'object' ? JSON.stringify(value) : value.toString()
  if (string && string.length > limit) {
    return string.substring(0, limit) + '...'
  } else {
    return string
  }
}

// TODO: use isomporphic library instead? https://github.com/unshiftio/url-parse
export function parseUrl (url) {
  const parser = document.createElement('a')
  parser.href = url
  // hostname, pathname, search, protocol, port, search, hash, host
  return parser
}

export function rootUrl (urlString) {
  const url = parseUrl(urlString)
  return `${url.protocol}//${url.host}`
}

export default {
  capitalize,
  timeAgo,
  debounce,
  truncated,
  parseUrl
}
