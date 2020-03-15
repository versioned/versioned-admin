<template lang="html">
  <div class="form-group">
    <ul v-if="selectedResults && selectedResults.length > 0" class="selected-results list-group">
        <li v-for="result in selectedResults" :key="result.id" :class="selectedResultClass(result)">
          <router-link v-if="thumbnailUrl(result)" :to="itemUrl(result)" target="_blank">
            <img :src="thumbnailUrl(result)" class="image-thumbnail">
          </router-link>
          <router-link :to="itemUrl(result)" target="_blank" data-toggle="tooltip" :title="itemTooltip(result)">
            {{itemTitle(result)}}
          </router-link>
          <a href="#" class="remove-relationship" @click.prevent="removeSelectedResult(result)">[-]</a>
        </li>
    </ul>
    <input type="text" class="search form-control" v-model="query" v-show="showSelect()" :placeholder="placeholder"/>
    <div v-if="loading" class="loader">
      <img src="/ajax-loader.gif">
    </div>
    <ul class="search-results">
      <li v-for="result in results">
        <a href="#" v-if="!selectedResultsById[result.id]" @click.prevent="select(result)" :title="itemTooltip(result)">
          {{optionText(result)}}
        </a>
        <span v-else>{{optionText(result)}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import Search from '@/services/search'
import Data from '@/services/data'
import session from '@/services/session'
import u from '@/util'

let searchTimeout = null
const DEBOUNCE_INTERVAL = 200

function getSelectedResultsById (selectedResults) {
  return u.makeObj(selectedResults.map(r => r.id), () => true)
}

export default {
  props: ['models', 'attribute', 'error'],
  data () {
    const toTypes = u.getIn(this.attribute, 'schema.x-meta.relationship.toTypes')
    const selectedResults = u.array(this.attribute.value || [])
    const selectedResultsById = getSelectedResultsById(selectedResults)
    const placeholder = (this.isArray() ? `search to add ${toTypes.join(' or ')}` : `search ${toTypes.join(' or ')}`)
    return {
      loading: false,
      query: '',
      results: [],
      placeholder,
      selectedResults,
      selectedResultsById
    }
  },
  watch: {
    query: 'search',
    selectedResults: function (selectedResults) {
      this.selectedResultsById = getSelectedResultsById(selectedResults)
    }
  },
  methods: {
    async search () {
      if (u.notEmpty(this.query)) {
        if (searchTimeout) clearTimeout(searchTimeout)
        const space = u.getIn(session.get(), 'space')
        const types = u.getIn(this.attribute, 'schema.x-meta.relationship.toTypes', [])
        const externalTypes = types.filter(type => u.getIn(this.models.find(model => model.model.type === type), 'external'))
        const search = Search({space})
        let searchFunction
        if (search.enabled && !(types.length === 1 && externalTypes.length === 1)) {
          const filters = types.map(type => `type:${type}`).join(' OR ')
          const options = {filters}
          searchFunction = async () => {
            const result = await search.search(this.query, options)
            if (result) this.results = result.data.hits
            this.loading = false
          }
        } else {
          const api = Data(types[0])
          const id = (this.query.match(/^\s*id:(\w+)\s*$/) || [])[1]
          if (id) {
            searchFunction = async () => {
              const result = await api.get(id)
              if (result) this.results = [result]
              this.loading = false
            }
          } else {
            searchFunction = async () => {
              const result = await api.list({params: {q: this.query}})
              if (u.notEmpty(this.query) && result) {
                this.results = result.data
              } else {
                this.results = []
              }
              this.loading = false
            }
          }
        }
        this.loading = true
        searchTimeout = setTimeout(searchFunction, DEBOUNCE_INTERVAL)
      } else {
        this.results = []
      }
    },
    select (result) {
      if (u.notEmpty(result)) {
        const alreadySelected = this.selectedResults.map(r => r.id).includes(result.id)
        if (this.isArray()) {
          if (!alreadySelected) this.selectedResults = this.selectedResults.concat([result])
        } else {
          this.selectedResults = [result]
        }
      }
      this.results = []
      this.query = ''
      this.$emit('fieldInput', this.fieldValue(this.selectedResults))
    },
    itemTitle (item) {
      const title = item._title || item.title || item.name || [item.type, item.id].join('-')
      return u.isObject(title) ? Object.values(title)[0] : title
    },
    itemUrl (item) {
      if (item.type === 'assets') {
        return `/assets/${item.id}/edit`
      } else {
        return `/data/${item.type}/${item.id}/edit`
      }
    },
    itemTooltip (item) {
      return u.prettyJson(item)
    },
    isArray () {
      return u.getIn(this.attribute, 'schema.type') === 'array'
    },
    showSelect () {
      return this.isArray() || u.empty(this.selectedResults)
    },
    optionText (item) {
      return item._title || item.title
    },
    removeSelectedResult (result) {
      this.selectedResults = this.selectedResults.filter(r => r.id !== result.id)
      this.$emit('fieldInput', this.fieldValue(this.selectedResults))
    },
    fieldValue (selectedResults) {
      return this.isArray() ? selectedResults : (u.first(selectedResults) || null)
    },
    selectedResultClass (result) {
      return `list-group-item ${result.type}-${result.id}`
    }
  }
}
</script>

<style lang="css">
ul.selected-results {
  margin-bottom: 10px;
}
ul.search-results {
  margin-top: 10px;
}
</style>
