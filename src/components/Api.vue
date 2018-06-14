<template>
  <div>
      <h1>API</h1>

      <ul class="api-info">
        <li>
          <strong>Base URL:</strong>
          <pre>{{baseUrl}}</pre>
        </li>
        <li>
          <strong>API Key:</strong> (read-only data access for clients - mobile/web apps etc.)
          <pre>{{apiKey}}</pre>
        </li>
        <li>
          <strong>Space ID:</strong>
          <pre>{{spaceId}}</pre>
        </li>
        <li>
          <a :href="docsUrl" target="_blank">API Docs</a>
        </li>
      </ul>

      <div v-if="examples.length > 0" class="example-container">
        <h2>Data Examples</h2>

        <p>
          Examples use the <a href="https://httpie.org" target="_blanke">httpie</a> client.
        </p>

        <div class="example" v-for="example in examples" v-bind:key="example.name">
          <strong>{{example.name}}</strong>

          <pre>{{example.httpie}}</pre>
        </div>
      </div>
  </div>
</template>

<script>
import u from '@/util'
import User from '@/services/user'
import Api from '@/services/api'
import Data from '@/services/data'
import Model from '@/services/model'
import DbStats from '@/services/db_stats'
import {rootUrl} from '@/client_util'

export default {
  data () {
    const spaceId = u.getIn(User.get(), 'space.id')
    const baseUrl = process.env.VUE_APP_API_URL
    const swaggerUrl = `${baseUrl}/data/${spaceId}/swagger.json`
    const docsUrl = `${rootUrl(process.env.VUE_APP_API_URL)}/swagger-ui/index.html?url=${swaggerUrl}`
    return {
      spaceId,
      baseUrl,
      docsUrl,
      models: [],
      examples: []
    }
  },
  created () {
    this.getData()
  },
  watch: {
    '$route': 'getData'
  },
  methods: {
    async getData () {
      const accountId = u.getIn(User.get(), 'account.id')
      const spaceId = u.getIn(User.get(), 'space.id')
      const params = {sort: 'name'}
      this.apiKey = u.getIn(User.get(), 'space.apiKey')
      this.models = (await Model(accountId).list({params})).data
      this.dbStats = await DbStats(spaceId).get()
      this.examples = await this.getExamples()
    },
    async getExamples (models, dbStats) {
      const result = []
      const exampleModels = this.models.filter(model => u.getIn(this.dbStats, `${model.coll}.count`) > 0)
      for (let exampleModel of exampleModels) {
        const api = Data(exampleModel.coll)
        result.push({name: `List ${exampleModel.name} Data`, httpie: this.httpie(api.listUrl())})

        const docs = (await Api.listRequest(api.listUrl({limit: 1}))).data
        const id = u.getIn(docs, '0.id')
        const getUrl = api.getUrl(id)
        result.push({name: `Get One ${exampleModel.name}`, httpie: this.httpie(getUrl)})
      }
      return result
    },
    httpie (url) {
      return Api.httpie(url, {apiKey: this.apiKey})
    }
  }
}
</script>

<style scoped>
</style>
