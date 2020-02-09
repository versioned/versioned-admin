<template lang="html">
  <form @submit.prevent="formSubmit" role="form" class="data-form">
    <div class="form-group">
      <div class="form-group buttons">
        <input type="submit" class="btn btn-primary" value="Save" />
        <button v-if="isPublished" class="btn btn-secondary" @click.prevent="saveAndPublish()">Save and Publish</button>
        <button v-if="isPublished && doc.publishedVersion" class="btn btn-secondary" @click.prevent="unpublish()">Unpublish</button>
        <a v-if="doc.id && previewUrl" :href="formattedPreviewUrl()" target="preview" class="btn btn-secondary preview">Preview</a>
      </div>

      <div class="form-group">
        <a v-show="hasChanges()" class="text-warning" href="#" @click.prevent="showUnsavedChanges = !showUnsavedChanges">Unsaved Changes</a>
      </div>
      <changes v-if="showUnsavedChanges" :from="docOrig" :to="doc"></changes>

      <div v-if="isPublished" class="form-group versions">
        <publish-status :doc="doc"></publish-status>

        <div>
          Version: <span class="version">{{doc.version}}</span>
        </div>

        <div v-if="doc.publishedVersion">
          Published version:
          <span class="published-version">{{doc.publishedVersion}}</span>
        </div>

        <div v-if="doc.firstPublishedAt">
          First published
          {{doc.firstPublishedAt | timeAgo}}
          ({{doc.firstPublishedAt | date('YYYY-MM-DD hh:mm')}})
        </div>
        <div v-if="doc.lastPublishedAt && doc.lastPublishedAt !== doc.firstPublishedAt">
          Last published
          {{doc.lastPublishedAt | timeAgo}}
          ({{doc.lastPublishedAt | date('YYYY-MM-DD hh:mm')}})
        </div>

        <div>
          <a href="#" @click.prevent="showVersions = !showVersions">Version History</a>
          <a href="#" v-show="showVersions" @click.prevent="showJson = !showJson">[JSON Data]</a>
        </div>

        <ul v-show="showVersions" class="list-group">
          <li v-for="(version, index) in versions" class="list-group-item">
            <strong>{{version.version}}.</strong>
            By {{version.createdBy.email}}
            at
            {{(version.updatedAt || version.createdAt) | date('YYYY-MM-DD hh:mm') }}
            ({{(version.updatedAt || version.createdAt) | timeAgo}})
            <a href="#" v-if="(index + 1) < versions.length" @click.prevent="toggle('showChanges', index)">Changes</a>
            <changes v-if="(index + 1) < versions.length && show('showChanges', index)" :from="versions[index + 1]" :to="version"></changes>

            <pre v-show="showJson">{{version}}</pre>
          </li>
        </ul>
      </div>

      <div class="form-group" v-for="attribute in readAttributes">
        <label name="title">{{attribute.label}}</label>
        <div class="attribute-value">
          {{attribute.value}}
        </div>
      </div>

      <div class="row">
        <div class="card card-body bg-light">
          <data-form-field v-for="attribute in writeAttributes" :doc="doc" :attribute="attribute" :model="model" :key="attribute.key" :isChanged="fieldIsChanged(attribute.key)" @fieldChange="fieldChange($event)" :error="errors[attribute.key]"></data-form-field>
        </div>
      </div>

      <div class="form-group">
        <a v-show="hasChanges()" class="text-warning" href="#" @click.prevent="showUnsavedChanges = !showUnsavedChanges">Unsaved Changes</a>
      </div>
      <changes v-if="showUnsavedChanges" :from="docOrig" :to="doc"></changes>

      <div class="form-group buttons">
        <input type="submit" class="btn btn-primary save" value="Save" />
        <button v-if="isPublished" class="btn btn-secondary save-and-publish" @click.prevent="saveAndPublish()">Save and Publish</button>
        <button v-if="isPublished && doc.publishedVersion" class="btn btn-secondary unpublish" @click.prevent="unpublish()">Unpublish</button>
        <a v-if="doc.id && previewUrl" :href="formattedPreviewUrl()" target="preview" class="btn btn-secondary preview">Preview</a>
        <a v-if="doc.id && !doc.publishedVersion" href="#" class="delete" @click.prevent="remove()">Delete</a>
      </div>
    </div>
  </form>
</template>

<script>
// import Vue from 'vue'
import u from '@/util'
import {urlWithQuery} from '@/services/api'
import Alert from '@/services/alert'
import Swagger from '@/services/swagger'
import DataFormField from '@/components/data/DataFormField'
import PublishStatus from '@/components/data/PublishStatus'
import Changes from '@/components/data/Changes'
import DataUtil from '@/data_util'
import FormUtil from '@/form_util'

export default {
  props: ['model', 'doc', 'docOrig', 'schema', 'isPublished', 'versions', 'previewUrl'],
  data: function () {
    return {
      errors: {},
      showVersions: false,
      showJson: false,
      showChanges: {},
      showUnsavedChanges: false
    }
  },
  computed: {
    readAttributes: function () {
      if (u.getIn(this.doc, 'id') && this.schema) {
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
    },
    changes () {
      return this.docOrig && DataUtil.changes(this.docOrig, this.doc)
    }
  },
  components: {
    DataFormField,
    PublishStatus,
    Changes
  },
  methods: {
    saveAndPublish () {
      this.doc.publishedVersion = this.doc.version + 1
      this.formSubmit()
    },
    unpublish () {
      this.doc.publishedVersion = null
      this.formSubmit()
    },
    fieldChange (field) {
      this.$emit('fieldChange', field)
    },
    formSubmit () {
      Alert.clear()
      this.errors = {}
      this.$emit('formSubmit', this.coerceDoc(this.doc))
    },
    formattedPreviewUrl () {
      if (!this.doc.id || !this.previewUrl) return
      let url = this.previewUrl.replace(/{[^}]+}/g, (m) => {
        const key = m.substring(1, m.length - 1)
        return encodeURIComponent(this.doc[key])
      })
      if (this.doc.versionToken) {
        url = urlWithQuery(url, {versionToken: this.doc.versionToken})
      }
      return url
    },
    remove () {
      this.$emit('remove', this.doc)
    },
    toggle (objName, property) {
      this[objName] = u.evolveAll((this[objName] || {}), {[property]: (v) => !v})
    },
    show (objName, property) {
      return this[objName] && this[objName][property]
    },
    coerceDoc (doc) {
      return Object.entries(doc).reduce((acc, [key, value]) => {
        const propertySchema = u.getIn(this.schema, `properties.${key}`)
        acc[key] = this.coerceValue(propertySchema, value)
        return acc
      }, {})
    },
    coerceValue (schema, value) {
      const type = u.getIn(schema, 'type')
      if (type === 'integer') {
        return u.parseIfInt(value)
      } else if (type === 'number') {
        const coerced = parseFloat(value)
        return isNaN(coerced) ? value : coerced
      } else {
        return value
      }
    },
    handleError (error) {
      this.errors = FormUtil.handleError(error)
    },
    fieldIsChanged (key) {
      return u.keys(this.changes).map(key => key.split('.')[0]).includes(key)
    },
    hasChanges () {
      return u.notEmpty(u.compact(this.changes))
    }
  }
}
</script>

<style lang="css">
  .versions ul {
    margin-top: 10px;
  }

  .versions li pre {
    margin-top: 5px;
  }
</style>
