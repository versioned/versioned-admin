<template lang="html">
  <div>
    <div class="page-title">
      <h1>List {{contentType}}</h1>
    </div>

    <form class="page-form" @submit.prevent="formSubmit" role="form">
      <div class="form-group">
        <div class="form-input">
          <label name="site">Content Type</label>
          <select v-model="contentType">
            <option v-for="contentType in contentTypes" v-bind:value="contentType">
              {{ contentType }}
            </option>
          </select>
        </div>
      </div>
    </form>

    <div class="create-new">
      <router-link v-if="canCreate()" class="btn btn-primary" :to="createUrl(contentType)">
        Lägg till
      </router-link>
    </div>

    <div class="rows-count" v-if="count">
      Antal rader: {{count}}
    </div>

    <div class="row">
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
</template>

<script>
import u from '@/util'
import router from '@/router'
import Swagger from '@/services/swagger'
import Api from '@/services/api'

const STR_LIMIT = 50

function truncated(string) {
  if (string && string.length > STR_LIMIT) {
    return string.substring(0, STR_LIMIT) + '...'
  } else {
    return string
  }
}

function formattedValue(property, value) {
  return truncated(Swagger.stringify(property, value))
}

function docsWithAttributeValues(docs, schema) {
  const attributeKeys = Swagger.attributes(schema).map(u.property('key'))
  return docs && docs.map(doc => {
    const attributeValues = attributeKeys.map(key => formattedValue(schema.properties[key], doc[key]))
    return u.merge(doc, {
      attributeValues
    })
  })
}

function labels(schema) {
  return ['id'].concat(Swagger.attributes(schema).map(u.property('label')))
}

export default {
  data() {
    return {
      contentType: null,
      contentTypes: null,
      swagger: null,
      schemas: [],
      labels: [],
      docs: []
    }
  },
  created() {
    this.getSwagger()
  },
  watch: {
    '$route': 'getSwagger',
    contentType: function(contentType) {
      Api.create(contentType).list().then(docs => {
        const schema = this.schemas[contentType]
        this.labels = labels(schema)
        this.docs = docsWithAttributeValues(docs, schema)
        router.push(`/docs/${contentType}`)
      })
    }
  },
  computed: {
    count() {
      return this.docs ? this.docs.length : null
    }
  },
  methods: {
    getSwagger() {
      Swagger.get().then(swagger => {
        this.swagger = swagger
        this.schemas = Swagger.schemas(swagger)
        this.contentTypes = Swagger.adminEnabledContentTypes(this.schemas)
        this.contentType = this.$route.params.contentType || this.contentTypes[0]
      })
    },
    editUrl(doc) {
      return `/docs/${this.contentType}/${doc.id}/edit`
    },
    createUrl() {
      return `/docs/${this.contentType}/new`
    },
    canCreate() {
      if (this.swagger && this.contentType) {
        return Swagger.canCreate(this.swagger, this.contentType)
      } else {
        return false
      }
    },
    canUpdate() {
      if (this.swagger && this.contentType) {
        return Swagger.canUpdate(this.swagger, this.contentType)
      } else {
        return false
      }
    }
  }
}
</script>

<style lang="css">
  div.rows-count {
    margin-top: 10px;
    margin-bottom: 20px;
  }
</style>
