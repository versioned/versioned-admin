<template>
  <div>
    <h1>Invite User</h1>

    <p>
      Invite user to the {{account.name}} account.
      The user will get an invitation link via email.
    </p>

    <form class="profile-form" @submit.prevent="save">
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" v-model="userInvite.email" class="form-control" id="email" v-bind:class="{ 'is-invalid': errors.email}" v-autofocus/>
        <div class="invalid-feedback">
          {{errors.email}}
        </div>
      </div>

      <div class="form-group">
        <label for="role">Role</label>
        <select v-model="userInvite.role" id="role" class="form-control">
          <option v-for="role in ROLES" v-bind:key="role">
            {{role}}
          </option>
        </select>
        <div class="invalid-feedback">
          {{errors.role}}
        </div>
      </div>

      <input type="submit" class="btn btn-primary" value="Send Invite" />
    </form>
  </div>
</template>

<script>
import u from '@/util'
import router from '@/router'
import UserInvite from '@/services/user_invite'
import Account from '@/services/account'
import Alert from '@/services/alert'
import {ROLES} from '@/config'

export default {
  data: () => {
    return {
      ROLES,
      userInvite: {role: 'read'},
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
      const id = this.$route.params.id
      this.account = await Account.get(id, {relationshipLevels: 2})
    },
    save: async function () {
      this.errors = {}
      this.baseErrors = []
      Alert.clear()
      try {
        await UserInvite(this.account.id).create(this.userInvite)
        Alert.setNext('success', 'User Invite Sent')
        router.push(`/accounts/${this.account.id}/edit`)
      } catch (error) {
        if (error.status === 422 && u.notEmpty(error.errors)) {
          this.baseErrors = u.filter(error.errors, e => u.nil(e.field))
          this.errors = error.errors.reduce((acc, error) => {
            if (error.field) {
              acc[error.field] = error.message
            }
            return acc
          }, {})
          Alert.set('errors', {title: `Could not invite user`, errors: error.errors})
        } else {
          Alert.set('warning', `Could not invite user. Please try again (status=${error.status})`)
          throw error
        }
      }
    }
  }
}
</script>

<style lang="css">
</style>
