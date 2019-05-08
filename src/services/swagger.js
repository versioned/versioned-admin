import axios from 'axios'
import u from '@/util'
import {propertiesOrder} from '@/models_util'

let _swagger = null

function get () {
  if (!_swagger) {
    const swaggerUrl = process.env.VUE_APP_API_URL + '/swagger.json'
    _swagger = axios.get(swaggerUrl)
      .then(response => {
        return u.getIn(response, 'data')
      })
  }
  return _swagger
}

function parseDefinitionKey (key) {
  const result = key.match(/^(.+)_(read|write)$/)
  if (result) {
    return {contentType: result[1], action: result[2]}
  } else {
    return {}
  }
}

function contentTypes (swagger) {
  return Object.keys(swagger.definitions).reduce((result, key) => {
    const {contentType, action} = parseDefinitionKey(key)
    if (contentType) {
      const schema = swagger.definitions[key]
      return u.setIn(result, [contentType, action], schema)
    } else {
      return result
    }
  }, {})
}

function schemas (swagger) {
  const types = contentTypes(swagger)
  return Object.keys(types).reduce((result, contentType) => {
    result[contentType] = u.getIn(types, `${contentType}.read`)
    return result
  }, {})
}

function listPath (contentType) {
  return `/${contentType}`
}

function getPath (contentType) {
  return `/${contentType}/{id}`
}

function deleteEndpoint (swagger, contentType) {
  return u.getIn(swagger.paths[getPath(contentType)], 'delete')
}

function canDelete (swagger, contentType) {
  const adminDelete = u.getIn(schemas(swagger)[contentType], 'x-meta.admin_delete')
  return deleteEndpoint(swagger, contentType) && adminDelete !== false
}

function createEndpoint (swagger, contentType) {
  return u.getIn(swagger.paths[listPath(contentType)], 'post')
}

function canCreate (swagger, contentType) {
  const adminCreate = u.getIn(schemas(swagger)[contentType], 'x-meta.admin_create')
  return createEndpoint(swagger, contentType) && adminCreate !== false
}

function updateEndpoint (swagger, contentType) {
  return u.getIn(swagger.paths[getPath(contentType)], 'put')
}

function canUpdate (swagger, contentType) {
  const adminUpdate = u.getIn(schemas(swagger)[contentType], 'x-meta.admin_update')
  return updateEndpoint(swagger, contentType) && adminUpdate !== false
}

function label (key, propertySchema) {
  return u.getIn(propertySchema, 'x-meta.field.name') || key
}

function help (key, propertySchema) {
  return u.getIn(propertySchema, 'x-meta.field.help')
}

function canReadProperty (propertySchema) {
  return u.getIn(propertySchema, 'x-meta.readable') !== false
}

function canWriteProperty (propertySchema) {
  return u.getIn(propertySchema, 'x-meta.writable') !== false
}

function attributes (schema, doc) {
  return propertiesOrder(schema).map((key, index) => {
    const propertySchema = schema.properties[key]
    const meta = propertySchema['x-meta'] || {}
    const field = u.getIn(propertySchema, 'x-meta.field', {})
    const relationship = u.getIn(propertySchema, 'x-meta.relationship')
    const value = u.getIn(doc, key)
    return {
      key,
      index,
      label: label(key, propertySchema),
      help: help(key, propertySchema),
      field,
      relationship,
      schema: propertySchema,
      meta,
      value
    }
  })
}

function writeAttributes (schema, doc) {
  return attributes(schema, doc).filter(attribute => canWriteProperty(attribute.schema))
}

function readAttributes (schema, doc) {
  return attributes(schema, doc).filter(attribute => !canWriteProperty(attribute.schema))
}

function getTitle (value) {
  if (u.empty(value)) return ''
  if (typeof value === 'string') return value
  return value.title || value.name || value.id
}

function stringify (value, propertySchema) {
  if (u.nil(value)) {
    return ''
  } else if (u.getIn(propertySchema, 'type') === 'date') {
    return new Date(value).toString()
  // } else if (u.getIn(propertySchema, 'x-meta', 'translated')) {
  //   return LANGUAGES.map(site => value[site]).find(u.notNil)
  } else if (u.isArray(value)) {
    return value.map(getTitle).join(', ')
  } else if (typeof value === 'object' && u.getIn(propertySchema, 'x-meta.relationship')) {
    return getTitle(value)
  } else if (typeof value === 'object') {
    return `Object {${Object.keys(value).join(', ')}}`
  } else {
    return value.toString()
  }
}

function adminEnabledModels (schemas) {
  return Object.keys(schemas).filter(key => u.getIn(schemas[key], 'x-meta.admin_properties'))
}

export default {
  get,
  canDelete,
  canCreate,
  canUpdate,
  schemas,
  attributes,
  canReadProperty,
  canWriteProperty,
  writeAttributes,
  readAttributes,
  stringify,
  adminEnabledModels
}
