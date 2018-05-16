<template lang="html">
  <section class="login-page">
    <div class="page-title">
      <h1>Register</h1>
    </div>

    <form class="page-form" role="form" @submit.prevent="register">
      <div class="form-group">
        <div class="form-input">
          <label for="email">Email</label>
          <input type="text" v-model="user.email" class="form-control" id="email" autofocus/>
        </div>
        <div class="form-input">
          <label for="password">Password</label>
          <input type="password" v-model="user.password" class="form-control" id="password"/>
        </div>
        <div class="form-input">
          <label for="accountName">Company Name</label>
          <input type="text" v-model="account.name" class="form-control" id="accountName" autofocus/>
        </div>
      </div>

      <div class="form-group">
        {{ message }}
      </div>

      <div class="form-group form-submit">
        <input type="submit" class="btn btn-primary" value="Register" />
      </div>

      <p>
        <router-link class="nav-link" to="/login">Login</router-link>
      </p>
    </form>
  </section>
</template>

<script>
import u from '@/util'
import User from '@/services/user'
import UserApi from '@/services/user_api'
import Account from '@/services/account'
import Space from '@/services/space'
import router from '@/router'

export default {
  data: () => {
    return {
      user: {
        email: '',
        password: ''
      },
      account: {
        name: ''
      },
      message: ''
    }
  },
  methods: {
    register: function () {
      UserApi.create(this.user)
        .then((user) => {
          this.message = 'User created'
          return User.login(this.user.email, this.user.password)
        })
        .then((result) => {
          this.message = 'Logged in'
          return Account.create(this.account)
        })
        .then((account) => {
          this.message = 'Account created'
          User.set(u.merge(User.get(), {account}))
          return Space(account.id).get(account.spaces[0])
        })
        .then((space) => {
          User.set(u.merge(User.get(), {space}))
          this.message = 'Registration successful'
          router.push('/')
        })
        .catch((error) => {
          console.error(error)
          this.message = `Registration failed: ${error.message}`
        })
    }
  }
}
</script>

<style lang="css">
</style>
