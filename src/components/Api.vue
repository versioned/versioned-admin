<template>
  <div>
      <h1>API</h1>

      <ul class="api-info">
        <li>
          <strong>Base URL</strong>
          <pre>{{baseUrl}}</pre>
        </li>
        <li>
          <strong>Account ID</strong>
          <pre>{{accountId}}</pre>
        </li>
        <li>
          <strong>Space ID</strong>
          <pre>{{spaceId}}</pre>
        </li>
        <li>
          <strong>API Key</strong> (read-only data access for clients - mobile/web apps etc.)
          <pre>{{apiKey}}</pre>
        </li>
        <li>
          <a :href="apiDocsUrl" target="_blank">API Docs</a>
        </li>
      </ul>

      <div v-if="examples.length > 0" class="example-container">
        <h2>API Call Examples</h2>

        <p class="alert alert-warning">
          In order to deliver production content to your clients (website, mobile apps etc.) you should
          put a CDN (i.e. a service like <a href="https://www.fastly.com">Fastly</a>, <a href="https://www.cloudflare.com">Cloudflare</a>,
          or <a href="https://aws.amazon.com/cloudfront">CloudFront</a>) in between your clients and this API.
          Setting up such a CDN is straightforward and relatively cheap (i.e. <a href="https://elements.heroku.com/addons/fastly">Fastly offers</a> 10 million requests per month at 25 USD/month).
          If you are not using a CDN you can expect the Versioned REST API to be rate limited at around 5 requests per second.
        </p>

        <p>
          Examples use the <a href="https://httpie.org" target="_blanke">httpie</a> client.
        </p>

        <div class="example" v-for="example in examples" v-bind:key="example.name">
          <strong>{{example.name}}</strong>

          <pre>{{example.httpie}}</pre>
        </div>
      </div>

      <div class="example-container">
        <h2>Data Import</h2>

        <p>
          There is an import API endpoint (see the <a :href="apiDocsUrl" target="_blank">API Docs</a> for details)
          that allows you to create many documents at a time for a model.
          If you need to write a script to import data there is an
          <a href="https://github.com/versioned/versioned-api/blob/master/examples/import-data.js">example script</a>
          that you can use as inspiration.
        </p>
      </div>

      <div v-if="docsUrl" class="example-container">
        <h2>Documentation</h2>

        To learn more about the core concepts of the API you should check out the
        <a :href="docsUrl" target="_blank">documentation</a>.
      </div>
  </div>
</template>

<script>
import u from '@/util'
import session from '@/services/session'
import Api from '@/services/api'
import Data from '@/services/data'
import Model from '@/services/model'
import DbStats from '@/services/db_stats'
import {rootUrl} from '@/client_util'

export default {
  data () {
    const accountId = u.getIn(session.get(), 'account.id')
    const spaceId = u.getIn(session.get(), 'space.id')
    const baseUrl = process.env.VUE_APP_API_URL
    const swaggerUrl = `${baseUrl}/data/${spaceId}/swagger.json`
    const apiDocsUrl = `${rootUrl(process.env.VUE_APP_API_URL)}/swagger-ui/index.html?url=${swaggerUrl}`
    const docsUrl = process.env.VUE_APP_DOCS_URL
    return {
      accountId,
      spaceId,
      baseUrl,
      apiDocsUrl,
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
      const spaceId = u.getIn(session.get(), 'space.id')
      const params = {sort: 'name'}
      this.apiKey = u.getIn(session.get(), 'space.apiKey')
      this.models = (await Model(spaceId).list({params})).data
      this.dbStats = await DbStats(spaceId).get()
      this.examples = await this.getExamples()
    },
    async getExamples (models, dbStats) {
      const result = []
      const exampleModel = this.models.find(model => u.getIn(this.dbStats, `${model.coll}.count`) > 0)
      const published = (exampleModel.features || []).includes('published')
      if (exampleModel) {
        const api = Data(exampleModel.coll)
        result.push({name: `List ${exampleModel.name} Data`, httpie: this.httpie(api.listUrl(), {published})})

        const docs = (await Api.listRequest(api.listUrl({limit: 1}))).data
        const id = u.getIn(docs, '0.id')
        const getUrl = api.getUrl(id)
        result.push({name: `Get Data for One ${exampleModel.name}`, httpie: this.httpie(getUrl, {published})})
      }
      return result
    },
    httpie (url, options = {}) {
      return Api.httpie(url, {apiKey: this.apiKey, published: options.published})
    }
  }
}
</script>

<style scoped>
</style>
