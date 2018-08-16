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

      <div class="form-group">
        <input type="submit" class="btn btn-primary" value="Log in" />
      </div>

      <div class="form-group">
        <router-link id="register-link" to="/register">Register</router-link>
        | <router-link id="forgot-password-link" :to="forgotPasswordUrl()">Forgot Password</router-link>
      </div>
    </form>
  </section>
</template>

<script>
import session from '@/services/session'
import Alert from '@/services/alert'
import router from '@/router'

export default {
  data: () => {
    return {
      user: {
        email: '',
        password: ''
      },
      message: ''
    }
  },
  created () {
    this.email = this.$route.query.email
  },
  methods: {
    login: function () {
      session.login(this.user.email, this.user.password)
        .then(() => {
          Alert.setNext('Logged in')
          router.push('/')
        })
        .catch(() => {
          Alert.set('warning', 'Could not log you in. Please check your credentials or <a href="#/register">register</a> if you don\'t have an account')
        })
    },
    forgotPasswordUrl () {
      return `/forgot-password/deliver?email=${encodeURIComponent(this.user.email)}`
    }
  }
}
</script>

<style lang="css">
</style>
