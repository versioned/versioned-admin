<template>
    <div class="row" v-if="changelog.length > 0">
      <h1>Changelog</h1>
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Type</th>
            <th>Action</th>
            <th>Name</th>
            <th>User</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in changelog" v-bind:key="item.id">
            <td>{{item.model.type}}</td>
            <td>{{item.action}}</td>
            <td>
              <router-link v-if="editUrl(item)" :to="editUrl(item)">
                {{title(item)}}
              </router-link>
              <span v-else>{{title(item)}}</span>
            </td>
            <td>{{item.createdBy.email}}</td>
            <td>
              {{item.createdAt | date('YYYY-MM-DD hh:mm') }}<br />
              ({{item.createdAt | timeAgo}})
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="row" v-else>
      <welcome />
    </div>
</template>

<script>
import u from '@/util'
import User from '@/services/user'
import Changelog from '@/services/changelog'
import Welcome from '@/components/Welcome'

export default {
  data () {
    return {
      changelog: [],
      deleted: {}
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
        .then(({data}) => {
          this.changelog = data
          this.deleted = data.reduce((acc, item) => {
            if (item.action === 'delete') {
              const key = [item.model.type, item.doc.id].join('.')
              acc[key] = true
            }
            return acc
          }, {})
        })
        .catch(err => {
          console.log('Changelog.list error', err)
        })
    },
    objectName (item) {
      return `${item.doc.type}:${item.doc.id}`
    },
    title (item) {
      return item.doc.title || item.doc.name || item.doc.id
    },
    editUrl (item) {
      const key = [item.model.type, item.doc.id].join('.')
      if (!this.deleted[key]) {
        if (u.getIn(item, 'model.schema.x-meta.dataModel')) {
          return `/data/${item.doc.type}/${item.doc.id}/edit`
        } else if (item.model.type === 'models') {
          return `/models/${item.doc.id}/edit`
        }
      }
    }
  },
  components: {
    Welcome
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  td {
    text-align: left;
  }
</style>
