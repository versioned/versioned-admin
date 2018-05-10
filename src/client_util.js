function throttle (interval, fn) {
  let timeout = null
  return function () {
    const args = arguments
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => fn.apply(this, args), interval)
  }
}

export default {
  throttle
}
