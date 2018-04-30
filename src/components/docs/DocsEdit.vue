<template lang="html">
  <section class="content-item-page">
    <div class="page-title">
        <h1>Edit {{contentType}} {{id}}</h1>
    </div>
    <docs-form :doc="doc" :schema="schema" @formSubmit="save($event)"></docs-form>
    <div v-if="canDelete">
      <a href="#" @click="remove">Ta bort</a>
    </div>
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
      id: null,
      contentType: null,
      swagger: null,
      schema: null,
      api: null,
      doc: {}
    }
  },
  computed: {
    canDelete: function() {
      if (this.swagger && this.contentType) {
        return Swagger.canDelete(this.swagger, this.contentType)
      } else {
        return null
      }
    }
  },
  components: {
    DocsForm
  },
  created() {
    this.getDoc()
  },
  watch: {
    '$route': 'getDoc'
  },
  methods: {
    getDoc() {
      Swagger.get().then(swagger => {
        this.id = this.$route.params.id
        this.contentType = this.$route.params.contentType
        this.swagger = swagger
        this.schema = Swagger.schemas(swagger)[this.contentType]
        this.api = Api.create(this.contentType)
        this.api.get(this.id).then(doc => {
          this.doc = doc
        })
      })
    },
    save(doc) {
      this.api.update(doc)
        .then(doc => {
          if (doc) this.doc = doc
          Alert.set('success', 'Saved')
        })
        .catch(result => {
          Alert.set('errors', {title: 'Could not save', errors: result.errors})
        })
    },
    remove() {
      if (confirm('Are you sure?')) {
        this.api.remove(this.doc)
          .then(() => {
            router.push(`/docs/${this.contentType}`)
          })
      }
    }
  }
}
</script>

<style lang="css">
</style>
