<template>
  <section>
  </section>
</template>

<script>
import router from '@/router'
import Alert from '@/services/alert'

export default {
  created () {
    Alert.setNext('warning', 'Page not found')
    router.push('/')
  }
}
</script>

<style lang="css">
</style>
