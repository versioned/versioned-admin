<template lang="html">
  <div>
    <div class="page-title">
      <h1>Models</h1>
    </div>

    <div class="row">
      <div class="create-new">
        <router-link v-if="canCreate()" class="btn btn-primary" :to="createUrl()">
          New Model
        </router-link>
      </div>
    </div>

    <div class="rows-count" v-if="count && count > 20">
      Number of models: {{count}}
    </div>

    <div class="row">
      <table v-if="models.length > 0" class="table table-striped">
        <thead>
          <tr>
            <th>Model</th>
            <th>Data</th>
            <th>Fields</th>
            <th>Relationships</th>
            <th>Updated</th>
            <th>By</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="model in models">
            <td>
              <router-link v-if="canUpdate()" :to="editUrl(model)">
                {{model.name}} Model
              </router-link>
            </td>
            <td>
              <router-link :to="dataUrl(model)">
                {{model.name}} Data: {{documentCount(model)}}
              </router-link>
              <br/>
              <router-link :to="createDataUrl(model)">New {{model.name}}</router-link>
            </td>
            <td>
              {{fields(model).join(', ')}}
            </td>
            <td>
              {{relationships(model).join(', ')}}
            </td>
            <td>
              {{(model.updatedAt || model.createdAt) | date('YYYY-MM-DD hh:mm') }}<br />
              ({{(model.updatedAt || model.createdAt) | timeAgo}})
            </td>
            <td>
              {{(model.updatedBy || model.createdBy).email}}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import u from '@/util'
import {propertyKeys} from '@/models_util'
// import router from '@/router'
import User from '@/services/user'
import Model from '@/services/model'
import DbStats from '@/services/db_stats'
import {capitalize} from '@/client_util'

export default {
  data () {
    return {
      models: [],
      dbStats: {}
    }
  },
  created () {
    this.getModels()
  },
  watch: {
    '$route': 'getModels'
  },
  computed: {
    count () {
      return this.models ? this.models.length : null
    }
  },
  methods: {
    getModels () {
      const accountId = u.getIn(User.get(), 'account.id')
      const spaceId = u.getIn(User.get(), 'space.id')
      const params = {sort: 'name'}
      Model(accountId).list({params}).then(({data}) => {
        this.models = data
        DbStats(spaceId).get().then((data) => {
          this.dbStats = data
        })
      })
    },
    editUrl (model) {
      return `/models/${model.id}/edit`
    },
    createUrl () {
      return `/models/new`
    },
    dataUrl (model) {
      return `/data/${model.coll}`
    },
    createDataUrl (model) {
      return `/data/${model.coll}/new`
    },
    canCreate () {
      // TODO: check if user can create
      return true
    },
    canUpdate () {
      // TODO :check if user can update
      return true
    },
    fieldName (model, property) {
      const fieldPath = `model.schema.properties.${property}.x-meta.field`
      return u.getIn(model, `${fieldPath}.name`) || capitalize(property)
    },
    fields (model) {
      return propertyKeys(model)
        .filter(p => !this.isRelationship(model, p))
        .map(p => this.fieldName(model, p))
    },
    relationships (model) {
      return propertyKeys(model)
        .filter(p => this.isRelationship(model, p))
        .map(p => this.fieldName(model, p))
    },
    isRelationship (model, property) {
      return u.getIn(model, `model.schema.properties.${property}.x-meta.relationship`)
    },
    documentCount (model) {
      return u.getIn(this.dbStats, `${model.coll}.count`)
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
