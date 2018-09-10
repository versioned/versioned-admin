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
    <model-list-select v-show="showSelect()"
                       :list="results"
                       option-value="id"
                       option-text="_title"
                       :custom-text="optionText"
                       v-model="selected"
                       :placeholder="placeholder"
                       @searchchange="search">
    </model-list-select>
  </div>
</template>

<script>
import {ModelListSelect} from 'vue-search-select'
import Search from '@/services/search'
import session from '@/services/session'
import u from '@/util'

let searchTimeout = null
const DEBOUNCE_INTERVAL = 200

export default {
  props: ['attribute', 'error'],
  data () {
    const toType = u.getIn(this.attribute, 'schema.x-meta.relationship.toType')
    const selectedResults = u.array(this.attribute.value || [])
    const placeholder = (this.isArray() ? `search ${toType} to add` : `search ${toType}`)
    return {
      results: [],
      placeholder,
      selected: null,
      selectedResults
    }
  },
  watch: {
    selected (selected) {
      if (u.notEmpty(selected)) {
        const alreadySelected = this.selectedResults.map(r => r.id).includes(selected.id)
        if (this.isArray() && !alreadySelected) {
          this.selectedResults = this.selectedResults.concat([selected])
        } else {
          this.selectedResults = [selected]
        }
      }
      this.$emit('fieldInput', this.fieldValue(this.selectedResults))
    }
  },
  methods: {
    async search (query) {
      if (u.notEmpty(query)) {
        const space = u.getIn(session.get(), 'space')
        const type = u.getIn(this.attribute, 'schema.x-meta.relationship.toType')
        const options = {filters: `type:${type}`}
        if (searchTimeout) clearTimeout(searchTimeout)
        searchTimeout = setTimeout(async () => {
          const result = await Search({space}).search(query, options)
          if (result) this.results = result.data.hits
        }, DEBOUNCE_INTERVAL)
      } else {
        this.results = []
      }
    },
    itemTitle (item) {
      return item._title || item.title || item.name || [item.type, item.id].join('-')
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
      return item._title
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
  },
  components: {
    ModelListSelect
  }
}
</script>

<style lang="css">
  ul.selected-results {
    margin-bottom: 10px;
  }
</style>
