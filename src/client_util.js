import u from '@/util'

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

export function debounce (fn, interval) {
  let timeout = null
  return function () {
    const args = arguments
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => fn.apply(this, args), interval)
  }
}

export function truncated (string, limit = 50) {
  if (string && string.length > limit) {
    return string.substring(0, limit) + '...'
  } else {
    return string
  }
}

export default {
  capitalize,
  timeAgo,
  debounce,
  truncated
}
