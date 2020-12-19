<template>
  <div class="-w-100vw -h-100vh -overflow-hidden -align-items-center">
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
