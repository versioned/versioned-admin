<template lang="html">
  <form class="page-form" @submit.prevent="formSubmit" role="form">
    <div class="form-group">
      <div class="form-group buttons">
        <input type="submit" class="btn btn-primary" value="Spara" />
      </div>


      <div class="form-input" v-for="attribute in readAttributes">
        <label name="title">{{attribute.label}}</label>
        <div class="attribute-value">
          {{attribute.value}}
        </div>
      </div>

      <docs-form-field v-for="attribute in writeAttributes" :doc="doc" :attribute="attribute" :key="attribute.key"></docs-form-field>

      <div class="form-group buttons">
        <input type="submit" class="btn btn-primary" value="Spara" />
      </div>
    </div>
  </form>
</template>

<script>
import Swagger from '@/services/swagger'
import DocsFormField from '@/components/docs/DocsFormField'

export default {
  props: ['doc', 'schema'],
  computed: {
    readAttributes: function() {
      if (this.doc && this.schema) {
        return Swagger.readAttributes(this.schema, this.doc)
      } else {
        return null
      }
    },
    writeAttributes: function() {
      if (this.doc && this.schema) {
        return Swagger.writeAttributes(this.schema, this.doc)
      } else {
        return null
      }
    }
  },
  components: {
    DocsFormField
  },
  methods: {
    formSubmit() {
      this.$emit('formSubmit', this.doc)
    }
  }
}
</script>

<style lang="css">
</style>
