<template lang="html">
  <nav class="navbar navbar-expand-md navbar-dark bg-dark">
      <router-link class="navbar-brand navbar-link" to="/">{{brand()}}</router-link>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarsExampleDefault">
          <ul class="navbar-nav mr-auto">
            <!-- <li class="nav-item active">
              <router-link class="nav-link" to="/">Home</router-link>
            </li> -->
            <li class="nav-item">
              <router-link class="nav-link" to="/docs">Browse</router-link>
              <!-- <a class="nav-link" href="#">Link</a> -->
            </li>
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
          <li class="logged-in-user">
            <a href="#">{{userEmail()}}</a> |
            <a href="#" data-toggle="tooltip" title="Logga ut" @click="logout">
              logout
            </a>
          </li>

          <!-- <form class="form-inline my-2 my-lg-0">
            <input class="form-control mr-sm-2" type="text" placeholder="Search" aria-label="Search">
            <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
          </form> -->
        </div>
      </nav>
</template>

<script>
import User from '@/services/user'
import u from '@/util'

export default {
  methods: {
    brand () {
      const user = User.get()
      const accountName = u.getIn(user, 'account.name')
      const spaceName = u.getIn(user, 'space.name')
      if (accountName && spaceName) {
        return accountName !== spaceName ? `${accountName} - ${spaceName}` : accountName
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
      }, 100)
    }
  }
}
</script>

<style lang="css">
</style>
