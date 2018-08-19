<template lang="html">
  <section v-if="doc">
    <div class="page-title">
        <h1>Edit {{model.name}}</h1>
    </div>

    <json-data :jsonData="jsonData" :jsonUrl="jsonUrl"></json-data>

    <data-form ref="dataForm" :doc="doc" :docOrig="docOrig" :schema="schema" :model="model.coll" :isPublished="isPublished" :versions="versions" @fieldChange="fieldChange($event)" @formSubmit="save($event)" @remove="remove($event)"></data-form>
    <div>
      <router-link :to="listUrl()">Return to {{model.name}} Data</router-link>
    </div>
  </section>
</template>

<script>
import u from '@/util'
import session from '@/services/session'
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
      isPublished: false,
      schema: null,
      doc: null,
      docOrig: null,
      versions: []
    }
  },
  computed: {
    canDelete: function () {
      // TODO
      return true
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
      const accountId = u.getIn(session.get(), 'account.id')
      const params = {'filter.coll': this.$route.params.model}
      Model(accountId).list({params}).then(({data}) => {
        if (data.length > 0) {
          this.model = data[0]
          this.isPublished = u.getIn(this.model, 'model.features', []).includes('published')
          this.schema = u.getIn(this.model, 'model.schema')
          const api = Data(this.model.coll)
          const params = {relationshipLevels: 1}
          if (this.isPublished) params.versions = 1
          this.jsonUrl = api.getUrl(this.id, params)
          Api.getRequest(this.jsonUrl).then(doc => {
            this.doc = doc
            if (!this.docOrig) this.docOrig = JSON.parse(JSON.stringify(doc))
            this.versions = u.getIn(doc, 'sys.versions', [])
            this.jsonData = u.prettyJson(this.doc)
          }).catch(() => {
            Alert.set('warning', 'Could not find data')
          })
        } else {
          Alert.set('warning', `Could not find model ${this.$route.params.model}`)
        }
      })
    },
    fieldChange (field) {
      this.doc = u.merge(this.doc, field)
      // this.doc[field.key] = field.value
    },
    async save (doc) {
      Alert.clear()
      try {
        const updatedDoc = await Data(this.model.coll).update(doc)
        this.docOrig = null
        await this.getData()
        if (updatedDoc) {
          Alert.setBoth('success', 'Saved')
        } else {
          Alert.setBoth('warning', 'No Changes')
        }
      } catch (error) {
        this.$refs.dataForm.handleError(error)
      }
    },
    remove () {
      if (confirm('Are you sure?')) {
        Data(this.model.coll).remove(this.doc.id)
          .then(() => {
            router.push(`/data/${this.model.coll}`)
          })
          .catch(error => {
            this.$refs.dataForm.handleError(error)
          })
      }
    },
    listUrl () {
      return `/data/${this.model.coll}`
    }
  }
}
</script>

<style lang="css">
  .versions {
    margin-top: 10px;
  }
</style>
