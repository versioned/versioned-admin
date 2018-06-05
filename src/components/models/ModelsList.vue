<template lang="html">
  <div>
    <div class="page-title">
      <h1>Models</h1>
    </div>

    <div class="row">
      <div class="create-new">
        <router-link v-if="canCreate()" class="btn btn-primary" :to="createUrl()">
          Create Model
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
            <th>Name</th>
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
                {{model.name}}
              </router-link>
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
// import router from '@/router'
import User from '@/services/user'
import Model from '@/services/model'

export default {
  data () {
    return {
      models: []
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
      Model(accountId).list().then(models => {
        this.models = models
      })
    },
    editUrl (model) {
      return `/models/${model.id}/edit`
    },
    createUrl () {
      return `/models/new`
    },
    canCreate () {
      // TODO: check if user can create
      return true
    },
    canUpdate () {
      // TODO :check if user can update
      return true
    },
    fields (model) {
      return model.propertiesOrder.filter(p => !this.isRelationship(model, p))
    },
    relationships (model) {
      return model.propertiesOrder.filter(p => this.isRelationship(model, p))
    },
    isRelationship (model, property) {
      return u.getIn(model, `model.schema.properties.${property}.x-meta.relationship`)
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
