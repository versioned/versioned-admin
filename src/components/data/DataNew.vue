<template lang="html">
  <section v-if="model">
    <div class="page-title">
        <h1>New {{modelName}}</h1>
    </div>
    <data-form ref="dataForm" :doc="doc" :schema="schema" :models="models" :model="model" @fieldChange="fieldChange($event)" @formSubmit="save($event)"></data-form>
  </section>
</template>

<script>
import u from '@/util'
import session from '@/services/session'
import router from '@/router'
import DataForm from '@/components/data/DataForm'
import Data from '@/services/data'
import Model from '@/services/model'
import Alert from '@/services/alert'

export default {
  data: function () {
    return {
      model: null,
      models: [],
      modelName: null,
      schema: null,
      doc: {}
    }
  },
  components: {
    DataForm
  },
  created () {
    const spaceId = u.getIn(session.get(), 'space.id')
    Model(spaceId).list().then(({data}) => {
      if (data.length > 0) {
        const model = data.find(model => model.coll === this.$route.params.model)
        this.model = model.coll
        this.models = data
        this.modelName = model.name
        this.schema = u.getIn(model, 'model.schema')
        const translatedProperties = u.keys(u.filter(this.schema.properties, (p) => u.getIn(p, 'x-meta.translated')))
        this.doc = u.makeObj(translatedProperties, () => ({}))
      } else {
        Alert.set('warning', `Could not find model ${this.$route.params.model}`)
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
          Alert.setBoth('success', 'Saved', {when: 'next'})
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
