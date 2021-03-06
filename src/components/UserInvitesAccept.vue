<template>
  <div>
    <h1>Accept Invite</h1>

    <div v-show="displayForm">
      <p>
        Account: {{userInvite.account.name}}
      </p>

      <p>
        Email: {{userInvite.email}}
      </p>

      <p v-if="userInvite.userExists">
        Please enter your password below to log in and accept the invite
      </p>
      <p v-else>
        Please select a password below and we'll create an account for you
      </p>

      <form class="user-invite-accept" @submit.prevent="save">
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" v-model="password" class="form-control" id="password" v-bind:class="{ 'is-invalid': errors.password}" required/>
          <div class="invalid-feedback">
            {{errors.password}}
          </div>
        </div>

        <input type="submit" class="btn btn-primary" value="Submit" />
      </form>
    </div>
  </div>
</template>

<script>
import u from '@/util'
import router from '@/router'
import session from '@/services/session'
import Account from '@/services/account'
import User from '@/services/user'
import UserInvite from '@/services/user_invite'
import Alert from '@/services/alert'
import FormUtil from '@/form_util'

export default {
  data: () => {
    return {
      displayForm: false,
      password: null,
      userInvite: {account: {}},
      account: {},
      errors: {},
      baseErrors: []
    }
  },
  created () {
    this.getData()
  },
  watch: {
    '$route': 'getData'
  },
  methods: {
    async getData () {
      const accountId = this.$route.params.id
      const inviteId = this.$route.params.inviteId
      this.userInvite = await UserInvite(accountId).get(inviteId, {relationshipLevels: 2})
      if (!this.userInvite) {
        Alert.setNext('warning', 'Could not find the invite, maybe you already accepted it?')
        session.isLoggedIn() ? router.push('/') : router.push('/login')
        return
      }
      this.displayForm = (session.get('user.email') !== this.userInvite.email)
      if (!this.displayForm) {
        await this.acceptInvite()
      }
    },
    async acceptInvite () {
      await UserInvite(this.userInvite.accountId).accept(this.userInvite.id)
      const account = await Account.get(this.userInvite.account.id, {relationshipLevels: 2})
      session.set(u.merge(session.get(), {account}))
      session.set(u.merge(session.get(), {space: account.spaces[0]}))
      Alert.setNext('success', `Invite accepted. You are now logged in and can start using the ${account.name} account`)
      router.push(`/`)
    },
    save: async function () {
      this.errors = {}
      Alert.clear()
      try {
        const user = {
          email: this.userInvite.email,
          password: this.password
        }
        if (!this.userInvite.userExists) {
          await User.create(user)
        }
        await session.login(user.email, user.password)
        await this.acceptInvite()
      } catch (error) {
        this.errors = FormUtil.handleError(error)
      }
    }
  }
}
</script>

<style lang="css">
</style>
