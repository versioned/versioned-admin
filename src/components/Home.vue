<template>
    <div class="row" v-if="changelog.length > 0">
      <h1>Change History</h1>
      <table class="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Name</th>
            <th>Action</th>
            <th>User</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in changelog" v-bind:key="item.id">
            <td>
              <router-link v-if="item.action !== 'delete'" :to="editUrl(item)">
                {{item.id}}
              </router-link>
              <span v-else>{{item.id}}</span>
            </td>
            <td>
              {{item.doc.type || item.coll}}
            </td>
            <td>{{item.doc.name || item.doc.title}}</td>
            <td>{{item.action}}</td>
            <td>{{item.createdBy}}</td>
            <td>{{item.createdAt | date('YYYY-MM-DD hh:mm') }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="row" v-else>
      <p>
        Welcome! Get started by creating models for your data.
      </p>
    </div>
</template>

<script>
import User from '@/services/user'
import Changelog from '@/services/changelog'

export default {
  data () {
    return {
      changelog: []
    }
  },
  created () {
    this.fetchChangelog()
  },
  methods: {
    fetchChangelog () {
      const params = {}
      const changelog = Changelog({accountId: User.accountId()})
      changelog.list({params})
        .then(changelog => {
          this.changelog = changelog
        })
        .catch(err => {
          console.log('Changelog.list error', err)
        })
    },
    objectName (item) {
      return `${item.doc.type}:${item.doc.id}`
    },
    editUrl (item) {
      return `/docs/${item.doc.type}/${item.doc.id}/edit`
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  td {
    text-align: left;
  }
</style>
