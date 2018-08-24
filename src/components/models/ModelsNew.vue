<template lang="html">
  <section>
    <div class="page-title">
        <h1>New Model</h1>
    </div>

    <models-form ref="modelsForm" :model="model" @submit="save($event)"/>
  </section>
</template>

<script>
import u from '@/util'
import session from '@/services/session'
import Model from '@/services/model'
import ModelsForm from '@/components/models/ModelsForm'
import router from '@/router'
import Alert from '@/services/alert'

export default {
  data () {
    const spaceId = u.getIn(session.get(), 'space.id')
    return {
      model: {
        spaceId,
        fields: [ModelsForm.methods.makeField({name: 'Title', unique: true, required: true, titleProperty: true})],
        model: {},
        features: ['published', 'search']
      }
    }
  },
  methods: {
    save: async function (model) {
      try {
        const spaceId = u.getIn(session.get(), 'space.id')
        const createdModel = await Model(spaceId).create(model)
        router.push(`/models/${createdModel.id}/edit`)
        Alert.setBoth('Saved')
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
