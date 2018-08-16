<template>
  <div>
    <h1>Account Config</h1>

    <form class="account-form" @submit.prevent="save">
      <!-- <div class="form-group">
        <label>Plan:</label>
        {{account.plan}}
      </div> -->

      <div class="form-group">
        <label>Users</label>

        <ul class="users-list">
          <li v-for="user in account.users" v-bind:key="user.id">
            {{user.email}}
            <select v-model="user.role">
              <option v-for="role in ROLES" v-bind:key="role">
                {{role}}
              </option>
            </select>
            <a href="#" @click.prevent="removeUser(user)" v-if="user.email !== sessionEmail" class="remove-user">
              [remove]
            </a>
          </li>
        </ul>

        <div class="invalid-feedback error-message">
          {{errors.users}}
        </div>

        <p v-if="account.userInvites && account.userInvites.length > 0">
          Invited Users

          <ul class="invited-users-list">
            <li v-for="userInvite in account.userInvites" v-bind:key="userInvite.id">
              <router-link :to="inviteUserUrl(userInvite.id)" class="user-invite">
                {{userInvite.email}}
              </router-link>
            </li>
          </ul>
        </p>

        <p>
          <router-link :to="newInviteUserUrl()" class="invite-user">
            Invite User
          </router-link>
        </p>
      </div>

      <div class="form-group">
        <label for="name">Name</label>
        <input type="text" v-model="account.name" class="form-control" id="name" v-bind:class="{ 'is-invalid': errors.name}" v-autofocus/>
        <div class="invalid-feedback">
          {{errors.name}}
        </div>
      </div>

      <input type="submit" class="btn btn-primary" value="Save" />
    </form>
  </div>
</template>

<script>
import u from '@/util'
import session from '@/services/session'
import Account from '@/services/account'
import Alert from '@/services/alert'
import {ROLES} from '@/config'

export default {
  data: () => {
    return {
      ROLES,
      sessionEmail: session.get('user.email'),
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
    newInviteUserUrl () {
      return `/accounts/${this.account.id}/invite-user`
    },
    inviteUserUrl (inviteId) {
      return `/accounts/${this.account.id}/invite-user/${inviteId}`
    },
    removeUser (user) {
      const users = this.account.users.filter(u => u.email !== user.email)
      this.account = u.merge(this.account, {users})
    },
    save: async function () {
      this.errors = {}
      this.baseErrors = []
      Alert.clear()
      try {
        await Account.update(this.account)
        await session.refresh()
        Alert.setBoth('success', 'Saved')
      } catch (error) {
        if (error.status === 422) {
          if (u.notEmpty(error.errors)) {
            this.baseErrors = u.filter(error.errors, e => u.nil(e.field))
            this.errors = error.errors.reduce((acc, error) => {
              if (error.field) {
                acc[error.field] = error.message
              }
              return acc
            }, {})
          }
          Alert.set('warning', `Could not save account. Please fix the erorrs in the form and try again`)
        } else {
          Alert.set('warning', `Could not save account. Please try again (status=${error.status})`)
        }
      }
    }
  }
}
</script>

<style lang="css">
  .error-message {
    display: block !important;
  }
</style>
