import u from '@/util'
import diff from '@/diff'

function convertRelObjectsToIds (doc) {
  if (!doc) return doc
  const convert = (value) => (u.getIn(value, 'id') && u.getIn(value, 'type')) ? u.pick(value, ['id', 'type']) : value
  return Object.entries(doc).reduce((acc, [key, value]) => {
    acc[key] = u.isArray(value) ? value.map(convert) : convert(value)
    return acc
  }, {})
}

export function changes (from, to) {
  const excludedKeys = ['versionToken', 'firstPublishedAt', 'lastPublishedAt', 'updatedBy', 'updatedAt', 'type']
  const _diff = diff.apply(null, [from, to].map(convertRelObjectsToIds).map(u.compact))
  if (!_diff) return {}
  return Object.entries(_diff).reduce((acc, [key, change]) => {
    if (!excludedKeys.includes(key)) {
      acc[key] = {
        from: [u.getIn(change, 'changed.from'), u.getIn(change, 'deleted')].find(u.notEmpty),
        to: [u.getIn(change, 'changed.to'), u.getIn(change, 'added')].find(u.notEmpty)
      }
    }
    return acc
  }, {})
}

export default {
  changes
}
