<template>
  <div class="container">
    <div>
      <logo />
      <h1 class="title">
        okrs-enterprise-frontend
        {{ $config.baseURL }}
      </h1>
      <div class="links">
        <el-button type="primary">Hello, click me mother fucker</el-button>
        <a href="https://nuxtjs.org/" target="_blank" rel="noopener noreferrer" class="button--green">Documentation</a>
        <a href="https://github.com/nuxt/nuxt.js" target="_blank" rel="noopener noreferrer" class="button--grey">GitHub</a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Logo from '~/components/Logo.vue';

export default Vue.extend({
  components: {
    Logo,
  },
});
</script>

<style>
/* .container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
} */
</style>
