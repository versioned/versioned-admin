import Alert from '@/services/alert'

export function handleError (error) {
  const alertErrors = error.errors || (error.message ? [error.message] : [])
  Alert.setBoth('errors', {title: `Errors`, errors: alertErrors})
  const fieldErrors = (error.errors || []).reduce((acc, error) => {
    if (error.field) {
      acc[error.field] = error.message
    }
    return acc
  }, {})
  return fieldErrors
}

export default {
  handleError
}
