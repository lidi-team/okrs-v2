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
import { Component, Vue, Prop } from 'vue-property-decorator';
@Component<EmployeeActive>({
  name: 'EmployeeActive',
})
export default class EmployeeActive extends Vue {
  @Prop(Array) readonly tableData!: Array<object>;
}
</script>
