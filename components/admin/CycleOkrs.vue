<template>
  <fragment>
    <el-table v-loading="loading" :data="tableData" empty-text="Không có dữ liệu" class="cycle-okrs">
      <el-table-column prop="name" label="Tên chu kỳ"></el-table-column>
      <el-table-column label="Ngày bắt đầu">
        <template v-slot="{ row }">
          <span>{{ dateParser(row.startDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Ngày kết đầu">
        <template v-slot="{ row }">
          <span>{{ dateParser(row.endDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Thao tác" align="center">
        <template v-slot="{ row }">
          <el-tooltip class="cycle-okrs__icon" content="Sửa" placement="top">
            <i class="el-icon-edit" @click="handleOpenDialogUpdate(row)"></i>
          </el-tooltip>
          <el-tooltip class="cycle-okrs__icon" content="Xóa" placement="top">
            <i class="el-icon-delete" @click="handleDelete(row)"></i>
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
    <el-dialog title="Cập nhật chu kỳ" :visible.sync="dialogUpdateVisible" width="30%" placement="center" :before-close="handleCloseDialog">
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form ref="temporaryUpdateCycleForm" :model="temporaryUpdateCycle" :hide-required-asterisk="false" :status-icon="true" :rules="rules">
            <el-form-item label="Tên chu kỳ" prop="name">
              <el-input v-model="temporaryUpdateCycle.name" placeholder="Nhập tên chu kỳ" @keyup.enter.native="handleUpdate(temporaryUpdateCycle)" />
            </el-form-item>
            <el-form-item label="Ngày bắt đầu" prop="startDate">
              <el-date-picker v-model="temporaryUpdateCycle.startDate" type="date" placeholder="Chọn ngày bắt đầu" value-format="dd-MM-yyyy">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="Ngày kết thúc" prop="endDate">
              <el-date-picker v-model="temporaryUpdateCycle.endDate" type="date" placeholder="Chọn ngày kết thúc" value-format="dd-MM-yyyy">
              </el-date-picker>
            </el-form-item>
          </el-form>
          <el-row>
            <el-col :span="12">
              <el-button class="el-button--white el-button--modal" @click="handleCloseDialog">Hủy</el-button>
            </el-col>
            <el-col :span="12">
              <el-button class="el-button--purple el-button--modal" @click="handleUpdate(temporaryUpdateCycle)">Cập nhật</el-button>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-dialog>
  </fragment>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { format, compareAsc, parse } from 'date-fns';
import { Form } from 'element-ui';
import { Maps, Rule } from '@/constants/app.type';
import { CycleDTO } from '@/constants/app.interface';
@Component<ManageCycleOkrs>({ name: 'ManageCycleOkrs' })
export default class ManageCycleOkrs extends Vue {
  @Prop(Array) public tableData!: Object[];
  @Prop(Boolean) public loading!: boolean;
  @Prop() public total!: number;
  @Prop() public page!: number;
  @Prop() public limit!: number;

  private dialogUpdateVisible: boolean = false;
  private temporaryUpdateCycle: CycleDTO = {
    name: '',
    startDate: new Date(),
    endDate: new Date(),
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
    const endDate = parse(value, 'yyyy-MM-dd', new Date());
    const startDate = parse(this.temporaryUpdateCycle.startDate, 'yyyy-MM-dd', new Date());
    if (compareAsc(startDate, endDate)) {
      return callback('Ngày kết thúc phải lớn hơn ngày bắt đầu ít nhất 1 tuần');
    }
    return callback();
  }

  private handleOpenDialogUpdate(row: CycleDTO): void {
    this.temporaryUpdateCycle = {
      id: row.id,
      name: row.name,
      startDate: this.dateParser(row.startDate),
      endDate: this.dateParser(row.endDate),
    };
    this.dialogUpdateVisible = true;
  }

  private handleUpdate(row: CycleDTO): void {}

  private handleDelete(row: CycleDTO): void {
    this.temporaryUpdateCycle = {
      id: row.id,
      name: row.name,
      startDate: this.dateParser(row.startDate),
      endDate: this.dateParser(row.endDate),
    };
    this.$confirm('Bạn có chắc chắn muốn chu kỳ này không?', {
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy bỏ',
      type: 'warning',
    });
  }

  private handleCloseDialog(): void {
    (this.$refs.temporaryUpdateCycleForm as Form).clearValidate();
    this.dialogUpdateVisible = false;
  }

  private dateParser(date: string, dateFormat: string = 'dd-MM-yyyy'): string {
    const tempDate = new Date(date);
    return format(tempDate, dateFormat);
  }
}
</script>
<style lang="scss" scoped>
.cycle-okrs {
  width: 100%;
}
</style>
