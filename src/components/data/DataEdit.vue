<template lang="html">
  <section v-if="doc">
    <div class="page-title">
        <h1>Edit {{model}}</h1>
    </div>
    <data-form :doc="doc" :schema="schema" @formSubmit="save($event)"></data-form>
    <div v-if="canDelete">
      <a href="#" @click="remove">Delete</a>
    </div>
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
      id: null,
      model: null,
      schema: null,
      doc: null
    }
  },
  computed: {
    canDelete: function () {
      // TODO
      return true
      // if (this.swagger && this.contentType) {
      //   return Swagger.canDelete(this.swagger, this.contentType)
      // } else {
      //   return null
      // }
    }
  },
  components: {
    DataForm
  },
  created () {
    this.getData()
  },
  watch: {
    '$route': 'getData'
  },
  methods: {
    getData () {
      this.id = this.$route.params.id
      console.log('pm debug getData', this.$route.params)
      const accountId = u.getIn(User.get(), 'account.id')
      const params = {'filter.coll': this.$route.params.model}
      Model(accountId).list({params}).then(models => {
        if (models.length > 0) {
          const model = models[0]
          this.model = model.coll
          this.schema = u.getIn(model, 'model.schema')
          Data(this.model).get(this.id).then(doc => {
            this.doc = doc
          }).catch(error => {
            Alert.set('error', 'Could not find data')
          })
        } else {
          Alert.set('error', `Could not find model ${this.$route.params.model}`)
        }
      })
    },
    save (doc) {
      Data(this.model).update(doc)
        .then(doc => {
          if (doc) this.doc = doc
          Alert.set('success', 'Saved')
        })
        .catch(result => {
          Alert.set('errors', {title: 'Could not save', errors: result.errors})
        })
    },
    remove () {
      if (confirm('Are you sure?')) {
        Data(this.model).remove(this.doc.id)
          .then(() => {
            router.push(`/data/${this.model}`)
          })
      }
    }
  }
}
</script>

<style lang="css">
</style>