# versioned-ui - A CMS Admin UI

## TODO

* Login broken?

* Need account and scope selectors
  Pick first for now. Allow changing on account page?

* Use standard for linting

* console.log?

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

## Resources

* [vue-cli Documentation](https://github.com/vuejs/vue-cli/blob/dev/docs/README.md)
* [Heroku Deployment](https://wyeworks.com/blog/2018/1/8/how-to-quickly-deploy-a-vuejs-app-to-heroku)
* [Algolia Search JavaScript Client](https://www.algolia.com/doc/api-client/javascript/getting-started)
* [Top 5 Vue Admin Templates](https://ourcodeworld.com/articles/read/699/top-5-best-free-vue-js-admin-templates)
