<template lang="html">
  <textarea type="text" :id="id" ref="objJson" v-model="objJson" class="form-control" @input="fieldInput" rows="20"/>
</template>

<script>
import u from '@/util'
import Alert from '@/services/alert'

export default {
  props: ['id', 'obj'],
  data: function () {
    return {
      valid: true
    }
  },
  computed: {
    objJson: {
      get () {
        // NOTE: Only allow the obj value to be passed once from the parent component.
        // Otherwise the circular update may mess with whitespace and cursor position during editing
        return u.prettyJson(this.obj)
      },
      set (value) {
        try {
          if (value) {
            JSON.parse(value)
            Alert.set('errors', null)
            this.valid = true
          }
        } catch (e) {
          Alert.set('errors', {title: `Invalid JSON: ${e}`})
          this.valid = false
        }
      }
    }
  },
  methods: {
    fieldInput () {
      if (this.valid) {
        const obj = JSON.parse(this.$refs.objJson.value)
        this.$emit('fieldInput', obj)
      }
    }
  }
}
</script>

<style lang="css">
div.buttons {
  margin-top: 10px;
}
</style>
