<template>
  <h1>bb</h1>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
@Component<CheckinStatus>({
  name: 'CheckinStatus',
})
export default class CheckinStatus extends Vue {
  @Prop(Array) readonly dataCheckin;
  @Prop(Boolean) readonly loadingAdmin!: boolean;
}
</script>
<style lang="scss">
@import '@/assets/scss/main.scss';
</style>
