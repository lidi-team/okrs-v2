<template>
  <div class="container">
    <div>
      <h1 class="title">
        okrs-enterprise-frontend
        {{ $config.baseURL }}
      </h1>
      <div class="links">
        <el-button type="primary">Hello, click me now!</el-button>
        <a href="https://nuxtjs.org/" target="_blank" rel="noopener noreferrer" class="button--green">Documentation</a>
        <a href="https://github.com/nuxt/nuxt.js" target="_blank" rel="noopener noreferrer" class="button--grey">GitHub</a>
      </div>
      <base-button></base-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import BaseButton from '@/components/shared/base/BaseButton.vue';
@Component<Boss>({
  name: 'Base-component',
  components: {
    BaseButton,
  },
})
export default class Boss extends Vue {}
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
