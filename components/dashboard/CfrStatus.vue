<template>
  <h1>cc</h1>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
@Component<CfrStatus>({
  name: 'CfrStatus',
})
export default class CfrStatus extends Vue {
  @Prop(Array) readonly dataCfr;
  @Prop(Boolean) readonly loadingAdmin!: boolean;
}
</script>
<style lang="scss">
@import '@/assets/scss/main.scss';
</style>
