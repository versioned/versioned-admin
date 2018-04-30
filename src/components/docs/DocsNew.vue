<template lang="html">
  <section class="content-item-page">
    <div class="page-title">
        <h1>Ny {{contentType}}</h1>
    </div>
    <docs-form :doc="doc" :schema="schema" @formSubmit="save($event)"></docs-form>
  </section>
</template>

<script>
import router from '@/router'
import DocsForm from '@/components/docs/DocsForm'
import Swagger from '@/services/swagger'
import Api from '@/services/api'
import Alert from '@/services/alert'

export default {
  data: function() {
    return {
      contentType: null,
      schema: null,
      api: null,
      doc: {}
    }
  },
  components: {
    DocsForm
  },
  created() {
    Swagger.get().then(swagger => {
      this.contentType = this.$route.params.contentType
      this.schema = Swagger.schemas(swagger)[this.contentType]
      this.api = Api.create(this.contentType)
    })
  },
  methods: {
    save(doc) {
      this.api.create(doc)
        .then(doc => {
          this.doc = doc
          Alert.setNext('success', 'Saved')
          router.push(`/docs/${this.contentType}/${doc.id}/edit`)
        })
        .catch(result => {
          Alert.set('errors', {title: 'Could not save', errors: result.errors})
        })
    }
  }
}
</script>

<style lang="css">
</style>
