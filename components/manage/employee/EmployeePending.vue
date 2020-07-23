<template>
  <fragment>
    <el-table :data="tableData" empty-text="Không có dữ liệu" style="width: 100%;">
      <el-table-column prop="fullName" label="Tên đầy đủ" width="250"></el-table-column>
      <el-table-column prop="email" label="Email" width="250"></el-table-column>
      <el-table-column label="Phòng ban" width="180">
        <template slot-scope="{ row }">
          <span>{{ row.team.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Vị trí công việc" width="250">
        <template slot-scope="{ row }">
          <span>{{ row.jobPosition.name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="role" label="Vai trò" width="180">
        <template slot-scope="{ row }">
          <span>{{ row.role.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Thao tác" align="center" width="150">
        <template slot-scope="{ row }">
          <el-tooltip class="employee-active__icon" content="Sửa" placement="top">
            <i class="el-icon-edit" @click="handleOpenDialogUpdate(row)"></i>
          </el-tooltip>
          <el-tooltip class="employee-active__icon" content="Xóa" placement="top">
            <i class="el-icon-delete" @click="handleDelete(row)"></i>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </fragment>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
@Component<EmployeePending>({
  name: 'EmployeePending',
})
export default class EmployeePending extends Vue {
  @Prop(Array) readonly tableData!: Array<object>;

  private handleDelete(row: object) {
    this.$confirm('Bạn có chắc chắn muốn xoá user này?', {
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy bỏ',
      type: 'warning',
    }).then(async () => {
      try {
        await this.$notify({
          title: 'Status',
          message: 'Thành công',
          type: 'success',
          duration: 1000,
        });
      } catch (error) {
        this.$notify({
          title: 'Status',
          message: 'Có lỗi xảy ra',
          type: 'error',
          duration: 1000,
        });
      }
    });
  }
}
</script>
