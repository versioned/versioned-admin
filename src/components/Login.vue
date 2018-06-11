<template lang="html">
  <section class="login-page">
    <div class="page-title">
      <h1>Login</h1>
    </div>

    <form class="login-form" @submit.prevent="login">
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" v-model="user.email" class="form-control" id="email" autofocus required/>

        <label for="password">Password</label>
        <input type="password" v-model="user.password" class="form-control" id="password" required/>
      </div>

      <div class="form-group">
        {{ message }}
      </div>

      <input type="submit" class="btn btn-primary" value="Log in" />
      <img v-if="loading" src="/ajax-loader.gif">

      <p>
        <router-link id="register-link" class="nav-link" to="/register">Register</router-link>
      </p>
    </form>
  </section>
</template>

<script>
import store from '@/store'
import u from '@/util'
import User from '@/services/user'
import Alert from '@/services/alert'
import router from '@/router'

export default {
  data: () => {
    return {
      loading: u.getIn(store, 'state.loading'),
      user: {
        email: '',
        password: ''
      },
      message: ''
    }
  },
  methods: {
    login: function () {
      User.login(this.user.email, this.user.password)
        .then(() => {
          Alert.setNext('Logged in')
          router.push('/')
        })
        .catch(() => {
          Alert.set('warning', 'Could not log you in. Please check your credentials or <a href="#/register">register</a> if you don\'t have an account')
        })
    }
  }
}
</script>

<style lang="css">
</style>
