# versioned-ui - A CMS Admin UI

## Values

Simplicity

(iZettle: Easy, Reliable, Inspiring)

## MVP

* Algolia Keys
  Each space needs its own index, move init index code to after space create
  Generate on the fly in spaces, make them expire after two months
  Need to make sure space/account data in session expires more often than that
  https://www.algolia.com/doc/guides/security/api-keys/#secured-api-keys

* User handling
  Forgotten password
  Invite user

* Domain
  www.versioned.io
  api.versioned.io

* Website (React Static?)

* Better loader? https://codepen.io/MattIn4D/pen/LiKFC

* Make sure account and space scoping works

* CDN

* Rate limiting (API Gateway?)

* Make sure you can handle thousands of documents

* Make UI/API able to deal with more than 100 relationship docs or enforce 100 in maxItems?
  Use maxItems on arrays?
  https://stackoverflow.com/questions/47256185/bootstrap-list-group-scroll

* Rename apiKey to clientKey?
  * Only allowed for published=1 or with versionToken preview?

* Sort by updatedAt, always set?

* JSON Edit option in DataEdit

* Add slug Field as default for models after titel Field

* Basic image/video support

* Getting started text
  What is a model?

* Basic web hook support (can do sync for now)
  https://aws.amazon.com/blogs/aws/aws-lambda-adds-amazon-simple-queue-service-to-supported-event-sources/

* Remove any unfinished/complex features

* UI tests for remaining parts

## Backlog (Sprint)

* Need to indicate clearly a "Model not created yet" warning for toModel that doesn't exist
  Use same search/select as for relationships

* Algolia keys

* Dedicated Mongodb + dedicated Algolia (latter is required)

* Images

* Translations

* Web hooks

* First real project!

* Hide any features that are not robust/complete

* Title in relationships in DataForm will only appear if there is a title or name property...
  Solve with x-meta.titleProperty boolean

* Array type not well supported - remove?

* Need coercion of number/integer types in DataFormField

* Relationships one-to-many and many-to-many with *lots* of entries will probably crash the UI

* Using relationship.name will not work with the UI. Turn off or add relationshipNames=0 for get

* Search in DataRelField doesn't work properly. Why? Replace with custom search/select? Also need scroll/handling of many items

* Set up Cypress test that creates Kitchensink models with most common data types and data

* Test all form field types (boolean etc. enum?)

* Ability to have color codes for models

* Check no delete of published content (remove link and have backend callback check as well)

* You need to make relationship docs ids on save? Or do this server side? Convert objects to ids in callback models.normalizeRelationshipIds

* Rename versions to publish history with revert links

* Unpublished at (lastUnpublishedAt)

* Having changelog.publishEvent does not provide a good history of publish events. Having them in a separate collection would be nicer!

* You have to click "Save and Publish" twice for it to be published!

* Put versions expandable on top of DataEdit?

* Component for dates?

* Versioning och publishing UI
  What info can we get from versions history?

* Need to create secured Algolia API keys when creating a space and store them in spaces.algoliaKeys
https://www.algolia.com/doc/guides/security/api-keys/#secured-api-keys

```
var searchOnlyApiKey = 'BIEV2YG99YSHTKQXQM';
var params = {
  hitsPerPage: 20,
  filters: '_tags:user_42 AND available = 1',
  validUntil: currentTimestamp + 3600,
  restrictIndices: 'index1,index2',
  userToken: 'user_42',
  restrictSources: '192.168.1.0/24'
};
var publicKey = client.generateSecuredApiKey(searchOnlyApiKey, params);
```

* Check account and space scoping works in changelog, algolia, DataList, ModelsList

* Add changelog.publishEvent boolean -

```
function isPublishEvent (doc) {
  return (doc.action === 'created' && getIn(doc, 'doc.publishedVersion')) ||
    (doc.action === 'update' && getIn(doc, 'doc.publishedVersion') !== getIn(doc, 'existingDoc.publishedVerison'))
}
```

* Do not allow delete when publishedVersion is set - must unpublish before delete

* Webhhoks with SQS

* Script to load data into UI - articles, authors, slots, categories

* User profile page

* Config tab

* Translations

* For unique relationships (one-to-many, one-to-one) - only make search results that are not taken selectable?

* Cannot remove single relationship

* Debounce rel search

* Clear errors on save (DataEdit, ModelsEdit)

* Gotcha: forgetting prevent in @click.prevent

* Need to indicate which field is the title field (or use title || name || id)

* Make sure localStorage data doesn't get too stale

* Support relationships in DataForm
  Restrict search by type
  Check out contentful and others

* Show version history or changelog on the DataEdit page

* Same error message handling in DataForm as in ModelsForm

* Fetch and show relationships in DataList

* ModelsList
  * Move to homepage?

* Pagination for DataList

* Support JSON object field with schema?

* Make Data select last edited Model (via localStorage)?

* Proper UX for ModelsForm:
  * Figure out when unique can be applied
  * Validate at least one field server side and client side (don't show)
  * Help texts for data types etc.
  * models.fields field. Remove the model and have it be generated instead - getModel().
    * {name, key, type, validation, relationship}
    * Figure out data types here based on contentful
      https://www.contentful.com/developers/docs/concepts/data-model
      * Short Text (Single line, length 256)
      * Long Text (Multiline, length 50k)
      * Slug. Can be updated?
      * Integer Number
      * Decimal Number (Float)
      * Boolean (true or false)
      * Enumeration
      * Relationship ()
      * Location
      * JSON
      * Date and time ("2015-11-06T09:45:27" ISO 8601)
      * Asset
    * Support Array Type like contentful does?
    * Need title field indicator like Contentful? Why?
    * Do as much validation as possible in the client
    * Support validations
      Required
      Unique
      Limit character count
      Match pattern
      Accept only specific values
    * Support relationships
    * Unique
    * Required (migration?)
    * Consider the approach of doing the fields transformation in the UI before you go all in and refactor the backend (fairly big change)
    * Use proper models.model.schema validation in the backend instead or before swagger validation

* Account Plans with GraphCMS
  Basic 29 USD per project per month (webhooks)
  Growth 99 USD per project per month (localization)
  Business 349 USD (premium support)

  GraphCMS show length of text inputs
  "Save and Close" and "Save and Publish" buttons
  GraphCMS has Algolia integration
  When your trial expires, you won't have access to the features Webhooks and Localization anymore.
  The Webhooks feature is available on Basic and higher plans.
  The Localization feature is available on Growth and higher plans.

* Account Plans with Contentful
  Developer Edition - 39 USD per month (5 users, 2 spaces, 10k records, 1M requests)
  Team Edition - 249 USD per month (15 users, 3 spaces, 25k records, 3M requests)
  Professional - 949 USD per month (50k records, 6M requests)

  Models List
  Name | Description | Fields | Updated | By

  ModelsEdit
  "displayField": "title",

  Not able to leave organization?

* Cosmic JS
  Starter - 29 USD (3 GB files, 25k requests, 5 users)
  Pro - 99 USD (15 GB files, 150k requests, 10 users)
  Categorize users by "Developer" and "Content Editor"
  All content by default has title/slug/content. Then you can add meta fields in addition.
  On the DataEdit page there is a link to the API endpoint. Very nice!
  There is also a link to a JavaScript code snippet for fetching the content. Awesome.

* Figure out consistent page layout Bootstrap markup

* Generic handling of:
  * status 5xx http responses
  * status 4xx http responses

* API test models CRUD

* Models validation API test

* Consistent form error handling?

* More E2E Tests
  * login_validation.js
  * register_validation.js

## Epics (Major Features)

## Ice Box (For Later Consideration)

* Registration form
  What if you register with an account that already exists
  An invitation request should be emailed to admins of account

* handle console.log in all browsers?

* slug - An autogenerated url-safe and human-readable identifier for an item

* Handle three API types (options.scope={accountId, scopeId}):
  * spaceId scoped: /v1/data/{spaceId}
  * accountId scoped: /v1/{accountId}/models|spaces
  * Global: /v1/users|accounts|login

* Need account and scope selectors
  Pick first for now. Allow settind users.defaultSpaceId on profile page or keep track of last used?

## Forms checklist

* form novalidate ?
* autofocus
* required
* Ajax loader next to submit
* Use proper type (number, email, url, time, date, datetime-local etc.)
* Help texts (x-meta.description):
    <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
Placeholder:
      <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email">
Checkbox:
  <div class="form-check">
    <input type="checkbox" class="form-check-input" id="exampleCheck1">
    <label class="form-check-label" for="exampleCheck1">Check me out</label>
  </div>

## Data Types

https://www.contentful.com/developers/docs/concepts/data-model

https://www.contentful.com/developers/docs/concepts/links

* Short text ("Hello World", max 256) - for titles and names. Support sorting and equal filters.
* Long text ("This is a long book...", max 50,000) - for paragraphs of text. Filtererable with search.
* Number (2) - integer
* Number (3.14) - decimal
* Date and time ("2015-11-06T09:45:27") - A date and time in ISO 8601 format
* Location ({"lat": 52.5208, "lon": 13.4049})
* Boolean (true/false)
* Media Link
* Reference Link
* Array
* JSON Object

## Onboarding Process (Adapted from Contentful)

* Signup / Try for free button on homepage
* Form with
  name
  company
  email
  password
* Land on app.versioned.io in selected account
* Create space (should be done automatically)
* Create structure / models
* Create content

https://app.contentful.com/spaces/3qm0py0gmiw8/home

https://app.contentful.com/account/organizations/2yw63mtuIHjOhmiHXCB8Tu/subscription_overview
  Payment details

https://app.contentful.com/account/organizations/2yw63mtuIHjOhmiHXCB8Tu/subscription_overview

Entry/Content Edit
https://app.contentful.com/spaces/3qm0py0gmiw8/entries/2uNOpLMJioKeoMq8W44uYc

Prismic:
  Email
  Password
  Project name (subdomain)

https://marklunds.prismic.io/documents/working/

Select language

npm install -g prismic-cli
prismic init marklunds

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

Setup:

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

Running:

```
yarn test:e2e --headless
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
