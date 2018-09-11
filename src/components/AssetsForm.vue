<template>
  <div>
    <form class="assets-form" @submit.prevent="save">
      <div class="form-group buttons">
        <input type="submit" class="btn btn-primary" value="Save" />
      </div>

      <div class="form-group">
        <a v-if="thumbnailUrl(doc)" :href="doc.url" target="_blank">
          <img class="image-thumbnail-large" :src="thumbnailUrl(doc)">
        </a>
        <ul v-show="doc.url">
          <li>
            original filename:
            <a :href="doc.url" target="_blank">{{doc.originalFilename}}</a>
          </li>
          <li>file extension: {{doc.fileExtension}}</li>
          <li>file type: {{doc.fileType}}</li>
          <li v-for="(value, key) in metaData()" v-bind:key="key">
            {{key}}: {{value}}
          </li>
        </ul>
      </div>

      <div class="form-group">
        <button class="btn btn-secondary upload" @click.prevent="upload">Upload File</button>
      </div>

      <div class="form-group">
        <label for="title">Title</label>
        <input type="text" v-model="doc.title" class="form-control" id="title" v-bind:class="{ 'is-invalid': errors.title}" v-autofocus/>
        <div class="invalid-feedback">
          {{errors.title}}
        </div>
      </div>

      <div class="form-group">
        <label for="description">Description</label>
        <textarea type="text" v-model="doc.description" class="form-control" rows="5" v-bind:class="{ 'is-invalid': errors.description}"/>
        <div class="invalid-feedback">
          {{errors.description}}
        </div>
      </div>

      <div class="form-group buttons">
        <input type="submit" class="btn btn-primary" value="Save" />
      </div>
    </form>
  </div>
</template>

<script>
import u from '@/util'
import {extract} from '@/client_util'
import Alert from '@/services/alert'
import FormUtil from '@/form_util'
import Asset from '@/services/asset'
import session from '@/services/session'

export default {
  props: ['doc'],
  data: function () {
    return {
      errors: {}
    }
  },
  methods: {
    upload () {
      const options = Asset.cloudinaryOptions(session.get('space'))
      cloudinary.openUploadWidget(options, (error, result) => {
        if (error) {
          Alert.set('errors', `Upload failed: ${error.message}`)
        } else {
          const upload = u.getIn(result, '0')
          console.log('upload', upload)
          const url = u.getIn(upload, 'secure_url')
          const file = {
            originalFilename: u.getIn(upload, 'original_filename'),
            url,
            fileType: u.getIn(upload, 'resource_type'),
            fileExtension: this.fileExtension(url),
            meta: upload
          }
          this.doc = u.merge(this.doc, file)
        }
      })
    },
    save () {
      Alert.clear()
      this.errors = {}
      this.$emit('save', this.doc)
    },
    handleError (error) {
      this.errors = FormUtil.handleError(error)
    },
    fileExtension (url) {
      return extract(url, /\.([^.]+)$/, {group: 1})
    },
    metaData () {
      return u.compact(u.pick(this.doc.meta, ['height', 'width', 'format', 'bytes']))
    }
  }
}
</script>

<style lang="css">
  .image-thumbnail-large {
    margin-bottom: 10px;
  }
</style>
