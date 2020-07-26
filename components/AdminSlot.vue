<template>
  <div>
    <slot name="top"></slot>
    <slot name="tab"></slot>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
@Component<AdminSlot>({ name: 'AdminSlot' })
export default class AdminSlot extends Vue {}
</script>
<style lang="scss" scoped></style>
