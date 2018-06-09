<template lang="html">
  <div>
    <input type="text" v-model.lazy="query" v-debounce="300">
    <ul v-if="results.length > 0">
        <li v-for="result in results" :key="result.id">
          {{result.title}}
        </li>
    </ul>
  </div>
</template>

<script>
import debounce from '@/directives/debounce'
import Search from '@/services/search'
import User from '@/services/user'
import u from '@/util'

export default {
  props: ['attribute'],
  data () {
    return {
      query: '',
      results: []
    }
  },
  watch: {
    query () {
      this.search()
    }
  },
  methods: {
    async search () {
      if (u.notEmpty(this.query)) {
        const space = u.getIn(User.get(), 'space')
        const type = u.getIn(this.attribute, 'schema.x-meta.relationship.toType')
        const options = {filters: `type:${type}`}
        const result = await Search({space}).search(this.query, options)
        this.results = result.data.hits
      } else {
        this.results = []
      }
    }
  },
  directives: {debounce}
}
</script>

<style lang="css">
</style>
