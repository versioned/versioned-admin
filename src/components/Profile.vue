<template>
  <div>
    <h1>User Profile</h1>

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
import u from '@/util'
import User from '@/services/user'
import UserApi from '@/services/user_api'
import Alert from '@/services/alert'

export default {
  data: () => {
    return {
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
      const id = u.getIn(User.get(), 'user.id')
      this.user = await UserApi.get(id, {relationshipLevels: 0})
    },
    save: async function () {
      try {
        await UserApi.update(this.user)
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
          Alert.set('warning', `Could not save user profile. Please fix the erorrs in the form and try again`)
        } else {
          Alert.set('warning', `Could not save user profile. Please try again (status=${error.status})`)
        }
      }
    }
  }
}
</script>

<style lang="css">
</style>
