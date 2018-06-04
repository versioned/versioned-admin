<template lang="html">
  <div>
    <div class="page-title">
      <h1>Models</h1>
    </div>

    <div class="create-new">
      <router-link v-if="canCreate()" class="btn btn-primary" :to="createUrl()">
        Create Model
      </router-link>
    </div>

    <div class="rows-count" v-if="count && count > 20">
      Number of models: {{count}}
    </div>

    <div class="row">
      <table v-if="models.length > 0" class="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="model in models">
            <td>
              <router-link v-if="canUpdate()" :to="editUrl(model)">
                {{model.name}}
              </router-link>
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
