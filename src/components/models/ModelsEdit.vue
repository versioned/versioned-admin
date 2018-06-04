<template lang="html">
  <section>
    <div class="page-title">
        <h1>Edit Model</h1>
    </div>

    <models-form ref="modelsForm" :model="model" @submit="save($event)" @remove="remove($event)"/>
  </section>
</template>

<script>
import u from '@/util'
import router from '@/router'
import User from '@/services/user'
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
      const accountId = u.getIn(User.get(), 'account.id')
      const model = await Model(accountId).get(this.$route.params.id)
      const fields = ModelsForm.methods.getFields(model)
      this.model = u.merge(model, {fields})
    },
    save: async function (model) {
      try {
        const accountId = u.getIn(User.get(), 'account.id')
        await Model(accountId).update(model)
        Alert.set('Saved')
      } catch (error) {
        this.$refs.modelsForm.handleError(error)
      }
    },
    remove: async function (model) {
      const accountId = u.getIn(User.get(), 'account.id')
      await Model(accountId).remove(model.id)
      Alert.setNext('Deleted')
      router.push(`/models`)
    }
  },
  components: {
    ModelsForm
  }
}
</script>

<style lang="css">
</style>
