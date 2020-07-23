<template>
  <div>
    <base-navbar />
    <nuxt />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
@Component<EmptyLayout>({
  name: 'EmptyLayout',
})
export default class EmptyLayout extends Vue {}
</script>
