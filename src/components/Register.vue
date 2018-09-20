<template lang="html">
  <section class="register-page">
    <div class="page-title">
      <h1>Register</h1>
    </div>

    <div class="alert alert-warning" role="alert">
      We are currently in beta and you can use the service free of charge
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

      <div class="form-group">
        <input type="submit" class="btn btn-primary" value="Register" />
      </div>

      <div class="form-group">
        <router-link class="nav-link" to="/login">Login</router-link>
      </div>
    </form>
  </section>
</template>

<script>
import u from '@/util'
import session from '@/services/session'
import User from '@/services/user'
import Account from '@/services/account'
import Space from '@/services/space'
import Alert from '@/services/alert'
import router from '@/router'
import FormUtil from '@/form_util'

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
      userCreated: false,
      accountCreated: false
    }
  },
  methods: {
    register: async function () {
      try {
        // NOTE: first attempt a login. This is a bit of a hack, but it allows creation of
        // multiple accounts for now. It also helps if someone uses Register instead of Login by mistake
        let messages = []
        try {
          await session.login(this.user.email, this.user.password)
          messages.push('You were already registered and are now logged in')
        } catch (_) {
          await User.create(this.user)
          await session.login(this.user.email, this.user.password)
          this.userCreated = true
          messages.push(`User ${this.user.email} created`)
        }
        const userAccountNames = (session.get('user.accounts') || []).map(u.property('name'))
        if (!userAccountNames.includes(this.account.name)) {
          const account = await Account.create(this.account)
          session.set(u.merge(session.get(), {account}))
          const space = await Space(account.id).get(account.spaces[0])
          session.set(u.merge(session.get(), {space}))
          this.accountCreated = true
          messages.push(`Account ${this.account.name} created`)
        } else {
          messages.push(`You are a member of the ${this.account.name} account`)
        }
        if (this.userCreated && this.accountCreated) messages = [`User ${this.user.email} and account ${this.account.name} successfully created`]
        Alert.setNext(messages.join('. '))
        router.push('/')
      } catch (error) {
        this.errors = u.rename(FormUtil.handleError(error), {name: 'accountName'})
      }
    }
  }
}
</script>

<style lang="css">
</style>
