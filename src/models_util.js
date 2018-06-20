import u from '@/util'

// NOTE: want keys ordered but unfortunately can't rely on propertiesOrder being set
export function propertyKeys (model) {
  const properties = u.getIn(model, 'model.schema.properties')
  if (u.empty(properties)) return []
  const allKeys = Object.keys(properties)
  const orderedKeys = model.propertiesOrder || []
  const unorderedKeys = u.difference(allKeys, orderedKeys)
  return orderedKeys.concat(unorderedKeys)
}

export default {
  propertyKeys
}
