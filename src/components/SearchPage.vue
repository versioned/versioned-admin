<template>
  <div>
    <h1>Search</h1>

    <div v-if="enabled" class="search-query">
      <input type="text" ref="query" v-model="query"/>
    </div>
    <div v-else class="alert alert-warning" role="alert">
      In order to enable full-text search across your data you need to install the Algolia service
    </div>

    <div class="row" v-if="results && results.length > 0">
      <table class="table table-striped">
        <thead>
          <tr>
            <th></th>
            <th>Title</th>
            <th>Type</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="doc in results" v-bind:key="doc.objectID">
            <td>
              <router-link v-if="thumbnailUrl(doc)" :to="assetUrl(doc)">
                <img :src="thumbnailUrl(doc)" class="image-thumbnail">
              </router-link>
            </td>
            <td>
              <router-link v-if="editUrl(doc)" :to="editUrl(doc)">
                {{stringify(doc._title)}}
              </router-link>
              <span v-else>{{stringify(doc._title)}}</span>
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
      results: [],
      enabled: true
    }
  },
  mounted () {
    const space = u.getIn(session.get(), 'space')
    const search = Search({space})
    this.enabled = search.enabled
    this.$refs.query.focus()
    this.$watch('query', () => {
      search.search(this.query).then((data) => {
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
    },
    assetUrl (doc) {
      return `/assets/${doc.id}/edit`
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
