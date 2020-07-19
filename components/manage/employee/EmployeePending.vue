<template>
  <fragment>
    <el-table :data="tableData" style="width: 100%;">
      <el-table-column prop="date" label="Date" width="180"></el-table-column>
      <el-table-column prop="name" label="Name" width="180"></el-table-column>
      <el-table-column prop="address" label="Address"></el-table-column>
    </el-table>
  </fragment>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator';
@Component<EmployeePending>({
  name: 'EmployeePending',
})
export default class EmployeePending extends Vue {
  @Prop(Array) readonly tableData!: Array<object>;
}
</script>
