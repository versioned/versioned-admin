import Vue from 'vue'
import Router from 'vue-router'
import guards from '@/router/guards'
import Home from '@/components/Home'
import Login from '@/components/Login'
import DocsList from '@/components/docs/DocsList'
import DocsEdit from '@/components/docs/DocsEdit'
import DocsNew from '@/components/docs/DocsNew'
import SearchPage from '@/components/SearchPage'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: Home
    },
    {
      path: '/search',
      name: 'Search',
      component: SearchPage
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },

    {
      path: '/docs/:contentType?',
      name: 'Docs List',
      component: DocsList
    },
    {
      path: '/docs/:contentType/:id/edit',
      name: 'Docs Edit',
      component: DocsEdit
    },
    {
      path: '/docs/:contentType/new',
      name: 'Docs New',
      component: DocsNew
    }
  ]
})

guards(router)

export default router
