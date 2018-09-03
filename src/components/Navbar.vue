<template lang="html">
  <nav class="navbar navbar-expand-md navbar-dark bg-dark">
      <router-link v-if="isLoggedIn()" class="navbar-brand navbar-link brand" to="/">{{brand()}}</router-link>
      <span v-else class="navbar-brand brand">{{brand()}}</span>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarsExampleDefault">
          <ul class="navbar-nav mr-auto" v-show="$store.state.login">
            <li class="nav-item dropdown" v-if="spaces().length > 0 && hasCurrentSpace()">
              <a class="nav-link dropdown-toggle" href="#" id="dropdown01" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{{currentSpace().name}}</a>
              <div class="dropdown-menu" aria-labelledby="dropdown01">
                <a class="dropdown-item" v-for="space in spaces()" href="#" @click="makeCurrentSpace(space)">{{space.name}}</a>
              </div>
            </li>

            <li class="nav-item">
              <router-link class="nav-link" to="/models" v-show="hasCurrentSpace()">Models</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/assets" v-show="hasCurrentSpace()">Assets</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/changelog" v-show="hasCurrentSpace()">Changelog</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/api" v-show="hasCurrentSpace()">API</router-link>
            </li>
            <li class="nav-item" v-show="isAdmin() && hasCurrentSpace()">
              <router-link class="nav-link" to="/config">Space Config</router-link>
            </li>
            <!-- <li class="nav-item">
              <router-link class="nav-link" to="/data">Data</router-link>
            </li> -->
            <!-- <li class="nav-item active">
              <router-link class="nav-link" to="/docs">Browse</router-link>
            </li> -->
            <!-- <li class="nav-item">
              <a class="nav-link disabled" href="#">Disabled</a>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="http://example.com" id="dropdown01" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Dropdown</a>
              <div class="dropdown-menu" aria-labelledby="dropdown01">
                <a class="dropdown-item" href="#">Action</a>
                <a class="dropdown-item" href="#">Another action</a>
                <a class="dropdown-item" href="#">Something else here</a>
              </div>
            </li> -->
          </ul>
          <li v-show="$store.state.login" class="logged-in-user">
            <router-link class="search" to="/search">Search</router-link> |
            <router-link class="user-profile" to="/profile">User Profile</router-link> |
            <a href="#" class="logout" data-toggle="tooltip" title="Logga ut" @click.prevent="logout">
              Logout
            </a>
          </li>

          <!-- <li v-if="$store.state.loading">
            <img src="/ajax-loader.gif">
          </li> -->

          <!-- <form class="form-inline my-2 my-lg-0">
            <input class="form-control mr-sm-2" type="text" placeholder="Search" aria-label="Search">
            <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
          </form> -->
        </div>
      </nav>
</template>

<script>
import u from '@/util'
import session from '@/services/session'
import router from '@/router'

export default {
  methods: {
    currentSpace () {
      return session.get('space') || {}
    },
    spaces () {
      const currentAccount = (session.get('user.accounts') || []).find(a => a.id === this.currentSpace().accountId)
      return u.getIn(currentAccount, 'spaces', []).filter(s => s.id !== this.currentSpace().id)
    },
    makeCurrentSpace (space) {
      const account = (session.get('user.accounts') || []).find(a => a.id === space.accountId)
      session.set(u.merge(session.get(), {account}))
      session.set(u.merge(session.get(), {space}))
      router.go(router.currentRoute)
    },
    brand () {
      return process.env.VUE_APP_NAME || 'Versioned'
    },
    userEmail () {
      return session.get('user.email')
    },
    logout () {
      session.logout()
      setTimeout(() => {
        location.reload(true)
      }, 50)
    }
  }
}
</script>

<style lang="css">
</style>
