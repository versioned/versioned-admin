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
import User from '@/services/user'
import Model from '@/services/model'
import ModelsForm from '@/components/models/ModelsForm'
import router from '@/router'
import Alert from '@/services/alert'

export default {
  data () {
    const spaceId = u.getIn(User.get(), 'space.id')
    return {
      model: {
        spaceId,
        model: {
          schema: {
            type: 'object',
            properties: {
              name: {type: 'string'}
            },
            additionalProperties: false,
            required: ['name']
          }
        }
      }
    }
  },
  methods: {
    save: async function (model) {
      try {
        const accountId = u.getIn(User.get(), 'account.id')
        const createdModel = await Model(accountId).create(model)
        router.push(`/models/${createdModel.id}/edit`)
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
