<template>
  <div>
    <div class="changes table table-striped">
      <table>
        <thead>
          <th>Field</th>
          <th>From</th>
          <th>To</th>
        </thead>
        <tbody>
          <tr v-for="(value, key) in changes" :key="key">
            <td>{{key}}</td>
            <td>{{stringify(value.from)}}</td>
            <td>{{stringify(value.to)}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import u from '@/util'
import diff from '@/diff'
import {truncated} from '@/client_util'

export default {
  props: ['from', 'to'],
  data () {
    return {
    }
  },
  computed: {
    changes () {
      const excludedKeys = ['versionToken', 'firstPublishedAt', 'lastPublishedAt', 'updatedBy', 'updatedAt']
      return Object.entries(diff(this.from, this.to)).reduce((acc, [key, change]) => {
        if (!excludedKeys.includes(key)) {
          acc[key] = {
            from: (u.getIn(change, 'changed.from') || u.getIn(change, 'deleted')),
            to: (u.getIn(change, 'changed.to') || u.getIn(change, 'added'))
          }
        }
        return acc
      }, {})
    }
  },
  methods: {
    stringify (value) {
      return truncated(value)
    },
    toggle (objName, property) {
      this[objName] = u.evolveAll((this[objName] || {}), {[property]: (v) => !v})
    },
    show (objName, property) {
      return this[objName] && this[objName][property]
    }
  }
}
</script>

<style scoped>
</style>
