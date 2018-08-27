<template>
  <div>
    <h1>Account Config</h1>

    <form class="account-form" @submit.prevent="save">
      <div class="form-group" v-if="!currentAccount(account)">
        <a href="#" @click="makeCurrent()">Switch to this account</a>
      </div>

      <div class="form-group">
        <label v-if="account.spaces && account.spaces.length > 0">Spaces</label>
        <label v-else>No Spaces</label>

        <ul class="spaces-list">
          <li v-for="space in account.spaces" v-bind:key="space.id">
            <router-link :to="spaceUrl(space)" :class="{'space-link': true, 'current-space': currentSpace(space)}">
              {{space.name}}
            </router-link>
            <span v-if="currentSpace(space)">
              [current]
            </span>
          </li>
        </ul>

        <p>
          <router-link :to="newSpaceUrl()" class="new-space">
            New Space
          </router-link>
        </p>
      </div>

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
import FormUtil from '@/form_util'

export default {
  data: () => {
    return {
      ROLES,
      sessionEmail: session.get('user.email'),
      account: {},
      errors: {}
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
    currentAccount (account) {
      return account.id === session.get('account.id')
    },
    makeCurrent () {
      session.set(u.merge(session.get(), {account: this.account}))
      const space = this.account.spaces[0]
      session.set(u.merge(session.get(), {space}))
    },
    currentSpace (space) {
      return space.id === session.get('space.id')
    },
    spaceUrl (space) {
      return `/accounts/${space.accountId}/spaces/${space.id}/edit`
    },
    newSpaceUrl () {
      return `/accounts/${this.account.id}/spaces/new`
    },
    save: async function () {
      this.errors = {}
      Alert.clear()
      try {
        await Account.update(this.account)
        await session.refresh()
        Alert.setBoth('success', 'Saved')
      } catch (error) {
        this.errors = FormUtil.handleError(error)
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
