<template lang="html">
  <div class="form-input">
    <label name="title">
      {{attribute.label}}
      <span v-if="attribute.help" class="help">
        ({{attribute.help}})
      </span>
    </label>

    <select v-if="attribute.schema.enum" v-model="doc[attribute.key]" class="form-control">
      <option v-for="value in attribute.schema.enum">
        {{ value }}
      </option>
    </select>

    <json-field v-else-if="isJsonField()" :obj="doc[attribute.key]" @fieldInput="updateJson($event)"></json-field>

    <input v-else-if="attribute.schema.type == 'boolean'" type="checkbox" v-model="doc[attribute.key]" value="1" />

    <textarea v-else-if="attribute.form_field == 'textarea'" type="text" v-model="doc[attribute.key]" class="form-control" rows="5"/>

    <input v-else type="text" v-model="doc[attribute.key]" class="form-control" />
  </div>
</template>

<script>
import JsonField from '@/components/form/JsonField'

export default {
  props: ['doc', 'attribute'],
  methods: {
    updateJson(value) {
      this.doc[this.attribute.key] = value
    },
    isJsonField() {
      return this.attribute.schema.type === 'object' || this.attribute.schema.type === 'array'
    }
  },
  components: {
    JsonField
  }
}
</script>

<style lang="css">
</style>
