<template>
  <div>
    <h1>Space Config</h1>

    <form class="space-form" @submit.prevent="save">
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
    </form>
  </div>
</template>

<script>
import u from '@/util'
import session from '@/services/session'
import Space from '@/services/space'
import Alert from '@/services/alert'

export default {
  data: () => {
    return {
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
      const accountId = session.get('account.id')
      const id = this.$route.params.id || session.get('space.id')
      this.space = await Space(accountId).get(id, {relationshipLevels: 2})
    },
    save: async function () {
      try {
        const accountId = session.get('account.id')
        await Space(accountId).update(this.space)
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
          Alert.set('warning', `Could not save space. Please fix the erorrs in the form and try again`)
        } else {
          Alert.set('warning', `Could not save space. Please try again (status=${error.status})`)
        }
      }
    }
  }
}
</script>

<style lang="css">
</style>
