<template>
  <fragment>
    <el-table :data="tableData" style="width: 100%;">
      <el-table-column prop="date" label="Date" width="180"></el-table-column>
      <el-table-column prop="name" label="Name" width="180"></el-table-column>
      <el-table-column prop="address" label="Address"></el-table-column>
      <el-table-column label="Thao tác" align="center" width="150">
        <template slot-scope="{ row }">
          <el-tooltip class="employee-active__icon" content="Sửa" placement="top">
            <i class="el-icon-edit" @click="handleUpdate(row)"></i>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
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
