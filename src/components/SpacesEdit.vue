<template>
  <div>
    <h1>Space Config</h1>

    <form class="spaces-form" @submit.prevent="save">
      <div class="form-group" v-if="!currentSpace(space)">
        <a href="#" @click="makeCurrent()">Switch to this space</a>
      </div>

      <div class="form-group">
        <label for="name">Account:</label>
        <router-link class="account-link" :to="accountUrl()">
          {{space.account.name}}
        </router-link>
      </div>

      <div class="form-group">
        <label for="name">Name</label>
        <input type="text" v-model="space.name" class="form-control" id="name" v-bind:class="{ 'is-invalid': errors.name}" v-autofocus/>
        <div class="invalid-feedback">
          {{errors.name}}
        </div>
      </div>

      <div class="form-group">
        TODO: webhook URL
      </div>

      <div class="form-group">
        TODO: spaces.config.ALGOLIASEARCH_APPLICATION_ID
      </div>

      <div class="form-group">
        TODO: spaces.config.ALGOLIASEARCH_API_KEY
      </div>

      <div class="form-group">
        TODO: spaces.config.ALGOLIASEARCH_INDEX_NAME
      </div>

      <div class="form-group">
        TODO: spaces.databaseUrl
      </div>

      <input type="submit" class="btn btn-primary" value="Save" />
      <a v-if="space.id" href="#" @click.prevent="remove()" class="delete">Delete</a>
    </form>
  </div>
</template>

<script>
import u from '@/util'
import session from '@/services/session'
import router from '@/router'
import Space from '@/services/space'
import Alert from '@/services/alert'
import FormUtil from '@/form_util'

export default {
  data: () => {
    return {
      accountId: null,
      space: {account: {}},
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
    currentSpace (space) {
      return space.id === session.get('space.id')
    },
    makeCurrent () {
      session.set(u.merge(session.get(), {account: this.space.account}))
      session.set(u.merge(session.get(), {space: this.space}))
    },
    accountUrl () {
      return `/accounts/${this.space.accountId}/edit`
    },
    async getData () {
      this.accountId = this.$route.params.accountId || session.get('account.id')
      const id = this.$route.params.id || session.get('space.id')
      this.space = await Space(this.accountId).get(id, {relationshipLevels: 2})
      if (this.$route.query.makeCurrent) this.makeCurrent()
    },
    async save () {
      try {
        await Space(this.accountId).update(this.space)
        await session.refresh()
        Alert.setBoth('success', 'Saved')
      } catch (error) {
        this.errors = FormUtil.handleError(error)
      }
    },
    async remove () {
      if (confirm(`Are you sure you want to delete the space ${this.space.name} in the ${this.space.account.name} account? All data in the space will be removed and this cannot be undone`)) {
        try {
          await Space(this.accountId).remove(this.space.id)
          await session.refresh()
          Alert.setNext('success', `Space ${this.space.name} deleted`)
          router.push(this.accountUrl())
        } catch (error) {
          Alert.set('warning', 'Could not delete space')
        }
      }
    }
  }
}
</script>

<style lang="css">
</style>
