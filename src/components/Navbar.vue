<template lang="html">
  <nav class="navbar navbar-expand-md navbar-dark bg-dark">
      <router-link class="navbar-brand navbar-link brand" to="/">{{brand()}}</router-link>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarsExampleDefault">
          <ul class="navbar-nav mr-auto">
            <!-- <li class="nav-item active">
              <router-link class="nav-link" to="/">Home</router-link>
            </li> -->
            <!-- <li class="nav-item">
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
          <li v-if="$store.state.login" class="logged-in-user">
            <a href="#" class="user-email">{{userEmail()}}</a> |
            <a href="#" class="logout" data-toggle="tooltip" title="Logga ut" @click="logout">
              logout
            </a>
          </li>

          <li v-if="$store.state.loading">
            <img src="/ajax-loader.gif">
          </li>

          <!-- <form class="form-inline my-2 my-lg-0">
            <input class="form-control mr-sm-2" type="text" placeholder="Search" aria-label="Search">
            <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
          </form> -->
        </div>
      </nav>
</template>

<script>
import u from '@/util'
import User from '@/services/user'

export default {
  methods: {
    brand () {
      const user = User.get()
      const accountName = u.getIn(user, 'account.name')
      const spaceName = u.getIn(user, 'space.name')
      if (accountName && spaceName) {
        return accountName !== spaceName ? `${accountName} - ${spaceName}` : accountName
      } else {
        return process.env.VUE_APP_NAME
      }
    },
    userEmail () {
      const user = User.get()
      return u.getIn(user, 'email') || u.getIn(user, 'user.email')
    },
    logout () {
      User.logout()
      setTimeout(() => {
        location.reload(true)
      }, 50)
    }
  }
}
</script>

<style lang="css">
</style>
