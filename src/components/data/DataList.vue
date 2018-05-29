<template lang="html">
  <section>
    <div v-if="models.length > 0">
      <div class="page-title">
        <h1>List {{model}}</h1>
      </div>

      <form class="page-form" @submit.prevent="formSubmit" role="form">
        <div class="form-group">
          <div class="form-input">
            <label name="site">Model</label>
            <select v-model="model">
              <option v-for="model in models" v-bind:value="model.coll">
                {{model.coll}}
              </option>
            </select>
          </div>
        </div>
      </form>

      <div class="create-new">
        <router-link v-if="canCreate()" class="btn btn-primary" :to="createUrl()">
          Create {{model}}
        </router-link>
      </div>

      <div class="rows-count" v-if="count && count > 20">
        Number of rows: {{count}}
      </div>

      <div class="row" v-if="count">
        <table class="table table-striped">
          <thead>
            <tr>
              <th v-for="label in labels">{{label}}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="doc in docs">
              <td>
                <router-link v-if="canUpdate()" :to="editUrl(doc)">
                  {{doc.id}}
                </router-link>
                <span v-else>{{doc.id}}</span>
              </td>
              <td v-for="attributeValue in doc.attributeValues">
                {{attributeValue}}
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

function docsWithAttributeValues (docs, schema) {
  const attributeKeys = Swagger.attributes(schema).map(u.property('key'))
  return docs && docs.map(doc => {
    const attributeValues = attributeKeys.map(key => formattedValue(schema.properties[key], doc[key]))
    return u.merge(doc, {
      attributeValues
    })
  })
}

function labels (schema) {
  return ['id'].concat(Swagger.attributes(schema).map(u.property('label')))
}

export default {
  data () {
    return {
      model: null,
      models: [],
      labels: [],
      docs: []
    }
  },
  created () {
    this.getModels()
  },
  watch: {
    '$route': 'getModels',
    model: function (model) {
      this.getData(model)
    }
  },
  computed: {
    count () {
      return this.docs ? this.docs.length : null
    }
  },
  methods: {
    getModels () {
      const accountId = u.getIn(User.get(), 'account.id')
      Model(accountId).list().then(models => {
        // this.swagger = swagger
        // this.schemas = Swagger.schemas(swagger)
        this.models = models
        this.model = this.$route.params.model || u.getIn(this.models, '0.coll')
      })
    },
    getData (model) {
      const modelSpec = this.models.find(m => m.coll === model)
      const schema = u.getIn(modelSpec, 'model.schema')
      Data(model).list().then(docs => {
        this.schema = schema
        this.labels = labels(schema)
        this.docs = docsWithAttributeValues(docs, schema)
        router.push(`/data/${model}`)
      })
    },
    editUrl (doc) {
      return `/data/${this.model}/${doc.id}/edit`
    },
    createUrl () {
      return `/data/${this.model}/new`
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
