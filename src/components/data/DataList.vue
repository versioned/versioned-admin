<template lang="html">
  <section>
    <div class="page-title">
      <h1>{{model.name}} Data</h1>
    </div>

    <form class="page-form" @submit.prevent="formSubmit" role="form">
      <div class="form-group">
        <div class="form-input">
          <label name="site">Model</label>
          <select v-model="coll">
            <option v-for="model in models" v-bind:value="model.coll">
              {{model.name}}
            </option>
          </select>
        </div>
      </div>
    </form>

    <div class="create-new">
      <router-link v-if="canCreate()" class="btn btn-primary" :to="createUrl()">
        New {{model.name}}
      </router-link>
    </div>

    <div class="rows-count" v-if="count">
      Number of documents: {{count}}
    </div>

    <json-data :jsonData="jsonData" :jsonUrl="jsonUrl"></json-data>

    <div class="row" v-if="count">
      <table class="table table-striped">
        <thead>
          <tr>
            <th v-for="attribute in attributes">{{attribute.label}}</th>
            <th>Publish Status</th>
            <th>Updated</th>
            <th>By</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="doc in docs" :class="rowClass(doc)">
            <td v-for="(attribute, index) in attributes" :class="attributeClass(attribute)">
              <router-link v-if="canUpdate() && index === 0" :to="editUrl(doc)" class="edit-data">
                {{stringify(attribute, doc[attribute.key]) || '[edit]'}}
              </router-link>
              <span v-else-if="attribute.meta && attribute.meta.relationship" v-html="relationshipLinks(attribute, doc)">
              </span>
              <span v-else>
                {{stringify(attribute, doc[attribute.key])}}
              </span>
            </td>

            <td>
              <publish-status :doc="doc"></publish-status>
            </td>
            <td>
              {{doc.updatedAt | date('YYYY-MM-DD hh:mm') }}<br />
              ({{doc.updatedAt | timeAgo}})
            </td>
            <td>
              {{doc.updatedBy.email}}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script>
import u from '@/util'
import Api from '@/services/api'
import session from '@/services/session'
import Data from '@/services/data'
import {truncated} from '@/client_util'
import router from '@/router'
import Model from '@/services/model'
import Swagger from '@/services/swagger'
import JsonData from '@/components/JsonData'
import PublishStatus from '@/components/data/PublishStatus'

const ATTRIBUTES_LIMIT = 10
const ARRAY_LIMIT = 10

export default {
  data () {
    return {
      jsonData: null,
      jsonUrl: null,
      coll: null,
      schema: null,
      attributes: [],
      models: [],
      labels: [],
      docs: [],
      count: 0
    }
  },
  created () {
    this.getModels()
  },
  watch: {
    '$route': 'getModels',
    coll: function (coll) {
      this.getData(coll)
    }
  },
  computed: {
    model () {
      return this.lookupModel(this.coll) || {}
    }
  },
  methods: {
    getModels () {
      const spaceId = u.getIn(session.get(), 'space.id')
      Model(spaceId).list().then(body => {
        // this.swagger = swagger
        // this.schemas = Swagger.schemas(swagger)
        this.models = body.data
        this.coll = this.$route.params.model || u.getIn(this.models, '0.coll')
      })
    },
    lookupModel (coll) {
      return this.models.find(m => m.coll === coll)
    },
    getData (coll) {
      const schema = u.getIn(this.lookupModel(coll), 'model.schema')
      const params = {relationshipLevels: 1}
      const api = Data(coll)
      this.jsonUrl = api.listUrl(params)
      return Api.listRequest(this.jsonUrl).then(body => {
        this.schema = schema
        this.attributes = this.getAttributes(schema)
        this.docs = body.data
        this.count = body.count
        this.jsonData = u.prettyJson(this.docs)
        router.push(`/data/${coll}`)
      })
    },
    array (value) {
      if (u.empty(value)) return []
      return u.array(value).slice(0, ARRAY_LIMIT)
    },
    relationshipLinks (attribute, doc) {
      const value = doc[attribute.key]
      if (u.empty(value)) return undefined
      let links = u.array(value).map((doc) => {
        const label = doc.title || doc.name || doc.id
        return `<a href="/#/data/${doc.type}/${doc.id}/edit">${label}</a>`
      })
      if (links.length > ARRAY_LIMIT) {
        links = links.slice(0, ARRAY_LIMIT)
        links.push('...')
      }
      return links.join(', ')
    },
    stringify (attribute, value) {
      if (u.empty(value)) return undefined
      return truncated(Swagger.stringify(attribute.schema, value))
    },
    getAttributes (schema) {
      return Swagger.attributes(schema).slice(0, ATTRIBUTES_LIMIT)
    },
    editUrl (doc) {
      return `/data/${doc.type}/${doc.id}/edit`
    },
    createUrl () {
      return `/data/${this.coll}/new`
    },
    canCreate () {
      // TODO
      return true
      // if (this.swagger && this.model) {
      //   return Swagger.canCreate(this.swagger, this.model)
      // } else {
      //   return false
      // }
    },
    canUpdate () {
      // TODO
      return true
      // if (this.swagger && this.model) {
      //   return Swagger.canUpdate(this.swagger, this.model)
      // } else {
      //   return false
      // }
    },
    rowClass (doc) {
      return `data-list-row ${doc.type}-${doc.id}`
    },
    attributeClass (attribute) {
      return `field-${attribute.key}`
    }
  },
  components: {
    JsonData,
    PublishStatus
  }
}
</script>

<style lang="css">
  .json-data {
    margin-top: 10px;
  }
  div.rows-count {
    margin-top: 10px;
    margin-bottom: 20px;
  }
  table.table {
    margin-top: 20px;
  }
</style>
