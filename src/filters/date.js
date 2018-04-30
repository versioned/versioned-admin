// From: https://github.com/Shangbinbin/vue-date-filter

function padStart(value, length, char) {
  value = value + ''
  var len = length - value.length
  if (len <= 0) {
    return value
  } else {
    return Array(len + 1).join(char) + value
  }
}

export function filter(date, format = 'YYYY-MM-DD hh:mm') {
  var _date = date
  var splitArr = format.split(/(YYYY|MM|DD|hh|mm|ss)+/)
  if (typeof date !== 'object') {
    _date = new Date(date)
  }
  return splitArr.map(function (item) {
    if (item === 'YYYY') {
      return _date.getFullYear()
    }
    if (item === 'MM') {
      return padStart(_date.getMonth() + 1, 2, 0)
    }
    if (item === 'DD') {
      return padStart(_date.getDate(), 2, 0)
    }
    if (item === 'hh') {
      return padStart(_date.getHours(), 2, 0)
    }
    if (item === 'mm') {
      return padStart(_date.getMinutes(), 2, 0)
    }
    if (item === 'ss') {
      return padStart(_date.getSeconds(), 2, 0)
    }
    return item
  }).join('')
}
