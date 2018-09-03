<template lang="html">
  <div>
    <div class="page-title">
      <h1>Assets</h1>
    </div>

    <div class="row">
      <div class="create-new">
        <router-link class="btn btn-primary new-asset" :to="createUrl()">
          New Asset
        </router-link>
      </div>
    </div>

    <div class="rows-count" v-if="count === 0 && !$store.state.loading">
      No assets created yet
    </div>

    <div class="rows-count" v-if="count && count > 20">
      Number of assets: {{count}}
    </div>

    <div class="row">
      <table v-if="count > 0" class="table table-striped">
        <thead>
          <tr>
            <th>Title</th>
            <th>File Type/Extension</th>
            <th>File</th>
            <th>Description</th>
            <th>Updated</th>
            <th>By</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="doc in docs">
            <td>
              <router-link :to="editUrl(doc)" class="assets-edit">
                {{doc.title}}
              </router-link>
            </td>
            <td>
              {{doc.fileType}}/{{doc.fileExtension}}
            </td>
            <td>
              <a :href="doc.url" target="_blank">{{doc.originalFilename}}</a>
            </td>
            <td>
              {{doc.description}}
            </td>
            <td>
              {{doc.updatedAt | date('YYYY-MM-DD hh:mm') }}<br />
              ({{doc.updatedAt | timeAgo}})
            </td>
            <td>
              {{doc.updatedBy.email}}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import u from '@/util'
import Alert from '@/services/alert'
import session from '@/services/session'
import Asset from '@/services/asset'

export default {
  data () {
    return {
      docs: [],
      count: 0
    }
  },
  created () {
    if (!Asset.cloudinaryOptions(session.get('space'))) {
      Alert.setNext('warning', 'You need to configure Cloudinary to use Assets')
      this.$router.push('/config')
      return
    }
    this.getData()
  },
  watch: {
    '$route': 'getData'
  },
  methods: {
    getData () {
      const spaceId = u.getIn(session.get(), 'space.id')
      Asset(spaceId).list().then((result) => {
        console.log('assets list', result)
        this.docs = result.data
        this.count = result.count
      })
    },
    editUrl (doc) {
      return `/assets/${doc.id}/edit`
    },
    createUrl () {
      return `/assets/new`
    }
  }
}
</script>

<style lang="css">
  div.rows-count {
    margin-top: 10px;
    margin-bottom: 20px;
  }
</style>
