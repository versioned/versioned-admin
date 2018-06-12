<template lang="html">
  <form @submit.prevent="formSubmit" role="form">
    <ul v-if="allErrors.length > 0" class="errors alert alert-danger">
      <li v-for="error in allErrors">{{error.field}} - {{error.message}}</li>
    </ul>
    <div class="form-group">
      <div class="form-group buttons">
        <input type="submit" class="btn btn-primary" value="Save" />
      </div>

      <div class="form-group" v-for="attribute in readAttributes">
        <label name="title">{{attribute.label}}</label>
        <div class="attribute-value">
          {{attribute.value}}
        </div>
      </div>

      <data-form-field v-for="attribute in writeAttributes" :doc="doc" :attribute="attribute" :model="model" :key="attribute.key"></data-form-field>

      <div class="form-group buttons">
        <input type="submit" class="btn btn-primary" value="Save" />
        <a v-if="doc.id" href="#" @click.prevent="remove()">Delete</a>
      </div>
    </div>
  </form>
</template>

<script>
import u from '@/util'
import Swagger from '@/services/swagger'
import DataFormField from '@/components/data/DataFormField'

export default {
  props: ['model', 'doc', 'schema'],
  data: function () {
    return {
      allErrors: []
    }
  },
  computed: {
    readAttributes: function () {
      if (this.doc && this.schema) {
        return Swagger.readAttributes(this.schema, this.doc)
      } else {
        return null
      }
    },
    writeAttributes: function () {
      if (this.doc && this.schema) {
        return Swagger.writeAttributes(this.schema, this.doc)
      } else {
        return null
      }
    }
  },
  components: {
    DataFormField
  },
  methods: {
    formSubmit () {
      this.allErrors = []
      this.$emit('formSubmit', this.doc)
    },
    remove () {
      this.$emit('remove', this.doc)
    },
    handleError (error) {
      if (error.status === 422) {
        if (u.notEmpty(error.errors)) {
          this.allErrors = error.errors
        }
      } else {
        throw error
      }
    }
  }
}
</script>

<style lang="css">
</style>
