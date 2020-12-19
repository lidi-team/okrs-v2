<template>
  <div>
    <el-table
      v-loading="loadingTable"
      empty-text="Không có dữ liệu"
      class="employee-active"
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column
        prop="fullName"
        label="Tên đầy đủ"
        min-width="150"
      ></el-table-column>
      <el-table-column
        prop="email"
        label="Email"
        min-width="180"
      ></el-table-column>
      <el-table-column label="Phòng ban" min-width="150">
        <template slot-scope="{ row }">
          <span>{{ row.department.name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="role" label="Vai trò" min-width="150">
        <template slot-scope="{ row }">
          <span>{{ displayRoleName(row.roles) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Giới tính">
        <template slot-scope="{ row }">
          <span>{{ row.gender == 0 ? 'Nữ' : 'Nam' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Trạng thái">
        <template slot-scope="{ row }">
          <span>{{ row.isActive ? 'hoạt động' : 'tạm khóa' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Thao tác" align="center">
        <template slot-scope="{ row }">
          <div class="employee-active__action">
            <el-tooltip
              class="employee-active__icon"
              content="Cập nhật"
              placement="left-end"
            >
              <i
                class="el-icon-edit icon--info"
                @click="handleOpenDialogUpdate(row)"
              ></i>
            </el-tooltip>
            <el-tooltip
              v-if="isEditable(row.roles)"
              class="employee-active__icon"
              :content="
                row.isActive ? 'Deactive tài khoản' : 'Active tài khoản'
              "
              placement="right-end"
            >
              <i
                :class="
                  row.isActive
                    ? 'el-icon-lock icon--delete'
                    : 'el-icon-unlock icon--warning'
                "
                @click="changeUserStatus(row)"
              ></i>
            </el-tooltip>
          </div>
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
            label-position="top"
            style="width: 100%"
          >
            <el-form-item
              label="Tên đầy đủ:"
              prop="fullName"
              class="custom-label"
            >
              <el-input
                v-model="tempUpdateUser.fullName"
                placeholder="Nhập họ và tên"
                @keyup.enter.native="handleUpdate(tempUpdateUser)"
              />
            </el-form-item>
            <el-form-item label="Email:" prop="email" class="custom-label">
              <el-input
                v-model="tempUpdateUser.email"
                placeholder="Nhập email"
                @keyup.enter.native="handleUpdate(tempUpdateUser)"
              />
            </el-form-item>
            <el-form-item
              v-if="true"
              label="Phòng ban:"
              class="custom-label"
              prop="departmentId"
            >
              <el-select
                v-model="tempUpdateUser.departmentId"
                class="custom-label"
                placeholder="Chọn phòng ban"
                @keyup.enter.native="handleUpdate(tempUpdateUser)"
              >
                <el-option
                  v-for="item in teams"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="true"
              label="giới tính:"
              class="custom-label"
              prop="gender"
            >
              <el-radio v-model="tempUpdateUser.gender" :label="1"
                >Nam
              </el-radio>
              <el-radio v-model="tempUpdateUser.gender" :label="0">Nữ</el-radio>
            </el-form-item>
            <el-form-item
              v-if="true"
              label="ngày sinh:"
              class="custom-label"
              prop="dob"
            >
              <el-date-picker
                v-model="tempUpdateUser.dob"
                format="dd/MM/yyyy"
                value-format="dd/MM/yyyy"
                :picker-options="pickerOptions"
                type="date"
                placeholder="Chọn ngày sinh"
              ></el-date-picker>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button
          class="el-button--white el-button--modal"
          @click="handleCloseDialog"
          >Hủy</el-button
        >
        <el-button
          class="el-button--purple el-button--modal"
          :loading="loadingTable"
          @click="handleUpdate(tempUpdateUser)"
          >Cập nhật</el-button
        >
      </span>
    </el-dialog>
    <!-- end update user dialog -->
  </div>
</template>
<script lang="ts">
import { Form } from 'element-ui';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import { employeeRules } from './employee.constant';
import {
  confirmWarningConfig,
  notificationConfig,
} from '@/constants/app.constant';
import { Maps, Rule } from '@/constants/app.type';
import { EmployeeDTO } from '@/constants/app.interface';
import { GetterState } from '@/constants/app.vuex';
import EmployeeRepository from '@/repositories/EmployeeRepository';
import { formatDateToDD } from '@/utils/dateParser';
import { filterUserRole } from '@/utils/filters';

@Component<EmployeeActive>({
  name: 'EmployeeActive',
  computed: {
    ...mapGetters({
      user: GetterState.USER,
    }),
  },
  mounted() {
    this.loadingTable = true;
    setTimeout(() => {
      this.loadingTable = false;
    }, 500);
  },
})
export default class EmployeeActive extends Vue {
  @Prop(Array) readonly tableData!: Array<object>;
  @Prop(Array) readonly teams!: Array<object>;
  // @Prop(Array) readonly jobs!: Array<object>;
  // @Prop(Array) readonly roles!: Array<object>;
  @Prop(Function) readonly getListUsers;

  private loadingTable: boolean = false;
  private dialogUpdateVisible: boolean = false;
  private tempUpdateUser: EmployeeDTO = {
    id: 0,
    fullName: '',
    email: '',
    roles: [],
    departmentId: 0,
    gender: 0,
    dob: '',
    isActive: true,
    active: 0,
  };

  public rules: Maps<Rule[]> = employeeRules;

  private handleOpenDialogUpdate(row) {
    this.tempUpdateUser = {
      id: row.id,
      fullName: row.fullName,
      email: row.email,
      roles: row.roles,
      departmentId: row.department.id,
      gender: row.gender,
      dob: row.dob ? formatDateToDD(row.dob) : '',
      isActive: row.isActive,
      active: row.isActive ? 1 : 0,
    };
    this.dialogUpdateVisible = true;
  }

  private handleUpdate(tempUpdateUser: EmployeeDTO) {
    console.log('before update: ', tempUpdateUser);

    this.loadingTable = true;
    (this.$refs.updateEmployeeForm as Form).validate(
      (isValid: boolean, invalidFields: object) => {
        if (isValid) {
          this.$confirm(`Bạn có chắc chắn muốn cập nhật user này?`, {
            ...confirmWarningConfig,
          })
            .then(async () => {
              await EmployeeRepository.update(tempUpdateUser)
                .then((res) => {
                  setTimeout(() => {
                    console.log('aa');
                    this.loadingTable = false;
                  }, 300);
                  this.$notify.success({
                    ...notificationConfig,
                    message: 'Cập nhật thành viên thành công',
                  });
                  this.getListUsers();
                  this.dialogUpdateVisible = false;
                })
                .catch((error) => {
                  if (error.response.data.statusCode === 430) {
                    this.$notify.error({
                      ...notificationConfig,
                      message: 'Team Leader đã tồn tại',
                    });
                  }
                  setTimeout(() => {
                    this.loadingTable = false;
                  }, 300);
                });
            })
            .catch(() => {
              setTimeout(() => {
                this.loadingTable = false;
              }, 300);
            });
        } else {
          setTimeout(() => {
            this.loadingTable = false;
          }, 300);
        }
      },
    );
  }

  private handleCloseDialog() {
    const updateUserForm = this.$refs.updateEmployeeForm as Form;
    updateUserForm.clearValidate();
    this.dialogUpdateVisible = false;
  }

  private pickerOptions: any = {
    disabledDate(time) {
      return time.getTime() > Date.now();
    },
  };

  private changeUserStatus(row) {
    this.tempUpdateUser = {
      id: row.id,
      fullName: row.fullName,
      email: row.email,
      roles: row.roles,
      departmentId: row.department.id,
      gender: row.gender,
      dob: row.dob ? formatDateToDD(row.dob) : '',
      active: row.isActive ? 0 : 1,
    };
    this.$confirm(
      `Bạn có chắc chắn muốn ${
        row.isActive ? 'khóa' : 'kích hoạt'
      } tài khoản này?`,
      {
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy bỏ',
        type: 'warning',
      },
    ).then(async () => {
      try {
        await EmployeeRepository.update(this.tempUpdateUser).then(
          (res: any) => {
            this.$notify.success({
              ...notificationConfig,
              message: 'Cập nhật thành viên thành công',
            });
          },
        );
        this.getListUsers();
      } catch (error) {}
    });
  }

  private isEditable(roles: string[]) {
    const isSpecialRole =
      roles.includes('ROLE_DIRECTOR') ||
      roles.includes('ROLE_ADMIN') ||
      roles.includes('ROLE_ADMIN_HR') ||
      roles.includes('ROLE_PM');
    return !isSpecialRole;
  }

  private displayRoleName(roles: any) {
    return filterUserRole(roles);
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
