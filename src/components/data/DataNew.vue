<template lang="html">
  <section v-if="model">
    <div class="page-title">
        <h1>Create {{model}} data</h1>
    </div>
    <data-form :doc="doc" :schema="schema" @formSubmit="save($event)"></data-form>
  </section>
</template>

<script>
import u from '@/util'
import User from '@/services/user'
import router from '@/router'
import DataForm from '@/components/data/DataForm'
import Api from '@/services/api'
import Model from '@/services/model'
import Alert from '@/services/alert'

export default {
  data: function () {
    return {
      model: null,
      schema: null,
      api: null,
      doc: {}
    }
  },
  components: {
    DataForm
  },
  created () {
    const accountId = u.getIn(User.get(), 'account.id')
    const params = {'filter.coll': this.$route.params.model}
    Model(accountId).list({params}).then(models => {
      if (models.length > 0) {
        const model = models[0]
        this.model = model.coll
        this.schema = u.getIn(model, 'model.schema')
        this.api = Api.create(this.model)
      } else {
        Alert.set('error', `Could not find model ${this.$route.params.model}`)
      }
    })
  },
  methods: {
    save (doc) {
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
