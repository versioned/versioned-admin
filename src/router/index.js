import Vue from 'vue'
import Router from 'vue-router'
import guards from '@/router/guards'
import PageNotFound from '@/components/PageNotFound'
import Home from '@/components/Home'
import Changelog from '@/components/Changelog'
import Api from '@/components/Api'
import Profile from '@/components/Profile'
import AccountsEdit from '@/components/AccountsEdit'
import SpacesNew from '@/components/SpacesNew'
import SpacesEdit from '@/components/SpacesEdit'
import Register from '@/components/Register'
import Login from '@/components/Login'
import UserInvitesNew from '@/components/UserInvitesNew'
import UserInvitesEdit from '@/components/UserInvitesEdit'
import UserInvitesAccept from '@/components/UserInvitesAccept'
import VerifyEmail from '@/components/VerifyEmail'
import ForgotDeliver from '@/components/ForgotDeliver'
import ForgotChange from '@/components/ForgotChange'
import ModelsList from '@/components/models/ModelsList'
import ModelsNew from '@/components/models/ModelsNew'
import ModelsEdit from '@/components/models/ModelsEdit'
import DataList from '@/components/data/DataList'
import DataNew from '@/components/data/DataNew'
import DataEdit from '@/components/data/DataEdit'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/changelog',
      name: 'Changelog',
      component: Changelog
    },
    {
      path: '/api',
      name: 'API',
      component: Api
    },
    {
      path: '/config',
      name: 'Config',
      component: SpacesEdit
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile
    },
    {
      path: '/accounts/:id/edit',
      name: 'Account Config',
      component: AccountsEdit
    },
    {
      path: '/accounts/:accountId/spaces/new',
      name: 'New Space',
      component: SpacesNew
    },
    {
      path: '/accounts/:accountId/spaces/:id/edit',
      name: 'Space Config',
      component: SpacesEdit
    },
    {
      path: '/accounts/:id/invite-user',
      name: 'Invite User',
      component: UserInvitesNew
    },
    {
      path: '/accounts/:id/invite-user/:inviteId',
      name: 'User Invite',
      component: UserInvitesEdit
    },
    {
      path: '/accounts/:id/invite-user-accept/:inviteId',
      name: 'Accept Invite',
      component: UserInvitesAccept,
      meta: {
        requiresAuth: false
      }
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
      path: '/verify-email',
      name: 'Verify Email',
      component: VerifyEmail,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/forgot-password/deliver',
      name: 'Forgot Password',
      component: ForgotDeliver,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/forgot-password/change',
      name: 'Select New Password',
      component: ForgotChange,
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
    },
    {
      path: '/data/:model?',
      name: 'Data List',
      component: DataList
    },
    {
      path: '/data/:model/new',
      name: 'Data New',
      component: DataNew
    },
    {
      path: '/data/:model/:id/edit',
      name: 'Data Edit',
      component: DataEdit
    },
    {
      path: '*',
      component: PageNotFound
    }
  ]
})

guards(router)

export default router
