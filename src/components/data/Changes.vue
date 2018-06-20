<template>
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
</template>

<script>
import u from '@/util'
import {truncated} from '@/client_util'
import DataUtil from '@/data_util'

export default {
  props: ['from', 'to'],
  data () {
    return {
    }
  },
  computed: {
    changes () {
      return DataUtil.changes(this.from, this.to)
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
  div.changes {
    margin-top: 15px;
    margin-bottom: 15px;
  }
</style>
