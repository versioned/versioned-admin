<template lang="html">
  <form @submit.prevent="submit" class="models-form">
    <ul v-if="allErrors.length > 0" class="errors alert alert-danger">
      <li v-for="error in allErrors">{{error.field}} {{error.message}}</li>
    </ul>

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
      <input type="text" v-model="model.coll" class="form-control" id="coll" :maxlength="KEY_LENGTH" @change="makeDbFriendly(model, 'coll')" v-bind:class="{ 'is-invalid': errors.coll}" required/>
      <div class="invalid-feedback">
        {{errors.coll}}
      </div>
      <!-- <label for="schema">Schema</label>
      <json-field id="schema" :obj="model.model.schema" @fieldInput="updateSchema($event)"></json-field>
      <div class="invalid-feedback">
        {{errors.schema}}
      </div> -->
    </div>

    <div class="form-group">
      <div class="form-check">
        <input v-model="features.published" class="form-check-input" type="checkbox">
        <label class="form-check-label">
          Published and versioned
        </label>
      </div>
      <!-- <div class="form-check">
        <input v-model="features.search" class="form-check-input" type="checkbox">
        <label class="form-check-label">
          Searchable
        </label>
      </div> -->
    </div>

    <div :class="fieldClass(field, index)" v-for="(field, index) in model.fields">
      <h2 :class="{'field-heading': true, 'required': field.required}">
        <a href="#" @click.prevent="toggleCollapsed(field.key)">
          <span v-if="!field.name">Field {{index + 1}}</span>
          <span v-else-if="field.category !== 'data'">
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
        <a href="#" class="small" v-show="index> 0" @click.prevent="removeField(index)">[remove]</a>
      </h2>

      <div v-show="!collapsed[field.key]" class="fields">
        <div class="form-group required">
          <label>Name</label>
          <input type="text" v-model="field.name" :maxlength="NAME_LENGTH" @input="fieldNameChange(field)" ref="fieldName" class="form-control field-name" required/>
        </div>

        <div class="form-group required">
          <label>Key</label>
          <input type="text" v-model="field.key" :maxlength="KEY_LENGTH" @change="makeDbFriendly(field, 'key')" class="form-control" required/>
        </div>

        <div class="form-group">
          <div class="form-check">
            <input v-model="field.category" class="form-check-input" type="radio" value="data">
            <label class="form-check-label">
              Data field
            </label>
          </div>

          <div class="form-check">
            <input v-model="field.category" class="form-check-input one-way-relationship" type="radio" value="oneWayRelationship">
            <label class="form-check-label">
              One-way Relationship
            </label>
          </div>

          <div class="form-check">
            <input v-model="field.category" class="form-check-input two-way-relationship" type="radio" value="twoWayRelationship">
            <label class="form-check-label">
              Two-way Relationship
            </label>
          </div>
        </div>

        <div v-if="field.category === 'data'" class="form-group">
          <label class="form-check-label">
            Data type
          </label>
          <select v-if="field.category === 'data'" v-model="field.type" class="data-type">
            <option v-for="type in FIELD_TYPES" v-bind:value="type.key">
              {{type.name}}
            </option>
          </select>
        </div>

        <div v-if="field.category !== 'data'" class="form-group required">
          <label>Target model (key)</label>
          <input type="text" v-model="field.relationship.toType" :maxlength="COLL_LENGTH" @change="makeDbFriendly(field.relationship, 'toType')" class="form-control to-type" required/>
        </div>

        <div v-if="field.category === 'twoWayRelationship'" class="form-group required">
          <label>Target field (key)</label>
          <input type="text" v-model="field.relationship.toField" :maxlength="FIELD_LENGTH" @change="makeDbFriendly(field.relationship, 'toField')" class="form-control to-field" required/>
        </div>

        <div v-if="field.category === 'oneWayRelationship'" class="form-group">
          <div class="form-check">
            <input class="form-check-input one-to-many" type="radio" v-model="field.relationship.type" value="one-to-many">
            <label class="form-check-label">
              Multiple ID references ("has many" relationship, i.e. an array of string IDs)
            </label>
          </div>
          <div class="form-check">
            <input class="form-check-input many-to-one" type="radio" v-model="field.relationship.type" value="many-to-one">
            <label class="form-check-label">
              Single ID reference ("belongs to" relationship, i.e. a single string ID)
            </label>
          </div>
          <div class="form-check">
            <input class="form-check-input one-to-one" type="radio" v-model="field.relationship.type" value="one-to-one">
            <label class="form-check-label">
              Single Unique ID reference ("belongs to" relationship, i.e. a single string ID)
            </label>
          </div>
        </div>

        <div v-if="field.category === 'twoWayRelationship'" class="form-group">
          <div class="form-check">
            <input class="form-check-input one-to-many" type="radio" v-model="field.relationship.type" value="one-to-many">
            <label class="form-check-label">
              One to Many - multiple ID references (array of string IDs in this model, single string ID in target model)
            </label>
          </div>
          <div class="form-check">
            <input class="form-check-input many-to-many" type="radio" v-model="field.relationship.type" value="many-to-many">
            <label class="form-check-label">
              Many to Many - multiple ID references (array of string IDs in this model, array of string IDs in target model)
            </label>
          </div>
          <div class="form-check">
            <input class="form-check-input many-to-one" type="radio" v-model="field.relationship.type" value="many-to-one">
            <label class="form-check-label">
              Many to One - single ID reference (single string ID in this model, array of string IDs in target model)
            </label>
          </div>
          <div class="form-check">
            <input class="form-check-input one-to-one" type="radio" v-model="field.relationship.type" value="one-to-one">
            <label class="form-check-label">
              One to One - single unique ID reference (single unique string ID in this model, single unique string ID in target model)
            </label>
          </div>
        </div>

        <div v-if="field.category !== 'data'" class="form-group">
          <label>Relationship name (if field key is "userId" then a good relationship name might be "user" - optional)</label>
          <input type="text" v-model="field.relationship.name" :maxlength="KEY_LENGTH" @change="makeDbFriendly(field.relationship, 'name')" class="form-control"/>
        </div>

        <div class="form-group">
          <div v-if="field.category === 'data' && field.type !== 'text'" class="form-check">
            <input v-model="field.array" class="form-check-input" type="checkbox">
            <label class="form-check-label">
              array (multiple {{field.type}} values)
            </label>
          </div>
          <div class="form-check">
            <input v-model="field.required" class="form-check-input" type="checkbox">
            <label class="form-check-label">
              required
            </label>
          </div>

          <div v-if="enabledField('unique', field)" class="form-check">
            <input v-model="field.unique" class="form-check-input" type="checkbox">
            <label class="form-check-label">
              unique
            </label>
          </div>

          <div v-if="enabledField('validation', field)" class="form-check">
            <input v-model="field.hasValidation" class="form-check-input" type="checkbox" value="true">
            <label class="form-check-label">
              validation
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
    <a v-if="model.id" href="#" @click.prevent="remove()">Delete</a>
  </form>
</template>

<script>
import Vue from 'vue'
import u from '@/util'
import {capitalize} from '@/client_util'
import {propertiesOrder} from '@/models_util'
import JsonField from '@/components/form/JsonField'

const FIELD_TYPES = [
  {
    name: 'String (256 characters)',
    key: 'string'
  },
  {
    name: 'Text (50k characters)',
    key: 'text'
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
  }
]

const NAME_LENGTH = 50
const FIELD_LENGTH = 30
const KEY_LENGTH = 20
const COLL_LENGTH = 40
const dbFriendly = name => u.dbFriendly(name, KEY_LENGTH)
const FIELD_TYPES_PROPERTIES = {
  string: {type: 'string', maxLength: 256},
  text: {type: 'string', maxLength: 50000},
  integer: {type: 'integer'},
  number: {type: 'number'},
  boolean: {type: 'boolean'},
  date: {type: 'string', format: 'date-time'}
}

export default {
  props: ['model'],
  data: function () {
    return {
      NAME_LENGTH,
      FIELD_LENGTH,
      KEY_LENGTH,
      COLL_LENGTH,
      FIELD_TYPES,
      errors: {},
      allErrors: [],
      features: this.makeFeatures(this.model),
      collapsed: this.getCollapsed(this.model.fields)
    }
  },
  watch: {
    model (model) {
      this.collapsed = this.getCollapsed(model.fields)
      this.features = this.makeFeatures(model)
    }
  },
  methods: {
    makeFeatures (model) {
      return u.makeObj(model.features || [], () => true)
    },
    getCollapsed (fields) {
      return u.makeObj(fields.map(u.property('key')), () => true)
    },
    setProperty (obj, property, value) {
      obj[property] = value
    },
    makeField (field = {}) {
      const defaults = {
        key: dbFriendly(field.name),
        category: 'data',
        type: 'string',
        required: false,
        relationship: {type: 'one-to-many'},
        validation: {},
        errors: {}
      }
      const result = u.merge(defaults, field)
      return u.merge(result, {hasValidation: u.notEmpty(result.validation)})
    },
    nameChange () {
      this.model.coll = dbFriendly(this.model.name)
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
      field.relationship.toType = field.key
      field.relationship.toField = this.model.coll
    },
    makeDbFriendly (obj, prop) {
      obj[prop] = dbFriendly(obj[prop])
    },
    updateSchema (value) {
      this.model.model.schema = value
    },
    submit () {
      if (this.model.fields) {
        this.model.model = {schema: this.getSchema(this.model.fields)}
        this.model.propertiesOrder = this.model.fields.map(u.property('key'))
      }
      this.model.features = u.keys(u.filter(this.features, (v) => true))
      this.$emit('submit', this.model)
    },
    remove () {
      this.$emit('remove', this.model)
    },
    enabledField (fieldName, field) {
      if (fieldName === 'unique') {
        return field.category === 'data' && !field.array && ['string', 'integer', 'number'].includes(field.type)
      } else if (fieldName === 'validation') {
        return field.category === 'data' && ['string', 'text', 'integer', 'number'].includes(field.type)
      } else if (fieldName.endsWith('minLength') || fieldName.endsWith('maxLength')) {
        return field.category === 'data' && (field.type === 'string' || field.type === 'text')
      } else if (fieldName === 'validation.pattern') {
        return field.category === 'data' && field.type === 'string'
      } else if (fieldName === 'validation.enum') {
        return field.category === 'data' && ['string', 'integer', 'number'].includes(field.type)
      }
    },
    validatePattern (field) {
      try {
        // NOTE: does this make sense? Can we even validate the regex?
        if (field.pattern) new RegExp(field.pattern).test('foobar')
      } catch (err) {
        field.errors.pattern = 'regular expression is invalid'
      }
    },
    toggleCollapsed (key) {
      this.collapsed = u.merge(this.collapsed, {[key]: !this.collapsed[key]})
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
    },
    getSchema (fields) {
      const properties = fields.reduce((acc, field) => {
        acc[field.key] = this.fieldToProperty(field)
        return acc
      }, {})
      const required = fields.filter(u.property('required')).map(u.property('key'))
      return {
        type: 'object',
        properties,
        additionalProperties: false,
        required
      }
    },
    fieldClass (field, index) {
      return `form-group field field-${index + 1}`
    },
    getFields (model) {
      const schema = u.getIn(model, 'model.schema', {})
      const keys = propertiesOrder(schema)
      if (u.empty(keys)) return []
      const required = schema.required || []
      return keys.map((key) => {
        return this.makeField(this.propertyToField(key, schema.properties[key], required.includes(key)))
      })
    },
    fieldToProperty (field) {
      let isArray = field.array
      const fieldType = field.type || 'string'
      let property = FIELD_TYPES_PROPERTIES[fieldType] || {}
      if (field.category === 'data') {
        if (field.hasValidation) {
          property = u.merge(property, u.evolve(field.validation, {
            enum: (v) => v.split(','),
            minLength: u.parseIfInt,
            maxLength: u.parseIfInt,
            pattern: (v) => v
          }))
        }
      } else {
        // Relationship
        property.type = 'string'
        isArray = ['many-to-many', 'one-to-many'].includes(field.relationship.type)
        field.relationship.oneWay = (field.category === 'oneWayRelationship')
      }
      const xMeta = u.compact({
        unique: field.unique,
        field: {
          name: field.name,
          type: fieldType
        },
        relationship: (field.category === 'data' ? undefined : field.relationship)
      })
      if (isArray) {
        property = {type: 'array', items: property}
      } else if (property.enum) {
        delete property.type
      }
      return u.compact(u.deepMerge(property, {
        'x-meta': xMeta
      }))
    },
    propertyToField (key, property, required) {
      const type = u.getIn(property, 'x-meta.field.type', property.type)
      const name = u.getIn(property, 'x-meta.field.name', capitalize(key))
      const defaults = FIELD_TYPES_PROPERTIES[type] || {}
      const relationship = u.getIn(property, 'x-meta.relationship')
      let category = 'data'
      if (relationship) {
        category = relationship.oneWay ? 'oneWayRelationship' : 'twoWayRelationship'
      }
      return u.compact({
        name,
        key,
        category,
        array: (property.type === 'array'),
        type,
        relationship,
        unique: u.getIn(property, 'x-meta.unique'),
        required,
        validation: {
          minLength: property.minLength,
          maxLength: (defaults.maxLength === property.maxLength ? undefined : property.maxLength),
          pattern: property.pattern,
          enum: (property.enum && property.enum.join(','))
        }
      })
    }
  },
  components: {
    JsonField
  }
}
</script>

<style media="screen">
  .field-heading a:hover {
    text-decoration: none;
  }
</style>
