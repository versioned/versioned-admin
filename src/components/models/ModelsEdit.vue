<template lang="html">
  <section class="content-item-page">
    <div class="page-title">
        <h1>Edit Model</h1>
    </div>

    <models-form ref="modelsForm" :model="model" @submit="save($event)"/>
  </section>
</template>

<script>
import u from '@/util'
import User from '@/services/user'
import Model from '@/services/model'
import Alert from '@/services/alert'
import ModelsForm from '@/components/models/ModelsForm'

export default {
  data () {
    return {
      model: {model: {}}
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
      this.model = await Model(accountId).get(this.$route.params.id)
    },
    save: async function (model) {
      try {
        const accountId = u.getIn(User.get(), 'account.id')
        await Model(accountId).update(model)
        Alert.set('Saved')
      } catch (error) {
        this.$refs.modelsForm.handleError(error)
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
