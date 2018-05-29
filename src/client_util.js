export function throttle (interval, fn) {
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
  throttle,
  truncated
}
