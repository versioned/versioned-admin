<template>
  <div>
    <h1>User Profile</h1>

    <div v-if="isAdmin()">
      <div v-if="user.accounts && user.accounts.length > 1">
        <p>
          <strong>
            Accounts
          </strong>
        </p>

        <ul class="accounts">
          <li v-for="account in user.accounts" v-bind:key="account.id">
            <router-link :to="accountUrl(account)" :class="{'account-link': true, 'current-account': currentAccount(account)}">
              {{account.name}}
            </router-link>
            <span v-if="currentAccount(account)">
              [current]
            </span>
          </li>
        </ul>
      </div>
      <div v-else>
        <p>
          <strong>
            Account:
          </strong>
          <router-link :to="accountUrl(session.account)" class="account-link current-account">
            {{session.account.name}}
          </router-link>
        </p>
      </div>
    </div>

    <form class="profile-form" @submit.prevent="save">
      <div class="form-group">
        <label for="name">Name</label>
        <input type="text" v-model="user.name" class="form-control" id="name" v-bind:class="{ 'is-invalid': errors.name}" v-autofocus/>
        <div class="invalid-feedback">
          {{errors.name}}
        </div>
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" v-model="user.email" class="form-control" id="email" v-bind:class="{ 'is-invalid': errors.email}" required/>
        <div class="invalid-feedback">
          {{errors.email}}
        </div>
      </div>

      <input type="submit" class="btn btn-primary" value="Save" />
    </form>
  </div>
</template>

<script>
import session from '@/services/session'
import User from '@/services/user'
import Alert from '@/services/alert'
import FormUtil from '@/form_util'

export default {
  data: () => {
    return {
      session: {},
      user: {},
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
      this.session = session.get()
      const id = session.get('user.id')
      this.user = await User.get(id, {relationshipLevels: 2})
    },
    accountUrl (account) {
      return `/accounts/${account.id}/edit`
    },
    currentAccount (account) {
      return account.id === this.session.account.id
    },
    save: async function () {
      try {
        await User.update(this.user)
        Alert.setBoth('success', 'Saved')
      } catch (error) {
        this.errors = FormUtil.handleError(error)
      }
    }
  }
}
</script>

<style lang="css">
  ul.accounts li {
    margin-left: 0;
  }
  /* ul.accounts li {
    list-style-type: none;
  } */
</style>
