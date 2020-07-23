<template>
  <div>
    <base-navbar />
    <nuxt />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
@Component<Layout>({
  name: 'Layout',
})
export default class Layout extends Vue {}
</script>
