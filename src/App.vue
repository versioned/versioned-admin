<template>
  <div id="app">
    <navbar></navbar>
    <alerts position="top"></alerts>
    <main role="main">
      <div class="container">
        <router-view></router-view>
        <div v-if="$store.state.loading" class="loader">
          <img src="/ajax-loader.gif">
        </div>
      </div>
    </main>
    <alerts position="bottom"></alerts>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar'
import Alerts from '@/components/Alerts'

export default {
  name: 'app',
  components: {
    Navbar,
    Alerts
  }
}
</script>

<style>
  main {
    margin-bottom: 20px;
  }
  .btn {
    margin-bottom: 10px;
  }
  .form-group.buttons {
    margin-top: 10px;
  }

  .form-input {
    margin-top: 10px;
    margin-bottom: 20px;
  }

  .form-group.required label:after {
    content:"*";
    color:red;
  }

  .field-heading.required:after {
    content:"*";
    color:red;
  }
  .loader {
    margin-top: 20px;
  }
  .image-thumbnail {
    width: 50px;
    height: 50px;
  }
  .image-thumbnail-large {
    width: 100px;
    height: 100px;
  }
  .form-group > label {
    font-weight: bold;
  }
  .form-check-label {
    margin-right: 10px;
  }
  input.btn {
    margin-right: 5px;
  }
</style>
