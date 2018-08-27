<template>
  <div>
    <h1>Search</h1>

    <div class="search-query">
      <input type="text" ref="query" v-model="query"/>
    </div>

    <div class="row" v-if="results && results.length > 0">
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Title</th>
            <th>Type</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="doc in results" v-bind:key="doc.objectID">
            <td>
              <router-link v-if="editUrl(doc)" :to="editUrl(doc)">
                {{doc._title}}
              </router-link>
              <span v-else>{{doc._title}}</span>
            </td>
            <td>
              {{doc.type}}
            </td>
            <td>
                {{doc.createdAt | date('YYYY-MM-DD hh:mm') }}<br />
                ({{doc.createdAt | timeAgo}})
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import u from '@/util'
import Search from '@/services/search'
import session from '@/services/session'

export default {
  data () {
    return {
      query: '',
      results: []
    }
  },
  mounted () {
    const space = u.getIn(session.get(), 'space')
    this.$refs.query.focus()
    this.$watch('query', () => {
      Search({space}).search(this.query).then((data) => {
        const results = u.getIn(data, 'data.hits')
        if (results) this.results = results
      })
    })
  },
  methods: {
    editUrl (doc) {
      if (doc.type === 'models') {
        return `/models/${doc.id}/edit`
      } else {
        return `/data/${doc.type}/${doc.id}/edit`
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
