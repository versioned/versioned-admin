<template lang="html">
  <form @submit.prevent="formSubmit" role="form">
    <ul v-if="allErrors.length > 0" class="errors alert alert-danger">
      <li v-for="error in allErrors">{{error.field}} - {{error.message}}</li>
    </ul>
    <div class="form-group">
      <div class="form-group buttons">
        <input type="submit" class="btn btn-primary" value="Save" />
      </div>

      <div v-if="isPublished" class="form-group versions">
        <publish-status :doc="doc"></publish-status>

        <div>
          Version: {{doc.version}}
        </div>

        <div v-if="doc.publishedVersion && doc.publishedVersion !== doc.version">
          Published version:
          {{doc.publishedVersion}}
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
            <pre v-show="showJson">{{version}}</pre>

            <a href="#" v-if="(index + 1) < versions.length" @click.prevent="toggle('showChanges', index)">Changes</a>
            <changes v-if="(index + 1) < versions.length && show('showChanges', index)" :from="versions[index + 1]" :to="version"></changes>
          </li>
        </ul>
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
        <button v-if="isPublished" class="btn btn-secondary" @click.prevent="saveAndPublish()">Save and Publish</button>
        <button v-if="isPublished && doc.publishedVersion" class="btn btn-secondary" @click.prevent="unpublish()">Unpublish</button>
        <a v-if="doc.id" href="#" @click.prevent="remove()">Delete</a>
      </div>
    </div>
  </form>
</template>

<script>
import u from '@/util'
import Swagger from '@/services/swagger'
import DataFormField from '@/components/data/DataFormField'
import PublishStatus from '@/components/data/PublishStatus'
import Changes from '@/components/data/Changes'

export default {
  props: ['model', 'doc', 'schema', 'isPublished', 'versions'],
  data: function () {
    return {
      showVersions: false,
      allErrors: [],
      showJson: false,
      showChanges: {}
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
    formSubmit () {
      this.allErrors = []
      this.$emit('formSubmit', this.doc)
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
  .versions ul {
    margin-top: 10px;
  }

  .versions li pre {
    margin-top: 5px;
  }
</style>
