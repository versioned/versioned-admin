<template>
  <div>
    <h1>New Space</h1>

    <form class="spaces-form" @submit.prevent="save">
      <div class="form-group">
        <label for="name">Account:</label>
        {{account.name}}
      </div>

      <div class="form-group">
        <label for="name">Name</label>
        <input type="text" v-model="space.name" class="form-control" id="name" v-bind:class="{ 'is-invalid': errors.name}" v-autofocus/>
        <div class="invalid-feedback">
          {{errors.name}}
        </div>
      </div>

      <input type="submit" class="btn btn-primary" value="Save" />
    </form>
  </div>
</template>

<script>
import router from '@/router'
import session from '@/services/session'
import Account from '@/services/account'
import Space from '@/services/space'
import Alert from '@/services/alert'
import FormUtil from '@/form_util'

export default {
  data: () => {
    return {
      account: {},
      space: {},
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
      this.account = await Account.get(this.$route.params.accountId)
      this.space.accountId = this.account.id
    },
    save: async function () {
      this.errors = {}
      Alert.clear()
      try {
        this.space = await Space(this.account.id).create(this.space)
        await session.refresh()
        Alert.setNext('success', `Space ${this.space.name} saved. <a href="/#/models/new">Create a model</a>`)
        router.push(`/accounts/${this.space.accountId}/spaces/${this.space.id}/edit?makeCurrent=1`)
      } catch (error) {
        this.errors = FormUtil.handleError(error)
      }
    }
  }
}
</script>

<style lang="css">
</style>
