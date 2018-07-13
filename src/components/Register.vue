<template lang="html">
  <section class="login-page">
    <div class="page-title">
      <h1>Register</h1>
    </div>

    <form class="register-form" @submit.prevent="register">
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" v-model="user.email" class="form-control" id="email" v-bind:class="{ 'is-invalid': errors.email}" v-autofocus required/>
        <div class="invalid-feedback">
          {{errors.email}}
        </div>

        <label for="password">Password</label>
        <input type="password" v-model="user.password" class="form-control" id="password" v-bind:class="{ 'is-invalid': errors.password}" required/>
        <div class="invalid-feedback">
          {{errors.password}}
        </div>

        <label for="accountName">Company Name</label>
        <input type="text" v-model="account.name" class="form-control" id="accountName" v-bind:class="{ 'is-invalid': errors.accountName}" required/>
        <div class="invalid-feedback">
          {{errors.accountName}}
        </div>
      </div>

      <input type="submit" class="btn btn-primary" value="Register" />

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
import Alert from '@/services/alert'
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
      errors: {},
      baseErrors: []
    }
  },
  methods: {
    register: async function () {
      try {
        await UserApi.create(this.user)
        await User.login(this.user.email, this.user.password)
        const account = await Account.create(this.account)
        User.set(u.merge(User.get(), {account}))
        const space = await Space(account.id).get(account.spaces[0])
        User.set(u.merge(User.get(), {space}))
        Alert.setNext('Registration successful')
        router.push('/')
      } catch (error) {
        if (error.status === 500) {
          Alert.set('danger', 'We are having technical difficulties. Please try again!')
        } else if (error.status === 422) {
          if (u.notEmpty(error.errors)) {
            this.baseErrors = u.filter(error.errors, e => u.nil(e.field))
            this.errors = error.errors.reduce((acc, error) => {
              if (error.field) {
                const name = (error.field === 'name' ? 'accountName' : error.field)
                acc[name] = error.message
              }
              return acc
            }, {})
          }
          Alert.set('warning', `Registration failed. Please fix the erorrs in the form and try again`)
        } else {
          Alert.set('warning', `Registration failed. Please try again (status=${error.status})`)
        }
      }
    }
  }
}
</script>

<style lang="css">
</style>
