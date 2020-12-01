<template>
  <div>
    <span>oke</span>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component<ControlProject>({
  name: 'ControlProject',
  // middleware: 'employeesPage',
})
export default class ControlProject extends Vue {}
</script>
<style lang="scss" scoped></style>
