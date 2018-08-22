<template>
  <models-list v-if="hasCurrentSpace()"></models-list>
</template>

<script>
import ModelsList from '@/components/models/ModelsList'

export default {
  components: {
    ModelsList
  }
}
</script>
