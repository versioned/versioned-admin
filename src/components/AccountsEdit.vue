<template>
  <div>
    <h1>Account Config</h1>

    <form class="profile-form" @submit.prevent="save">
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

export default {
  data: () => {
    return {
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
</style>
