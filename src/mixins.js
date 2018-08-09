import u from './util'

export function title (schema, doc) {
  const titleProperty = u.getIn(schema, 'x-meta.titleProperty')
  const defaultTitle = [doc.type, doc.id].join('-')
  return doc[titleProperty] || defaultTitle
}

export default {
  title
}
