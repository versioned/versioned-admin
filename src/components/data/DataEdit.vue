<template lang="html">
  <section v-if="doc">
    <div class="page-title">
        <h1>Edit {{modelName}}</h1>
    </div>

    <json-data :jsonData="jsonData" :jsonUrl="jsonUrl"></json-data>

    <data-form ref="dataForm" :doc="doc" :schema="schema" :model="model" @formSubmit="save($event)" @remove="remove($event)"></data-form>
    <div>
      <router-link :to="listUrl()">Return to {{modelName}} Data</router-link>
    </div>
  </section>
</template>

<script>
import u from '@/util'
import User from '@/services/user'
import router from '@/router'
import DataForm from '@/components/data/DataForm'
import Api from '@/services/api'
import Data from '@/services/data'
import Model from '@/services/model'
import Alert from '@/services/alert'
import JsonData from '@/components/JsonData'

export default {
  data: function () {
    return {
      jsonData: null,
      jsonUrl: null,
      id: null,
      model: null,
      modelName: null,
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
    DataForm,
    JsonData
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
      const accountId = u.getIn(User.get(), 'account.id')
      const params = {'filter.coll': this.$route.params.model}
      Model(accountId).list({params}).then(({data}) => {
        if (data.length > 0) {
          const model = data[0]
          this.model = model.coll
          this.modelName = model.name
          this.schema = u.getIn(model, 'model.schema')
          const api = Data(this.model)
          this.jsonUrl = api.getUrl(this.id, {relationshipLevels: 1})
          Api.getRequest(this.jsonUrl).then(doc => {
            this.doc = doc
            this.jsonData = u.prettyJson(this.doc)
          }).catch(() => {
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
          Alert.setBoth('success', 'Saved')
        })
        .catch(error => {
          this.$refs.dataForm.handleError(error)
        })
    },
    remove () {
      if (confirm('Are you sure?')) {
        Data(this.model).remove(this.doc.id)
          .then(() => {
            router.push(`/data/${this.model}`)
          })
          .catch(error => {
            this.$refs.dataForm.handleError(error)
          })
      }
    },
    listUrl () {
      return `/data/${this.model}`
    }
  }
}
</script>

<style lang="css">
</style>
