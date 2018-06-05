<template lang="html">
  <form class="page-form" @submit.prevent="formSubmit" role="form">
    <div class="form-group">
      <div class="form-group buttons">
        <input type="submit" class="btn btn-primary" value="Spara" />
      </div>

      <div class="form-group" v-for="attribute in readAttributes">
        <label name="title">{{attribute.label}}</label>
        <div class="attribute-value">
          {{attribute.value}}
        </div>
      </div>

      <data-form-field v-for="attribute in writeAttributes" :doc="doc" :attribute="attribute" :key="attribute.key"></data-form-field>

      <div class="form-group buttons">
        <input type="submit" class="btn btn-primary" value="Spara" />
      </div>
    </div>
  </form>
</template>

<script>
import Swagger from '@/services/swagger'
import DataFormField from '@/components/data/DataFormField'

export default {
  props: ['doc', 'schema'],
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
      this.$emit('formSubmit', this.doc)
    }
  }
}
</script>

<style lang="css">
</style>
