<template>
  <fragment>
    <el-table v-loading="loadingTable" :data="tableData" empty-text="Không có dữ liệu" style="width: 100%;">
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
          <el-tooltip class="employee-active__icon" content="Sửa" placement="right-end">
            <i class="el-icon-edit icon--info" @click="handleOpenDialogUpdate(row)"></i>
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
            :model="tempUpdateUser"
            label-position="top"
            style="width: 100%;"
          >
            <el-form-item
              label="Tên đầy đủ:"
              prop="fullName"
              :rules="[
                {
                  required: true,
                  pattern: /^[^-\s]/,
                  message: 'Họ và tên không được bỏ trống',
                  trigger: 'blur',
                },
                {
                  pattern: /^[^\@\#\^\{\}\<\>\~\+\`\/\*\[\]]+$/,
                  message: 'Họ và tên không được chứa ký tự đặc biệt',
                  trigger: 'blur',
                },
              ]"
              class="custom-label"
            >
              <el-input v-model="tempUpdateUser.fullName" placeholder="Nhập họ và tên" @keyup.enter.native="handleUpdate(tempUpdateUser)" />
            </el-form-item>
            <el-form-item
              :rules="[
                {
                  type: 'email',
                  required: true,
                  message: 'Email không được bỏ trống',
                  trigger: 'blur',
                },
              ]"
              label="Email:"
              prop="email"
              class="custom-label"
            >
              <el-input v-model="tempUpdateUser.email" placeholder="Nhập email" :disabled="true" @keyup.enter.native="handleUpdate(tempUpdateUser)" />
            </el-form-item>
            <el-form-item
              :rules="[
                {
                  required: true,
                  message: 'Phòng ban không được bỏ trống',
                  trigger: 'blur',
                },
              ]"
              label="Phòng ban:"
              class="custom-label"
              prop="teamId"
            >
              <el-select
                v-model="tempUpdateUser.teamId"
                class="custom-label"
                placeholder="Chọn phòng ban"
                @keyup.enter.native="handleUpdate(tempUpdateUser)"
              >
                <el-option v-for="item in teams" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item
              :rules="[
                {
                  required: true,
                  message: 'Vị trí công việc không được bỏ trống',
                  trigger: 'blur',
                },
              ]"
              label="Vị trí công việc:"
              class="custom-label"
              prop="jobPositionId"
            >
              <el-select
                v-model="tempUpdateUser.jobPositionId"
                class="custom-label"
                placeholder="Chọn vị trí công việc"
                @keyup.enter.native="handleUpdate(tempUpdateUser)"
              >
                <el-option v-for="item in jobs" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item
              :rules="[
                {
                  required: true,
                  message: 'Vai trò không được bỏ trống',
                  trigger: 'blur',
                },
              ]"
              label="Vai trò:"
              class="custom-label"
              prop="roleId"
            >
              <el-select
                v-model="tempUpdateUser.roleId"
                class="custom-label"
                placeholder="Chọn vai trò"
                @keyup.enter.native="handleUpdate(tempUpdateUser)"
              >
                <el-option v-for="item in roles" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-checkbox v-model="tempUpdateUser.isLeader">Trưởng nhóm</el-checkbox>
            <el-checkbox v-model="tempUpdateUser.isActive">Hoạt động</el-checkbox>
          </el-form>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button class="el-button--white el-button--modal" @click="handleCloseDialog">Hủy</el-button>
        <el-button class="el-button--purple el-button--modal" @click="handleUpdate(tempUpdateUser)">Xác nhận</el-button>
      </span>
    </el-dialog>
    <!-- end update user dialog -->
  </fragment>
</template>
<script lang="ts">
import { Form } from 'element-ui';
import { Component, Vue, Prop } from 'vue-property-decorator';

import { notificationConfig, confirmWarningConfig } from '@/constants/app.constant';
import { EmployeeDTO } from '@/constants/app.interface';
import EmployeeRepository from '@/repositories/EmployeeRepository';
@Component<EmployeeDeactive>({
  name: 'EmployeeDeactive',
  mounted() {
    this.loadingTable = true;
    setTimeout(() => {
      this.loadingTable = false;
    }, 500);
  },
})
export default class EmployeeDeactive extends Vue {
  @Prop(Array) readonly tableData!: Array<object>;
  @Prop(Array) readonly teams!: Array<object>;
  @Prop(Array) readonly jobs!: Array<object>;
  @Prop(Array) readonly roles!: Array<object>;
  @Prop(Function) readonly getListUsers;

  private loadingTable: boolean = false;
  private dialogUpdateVisible: boolean = false;
  private tempUpdateUser: EmployeeDTO = {
    id: 0,
    fullName: '',
    email: '',
    roleId: 3,
    teamId: 0,
    jobPositionId: 0,
    isLeader: false,
    isActive: false,
  };

  private handleOpenDialogUpdate(row) {
    this.tempUpdateUser = {
      id: row.id,
      fullName: row.fullName,
      email: row.email,
      roleId: row.role.id,
      teamId: row.team.id,
      jobPositionId: row.jobPosition.id,
      isLeader: row.isLeader,
      isActive: row.isActive,
    };
    this.dialogUpdateVisible = true;
  }

  private handleUpdate(tempUpdateUser: EmployeeDTO) {
    const updateUserForm = this.$refs.updateEmployeeForm as Form;
    updateUserForm.validate((isValid) => {
      if (isValid) {
        this.$confirm(`Bạn có chắc chắn muốn active user này?`, {
          ...confirmWarningConfig,
        }).then(async () => {
          try {
            await EmployeeRepository.update(tempUpdateUser).then((res: any) => {
              this.$notify.success({
                ...notificationConfig,
                message: 'Cập nhật thành viên thành công',
              });
            });
            this.getListUsers();
            this.dialogUpdateVisible = false;
          } catch (error) {
            this.dialogUpdateVisible = false;
          }
        });
      }
    });
  }

  private handleCloseDialog() {
    const updateUserForm = this.$refs.updateEmployeeForm as Form;
    updateUserForm.clearValidate();
    this.dialogUpdateVisible = false;
  }
}
</script>
