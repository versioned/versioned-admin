import u from '@/util'
import diff from '@/diff'

export function changes (from, to) {
  const excludedKeys = ['versionToken', 'firstPublishedAt', 'lastPublishedAt', 'updatedBy', 'updatedAt', 'type']
  const _diff = diff(from, to)
  if (!_diff) return {}
  return Object.entries(_diff).reduce((acc, [key, change]) => {
    if (!excludedKeys.includes(key)) {
      acc[key] = {
        from: (u.getIn(change, 'changed.from') || u.getIn(change, 'deleted')),
        to: (u.getIn(change, 'changed.to') || u.getIn(change, 'added'))
      }
    }
    return acc
  }, {})
}

export default {
  changes
}
