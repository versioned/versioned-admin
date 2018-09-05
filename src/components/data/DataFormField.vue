<template lang="html">
  <div :class="fieldClass()">
    <label name="title" :class="{'text-warning': isChanged}">
      {{attribute.label}}
      <span v-if="attribute.help" class="help">
        ({{attribute.help}})
      </span>
    </label>

    <select v-if="attribute.schema.enum" v-model="doc[attribute.key]" @input="updateValue($event.target.value)" class="form-control">
      <option v-for="value in enumOptions()">
        {{ value }}
      </option>
    </select>

    <json-field v-else-if="isJsonField()" :obj="doc[attribute.key]" @fieldInput="updateValue($event)"></json-field>

    <input v-else-if="attribute.schema.type === 'boolean'" type="checkbox" v-model="doc[attribute.key]" @input="updateValue($event.target.value)"/>

    <textarea v-else-if="isTextAttribute()" type="text" v-model="doc[attribute.key]" @input="updateValue($event.target.value)" class="form-control" rows="5"/>

    <data-rel-field v-else-if="attribute.relationship" :attribute="attribute" @fieldInput="updateValue($event)" :error="error"></data-rel-field>

    <input v-else :type="inputType()" ref="textInput" v-model="doc[attribute.key]" class="form-control" :class="{ 'is-invalid': error}" @input="updateValue($event.target.value)"/>

    <div class="invalid-feedback">
      {{error}}
    </div>
  </div>
</template>

<script>
import u from '@/util'
import JsonField from '@/components/form/JsonField'
import DataRelField from '@/components/data/DataRelField'

export default {
  props: ['doc', 'attribute', 'model', 'isChanged', 'error'],
  mounted () {
    if (this.attribute.index === 0 && this.$refs.textInput) {
      this.$refs.textInput.focus()
    }
  },
  methods: {
    updateValue (value) {
      if (this.attribute.schema.type === 'boolean') {
        value = this.doc[this.attribute.key] ? false : true
      }
      this.$emit('fieldChange', {[this.attribute.key]: value})
    },
    isJsonField () {
      return !this.attribute.relationship && (this.attribute.schema.type === 'object' || this.attribute.schema.type === 'array')
    },
    isTextAttribute () {
      const schema = this.attribute.schema
      return schema.type === 'string' && schema.maxLength && schema.maxLength > 256
    },
    enumOptions () {
      return u.concat([null], this.attribute.schema.enum)
    },
    inputType () {
      if (this.attribute.schema.type === 'integer') {
        return 'number'
      } else {
        return 'text'
      }
    },
    fieldClass () {
      return `form-group data-field data-field-${this.attribute.key}`
    }
  },
  components: {
    JsonField,
    DataRelField
  }
}
</script>

<style lang="css">
</style>
