<template>
  <fragment>
    <el-table v-loading="loading" empty-text="Không có dữ liệu" class="employee-active" :data="tableData" style="width: 100%;">
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
          <el-form
            ref="updateEmployeeForm"
            :hide-required-asterisk="false"
            :status-icon="true"
            :rules="rules"
            :model="tempUpdateUser"
            label-position="left"
            label-width="20%"
            style="width: 100%;"
          >
            <el-form-item label="Tên đầy đủ:" prop="fullName" class="custom-label">
              <el-input
                v-model="tempUpdateUser.fullName"
                placeholder="Nhập tiêu đề"
                :disabled="true"
                @keyup.enter.native="handleUpdate(tempUpdateUser)"
              />
            </el-form-item>
            <el-form-item label="Email:" class="custom-label" prop="email">
              <el-input v-model="tempUpdateUser.email" placeholder="Nhập email" :disabled="true" @keyup.enter.native="handleUpdate(tempUpdateUser)" />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button class="el-button--white el-button--modal" @click="handleCloseDialog">Hủy</el-button>
        <el-button class="el-button--purple el-button--modal" @click="handleUpdate(tempUpdateUser)">Cập nhật</el-button>
      </span>
    </el-dialog>
    <!-- end update user dialog -->
  </fragment>
</template>
<script lang="ts">
import { Form } from 'element-ui';
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Maps, Rule } from '@/constants/app.type';
@Component<EmployeeActive>({
  name: 'EmployeeActive',
})
export default class EmployeeActive extends Vue {
  @Prop(Array) readonly tableData!: Array<object>;
  @Prop(Boolean) readonly loading!: boolean;
  private dialogUpdateVisible: boolean = false;
  private tempUpdateUser: object = {};

  public rules: Maps<Rule[]> = {};

  private handleOpenDialogUpdate(row: object) {
    this.tempUpdateUser = Object.assign({}, row);
    this.dialogUpdateVisible = true;
  }

  private handleUpdate(tempUpdateUser: object) {
    const updateUserForm = this.$refs.updateEmployeeForm as Form;
    updateUserForm.validate((isValid) => {
      if (isValid) {
        console.log('xxx');
      }
    });
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
