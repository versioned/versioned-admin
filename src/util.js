function nil(value) {
  return value === undefined || value === null
}

function notNil(value) {
  return !nil(value)
}

function empty(value) {
  if (nil(value)) {
    return true
  } else if (Array.isArray(value) || typeof value === 'string') {
    return value.length === 0
  } else if (typeof value === 'object') {
    return Object.keys(value).length === 0
  } else {
    return false
  }
}

function notEmpty(value) {
  return !empty(value)
}

function envValue(key) {
  return process.env[key]
}

function clone(obj) {
  if (obj == null || typeof obj !== 'object') return obj
  var copy = obj.constructor()
  for (const attr in obj) {
    if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr]
  }
  return copy
}

function filter(obj, predicate) {
  if (Array.isArray(obj)) {
    return obj.filter(predicate)
  } else {
    return Object.keys(obj).reduce((result, key) => {
      const value = obj[key]
      if (predicate(value)) result[key] = value
      return result
    }, {})
  }
}

function compact(obj) {
  return filter(obj, notNil)
}

// Like: http://ramdajs.com/docs/#path
function getIn(obj, ...path) {
  let result = obj
  for (const key of path) {
    const value = (result && result[key])
    if (nil(value)) {
      return undefined
    } else {
      result = value
    }
  }
  return result
}

// Like: http://ramdajs.com/docs/#assocPath
function setIn(obj, path, value) {
  const result = nil(obj) ? {} : clone(obj)
  let nested = result
  for (let i = 0; i < path.length - 1; ++i) {
    let value = nested[path[i]]
    if (nil(value)) {
      value = {}
      nested[path[i]] = value
    }
    nested = value
  }
  nested[path[path.length - 1]] = value
  return result
}

function merge(toObj, fromObj) {
  return Object.assign({},
                      (toObj || {}),
                      (fromObj || {}))
}

function pick(keys, obj) {
  return keys.reduce(function(acc, key) {
    const value = obj[key]
    if (value !== undefined) {
      acc[key] = value
    }
    return acc
  }, {})
}

function property(name) {
  return function(obj) {
    return obj ? obj[name] : obj
  }
}

function prettyJson(obj) {
  return obj ? JSON.stringify(obj, null, 4) : undefined
}

function throttle(interval, fn) {
  let timeout = null
  return function() {
    const args = arguments
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => fn.apply(this, args), interval)
  }
}

function array(value) {
  return Array.isArray(value) ? value : [value]
}

function intersection(tags1, tags2) {
  return array(tags1).filter(t => array(tags2).includes(t))
}

export default {
  nil,
  notNil,
  empty,
  notEmpty,
  envValue,
  filter,
  compact,
  getIn,
  setIn,
  pick,
  merge,
  property,
  prettyJson,
  throttle,
  intersection
}
