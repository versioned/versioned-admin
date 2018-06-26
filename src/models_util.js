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

export function titleProperty (schema) {
  const propertyNames = u.getIn(schema, 'x-meta.propertiesOrder', u.keys(u.getIn(schema, 'properties')))
  const typicalNames = ['title', 'name']
  const isStringProperty = (name) => u.getIn(schema, `properties.${name}.type`) === 'string'
  return u.getIn(schema, 'x-meta.titleProperty') ||
    find(typicalNames, name => propertyNames.includes(name)) ||
    u.first(u.filter(propertyNames, isStringProperty))
}

export default {
  propertiesOrder,
  titleProperty
}
