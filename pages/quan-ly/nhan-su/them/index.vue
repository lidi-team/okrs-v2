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
        <span>fine</span>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import UploadExcelComponent from '@/components/UploadExcel/index.vue';
import { formatDateFromExcel } from '@/utils/dateParser';
import { dateFormat } from '@vuejs-community/vue-filter-date-format';
import TeamRepository from '@/repositories/TeamRepository';
import value from '*.png';
import EmployeeRepository from '@/repositories/EmployeeRepository';
import {
  notificationConfig,
  confirmWarningConfig,
} from '@/constants/app.constant';

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
