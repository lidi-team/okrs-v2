<template>
  <div class="create-employee">
    <el-tabs v-model="tabActive" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="Tải lên file" name="excel">
        <upload-excel-component
          :on-success="handleSuccess"
          :before-upload="beforeUpload"
        />
        <el-button
          class="el-button--purple el-button--modal create-employee__button"
          :disabled="!hasData"
          @click="handleAddEmployee"
          >Thêm nhân viên</el-button
        >
        <el-table
          :data="tableData"
          border
          highlight-current-row
          style="width: 100%; margin-top: 20px"
          fit
        >
          <!-- <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item" /> -->
          <el-table-column
            label="Email"
            prop="email"
            align="center"
            min-width="80"
          >
            <template slot-scope="{ row }">
              <span>{{ row.email }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="Họ và tên"
            prop="fullName"
            align="center"
            min-width="80"
          >
            <template slot-scope="{ row }">
              <span>{{ row.fullName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="Ngày sinh"
            prop="dob"
            align="center"
            min-width="80"
          >
            <template slot-scope="{ row }">
              <span>{{ row.dob }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="Số điện thoại"
            prop="phoneNumber"
            align="center"
            min-width="80"
          >
            <template slot-scope="{ row }">
              <span>{{ row.phoneNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="Giới tính"
            prop="gender"
            align="center"
            min-width="80"
          >
            <template slot-scope="{ row }">
              <span>{{ row.gender }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="Phòng ban"
            prop="department"
            align="center"
            min-width="80"
          >
            <template slot-scope="{ row }">
              <span>{{ row.department }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column label="Actions" align="center" width="230" class-name="small-padding fixed-width">
            <template slot-scope="{ row, $index }">
              <el-button type="primary" size="mini" @click="handleUpdate(row)"> Sửa </el-button>
              <el-button v-if="row.status != 'deleted'" size="mini" type="danger" @click="handleDelete(row, $index)"> Xóa </el-button>
            </template>
          </el-table-column> -->
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="Thêm một nhân viên" name="one">
        <!-- FORM -->
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
              placeholder="Chọn ngày sinh"
              :format="dateFormat"
              :value-format="dateFormat"
            ></el-date-picker>
          </el-form-item>
          <el-form-item prop="gender" label="Giới tính">
            <el-radio-group v-model="employee.gender">
              <el-radio :label="1">Nam</el-radio>
              <el-radio :label="0">Nữ</el-radio>
            </el-radio-group>
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
          <el-form-item class="create-member-dialog__action">
            <el-button
              class="el-button--purple el-button--modal"
              :loading="loading"
              @click="createEmployee"
              >Thêm nhân viên
            </el-button>
          </el-form-item>
        </el-form>
        <!-- END FORM -->
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import UploadExcelComponent from '@/components/UploadExcel/index.vue';
import { compareTwoDate, formatDateFromExcel } from '@/utils/dateParser';
import { dateFormat } from '@vuejs-community/vue-filter-date-format';
import TeamRepository from '@/repositories/TeamRepository';
import value from '*.png';
import EmployeeRepository from '@/repositories/EmployeeRepository';
import {
  notificationConfig,
  confirmWarningConfig,
} from '@/constants/app.constant';
import { EmployeeDTO } from '@/constants/app.interface';
import { Maps, Rule } from '@/constants/app.type';
import { max255Char } from '@/constants/account.constant';

@Component<CreateEmployee>({
  name: 'CreateEmployee',
  components: { UploadExcelComponent },
  async created() {
    await this.getDataCommons();
  },
})
export default class CreateEmployee extends Vue {
  private tableData: Array<Object> = [];
  private tableHeader: Array<Object> = [];
  private departments: Array<any> = [];
  private tabActive: string = 'excel';
  private hasData: boolean = false;
  private loading: boolean = false;
  private loadingForm: Boolean = false;
  private noDataText: string = 'Không có dữ liệu';
  private dateFormat: string = 'dd/MM/yyyy';

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

  private employee: EmployeeDTO = {
    fullName: '',
    email: '',
    roles: [],
    departmentId: null,
    gender: 1,
    dob: '',
  };

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

  private async createEmployee() {
    console.log('Employee', this.employee);
    try {
      const response = await EmployeeRepository.create({
        users: [this.employee],
      });
      console.log(response);
      if (!!response && !!response.data) {
        if (response.data.numberOfFailed === 0) {
          this.$notify.success({
            ...notificationConfig,
            message: 'thêm nhân viên thành công',
          });
        } else {
          this.$notify.warning({
            ...notificationConfig,
            message:
              `Thêm thành công: ${response.data.numberOfSuccess}` +
              '\n' +
              `Thất bại: ${response.data.numberOfFailed}`,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  @Watch('tableData')
  private checkData() {
    this.hasData = this.tableData.length > 0;
    console.log('this.hasData: ', this.hasData);
  }

  private beforeUpload(file) {
    const isLt1M = file.size / 1024 / 1024 < 1;
    if (isLt1M) {
      return true;
    }
    this.$message({
      message: 'Please do not upload files larger than 1m in size.',
      type: 'warning',
    });
    return false;
  }

  private handleSuccess({ results, header }) {
    this.handleTableData(results);

    this.tableData = results;
    this.tableHeader = header;
  }

  private handleTableData(data: Array<any>) {
    const result = data.map((value, index) => {
      return {
        email: value.email,
        fullName: value.fullName,
        dob: formatDateFromExcel(value.dob),
        phoneNumber: value.phoneNumber,
        gender: !!value.gender && value.gender.toLowerCase() === 'nam' ? 1 : 0,
        departmentId: this.getIdDepartment(value.department),
      };
    });
    return result;
  }

  private async getDataCommons() {
    try {
      const departments = await TeamRepository.getMetaData();
      this.departments = departments.data;
    } catch (error) {}
  }

  private getIdDepartment(name: string) {
    const dName: string = name.toLowerCase();
    const result: number = -1;
    if (this.departments.length > 0) {
      const indexDepartment = this.departments.find(
        (value) => value.name.toLowerCase() === dName,
      );
      return indexDepartment.id;
    }
    return result;
  }

  private handleClick(tab, event) {
    this.tabActive = tab.name;
  }

  private async handleAddEmployee() {
    const users: any = this.handleTableData(this.tableData);
    try {
      const response = await EmployeeRepository.create({ users });
      console.log(response);
      if (!!response && !!response.data) {
        if (response.data.numberOfFailed === 0) {
          this.$notify.success({
            ...notificationConfig,
            message: 'thêm nhân viên thành công',
          });
        } else {
          this.$notify.warning({
            ...notificationConfig,
            message:
              `Thêm thành công: ${response.data.numberOfSuccess}` +
              '\n' +
              `Thất bại: ${response.data.numberOfFailed}`,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/main.scss';
.create-employee {
  &__button {
    margin: 20px 0;
    float: right;
  }
}
</style>
