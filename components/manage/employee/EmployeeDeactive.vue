<template>
  <fragment>
    <h1>pending</h1>
  </fragment>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator';
@Component<EmployeeDeactive>({
  name: 'EmployeeDeactive',
})
export default class EmployeeDeactive extends Vue {
  @Prop(Array) readonly tableData!: Array<object>;
}
</script>
