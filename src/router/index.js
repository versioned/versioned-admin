import Vue from 'vue'
import Router from 'vue-router'
import guards from '@/router/guards'
import Home from '@/components/Home'
import Register from '@/components/Register'
import Login from '@/components/Login'
import ModelsList from '@/components/models/ModelsList'
import ModelsNew from '@/components/models/ModelsNew'
import ModelsEdit from '@/components/models/ModelsEdit'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/models',
      name: 'Models',
      component: ModelsList
    },
    {
      path: '/models/new',
      name: 'New Model',
      component: ModelsNew
    },
    {
      path: '/models/:id/edit',
      name: 'Edit Model',
      component: ModelsEdit
    }
    // {
    //   path: '/docs/:contentType?',
    //   name: 'Docs List',
    //   component: DocsList
    // },
    // {
    //   path: '/docs/:contentType/:id/edit',
    //   name: 'Docs Edit',
    //   component: DocsEdit
    // },
    // {
    //   path: '/docs/:contentType/new',
    //   name: 'Docs New',
    //   component: DocsNew
    // }
  ]
})

guards(router)

export default router
