<template>
    <div class="row">
      <h1>History</h1>
      <table class="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Title</th>
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
              {{item.doc.type}}
            </td>
            <td>{{item.doc.title}}</td>
            <td>{{item.action}}</td>
            <td>{{item.created_by}}</td>
            <td>{{item.created_at | date('YYYY-MM-DD hh:mm') }}</td>
          </tr>
        </tbody>
      </table>
    </div>
</template>

<script>
import Changelog from '@/services/changelog'

export default {
  data () {
    return {
      changelog: []
    }
  },
  created() {
    this.fetchChangelog()
  },
  methods: {
    fetchChangelog() {
      const params = {'per-page': 100}
      Changelog.list({params})
        .then(changelog => {
          this.changelog = changelog
        })
        .catch(err => {
          console.log('Changelog.list error', err)
        })
    },
    objectName(item) {
      return `${item.doc.type}:${item.doc.id}`
    },
    editUrl(item) {
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
