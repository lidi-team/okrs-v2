<template>
  <el-dialog
    title="Thêm mới chu kỳ"
    :visible.sync="cycleVisibleDialog"
    width="30%"
    placement="center"
    :before-close="handleCloseDialog"
    class="dialog-cycle-okrs"
  >
    <el-row>
      <el-col :span="24">
        <el-form ref="temCreateCycle" :model="temCreateCycle">
          <el-form-item label="Tên chu kỳ" prop="name" class="custom-label" label-width="120px">
            <el-input v-model="temCreateCycle.name" placeholder="Nhập tên chu kỳ" />
          </el-form-item>
          <el-form-item label="Ngày bắt đầu" prop="startDate" class="custom-label" label-width="120px">
            <el-date-picker
              v-model="temCreateCycle.startDate"
              type="date"
              placeholder="Chọn ngày bắt đầu"
              :format="dateFormat"
              :value-format="dateFormat"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="Ngày kết thúc" prop="endDate" class="custom-label" label-width="120px">
            <el-date-picker
              v-model="temCreateCycle.endDate"
              type="date"
              placeholder="Chọn ngày kết thúc"
              :format="dateFormat"
              :value-format="dateFormat"
            ></el-date-picker>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <span slot="footer">
      <el-button class="el-button--white el-button--modal" @click="handleCloseDialog">Hủy</el-button>
      <el-button class="el-button--purple el-button--modal" @click="handeCreate">Thêm mới</el-button>
    </span>
  </el-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from 'vue-property-decorator';
import { Form } from 'element-ui';
import { CycleDTO } from '@/constants/app.interface';
import { Maps, Rule } from '@/constants/app.type';
import { compareTwoDate } from '@/utils/dateParser';
@Component<CycleOkrsDialog>({
  name: 'CycleOkrsDialog',
  updated() {
    console.log(this.cycleVisibleDialog);
  },
})
export default class CycleOkrsDialog extends Vue {
  @Prop({ type: Boolean, required: true, default: false }) private cycleVisibleDialog!: boolean;

  get isCycleVisibleDialog() {
    return this.cycleVisibleDialog;
  }

  set isCycleVisibleDialog(value) {
    this.$emit('update:cycleVisibleDialog', value);
  }

  private handleVisible() {
    this.$emit('umbalaVisible', this.isCycleVisibleDialog);
  }

  // get

  private dateFormat: string = 'dd/MM/yyyy';
  private temCreateCycle: CycleDTO = {
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
    if (compareTwoDate(value, this.temCreateCycle.startDate) === 1) {
      return callback('Ngày kết thúc phải lớn hơn ngày bắt đầu');
    }
    return callback();
  }

  private handeCreate() {}

  private handleCloseDialog() {
    (this.$refs.temCreateCycle as Form).clearValidate();
    this.cycleVisibleDialog = false;
  }
}
</script>
<style lang="scss" scoped>
.dialog-cycle-okrs {
  .el-date-editor.el-input {
    width: 100%;
  }
}
</style>
