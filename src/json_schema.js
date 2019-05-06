const Ajv = require('ajv')
const ajv = new Ajv({allErrors: true})

export function validate (schema, data) {
  if (!data) return undefined
  const _validate = ajv.compile(schema)
  _validate(data)
  return _validate.errors
}

export default {
  validate
}
