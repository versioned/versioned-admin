import u from '@/util'

// NOTE: want keys ordered but unfortunately can't rely on models.propertiesOrder being up-to-date
export function propertiesOrder (schema) {
  const properties = u.getIn(schema, 'properties')
  if (u.empty(properties)) return []
  const allKeys = Object.keys(properties)
  const orderedKeys = u.getIn(schema, 'x-meta.propertiesOrder', []).filter(key => allKeys.includes(key))
  const missingKeys = u.difference(allKeys, orderedKeys)
  return orderedKeys.concat(missingKeys)
}

export default {
  propertiesOrder
}
