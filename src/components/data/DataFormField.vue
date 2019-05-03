<template lang="html">
  <div v-if="attribute.meta.translated" :class="fieldClass()">
    <div v-if="empty(languages)" class="alert alert-warning">
      To use translated fields you also need to select languages to translate in the
      <router-link :to="spaceUrl()" target="_blank">Space Config</router-link>
    </div>
    <div v-else>
      <div v-for="[language, code] in languages" class="form-group">
        <label name="title" :class="{'text-warning': isChanged}">
          {{attribute.label}} - {{language}}
          <span v-if="attribute.help" class="help">
            ({{attribute.help}})
          </span>
        </label>
        <textarea v-if="isTextAttribute(attribute.meta.translated)" type="text" v-model="doc[attribute.key][code]" class="form-control" rows="5"/>
        <input v-else type="text" ref="textInput" v-model="doc[attribute.key][code]" class="form-control" :class="{ 'is-invalid': error}"/>
      </div>
    </div>
  </div>
  <div v-else :class="fieldClass()">
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

    <template v-else-if="isNestedObject()">
        <div class="row">
          <div class="card card-body bg-light">
              <!-- <json-field :obj="doc[attribute.key]" @fieldInput="updateValue($event)"></json-field> -->
              <data-form-field v-for="nestedAttribute in nestedWriteAttributes(attribute, doc[attribute.key])" :doc="nestedDoc(doc, attribute.key, nestedAttribute)" :attribute="nestedAttribute" :model="model" :key="nestedAttribute.key"></data-form-field>
          </div>
        </div>
    </template>

    <template v-else-if="isNestedArray()">
        <div class="row">
          <div class="card card-body bg-light">
              <ul>
                <li v-for="(item, index) in doc[attribute.key]" :key="index">
                  {{attribute.key}} #{{index + 1}}
                  [<a href="#" @click="removeNestedItem(index)">remove</a>]
                  <data-form-field v-for="nestedAttribute in nestedWriteAttributes(attribute, doc[attribute.key])" :doc="nestedDoc(doc[attribute.key], index, nestedAttribute)" :attribute="nestedAttribute" :model="model" :key="nestedAttribute.key"></data-form-field>
                </li>
              </ul>
              <a href="#" @click="addNestedItem()">+ add {{attribute.key}}</a>
          </div>
        </div>
    </template>

    <input v-else-if="attribute.schema.type === 'boolean'" type="checkbox" v-model="doc[attribute.key]" @input="updateValue($event.target.value)"/>

    <textarea v-else-if="isTextAttribute(attribute.schema)" type="text" v-model="doc[attribute.key]" @input="updateValue($event.target.value)" class="form-control" rows="5"/>

    <data-rel-field v-else-if="attribute.relationship" :attribute="attribute" @fieldInput="updateValue($event)" :error="error"></data-rel-field>

    <input v-else :type="inputType()" ref="textInput" v-model="doc[attribute.key]" class="form-control" :class="{ 'is-invalid': error}" @input="updateValue($event.target.value)"/>

    <div class="invalid-feedback">
      {{error}}
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import u from '@/util'
import Swagger from '@/services/swagger'
import session from '@/services/session'
import DataRelField from '@/components/data/DataRelField'
import {languageToCode} from '@/language_codes'

export default {
  name: 'data-form-field',
  props: ['doc', 'attribute', 'model', 'isChanged', 'error'],
  data () {
    const space = u.getIn(session.get(), 'space')
    return {
      languages: (space.languages || []).map((language) => [language, languageToCode(language)])
    }
  },
  mounted () {
    if (this.attribute.index === 0 && this.$refs.textInput) {
      this.$refs.textInput.focus()
    }
  },
  methods: {
    updateValue (value) {
      if (this.attribute.schema.type === 'boolean') {
        value = this.doc[this.attribute.key] ? false : true
      } else if (this.attribute.schema.type === 'number') {
        value = parseFloat(this.doc[this.attribute.key])
        this.doc[this.attribute.key] = value
      }
      this.$emit('fieldChange', {[this.attribute.key]: value})
    },
    isNestedObject () {
      return !this.attribute.relationship && this.attribute.schema.type === 'object'
    },
    isNestedArray () {
      return !this.attribute.relationship && this.attribute.schema.type === 'array'
    },
    isTextAttribute (schema) {
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
    },
    spaceUrl () {
      const space = u.getIn(session.get(), 'space')
      return `/accounts/${space.accountId}/spaces/${space.id}/edit`
    },
    nestedWriteAttributes (attribute, value) {
      const schema = attribute.schema.type === 'array' ? attribute.schema.items : attribute.schema
      return Swagger.writeAttributes(schema, value)
    },
    nestedDoc (doc, key, nestedAttribute) {
      if (!doc[key]) Vue.set(doc, key, {})
      if (nestedAttribute.schema.type === 'array' && !doc[key][nestedAttribute.key]) {
        Vue.set(doc[key], nestedAttribute.key, [])
      }
      return doc[key]
    },
    addNestedItem () {
      this.doc[this.attribute.key] = this.doc[this.attribute.key].concat([{}])
    },
    removeNestedItem (index) {
      this.doc[this.attribute.key] = this.doc[this.attribute.key].filter((_, i) => i !== index)
    }
  },
  components: {
    DataRelField
  }
}
</script>

<style lang="css">
</style>
