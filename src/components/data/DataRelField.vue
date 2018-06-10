<template lang="html">
  <div class="form-group">
    <ul v-if="selectedResults && selectedResults.length > 0" class="selected-results list-group">
        <li v-for="result in selectedResults" :key="result.id" class="list-group-item" @click.prevent="removeSelectedResult(result)">
          {{result.title}}
          <a href="#" @click.prevent="removeSelectedResult(result)">[-]</a>
        </li>
    </ul>
    <model-list-select v-show="showSelect()"
                       :list="results"
                       option-value="id"
                       option-text="title"
                       v-model="selected"
                       :placeholder="placeholder"
                       @searchchange="search">
    </model-list-select>
  </div>
</template>

<script>
import { ModelListSelect } from 'vue-search-select'
import debounce from '@/directives/debounce'
import Search from '@/services/search'
import User from '@/services/user'
import u from '@/util'

export default {
  props: ['attribute'],
  data () {
    const toType = u.getIn(this.attribute, 'schema.x-meta.relationship.toType')
    const selectedResults = u.array(this.attribute.value || [])
    const placeholder = (this.isArray() ? `search ${toType} to add` : `search ${toType}`)
    this.$emit('fieldInput', this.fieldValue(selectedResults))
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
        const space = u.getIn(User.get(), 'space')
        const type = u.getIn(this.attribute, 'schema.x-meta.relationship.toType')
        const options = {filters: `type:${type}`}
        const result = await Search({space}).search(query, options)
        this.results = result.data.hits
      } else {
        this.results = []
      }
    },
    isArray () {
      return u.getIn(this.attribute, 'schema.type') === 'array'
    },
    showSelect () {
      return this.isArray() || u.empty(this.selectedResults)
    },
    removeSelectedResult (result) {
      this.selectedResults = this.selectedResults.filter(r => r.id !== result.id)
      this.$emit('fieldInput', this.fieldValue(this.selectedResults))
    },
    fieldValue (selectedResults) {
      const ids = selectedResults.map(doc => doc.id)
      return this.isArray() ? ids : (u.first(ids) || null)
    }
  },
  directives: {debounce},
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
