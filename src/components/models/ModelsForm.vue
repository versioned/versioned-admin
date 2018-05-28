<template lang="html">
  <form class="models-form" @submit.prevent="submit">
    <ul v-if="allErrors.length > 0" class="errors alert alert-danger">
      <li v-for="error in allErrors">{{error.field}} {{error.message}}</li>
    </ul>
    <div class="form-group">
      <label for="name">Name</label>
      <input type="name" v-model="model.name" class="form-control" id="name" v-bind:class="{ 'is-invalid': errors.name}" autofocus required/>
      <div class="invalid-feedback">
        {{errors.name}}
      </div>

      <label for="schema">Schema</label>
      <json-field id="schema" :obj="model.model.schema" @fieldInput="updateSchema($event)"></json-field>
      <div class="invalid-feedback">
        {{errors.schema}}
      </div>
    </div>

    <input type="submit" class="btn btn-primary" value="Save" />
    <a v-if="model.id" href="#" @click="remove()">Delete</a>
    <img v-if="$store.state.loading" src="/ajax-loader.gif">
  </form>
</template>

<script>
import u from '@/util'
import JsonField from '@/components/form/JsonField'

export default {
  props: ['model'],
  data: function () {
    return {
      errors: {},
      allErrors: []
    }
  },
  methods: {
    updateSchema (value) {
      this.model.model.schema = value
    },
    submit () {
      this.$emit('submit', this.model)
    },
    remove () {
      this.$emit('remove', this.model)
    },
    handleError (error) {
      if (error.status === 422) {
        if (u.notEmpty(error.errors)) {
          this.allErrors = error.errors
          this.errors = error.errors.reduce((acc, error) => {
            if (error.field) {
              acc[error.field] = error.message
            }
            return acc
          }, {})
        }
      } else {
        throw error
      }
    }
  },
  components: {
    JsonField
  }
}
</script>
