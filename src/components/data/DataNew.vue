<template lang="html">
  <section v-if="model">
    <div class="page-title">
        <h1>New {{modelName}}</h1>
    </div>
    <data-form ref="dataForm" :doc="doc" :schema="schema" :model="model" @fieldChange="fieldChange($event)" @formSubmit="save($event)"></data-form>
  </section>
</template>

<script>
import u from '@/util'
import User from '@/services/user'
import router from '@/router'
import DataForm from '@/components/data/DataForm'
import Data from '@/services/data'
import Model from '@/services/model'
import Alert from '@/services/alert'

export default {
  data: function () {
    return {
      model: null,
      modelName: null,
      schema: null,
      doc: {}
    }
  },
  components: {
    DataForm
  },
  created () {
    const accountId = u.getIn(User.get(), 'account.id')
    const params = {'filter.coll': this.$route.params.model}
    Model(accountId).list({params}).then(({data}) => {
      if (data.length > 0) {
        const model = data[0]
        this.model = model.coll
        this.modelName = model.name
        this.schema = u.getIn(model, 'model.schema')
      } else {
        Alert.set('error', `Could not find model ${this.$route.params.model}`)
      }
    })
  },
  methods: {
    fieldChange (field) {
      this.doc = u.merge(this.doc, field)
      // this.doc[field.key] = field.value
    },
    save (doc) {
      Data(this.model).create(doc)
        .then(doc => {
          this.doc = doc
          Alert.setNext('success', 'Saved')
          router.push(`/data/${this.model}/${doc.id}/edit`)
        })
        .catch(error => {
          this.$refs.dataForm.handleError(error)
        })
    }
  }
}
</script>

<style lang="css">
</style>
