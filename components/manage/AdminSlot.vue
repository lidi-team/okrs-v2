<template>
  <fragment>
    <slot name="top"></slot>
    <slot name="tab"></slot>
    <slot name="table"></slot>
  </fragment>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
@Component<AdminSlot>({ name: 'AdminSlot' })
export default class AdminSlot extends Vue {}
</script>
<style lang="scss" scoped></style>
