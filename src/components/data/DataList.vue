<template lang="html">
  <section>
    <div v-if="models.length > 0">
      <div class="page-title">
        <h1>{{model.name}} Data</h1>
      </div>

      <form class="page-form" @submit.prevent="formSubmit" role="form">
        <div class="form-group">
          <div class="form-input">
            <label name="site">Model</label>
            <select v-model="coll">
              <option v-for="model in models" v-bind:value="model.coll">
                {{model.coll}}
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

      <div class="row" v-if="count">
        <table class="table table-striped">
          <thead>
            <tr>
              <th v-for="label in labels">{{label}}</th>
              <th>Updated</th>
              <th>By</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="doc in docs">
              <td v-for="(attributeValue, index) in doc.attributeValues">
                <router-link v-if="canUpdate() && index === 0" :to="editUrl(doc)">
                  {{attributeValue || '[edit]'}}
                </router-link>
                <span v-else>{{attributeValue}}</span>
              </td>
              <td>
                {{(doc.updatedAt || doc.createdAt) | date('YYYY-MM-DD hh:mm') }}<br />
                ({{(doc.updatedAt || doc.createdAt) | timeAgo}})
              </td>
              <td>
                {{(doc.updatedBy || doc.createdBy).email}}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-else>
      <welcome />
    </div>
  </section>
</template>

<script>
import u from '@/util'
import User from '@/services/user'
import Data from '@/services/data'
import {truncated} from '@/client_util'
import router from '@/router'
import Model from '@/services/model'
import Swagger from '@/services/swagger'
import Welcome from '@/components/Welcome'

function formattedValue (property, value) {
  return truncated(Swagger.stringify(property, value))
}

const ATTRIBUTES_LIMIT = 10

function getAttributes (schema) {
  return Swagger.attributes(schema).slice(0, ATTRIBUTES_LIMIT)
}

function docsWithAttributeValues (docs, schema) {
  const attributeKeys = getAttributes(schema).map(u.property('key'))
  return docs && docs.map(doc => {
    const attributeValues = attributeKeys.map(key => formattedValue(schema.properties[key], doc[key]))
    return u.merge(doc, {
      attributeValues
    })
  })
}

function labels (schema) {
  return getAttributes(schema).map(u.property('label'))
}

export default {
  data () {
    return {
      coll: null,
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
      return this.lookupModel(this.coll)
    }
  },
  methods: {
    getModels () {
      const accountId = u.getIn(User.get(), 'account.id')
      Model(accountId).list().then(body => {
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
      Data(coll).list().then(body => {
        this.schema = schema
        this.labels = labels(schema)
        this.docs = docsWithAttributeValues(body.data, schema)
        this.count = body.count
        router.push(`/data/${coll}`)
      })
    },
    editUrl (doc) {
      return `/data/${this.coll}/${doc.id}/edit`
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
    }
  },
  components: {
    Welcome
  }
}
</script>

<style lang="css">
  div.rows-count {
    margin-top: 10px;
    margin-bottom: 20px;
  }
  table.table {
    margin-top: 20px;
  }
</style>
