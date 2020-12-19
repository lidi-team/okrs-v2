<template>
  <el-dialog
    class="update-employee"
    :visible.sync="syncStaffDialog"
    width="45%"
    placement="bottom-start"
    title="Thêm một nhân viên"
    :before-close="handleCloseDialog"
  >
    <el-form
      ref="employee"
      v-loading="loadingForm"
      :model="employee"
      label-width="180px"
      label-position="left"
      :rules="rules"
    >
      <el-form-item prop="email" label="Email" class="custom-label">
        <el-input
          v-model="employee.email"
          size="medium"
          class="register-form__input__email"
          placeholder="Nhập email"
          type="email"
        ></el-input>
      </el-form-item>
      <el-form-item prop="fullName" label="Họ và tên" class="custom-label">
        <el-input
          v-model="employee.fullName"
          size="medium"
          class="register-form__input__full-name"
          placeholder="Nhập họ tên"
        ></el-input>
      </el-form-item>
      <el-form-item prop="dob" label="Ngày sinh" class="custom-label">
        <el-date-picker
          v-model="employee.dob"
          type="date"
          placeholder="Chọn ngày sinh dd/MM/yyyy"
          :format="dateFormat"
          :value-format="dateFormat"
          :picker-options="pickerOptions"
        ></el-date-picker>
      </el-form-item>
      <el-form-item
        prop="teamId"
        label="Phòng ban"
        class="register-form__input__team custom-label"
      >
        <el-select
          v-model="employee.departmentId"
          size="medium"
          placeholder="Chọn phòng ban"
          :no-data-text="noDataText"
        >
          <el-option
            v-for="item in departments"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="gender" label="Giới tính">
        <el-radio-group v-model="employee.gender">
          <el-radio :label="1">Nam</el-radio>
          <el-radio :label="0">Nữ</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item class="create-member-dialog__action">
        <el-button
          class="el-button--purple el-button--modal"
          :loading="loadingForm"
          @click="createEmployee"
          >Thêm nhân viên
        </el-button>
        <el-button class="el-button--modal" @click="handleCloseDialog"
          >Hủy
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Prop, PropSync, Vue } from 'vue-property-decorator';
import { EmployeeDTO } from '../../../constants/app.interface';
import { Form } from 'element-ui';
import { compareTwoDate } from '@/utils/dateParser';
import { Maps, Rule } from '@/constants/app.type';
import { max255Char } from '@/constants/account.constant';
import EmployeeRepository from '@/repositories/EmployeeRepository';

@Component<StaffDialog>({
  name: 'StaffDialog',
})
export default class StaffDialog extends Vue {
  @Prop(Array) readonly departments!: Array<any>;
  @PropSync('visibleDialog', { type: Boolean, required: true })
  public syncStaffDialog!: boolean;
  private loadingForm: Boolean = false;
  private noDataText: string = 'Không có dữ liệu';
  private dateFormat: string = 'dd/MM/yyyy';

  private employee: EmployeeDTO = {
    fullName: '',
    email: '',
    roles: [],
    departmentId: null,
    gender: 1,
    dob: '',
  };
  private handleCloseDialog() {
    const updateUserForm = this.$refs.employee as Form;
    updateUserForm.clearValidate();
    this.syncStaffDialog = false;
  }

  private clearForm(): void {
    this.employee = {
      fullName: '',
      email: '',
      roles: [],
      departmentId: null,
      gender: 1,
      dob: '',
    };
  }

  private validateEndDate(
    rule: any,
    value: any,
    callback: (message?: string) => any,
  ): (message?: string) => any {
    if (compareTwoDate(value, new Date().toString()) === 1) {
      return callback('Ngày sinh phải nhỏ hơn ngày hiện tại');
    }
    return callback();
  }

  private rules: Maps<Rule[]> = {
    email: [
      {
        required: true,
        message: 'Vui lòng nhập địa chỉ email',
        trigger: 'blur',
      },
      {
        type: 'email',
        message: 'Vui lòng nhập đúng địa chỉ email',
        trigger: 'blur',
      },
      max255Char,
    ],
    fullName: [{ required: true, message: 'Vui lòng nhập họ tên' }, max255Char],
    departmentId: [{ required: true, message: 'Vui lòng chọn phòng ban' }],
    dob: [
      {
        required: true,
        message: 'Vui lòng chọn ngày sinh',
        trigger: ['blur', 'change'],
      },
      { validator: this.validateEndDate, trigger: ['blur', 'change'] },
    ],
  };

  private createEmployee() {
    console.log('Employee', this.employee);
    (this.$refs.employee as Form).validate(
      async (isValid: boolean, invalidatedFields: object) => {
        if (isValid) {
          this.loadingForm = true;
          try {
            const response = await EmployeeRepository.create({
              users: [this.employee],
            });
            if (response) {
              this.clearForm();
              this.loadingForm = false;
              this.syncStaffDialog = false;
            }
          } catch (error) {
            this.loadingForm = false;
            console.log(error);
          }
        }
        if (invalidatedFields) {
          setTimeout(() => {
            this.loadingForm = false;
          }, 300);
        }
      },
    );
  }

  private pickerOptions: any = {
    disabledDate(time) {
      return time.getTime() > Date.now();
    },
  };
}
</script>

<style scoped></style>
