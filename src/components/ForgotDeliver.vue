<template lang="html">
  <section class="forgot-password-page">
    <div class="page-title">
      <h1>Forgot Password</h1>
    </div>

    <form class="login-form" @submit.prevent="sendEmail">
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" v-model="email" class="form-control" id="email" v-autofocus required/>
      </div>

      <div class="form-group">
        {{message}}
      </div>

      <input type="submit" class="btn btn-primary" value="Send Email" />

      <p>
        <router-link class="nav-link" to="/login">Login</router-link>
      </p>
    </form>
  </section>
</template>

<script>
import User from '@/services/user'
import Alert from '@/services/alert'
import router from '@/router'

export default {
  data: () => {
    return {
      email: null,
      message: null
    }
  },
  created () {
    this.email = this.$route.query.email
  },
  methods: {
    sendEmail () {
      User.forgotDeliver(this.email)
        .then(() => {
          Alert.setNext(`Email sent to ${this.email}. Please check your inbox. It may take a few minutes for the email to arrive.`)
          router.push('/login')
        })
        .catch(() => {
          Alert.set('warning', 'Could not send email. Please double check your email address.')
        })
    }
  }
}
</script>

<style lang="css">
</style>
