<template>
    <div class="row">
      <h1>Changelog</h1>
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Type</th>
            <th>Action</th>
            <th>Name</th>
            <th>Data</th>
            <th>Changes</th>
            <th>User</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in changelog" v-bind:key="item.id">
            <td>{{item.model.type}}</td>
            <td>
              {{item.action}}
              <span v-if="item.publishEvent" :class="publishEventClass(item)">{{publishEventLabel(item)}}</span>
            </td>
            <td>
              <router-link v-if="editUrl(item)" :to="editUrl(item)">
                {{title(item)}}
              </router-link>
              <span v-else>{{title(item)}}</span>
            </td>
            <td>
              <a href="#" @click.prevent="toggle('showData', item.id)">JSON Data</a>
              <pre v-show="show('showData', item.id)">{{item.doc}}</pre>
            </td>
            <td>
              <a href="#" v-show="item.changes" @click.prevent="toggle('showChanges', item.id)">Changes</a>
              <table v-if="item.changes && show('showChanges', item.id)" class="changes">
                <thead>
                  <th>Field</th>
                  <th>From</th>
                  <th>To</th>
                </thead>
                <tbody>
                  <tr v-for="(value, key) in changes(item)" :key="key">
                    <td>{{key}}</td>
                    <td>{{stringify(value.from)}}</td>
                    <td>{{stringify(value.to)}}</td>
                  </tr>
                </tbody>
              </table>
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
</template>

<script>
import u from '@/util'
import {capitalize, truncated} from '@/client_util'
import User from '@/services/user'
import Changelog from '@/services/changelog'

export default {
  data () {
    return {
      changelog: [],
      deleted: {},
      showData: {},
      showChanges: {}
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
    publishEventClass (item) {
      if (!item.publishEvent) return undefined
      const klass = {
        'first-publish': 'success',
        'republish': 'primary',
        'publish-change': 'warning',
        'unpublish': 'danger'
      }[item.publishEvent]
      return `badge badge-${klass}`
    },
    publishEventLabel (item) {
      return item.publishEvent && item.publishEvent.split('-').map(capitalize).join(' ')
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
    },
    changes (item) {
      const excludedKeys = ['versionToken', 'firstPublishedAt', 'lastPublishedAt']
      return Object.keys(item.changes || {}).reduce((acc, key) => {
        const change = item.changes[key]
        if (!excludedKeys.includes(key)) {
          acc[key] = {
            from: (u.getIn(change, 'changed.from') || u.getIn(change, 'deleted')),
            to: (u.getIn(change, 'changed.to') || u.getIn(change, 'added'))
          }
          // if (changeTrackedKeys.includes(key) && change) {
          //   acc[key] = change
          // } else {
          //   acc[key] = true
          // }
        }
        return acc
      }, {})
    },
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  td {
    text-align: left;
  }

  ul.changes {
    list-style-type: none;
  }
</style>
