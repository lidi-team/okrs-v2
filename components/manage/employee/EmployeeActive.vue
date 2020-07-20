<template>
  <fragment>
    <el-table v-loading="loading" class="employee-active" :data="tableData" style="width: 100%;">
      <el-table-column prop="date" label="Date" width="180"></el-table-column>
      <el-table-column prop="name" label="Name" width="180"></el-table-column>
      <el-table-column prop="address" label="Address"></el-table-column>
      <el-table-column label="Thao tác" align="center" width="150">
        <template slot-scope="{ row }">
          <el-tooltip class="employee-active__icon" content="Sửa" placement="top">
            <i class="el-icon-edit" @click="handleUpdate(row)"></i>
          </el-tooltip>
          <el-tooltip class="employee-active__icon" content="Xóa" placement="top">
            <i class="el-icon-delete" @click="handleDelete(row)"></i>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- update user dialog -->
    <el-dialog
      class="update-employee"
      :visible.sync="dialogUpdateVisible"
      width="40%"
      placement="bottom-start"
      title="Cập nhật thông tin"
      :before-close="handleCloseDialog"
    >
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form ref="updateEmployeeForm" :model="tempUpdateUser" label-position="left" label-width="20%" style="width: 100%;">
            <div class="update-employee__item item">
              <div class="item__right">
                {{ tempUpdateUser }}
              </div>
            </div>
          </el-form>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button class="el-button--white el-button--modal" @click="handleCloseDialog">
          Hủy
        </el-button>
        <el-button class="el-button--purple el-button--modal" type="primary" @click="handleCloseDialog">
          Xác nhận
        </el-button>
      </span>
    </el-dialog>
    <!-- end update user dialog -->
  </fragment>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator';
@Component<EmployeeActive>({
  name: 'EmployeeActive',
})
export default class EmployeeActive extends Vue {
  @Prop(Array) readonly tableData!: Array<object>;
  @Prop(Boolean) readonly loading!: boolean;
  private dialogUpdateVisible: boolean = false;
  private tempUpdateUser: object = {};

  private handleUpdate(row: object) {
    this.tempUpdateUser = Object.assign(this.tempUpdateUser, row);
    this.dialogUpdateVisible = true;
  }

  private handleCloseDialog() {
    this.dialogUpdateVisible = false;
  }

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

<style lang="scss">
@import '@/assets/scss/main.scss';
.employee-active {
  &__icon {
    cursor: pointer;
    margin: 0 $unit-1;
  }
}
</style>
