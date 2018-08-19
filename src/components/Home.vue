<template>
  <models-list v-if="currentSpace()"></models-list>
</template>

<script>
import ModelsList from '@/components/models/ModelsList'

export default {
  components: {
    ModelsList
  }
}
</script>
