<template>
  <div>
    <base-navbar />
    <nuxt class="page" />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
@Component<Layout>({
  name: 'Layout',
})
export default class Layout extends Vue {}
</script>

<style lang="scss">
@import '@/assets/scss/main.scss';
.page {
  background: $neutral-primary-0;
  min-height: calc(100vh - 60px);
}
</style>
