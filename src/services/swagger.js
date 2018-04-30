import axios from 'axios'
import u from '@/util'

let _swagger = null

function get() {
  if (!_swagger) {
    const swaggerUrl = process.env.VUE_APP_API_URL + '/swagger.json'
    _swagger = axios.get(swaggerUrl)
      .then(response => {
        return u.getIn(response, 'data')
      })
  }
  return _swagger
}

function parseDefinitionKey(key) {
  const result = key.match(/^(.+)_(read|write)$/)
  if (result) {
    return {contentType: result[1], action: result[2]}
  } else {
    return {}
  }
}

function contentTypes(swagger) {
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

function schemas(swagger) {
  const types = contentTypes(swagger)
  return Object.keys(types).reduce((result, contentType) => {
    result[contentType] = u.getIn(types, contentType, 'read')
    return result
  }, {})
}

function listPath(contentType) {
  return `/${contentType}`
}

function getPath(contentType) {
  return `/${contentType}/{id}`
}

function deleteEndpoint(swagger, contentType) {
  return u.getIn(swagger.paths[getPath(contentType)], 'delete')
}

function canDelete(swagger, contentType) {
  const adminDelete = u.getIn(schemas(swagger)[contentType], 'x-meta', 'admin_delete')
  return deleteEndpoint(swagger, contentType) && adminDelete !== false
}

function createEndpoint(swagger, contentType) {
  return u.getIn(swagger.paths[listPath(contentType)], 'post')
}

function canCreate(swagger, contentType) {
  const adminCreate = u.getIn(schemas(swagger)[contentType], 'x-meta', 'admin_create')
  return createEndpoint(swagger, contentType) && adminCreate !== false
}

function updateEndpoint(swagger, contentType) {
  return u.getIn(swagger.paths[getPath(contentType)], 'put')
}

function canUpdate(swagger, contentType) {
  const adminUpdate = u.getIn(schemas(swagger)[contentType], 'x-meta', 'admin_update')
  return updateEndpoint(swagger, contentType) && adminUpdate !== false
}

function label(key, propertySchema) {
  return u.getIn(propertySchema, 'x-meta', 'label') || key
}

function help(key, propertySchema) {
  return u.getIn(propertySchema, 'x-meta', 'admin_help')
}

function formField(key, propertySchema) {
  return u.getIn(propertySchema, 'x-meta', 'form_field')
}

function canReadProperty(propertySchema) {
  return u.getIn(propertySchema, 'x-meta', 'admin') !== false &&
    u.getIn(propertySchema, 'x-meta', 'admin_read') !== false
}

function canWriteProperty(propertySchema) {
  return u.getIn(propertySchema, 'x-meta', 'api_writable') !== false &&
    u.getIn(propertySchema, 'x-meta', 'admin') !== false &&
    u.getIn(propertySchema, 'x-meta', 'admin_write') !== false
}

function propertyNames(schema) {
  return u.getIn(schema, 'x-meta', 'admin_properties') || Object.keys(schema.properties)
}

function attributes(schema, doc) {
  return propertyNames(schema).map(key => {
    const propertySchema = schema.properties[key]
    const value = u.getIn(doc, key)
    return {
      key,
      label: label(key, propertySchema),
      help: help(key, propertySchema),
      form_field: formField(key, propertySchema),
      schema: propertySchema,
      value
    }
  })
}

function writeAttributes(schema, doc) {
  return attributes(schema, doc).filter(attribute => canWriteProperty(attribute.schema))
}

function readAttributes(schema, doc) {
  return attributes(schema, doc).filter(attribute => !canWriteProperty(attribute.schema))
}

function stringify(propertySchema, value) {
  if (u.nil(value)) {
    return ''
  } else if (propertySchema.type === 'date') {
    return new Date(value).toString()
  // } else if (u.getIn(propertySchema, 'x-meta', 'translated')) {
  //   return LANGUAGES.map(site => value[site]).find(u.notNil)
  } else {
    return JSON.stringify(value, null, 4)
  }
}

function adminEnabledContentTypes(schemas) {
  return Object.keys(schemas).filter(key => u.getIn(schemas[key], 'x-meta', 'admin_properties'))
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
  adminEnabledContentTypes
}
