<template>
  <div>
    <h1>New Asset</h1>

    <assets-form ref="mainForm" :doc="doc" @save="save($event)"></assets-form>
  </div>
</template>

<script>
import u from '@/util'
import session from '@/services/session'
import router from '@/router'
import Asset from '@/services/asset'
import Alert from '@/services/alert'
import AssetsForm from '@/components/AssetsForm'

export default {
  data () {
    return {
      doc: {}
    }
  },
  created () {
    this.getData()
  },
  watch: {
    '$route': 'getData'
  },
  methods: {
    async getData () {
    },
    async save (doc) {
      this.errors = {}
      Alert.clear()
      try {
        const spaceId = u.getIn(session.get(), 'space.id')
        this.doc = await Asset(spaceId).create(doc)
        Alert.setNext('success', 'Saved')
        router.push(`/assets/${this.doc.id}/edit`)
      } catch (error) {
        this.$refs.mainForm.handleError(error)
      }
    }
  },
  components: {
    AssetsForm
  }
}
</script>

<style lang="css">
</style>
