<template>
  <div>
    <h1>Edit Asset</h1>

    <assets-form ref="mainForm" :doc="doc" @save="save($event)"></assets-form>
  </div>
</template>

<script>
import u from '@/util'
import session from '@/services/session'
import Asset from '@/services/asset'
import Alert from '@/services/alert'
import AssetsForm from '@/components/AssetsForm'

export default {
  data: () => {
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
      const spaceId = u.getIn(session.get(), 'space.id')
      const id = this.$route.params.id
      this.doc = await Asset(spaceId).get(id)
    },
    async save (doc) {
      this.errors = {}
      Alert.clear()
      try {
        const spaceId = u.getIn(session.get(), 'space.id')
        await Asset(spaceId).update(doc)
        Alert.setBoth('success', 'Saved')
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
