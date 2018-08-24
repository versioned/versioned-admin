<template>
  <section>
    <div class="page-title">
        <h1>Changelog</h1>

        <table class="table table-striped" v-if="changelog.length > 0">
          <thead>
            <tr>
              <th>Type</th>
              <th>Action</th>
              <th>Document</th>
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
                  {{itemTitle(item)}}
                </router-link>
                <span v-else>{{itemTitle(item)}}</span>
              </td>
              <td>
                <a href="#" @click.prevent="toggle('showData', item.id)">JSON Data</a>
                <pre v-show="show('showData', item.id)">{{item.doc}}</pre>
              </td>
              <td>
                <a href="#" v-show="item.changes" @click.prevent="toggle('showChanges', item.id)">Changes</a>
                <changes v-if="item.action === 'update' && show('showChanges', item.id)" :from="item.existingDoc" :to="item.doc"></changes>
              </td>
              <td>{{item.createdBy.email}}</td>
              <td>
                {{item.createdAt | date('YYYY-MM-DD hh:mm') }}<br />
                ({{item.createdAt | timeAgo}})
              </td>
            </tr>
          </tbody>
        </table>
        <p v-else>
          No changes yet
        </p>
      </div>
    </section>
</template>

<script>
import u from '@/util'
import {capitalize} from '@/client_util'
import session from '@/services/session'
import Changelog from '@/services/changelog'
import Changes from '@/components/data/Changes'

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
      const spaceId = u.getIn(session.get(), 'space.id')
      const changelog = Changelog({spaceId})
      changelog.list()
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
    itemTitle (item) {
      return item.doc.title || item.doc.name || [item.doc.type, item.doc.id].join('-')
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
    toggle (objName, property) {
      this[objName] = u.evolveAll((this[objName] || {}), {[property]: (v) => !v})
    },
    show (objName, property) {
      return this[objName] && this[objName][property]
    }
  },
  components: {
    Changes
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  td {
    text-align: left;
  }
</style>
