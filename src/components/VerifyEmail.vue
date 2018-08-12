<template lang="html">
  <section class="forgot-password-page">
    <div class="page-title">
      <h1>Verify Email</h1>
    </div>
  </section>
</template>

<script>
import User from '@/services/user'
import Alert from '@/services/alert'
import router from '@/router'

export default {
  created () {
    const email = this.$route.query.email
    const token = this.$route.query.token
    User.verifyEmail(email, token, this.password)
      .then(() => {
        Alert.setNext(`Successfully verified email ${email}`)
        router.push('/')
      })
      .catch(() => {
        Alert.set('warning', 'Could not verify your email')
      })
  }
}
</script>

<style lang="css">
</style>
