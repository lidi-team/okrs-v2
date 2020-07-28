<template>
  <fragment>
    <el-table v-loading="loading" :data="tableData" empty-text="Không có dữ liệu" class="cycle-okrs">
      <el-table-column prop="name" label="Tên chu kỳ"></el-table-column>
      <el-table-column label="Ngày bắt đầu">
        <template v-slot="{ row }">
          <!-- Nếu convert như thế này thì sẽ bị lỗi :)) Méo hiểu -->
          <!-- <span>{{ dateParser(row.startDate) }}</span> -->
          <span>{{ row.startDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Ngày kết thúc">
        <template v-slot="{ row }">
          <span>{{ row.endDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Thao tác" align="center">
        <template v-slot="{ row }">
          <el-tooltip class="cycle-okrs__icon" content="Sửa" placement="top">
            <i class="el-icon-edit" @click="handleOpenDialogUpdate(row)"></i>
          </el-tooltip>
          <el-tooltip class="cycle-okrs__icon" content="Xóa" placement="top">
            <i class="el-icon-delete" @click="deleteRow(row)"></i>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <base-pagination
      class="admin__tab__table__pagination"
      :total="total"
      page.sync="page"
      limit.sync="limit"
      @pagination="handlePagination($event)"
    />
    <el-dialog
      title="Cập nhật chu kỳ"
      :visible.sync="dialogUpdateVisible"
      width="30%"
      placement="center"
      :before-close="handleCloseDialog"
      class="cycle-okrs-dialog"
    >
      <el-row>
        <el-col :span="24">
          <el-form ref="temporaryUpdateCycleForm" :model="temporaryUpdateCycle" :hide-required-asterisk="false" :status-icon="true" :rules="rules">
            <el-form-item label="Tên chu kỳ" prop="name" class="custom-label" label-width="120px">
              <el-input v-model="temporaryUpdateCycle.name" placeholder="Nhập tên chu kỳ" @keyup.enter.native="handleUpdate(temporaryUpdateCycle)" />
            </el-form-item>
            <el-form-item label="Ngày bắt đầu" prop="startDate" class="custom-label" label-width="120px">
              <el-date-picker
                v-model="temporaryUpdateCycle.startDate"
                type="date"
                placeholder="Chọn ngày bắt đầu"
                :format="dateFormat"
                :value-format="dateFormat"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="Ngày kết thúc" prop="endDate" class="custom-label" label-width="120px">
              <el-date-picker
                v-model="temporaryUpdateCycle.endDate"
                type="date"
                placeholder="Chọn ngày kết thúc"
                :format="dateFormat"
                :value-format="dateFormat"
              ></el-date-picker>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button class="el-button--white el-button--modal" @click="handleCloseDialog">Hủy</el-button>
        <el-button class="el-button--purple el-button--modal" :loading="loading" @click="handleUpdate">Cập nhật</el-button>
      </span>
    </el-dialog>
  </fragment>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Form } from 'element-ui';
import { Maps, Rule } from '@/constants/app.type';
import { CycleDTO } from '@/constants/app.interface';
import CycleRepository from '@/repositories/CycleRepository';
import { formtDateToDD, formatDateToYYYY, compareTwoDate, parseToDate } from '@/utils/dateParser';

@Component<ManageCycleOkrs>({ name: 'ManageCycleOkrs' })
export default class ManageCycleOkrs extends Vue {
  @Prop(Array) public tableData!: Object[];
  @Prop(Boolean) public loading!: boolean;
  @Prop(Function) public getListCycles!: Function;
  @Prop() public total!: number;
  @Prop() public page!: number;
  @Prop() public limit!: number;

  private dateFormat: string = 'dd/MM/yyyy';
  private dialogUpdateVisible: boolean = false;
  private temporaryUpdateCycle: CycleDTO = {
    name: '',
    startDate: null,
    endDate: null,
  };

  private rules: Maps<Rule[]> = {
    name: [
      { type: 'string', required: true, message: 'Vui lòng nhập tên chu kỳ', trigger: 'blur' },
      { min: 3, message: 'Tên chu kỳ chứa ít nhất 3 ký tự' },
    ],
    startDate: [{ required: true, message: 'Vui lòng chọn ngày bắt đầu', trigger: 'blur' }],
    endDate: [
      { required: true, message: 'Vui lòng chọn ngày kết thúc', trigger: 'blur' },
      { validator: this.validateEndDate, trigger: ['blur', 'change'] },
    ],
  };

  private validateEndDate(rule: any, value: any, callback: (message?: string) => any): (message?: string) => any {
    if (compareTwoDate(value, this.temporaryUpdateCycle.startDate) === 1) {
      return callback('Ngày kết thúc phải lớn hơn ngày bắt đầu');
    }
    return callback();
  }

  private handleOpenDialogUpdate(row: CycleDTO): void {
    this.temporaryUpdateCycle = {
      id: row.id,
      name: row.name,
      startDate: formtDateToDD(row.startDate),
      endDate: formtDateToDD(row.endDate),
    };
    this.dialogUpdateVisible = true;
  }

  private handleUpdate(): void {
    (this.$refs.temporaryUpdateCycleForm as Form).validate((isValid) => {
      this.$confirm(`Bạn có chắc chắn muốn cập nhật cycle này không?`, {
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy bỏ',
        type: 'warning',
      }).then(async () => {
        try {
          const tempCycle: CycleDTO = {
            id: this.temporaryUpdateCycle.id,
            name: this.temporaryUpdateCycle.name,
            startDate: formatDateToYYYY(this.temporaryUpdateCycle.startDate),
            endDate: formatDateToYYYY(this.temporaryUpdateCycle.endDate),
          };
          await CycleRepository.update(tempCycle).then((res) => {
            this.$notify({
              title: 'Status',
              message: 'Cập nhật thành công',
              type: 'success',
              duration: 1000,
            });
          });
          // this.getListCycles();
          this.dialogUpdateVisible = false;
        } catch (error) {
          this.$notify({
            title: 'Lỗi',
            message: `Lỗi ${error.message}`,
            type: 'error',
            duration: 1000,
          });
        }
      });
    });
  }

  private deleteRow(row: CycleDTO): void {
    this.$confirm(`Bạn có chắc chắn muốn xóa chu kỳ ${row.name}?`, {
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy bỏ',
      type: 'warning',
    }).then(async () => {
      try {
        const rowName = row.name;
        await CycleRepository.delete(row.id).then((res) => {
          this.$notify({
            title: 'Status',
            message: `Xóa thánh công chu kỳ ${rowName}`,
            type: 'success',
            duration: 1000,
          });
        });
      } catch (error) {
        this.$notify({
          title: 'Lỗi',
          message: `Lỗi ${error.message}`,
          type: 'error',
          duration: 1000,
        });
      }
    });
  }

  private handleCloseDialog(): void {
    (this.$refs.temporaryUpdateCycleForm as Form).clearValidate();
    this.dialogUpdateVisible = false;
  }

  private dateParser(date: string): string {
    return formtDateToDD(date);
  }
}
</script>
<style lang="scss">
@import '@/assets/scss/main.scss';
.cycle-okrs {
  width: 100%;
}
.cycle-okrs-dialog {
  .el-date-editor.el-input {
    width: 100%;
  }
}
</style>
