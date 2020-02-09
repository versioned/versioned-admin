<template lang="html">
  <form @submit.prevent="submit" class="models-form">
    <div class="form-group buttons">
      <input type="submit" class="btn btn-primary" value="Save" />
    </div>

    <div class="form-group required">
      <label for="name">Name</label>
      <input type="text" v-model="model.name" class="form-control" id="name" :maxlength="NAME_LENGTH" @input="nameChange()" v-bind:class="{ 'is-invalid': errors.name}" v-autofocus required/>
      <div class="invalid-feedback">
        {{errors.name}}
      </div>
    </div>

    <div class="form-group required">
      <label for="coll">Key</label>
      <input type="text" v-model="model.coll" class="form-control" id="coll" :maxlength="KEY_LENGTH" @change="makeDbFriendly(model, 'coll')" v-bind:class="{ 'is-invalid': errors.coll}" :disabled="model.id" required/>
      <div class="invalid-feedback">
        {{errors.coll}}
      </div>
    </div>

    <div class="form-group">
      <div class="form-check">
        <input v-model="features.published" class="form-check-input" type="checkbox">
        <label class="form-check-label">
          Published and versioned
        </label>
      </div>
    </div>

    <div class="form-group">
      <label for="previewUrl">Preview URL</label>
      <input type="text" v-model="model.previewUrl" class="form-control" id="previewUrl" v-bind:class="{ 'is-invalid': errors.previewUrl}" placeholder="https://my-website.example.com/articles/{id}"/>
      <div class="invalid-feedback">
        {{errors.previewUrl}}
      </div>
    </div>

    <div :class="fieldClass(field, index)" v-for="(field, index) in model.fields">
      <h2 :class="{'field-heading': true, 'required': field.required}">
        <a href="#" @click.prevent="toggleCollapsed(field.key)" class="expand-field">
          <span v-if="!field.name">Field {{index + 1}}</span>
          <span v-else-if="isRelationship(field)">
            {{field.name}} relationship
          </span>
          <span v-else>
            {{field.name}}
          </span>
        </a>
        <span v-if="field.category === 'data'" class="small">[{{field.type}}]</span>
        <span v-if="field.category === 'data' && field.array" class="small">[array]</span>
        <!-- <a href="#" class="small" v-show="field.key && collapsed[field.key]" @click.prevent="toggleCollapsed(field.key)">show</a>
        <a href="#" class="small" v-show="field.key && !collapsed[field.key]" @click.prevent="toggleCollapsed(field.key)">hide</a> -->
        <a href="#" class="small remove-field" v-show="index> 0" @click.prevent="removeField(index)">[remove]</a>
      </h2>

      <div v-show="!collapsed[field.key]" class="fields">
        <div class="form-group required">
          <label>Name</label>
          <input type="text" v-model="field.name" :maxlength="NAME_LENGTH" @input="fieldNameChange(field)" ref="fieldName" class="form-control field-name" required/>
        </div>

        <div class="form-group required">
          <label>Key</label>
          <input type="text" v-model="field.key" :maxlength="KEY_LENGTH" @change="makeDbFriendly(field, 'key')" class="form-control field-key" required/>
        </div>

        <div class="form-group">
          <div class="form-check">
            <input v-model="field.category" class="form-check-input" type="radio" value="data" @change="fieldChanged(field)">
            <label class="form-check-label">
              Data field
            </label>
          </div>

          <div class="form-check">
            <input v-model="field.category" class="form-check-input one-way-relationship" type="radio" value="oneWayRelationship" @change="fieldChanged(field)">
            <label class="form-check-label">
              One-way Relationship
            </label>
          </div>

          <div class="form-check">
            <input v-model="field.category" class="form-check-input two-way-relationship" type="radio" value="twoWayRelationship" @change="fieldChanged(field)">
            <label class="form-check-label">
              Two-way Relationship
            </label>
          </div>

          <div class="form-check">
            <input v-model="field.category" class="form-check-input sequence" type="radio" value="sequence" @change="fieldChanged(field)">
            <label class="form-check-label">
              Integer Sequence (1, 2, 3...)
            </label>
          </div>

          <div class="form-check">
            <input v-model="field.category" class="form-check-input slug" type="radio" value="slug" @change="fieldChanged(field)">
            <label class="form-check-label">
              Slug (for SEO-friendly URLs, generated from the title field)
            </label>
          </div>
        </div>

        <div v-if="field.category === 'data'" class="form-group">
          <label class="form-check-label">
            Data type
          </label>
          <select v-if="field.category === 'data'" v-model="field.type" class="data-type" @change="fieldChanged(field)">
            <option v-for="type in FIELD_TYPES" v-bind:value="type.key">
              {{type.name}}
            </option>
          </select>
        </div>

        <div v-show="showTranslateWarning(field)" class="form-group alert alert-warning">
          To use translated fields you also need to select languages to translate in the
          <router-link :to="spaceUrl()" target="_blank">Space Config</router-link>
        </div>

        <div v-if="field.category === 'data' && field.type === 'object'" class="form-group required">
          <label>JSON Schema</label>
          <div class="invalid-schema">
            {{field.errors.schema}}
          </div>
          <codemirror ref="codemirror" v-model="field.schema" :options="codemirrorOptions" @input="validateSchema(field)" v-bind:class="{ 'is-invalid': field.errors.schema}"></codemirror>
          <div class="invalid-schema">
            {{field.errors.schema}}
          </div>
        </div>

        <div v-if="field.category === 'data'" class="form-group">
          <div class="form-check">
            <input v-model="field.titleProperty" class="form-check-input" type="checkbox" @change="updateTitleProperty(index)">
            <label class="form-check-label">
              Title/Name field
            </label>
          </div>
        </div>

        <div v-if="isRelationship(field)" class="form-group required to-type">
          <label v-if="field.category === 'oneWayRelationship'">
            Target models (comma separated keys)
          </label>
          <label v-else>
            Target model (key)
          </label>
          <input type="text" v-model="field.relationship.toTypes" class="form-control to-type" required/>
          <div v-show="toTypeWarning(field)">
            <p class="alert alert-warning">
              {{toTypeWarning(field)}}
            </p>
            <p>
              Existing models:
            <ul>
              <li v-for="coll in existingModels">
                <a href="#" @click="selectModel(field, coll, index)">{{coll}}</a>
              </li>
            </ul>
            </p>
          </div>
        </div>

        <div v-if="field.category === 'twoWayRelationship'" class="form-group required">
          <label>Target field (key)</label>
          <input type="text" v-model="field.relationship.toField" :maxlength="FIELD_LENGTH" @change="makeDbFriendly(field.relationship, 'toField')" class="form-control to-field" required/>
        </div>

        <div v-if="field.category === 'oneWayRelationship'" class="form-group">
          <div class="form-check">
            <input class="form-check-input one-to-many" type="radio" v-model="field.relationship.type" value="one-to-many">
            <label class="form-check-label">
              Multiple ID references ("has many" relationship, i.e. an array of IDs)
            </label>
          </div>
          <div class="form-check">
            <input class="form-check-input many-to-one" type="radio" v-model="field.relationship.type" value="many-to-one">
            <label class="form-check-label">
              Single ID reference ("belongs to" relationship, i.e. a single ID)
            </label>
          </div>
          <div class="form-check">
            <input class="form-check-input one-to-one" type="radio" v-model="field.relationship.type" value="one-to-one">
            <label class="form-check-label">
              Single Unique ID reference ("belongs to" relationship, i.e. a single ID)
            </label>
          </div>
        </div>

        <div v-if="field.category === 'twoWayRelationship'" class="form-group">
          <div class="form-check">
            <input class="form-check-input one-to-many" type="radio" v-model="field.relationship.type" value="one-to-many">
            <label class="form-check-label">
              One to Many - multiple ID references (array of IDs in this model, single ID in target model)
            </label>
          </div>
          <div class="form-check">
            <input class="form-check-input many-to-many" type="radio" v-model="field.relationship.type" value="many-to-many">
            <label class="form-check-label">
              Many to Many - multiple ID references (array of IDs in this model, array of IDs in target model)
            </label>
          </div>
          <div class="form-check">
            <input class="form-check-input many-to-one" type="radio" v-model="field.relationship.type" value="many-to-one">
            <label class="form-check-label">
              Many to One - single ID reference (single ID in this model, array of IDs in target model)
            </label>
          </div>
          <div class="form-check">
            <input class="form-check-input one-to-one" type="radio" v-model="field.relationship.type" value="one-to-one">
            <label class="form-check-label">
              One to One - single unique ID reference (single unique ID in this model, single unique ID in target model)
            </label>
          </div>
        </div>

        <!-- <div v-if="field.category !== 'data'" class="form-group">
          <label>Relationship name (if field key is "userId" then a good relationship name might be "user" - optional)</label>
          <input type="text" v-model="field.relationship.name" :maxlength="KEY_LENGTH" @change="makeDbFriendly(field.relationship, 'name')" class="form-control"/>
        </div> -->

        <div class="form-group">
          <!-- <div v-if="enabledField('array', field)" class="form-check">
            <input v-model="field.array" class="form-check-input" type="checkbox">
            <label class="form-check-label">
              Array (multiple {{field.type}} values)
            </label>
          </div> -->
          <div v-if="field.category !== 'sequence'" class="form-check">
            <input v-model="field.required" class="form-check-input required" type="checkbox">
            <label class="form-check-label">
              Required
            </label>
          </div>
          <div class="form-check" v-show="showCascade(field)">
            <input v-model="field.cascade" class="form-check-input cascade" type="checkbox">
            <label class="form-check-label">
              Cascade deletes (i.e. if relationship is removed, delete the document)
            </label>
          </div>

          <div v-if="enabledField('unique', field)" class="form-check">
            <input v-model="field.unique" class="form-check-input" type="checkbox">
            <label class="form-check-label">
              Unique
            </label>
          </div>

          <div v-if="enabledField('validation', field)" class="form-check">
            <input v-model="field.hasValidation" class="form-check-input" type="checkbox" value="true">
            <label class="form-check-label">
              Validation
            </label>
          </div>

          <div v-if="enabledField('validation', field) && field.hasValidation" class="form-group">
            <div v-if="enabledField('validation.minLength', field)" class="form-group">
              <label>Minimum Length</label>
              <input type="number" v-model="field.validation.minLength" class="form-control"/>
            </div>

            <div v-if="enabledField('validation.maxLength', field)" class="form-group">
              <label>Maximum Length</label>
              <input type="number" v-model="field.validation.maxLength" class="form-control"/>
            </div>

            <div v-if="enabledField('validation.pattern', field)" class="form-group">
              <label>Pattern (regular expression)</label>
              <input type="text" v-model="field.validation.pattern" @input="validatePattern(field)" v-bind:class="{ 'is-invalid': field.errors.pattern}" class="form-control"/>
              <div class="invalid-feedback">
                {{field.errors.pattern}}
              </div>
            </div>

            <div v-if="enabledField('validation.enum', field)" class="form-group">
              <label>Only allow certain values (enumeration, comma separated)</label>
              <input type="text" v-model="field.validation.enum" class="form-control"/>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="form-group">
      <button class="btn btn-secondary add-field" @click.prevent="addField">Add Another Field</button>
    </div>

    <input v-if="model.fields.length > 0" type="submit" class="btn btn-primary" value="Save" />
    <a v-if="model.id" href="#" @click.prevent="remove()" class="delete">Delete</a>
  </form>
</template>

<script>
import Vue from 'vue'
import u from '@/util'
import session from '@/services/session'
import Alert from '@/services/alert'
import Model from '@/services/model'
import {capitalize} from '@/client_util'
import {propertiesOrder} from '@/models_util'
import FormUtil from '@/form_util'
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import META_SCHEMA from '@/json_schema_meta'
import jsonSchema from '@/json_schema'

const FIELD_TYPES = [
  {
    name: 'String (256 characters)',
    key: 'string'
  },
  {
    name: 'Translated String (256 characters)',
    key: 'translated_string'
  },
  {
    name: 'Text (50k characters)',
    key: 'text'
  },
  {
    name: 'Translated Text (50k characters)',
    key: 'translated_text'
  },
  {
    name: 'Integer Number',
    key: 'integer'
  },
  {
    name: 'Decimal Number',
    key: 'number'
  },
  {
    name: 'Boolean',
    key: 'boolean'
  },
  {
    name: 'Date and time',
    key: 'date'
  },
  {
    name: 'Nested JSON Object',
    key: 'object'
  }
]

const NAME_LENGTH = 50
const FIELD_LENGTH = 30
const KEY_LENGTH = 20
const COLL_LENGTH = 40
const dbFriendly = name => u.dbFriendly(name, KEY_LENGTH)
const STRING_PROPERTY = {type: 'string', maxLength: 256}
const TEXT_PROPERTY = {type: 'string', maxLength: 50000}
const FIELD_TYPES_PROPERTIES = {
  string: STRING_PROPERTY,
  translated_string: {type: 'object', 'x-meta': {translated: STRING_PROPERTY}},
  text: TEXT_PROPERTY,
  translated_text: {type: 'object', 'x-meta': {translated: TEXT_PROPERTY}},
  integer: {type: 'integer'},
  number: {type: 'number'},
  boolean: {type: 'boolean'},
  date: {type: 'string', format: 'date-time'}
}

function textType (type, maxLength) {
  return (type === 'string' || type === 'text') && maxLength && maxLength > FIELD_TYPES_PROPERTIES['string'].maxLength
}

function textField (field) {
  return textType(field.type, u.getIn(field, 'validation.maxLength'))
}

function fieldType (property) {
  if (textType(property.type, property.maxLength)) {
    return 'text'
  } else if (property.type === 'string' && property.format === 'date-time') {
    return 'date'
  } else if (property.type === 'array') {
    return fieldType(property.items)
  } else if (u.getIn(property, 'x-meta.translated')) {
    return fieldType(u.getIn(property, 'x-meta.translated')) === 'text' ? 'translated_text' : 'translated_string'
  } else {
    return property.type
  }
}

export default {
  props: ['model'],
  data: function () {
    return {
      models: [],
      existingModels: [],
      NAME_LENGTH,
      FIELD_LENGTH,
      KEY_LENGTH,
      COLL_LENGTH,
      FIELD_TYPES,
      errors: {},
      features: this.makeFeatures(this.model),
      collapsed: this.getCollapsed(this.model.fields),
      codemirrorOptions: {
        autoRefresh: true,
        matchBrackets: true,
        autoCloseBrackets: true,
        tabSize: 2,
        mode: {name: 'javascript', json: true},
        theme: 'base16-dark',
        lineNumbers: false,
        line: true
      }
    }
  },
  created () {
    this.getData()
  },
  watch: {
    model (model) {
      this.collapsed = this.getCollapsed(model.fields)
      this.features = this.makeFeatures(model)
    }
  },
  methods: {
    getData () {
      const spaceId = u.getIn(session.get(), 'space.id')
      Model(spaceId).list().then(({data}) => {
        this.models = data
        this.existingModels = ['assets'].concat(this.models.map(u.property('coll')))
      })
    },
    makeFeatures (model) {
      return u.makeObj(model.features || [], () => true)
    },
    getCollapsed (fields) {
      return u.makeObj(fields.map(u.property('key')), () => true)
    },
    setProperty (obj, property, value) {
      obj[property] = value
    },
    isRelationship (field) {
      return ['oneWayRelationship', 'twoWayRelationship'].includes(field.category)
    },
    makeField (field = {}) {
      const defaults = {
        key: dbFriendly(field.name),
        category: 'data',
        type: 'string',
        required: false,
        titleProperty: false,
        relationship: {type: 'one-to-many', toTypes: ''},
        validation: {},
        errors: {}
      }
      const result = u.merge(defaults, field)
      return u.merge(result, {hasValidation: u.notEmpty(result.validation)})
    },
    nameChange () {
      if (!this.model.id) {
        this.model.coll = dbFriendly(this.model.name)
      }
    },
    updateTitleProperty (index) {
      const field = this.model.fields[index]
      if (field.titleProperty) {
        this.model.fields.forEach((field, i) => {
          if (i !== index) {
            this.model.fields[i].titleProperty = false
          }
        })
      }
    },
    addField () {
      this.model.fields.push(this.makeField())
      Vue.nextTick(() => {
        const inputs = this.$refs.fieldName
        if (inputs) inputs[inputs.length - 1].focus()
      })
    },
    removeField (index) {
      this.model.fields.splice(index, 1)
    },
    fieldNameChange (field) {
      field.key = dbFriendly(field.name)
      field.relationship.toTypes = field.key
      field.relationship.toField = this.model.coll
    },
    showCascade (field) {
      return field.required &&
        field.category === 'twoWayRelationship' &&
        ['many-to-one', 'one-to-one'].includes(field.relationship.type)
    },
    toTypeExists (toType) {
      return this.existingModels.includes(toType)
    },
    toTypeWarning (field) {
      if (u.empty(field.relationship.toTypes)) return
      const toTypes = u.splitCommas(field.relationship.toTypes)
      if (field.category === 'twoWayRelationship' && toTypes.length > 1) {
        return 'Two way relationships cannot have more than one target model'
      }
      const missingTypes = toTypes.filter(t => !this.toTypeExists(t))
      if (u.notEmpty(missingTypes)) {
        return `The following models do not exist yet: ${missingTypes.join(', ')}. To create a relationship to an image or other file specify "assets" as target model.`
      } else {
        return null
      }
    },
    selectModel (field, coll, index) {
      field.relationship.toTypes = coll
    },
    makeDbFriendly (obj, prop) {
      obj[prop] = dbFriendly(obj[prop])
    },
    updateSchema (value) {
      this.model.model.schema = value
    },
    submit () {
      Alert.clear()
      if (this.model.fields) {
        this.model.model = {schema: this.getSchema(this.model.fields)}
        this.model.propertiesOrder = this.model.fields.map(u.property('key'))
      }
      this.model.features = u.keys(this.features).filter(key => this.features[key])
      this.$emit('submit', this.model)
    },
    remove () {
      this.$emit('remove', this.model)
    },
    enabledField (fieldName, field) {
      if (fieldName === 'unique') {
        return field.category === 'data' && !field.array && ['string', 'integer', 'number'].includes(field.type) && !textField(field)
      } else if (fieldName === 'validation') {
        return field.category === 'data' && ['string', 'text', 'integer', 'number'].includes(field.type)
      } else if (fieldName.endsWith('minLength') || fieldName.endsWith('maxLength')) {
        return field.category === 'data' && (field.type === 'string' || field.type === 'text')
      } else if (fieldName === 'validation.pattern') {
        return field.category === 'data' && field.type === 'string' && !textField(field)
      } else if (fieldName === 'validation.enum') {
        return field.category === 'data' && ['string', 'integer', 'number'].includes(field.type) && !textField(field)
      } else if (fieldName === 'array') {
        return field.category === 'data' && !textField(field)
      }
    },
    fieldChanged (field) {
      field.errors = {}
      field.schema = u.prettyJson({
        type: 'object',
        properties: {},
        required: [],
        additionalProperties: false
      })
    },
    validatePattern (field) {
      try {
        // NOTE: does this make sense? Can we even validate the regex?
        if (field.pattern) new RegExp(field.pattern).test('foobar')
      } catch (err) {
        field.errors.pattern = 'regular expression is invalid'
      }
    },
    validateSchema (field) {
      if (u.empty(field.schema)) {
        Vue.set(field.errors, 'schema', 'please provide a JSON Schema object')
        return
      }
      try {
        const schema = JSON.parse(field.schema)
        const schemaErrors = jsonSchema.validate(META_SCHEMA, schema)
        if (schemaErrors) {
          const message = schemaErrors.map(e => `${e.dataPath} - ${e.message}`).join(', ')
          Vue.set(field.errors, 'schema', message)
        } else if (schema.type !== 'object') {
          Vue.set(field.errors, 'schema', 'must have "type": "object"')
        } else if (u.empty(u.compact(schema.properties))) {
          Vue.set(field.errors, 'schema', 'properties must contain at least one property')
        } else {
          Vue.set(field.errors, 'schema', undefined)
        }
      } catch (err) {
        Vue.set(field.errors, 'schema', 'invalid JSON (check for matching quotation marks, curly braces, and trailing commas)')
      }
    },
    showTranslateWarning (field) {
      const space = u.getIn(session.get(), 'space')
      return field.category === 'data' && (field.type === 'translated_string' || field.type === 'translated_text') && u.empty(space.languages)
    },
    spaceUrl () {
      const space = u.getIn(session.get(), 'space')
      return `/accounts/${space.accountId}/spaces/${space.id}/edit`
    },
    toggleCollapsed (key) {
      this.collapsed = u.merge(this.collapsed, {[key]: !this.collapsed[key]})
    },
    handleError (error) {
      this.errors = FormUtil.handleError(error)
    },
    getSchema (fields) {
      const properties = fields.reduce((acc, field) => {
        acc[field.key] = this.fieldToProperty(field)
        return acc
      }, {})
      const required = fields.filter(u.property('required')).map(u.property('key'))
      const titleProperty = u.getIn(fields.find(field => field.titleProperty), 'key')
      return {
        type: 'object',
        'x-meta': {
          titleProperty
        },
        properties,
        additionalProperties: false,
        required
      }
    },
    fieldClass (field, index) {
      return `form-group field field-${index + 1} ${field.key}`
    },
    getFields (model) {
      const schema = u.getIn(model, 'model.schema', {})
      const keys = propertiesOrder(schema)
      if (u.empty(keys)) return []
      const required = schema.required || []
      return keys.map((key) => {
        const titleProperty = (u.getIn(model, 'model.schema.x-meta.titleProperty') === key)
        return this.makeField(this.propertyToField(key,
          schema.properties[key],
          required.includes(key),
          titleProperty))
      })
    },
    fieldToProperty (field) {
      let isArray = field.array
      const fieldType = field.type || 'string'
      const translated = fieldType.startsWith('translated_')
      let property = FIELD_TYPES_PROPERTIES[fieldType] || {}
      if (field.category === 'data' && field.type === 'object') {
        property = u.safeJsonParse(field.schema) || {}
      }
      let writable = true
      if (field.category === 'data') {
        if (field.hasValidation) {
          property = u.merge(property, u.evolve(field.validation, {
            enum: (v) => v.split(','),
            minLength: u.parseIfInt,
            maxLength: u.parseIfInt,
            pattern: (v) => v
          }))
        }
      } else if (field.category === 'sequence') {
        property.type = 'integer'
        field.unique = true
        writable = false
      } else if (field.category === 'slug') {
        property.type = 'string'
        field.unique = true
      } else {
        // Relationship
        property = {
          type: 'object',
          properties: {
            id: {type: 'string'},
            type: {type: 'string'}
          },
          additionalProperties: false,
          required: ['id', 'type']
        }
        isArray = ['many-to-many', 'one-to-many'].includes(field.relationship.type)
      }
      let relationship
      if (this.isRelationship(field)) {
        relationship = u.evolve(field.relationship, {
          toTypes: u.splitCommas,
          toField: (t) => (field.category === 'twoWayRelationship' ? t : undefined)
        })
      }
      const xMeta = u.compact({
        unique: (translated ? undefined : field.unique),
        writable: (writable ? undefined : false),
        field: {
          name: field.name
        },
        relationship,
        sequence: (field.category === 'sequence' ? true : undefined),
        slug: (field.category === 'slug' ? true : undefined)
      })
      if (xMeta.relationship) {
        xMeta.relationship.onDelete = (field.cascade ? 'cascade' : null)
      }
      if (isArray) {
        property = {type: 'array', items: property}
      } else if (property.enum) {
        delete property.type
      }
      return u.compact(u.deepMerge(property, {
        'x-meta': xMeta
      }))
    },
    propertyToField (key, property, required, titleProperty) {
      let type = fieldType(property)
      const name = u.getIn(property, 'x-meta.field.name', capitalize(key))
      const defaults = FIELD_TYPES_PROPERTIES[type] || {}
      const relationship = u.evolve(u.getIn(property, 'x-meta.relationship'), {toTypes: u.joinCommas})
      const sequence = u.getIn(property, 'x-meta.sequence')
      const slug = u.getIn(property, 'x-meta.slug')
      const cascade = (u.getIn(property, 'x-meta.relationship.onDelete') === 'cascade')
      let category = 'data'
      if (u.notEmpty(relationship)) {
        category = relationship.toField ? 'twoWayRelationship' : 'oneWayRelationship'
      } else if (sequence) {
        category = 'sequence'
      } else if (slug) {
        category = 'slug'
      }
      return u.compact({
        name,
        key,
        category,
        titleProperty,
        array: (property.type === 'array'),
        type,
        relationship,
        unique: u.getIn(property, 'x-meta.unique'),
        required,
        cascade,
        validation: {
          minLength: property.minLength,
          maxLength: (defaults.maxLength === property.maxLength ? undefined : property.maxLength),
          pattern: property.pattern,
          enum: (property.enum && property.enum.join(','))
        },
        schema: u.prettyJson(u.omit(property, ['x-meta']))
      })
    }
  },
  components: {
    codemirror
  }
}
</script>

<style media="screen">
  .CodeMirror {
         border: 1px solid rgb(223, 229, 233);
         font-size: 1.2em;
  }
  .field-heading a:hover {
    text-decoration: none;
  }
  .invalid-schema {
    width: 100%;
    margin-top: .25rem;
    font-size: 80%;
    color: #dc3545;
  }
</style>
