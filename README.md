# versioned-ui - A CMS Admin UI

## Starting the Development Server

```
yarn install
yarn run dev
open http://localhost:8080
```

To create a production build, run `yarn build`

## Debuggning

User:

```
localStorage.getItem('user')
```

## How this App Was Created

```
npm install -g @vue/cli
vue create versioned-ui
```

## Heroku Deploy

```
heroku config:set VUE_APP_API_URL=https://versioned2.herokuapp.com/v1
```

## Unit Tests

Setting up with Jest:

```
vue add @vue/unit-jest
```

Updated/added files:

```
jest.config.js
tests/unit/.eslintrc.js
tests/unit/HelloWorld.spec.js
package.json
yarn.lock
```

Running:

```
yarn test:unit --watch
```

See [@vue/cli-plugin-unit-jest](https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-unit-jest)

## End-to-End/Integration Tests

The dedicated_space.js spec requires these environment variables:

```
  CYPRESS_MONGODB_URL
  CYPRESS_ALGOLIASEARCH_APPLICATION_ID
  CYPRESS_ALGOLIASEARCH_API_KEY
```

Running:

```
yarn test:e2e --headless
```

How Cypress tests were added to the project:

```
vue add @vue/e2e-cypress
```

Updated/added files:

```
cypress.json
tests/e2e/.eslintrc
tests/e2e/plugins/index.js
tests/e2e/specs/test.js
tests/e2e/support/commands.js
tests/e2e/support/index.js
package.json
yarn.lock
```

## Resources

* [vue-cli Documentation](https://github.com/vuejs/vue-cli/blob/dev/docs/README.md)
* [Heroku Deployment](https://wyeworks.com/blog/2018/1/8/how-to-quickly-deploy-a-vuejs-app-to-heroku)
* [Algolia Search JavaScript Client](https://www.algolia.com/doc/api-client/javascript/getting-started)
* [Top 5 Vue Admin Templates](https://ourcodeworld.com/articles/read/699/top-5-best-free-vue-js-admin-templates)
* [Awesome Vue - Curated List](https://github.com/vuejs/awesome-vue#validation)
* [Cypress Testing Examples](https://github.com/cypress-io/cypress-example-kitchensink)
* [Cypress Docs - Assertions](https://docs.cypress.io/guides/references/assertions.html)
* [Cypress Vue Example](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/blogs__vue-vuex-rest)
