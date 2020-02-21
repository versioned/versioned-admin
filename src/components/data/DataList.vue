<template lang="html">
  <section>
    <div class="page-title">
      <h1>{{model.name}} Data</h1>
    </div>

    <!-- TODO: this dropdown is broken - data in the table doesn't update properly -->
    <!-- <form class="page-form" @submit.prevent="formSubmit" role="form">
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
    </form> -->

    <div class="create-new">
      <router-link v-if="canCreate()" class="btn btn-primary" :to="createUrl()">
        New {{model.name}}
      </router-link>
    </div>

    <div class="rows-count" v-if="count">
       Showing {{docs.length}} out of {{count}} documents
    </div>

    <div class="form-input" v-if="attributes.length > 1">
      Showing
      <select class="nAttributes" v-model="nAttributes">
        <option v-for="n in attributes.length" v-bind:value="n">
          {{n}}
        </option>
      </select>
      out of {{attributes.length}} columns
    </div>

    <div class="form query-form">
      <form @submit.prevent="submitQuery" role="form" class="data-form">
        <label name="query">
          Query <a href="#" @click.prevent="showQueryHelp = !showQueryHelp">?</a>
        </label>
        <div class="queryHelp alert alert-warning" v-show="showQueryHelp">
          <p>
            You can sort and filter the list by entering a query in the field below and clicking enter to submit.
          </p>
          <p>
            Available query fields: {{queryFields.join(', ')}}
          </p>
          <p>
            Search all string fields for the word "stockholm" (creates a regex filter for multiple columns):
            <pre>stockholm</pre>
          </p>
          <p>
            Sort by most recently updated first (this is the default):
            <pre>sort=-updatedAt</pre>
          </p>
          <p>
            Sort by creation time chronologically (oldest first):
            <pre>sort=createdAt</pre>
          </p>
          <p>
            Sort by creation time reverse chronologically (newest first):
            <pre>sort=-createdAt</pre>
          </p>
          <p>
            Sort by creation time and filter out only published content (relevant if model is published):
            <pre>sort=-createdAt&amp;filter.publishedVersion[exists]=true</pre>
          </p>
          <p>
            Filter out all documents where the body field includes the word travel:
            <pre>filter.body[regex]=travel</pre>
          </p>
          <p>
            Filter out all documents where the score field is greater than 5:
            <pre>filter.score[gt]=5</pre>
          </p>
        </div>
        <input type="text" class="form-control" v-model="query">
        <div class="alert alert-danger" v-show="queryError">
          {{queryError}}
        </div>
      </form>
    </div>

    <json-data :jsonData="jsonData" :jsonUrl="jsonUrl" :published="published"></json-data>

    <div class="row" v-if="count">
      <table class="table table-striped data-table">
        <thead>
          <tr>
            <th v-for="attribute in showAttributes">{{attribute.label}}</th>
            <th v-if="published">Publish Status</th>
            <th>Updated</th>
            <th>By</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(doc, index) in docs" :class="rowClass(doc, index)">
            <td v-for="(attribute, index) in showAttributes" :class="attributeClass(attribute)">
              <router-link v-if="canUpdate() && index === 0" :to="editUrl(doc)" class="edit-data">
                {{stringify(doc[attribute.key], attribute.schema) || '[edit]'}}
              </router-link>
              <span v-else-if="attribute.meta && attribute.meta.relationship" v-html="relationshipLinks(attribute, doc)">
              </span>
              <span v-else-if="attribute.schema.type === 'object' && doc[attribute.key]">
                Object: {{'{' + Object.keys(doc[attribute.key]).join(', ') + '}'}}
              </span>
              <span v-else>
                {{stringify(doc[attribute.key], attribute.schema)}}
              </span>
            </td>

            <td v-if="published">
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

      <p>
        <a href="#" ref="loadMore" class="load-more" v-show="hasMoreRows()" @click.prevent="loadMoreDocs()">&raquo; Load more documents</a>
      </p>
    </div>
  </section>
</template>

<script>
import u from '@/util'
import Api from '@/services/api'
import session from '@/services/session'
import Data from '@/services/data'
import router from '@/router'
import Model from '@/services/model'
import Swagger from '@/services/swagger'
import JsonData from '@/components/JsonData'
import PublishStatus from '@/components/data/PublishStatus'

const LIMIT = 100
const ATTRIBUTES_LIMIT = 10
const ARRAY_LIMIT = 10
const DEFAULT_N_ATTRIBUTES = 4

export default {
  data () {
    return {
      jsonData: null,
      jsonUrl: null,
      published: null,
      coll: null,
      schema: null,
      attributes: [],
      models: [],
      labels: [],
      docs: [],
      skip: 0,
      count: 0,
      nAttributes: 0,
      query: '',
      queryError: '',
      queryFields: [],
      showQueryHelp: false
    }
  },
  created () {
    this.getModels()
  },
  watch: {
    '$route': 'getModels',
    coll: function (coll) {
      router.push(`/data/${coll}`)
      this.getData(coll)
    }
  },
  computed: {
    model () {
      return this.lookupModel(this.coll) || {}
    },
    showAttributes () {
      return this.attributes.slice(0, this.nAttributes)
    }
  },
  methods: {
    getModels () {
      const spaceId = u.getIn(session.get(), 'space.id')
      Model(spaceId).list().then(body => {
        this.models = body.data
        this.coll = this.$route.params.model || u.getIn(this.models, '0.coll')
      })
    },
    lookupModel (coll) {
      return this.models.find(m => m.coll === coll)
    },
    submitQuery () {
      this.queryError = ''
      this.docs = []
      this.getData(this.coll)
    },
    getData (coll) {
      this.published = u.getIn(this.lookupModel(coll), 'features', []).includes('published')
      this.schema = u.getIn(this.lookupModel(coll), 'model.schema')
      this.attributes = this.getAttributes(this.schema)
      this.queryFields = ['createdAt', 'updatedAt'].concat(this.attributes.map(a => a.key).join(', '))
      this.nAttributes = Math.min(DEFAULT_N_ATTRIBUTES, this.attributes.length)
      const params = u.merge(this.queryParams(), {relationshipLevels: 1, limit: LIMIT, skip: this.skip})
      const api = Data(coll)
      this.jsonUrl = api.listUrl(params)
      return Api.listRequest(this.jsonUrl).then(body => {
        this.docs = this.docs.concat(body.data)
        this.count = body.count
        this.jsonData = u.prettyJson(this.docs)
      }).catch(error => {
        if (error.response.status === 422) {
          this.queryError = error.response.data.errors[0].message
        }
      })
    },
    queryParams () {
      if (this.query && this.query.includes('=')) {
        return u.tuplesToObj(this.query.split('&').map(q => q.split('=')))
      } else if (this.query) {
        return {q: this.query}
      } else {
        return {}
      }
    },
    hasMoreRows () {
      return this.count > (this.skip + LIMIT)
    },
    async loadMoreDocs () {
      this.skip += LIMIT
      await this.getData(this.coll)
      this.scrollToEnd()
    },
    scrollToEnd () {
      this.$el.querySelector(`.row-${this.skip - 1}`).scrollIntoView()
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
      return true
    },
    canUpdate () {
      return true
    },
    rowClass (doc, index) {
      return `data-list-row ${doc.type}-${doc.id} row-${index}`
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
  .query-form {
    margin-bottom: 10px;
  }
</style>
