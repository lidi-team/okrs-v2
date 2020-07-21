<template>
  <fragment>
    <el-table :data="tableData" empty-text="Không có dữ liệu" style="width: 100%;">
      <el-table-column prop="name" label="Tên đầy đủ" width="250"></el-table-column>
      <el-table-column prop="email" label="Email" width="250"></el-table-column>
      <el-table-column prop="department" label="Phòng ban" width="180"></el-table-column>
      <el-table-column prop="possiton" label="Vị trí công việc" width="180"></el-table-column>
      <el-table-column prop="role" label="Vai trò" width="180"></el-table-column>
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
