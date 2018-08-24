<template lang="html">
  <section>
    <div class="page-title">
        <h1>Edit {{model.name}} Model</h1>
    </div>

    <models-form ref="modelsForm" :model="model" @submit="save($event)" @remove="remove($event)"/>
  </section>
</template>

<script>
import u from '@/util'
import router from '@/router'
import session from '@/services/session'
import Model from '@/services/model'
import Alert from '@/services/alert'
import ModelsForm from '@/components/models/ModelsForm'

export default {
  data () {
    return {
      model: {fields: [], model: {}}
    }
  },
  created () {
    this.getModel()
  },
  watch: {
    '$route': 'getModel'
  },
  methods: {
    getModel: async function () {
      const spaceId = u.getIn(session.get(), 'space.id')
      const model = await Model(spaceId).get(this.$route.params.id)
      const fields = ModelsForm.methods.getFields(model)
      this.model = u.merge(model, {fields})
    },
    save: async function (model) {
      Alert.clear()
      try {
        const spaceId = u.getIn(session.get(), 'space.id')
        const updatedModel = await Model(spaceId).update(model)
        if (updatedModel) {
          Alert.setBoth('Saved')
        } else {
          Alert.setBoth('warning', 'No Changes')
        }
      } catch (error) {
        this.$refs.modelsForm.handleError(error)
      }
    },
    remove: async function (model) {
      if (confirm('Are you sure?')) {
        const spaceId = u.getIn(session.get(), 'space.id')
        await Model(spaceId).remove(model.id)
        Alert.setNext('Deleted')
        router.push(`/models`)
      }
    }
  },
  components: {
    ModelsForm
  }
}
</script>

<style lang="css">
</style>
