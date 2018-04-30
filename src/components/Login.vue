<template lang="html">
  <section class="login-page">
    <div class="page-title">
      <h1>Logga in</h1>
    </div>

    <form class="page-form" role="form" @submit.prevent="login">
      <div class="form-group">
        <div class="form-input">
          <label for="email">Email</label>
          <input type="text" v-model="user.email" class="form-control" id="email" autofocus/>
        </div>
        <div class="form-input">
          <label for="password">Lösenord</label>
          <input type="password" v-model="user.password" class="form-control" id="password"/>
        </div>
      </div>

      <div class="form-group">
        {{ message }}
      </div>

      <div class="form-group form-submit">
        <input type="submit" class="btn btn-primary" value="Logga in" />
      </div>
    </form>
  </section>
</template>

<script>
import User from '@/services/user'
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
  methods: {
    login: function() {
      User.login(this.user.email, this.user.password)
        .then(() => {
          router.push('/')
        })
        .catch(() => {
          this.message = 'Inloggningen misslyckades'
        })
    }
  }
}
</script>

<style lang="css">
</style>
