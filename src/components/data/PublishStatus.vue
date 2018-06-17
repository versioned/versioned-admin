<template lang="html">
  <div v-show="doc.version" class="publish-status">
    <span :class="status.className">{{status.label}}</span>
    <span v-show="status.draft" :class="status.draft.className">{{status.draft.label}}</span>
  </div>
</template>

<script>
function className (key) {
  return `badge badge-${key}`
}

function getStatus (doc) {
  let label
  let key
  let draft = {}
  if (doc.publishedVersion) {
    label = 'Published'
    key = 'success'
    if (doc.version > doc.publishedVersion) {
      draft = {label: 'Draft', className: className('warning')}
    }
  } else {
    if (doc.firstPublishedAt) {
      label = 'Unpublished'
      key = 'danger'
    } else {
      label = 'Not Yet Published'
      key = 'warning'
    }
  }
  return {
    label,
    className: className(key),
    draft
  }
}

export default {
  props: ['doc'],
  data: () => {
    return {
      status: {}
    }
  },
  created () {
    this.status = getStatus(this.doc)
  },
  watch: {
    doc (newDoc) {
      this.status = getStatus(newDoc)
    }
  }
}
</script>

<style lang="css">
</style>
