<template>
  <div>
    <el-page-header title="Quay lại" @back="goBack" />
    <div class="-mt-4">
      <div class="box-wrap">
        <div class="-display-flex -justify-content-between -border-header">
          <span class="-title-2">Thêm nhân viên</span>
          <div>
            <el-button
              class="el-button--purple el-button--invite"
              size="small"
              @click="handleShowDialog"
            >
              Thêm một nhân viên
            </el-button>
          </div>
        </div>
        <upload-excel-component
          :on-success="handleSuccess"
          :before-upload="beforeUpload"
        />
        <div class="-mt-2 -mb-2">
          <el-button
            class="el-button--purple el-button--modal"
            icon="el-icon-download"
            @click="downloadTemplate"
          >
            Tải xuống template excel
          </el-button>
          <el-button
            class="el-button--purple el-button--modal create-employee__button"
            icon="el-icon-plus"
            :disabled="!hasData"
            @click="handleAddEmployee"
          >
            Thêm
          </el-button>
        </div>
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
            min-width="100"
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
          <el-table-column
            label="Trạng thái thêm"
            prop="department"
            align="center"
            min-width="80"
          >
            <template slot-scope="{ row }">
              <span>{{ row.reason }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <staff-dialog
        :visible-dialog.sync="visibleDialog"
        :departments="departments"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import UploadExcelComponent from '@/components/Common/CommonUploadExcel.vue';
import { compareTwoDate, formatDateFromExcel } from '@/utils/dateParser';
import TeamRepository from '@/repositories/TeamRepository';
import EmployeeRepository from '@/repositories/EmployeeRepository';
import { EmployeeDTO } from '@/constants/app.interface';
import { Maps, Rule } from '@/constants/app.type';
import { max255Char } from '@/constants/account.constant';
import StaffDialog from '@/components/Admin/AdminDialog/AdminDialogStaff.vue';

@Component<CreateEmployee>({
  name: 'CreateEmployee',
  components: { UploadExcelComponent, StaffDialog },
  async created() {
    await this.getDataCommons();
  },
})
export default class CreateEmployee extends Vue {
  private tableData: Array<Object> = [];
  private tableHeader: Array<Object> = [];
  private departments: Array<any> = [];
  private hasData: boolean = false;
  private visibleDialog: Boolean = false;

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

  private async createEmployee() {
    console.log('Employee', this.employee);
    try {
      await EmployeeRepository.create({
        users: [this.employee],
      });
    } catch (error) {
      console.log(error);
    }
  }

  @Watch('tableData')
  private checkData() {
    this.hasData = this.tableData.length > 0;
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

    const tableData = results.map((value) => {
      return { ...value, reason: 'Đang chờ' };
    });
    this.tableData = tableData;
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

  private async handleAddEmployee() {
    const users: any = this.handleTableData(this.tableData);
    try {
      const response: any = await EmployeeRepository.create({ users });
      if (!!response && !!response.code) {
        console.log('response: ', response);
        if (response.code === 2000) {
          this.employee = {
            fullName: '',
            email: '',
            roles: [],
            departmentId: null,
            gender: 1,
            dob: '',
          };
          this.tableData = [];
        } else {
          this.tableData = this.createFalseReason(
            this.tableData,
            response.data.list,
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  private createFalseReason(tableData: Array<any>, responseData: Array<any>) {
    return responseData.map((value) => {
      const tableRowData = tableData.find(
        (value1) => value1.email === value.email,
      );
      return {
        ...tableRowData,
        reason: value.reason,
      };
    });
  }

  private pickerOptions: any = {
    disabledDate(time) {
      return time.getTime() > Date.now();
    },
  };

  private goBack() {
    this.$router.go(-1);
  }

  private handleShowDialog() {
    this.visibleDialog = true;
  }

  private downloadTemplate() {
    const templateLink =
      'https://bluemarble-hep1.s3-ap-southeast-1.amazonaws.com/insert_staff_template.xlsx';
    window.open(templateLink);
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/main.scss';

.create-employee {
  &__button {
    float: right;
  }
}
</style>
