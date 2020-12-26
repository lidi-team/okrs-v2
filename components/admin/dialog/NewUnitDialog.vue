<template>
  <el-dialog
    title="Thêm mới đơn vị"
    :visible.sync="syncMeasureUnitDialog"
    width="30%"
    placement="center"
    :before-close="handleCloseDialog"
  >
    <el-row>
      <el-col :span="24">
        <el-form ref="tempCreateUnit" :model="tempCreateUnit" :rules="rules">
          <el-form-item
            label="Tên đơn vị"
            prop="name"
            class="custom-label"
            label-width="120px"
          >
            <el-input
              v-model="tempCreateUnit.type"
              placeholder="Nhập tên đơn vị"
            />
          </el-form-item>
          <el-form-item label="Tên viết tắt" label-width="120px">
            <el-input
              v-model="tempCreateUnit.preset"
              placeholder="Nhập tên viết tắt"
            />
          </el-form-item>
          <el-form-item label="Thứ tự hiển thị" label-width="120px">
            <el-input
              v-model.number="tempCreateUnit.index"
              placeholder="Nhập thứ tự hiển thị"
            />
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <span slot="footer">
      <el-button
        class="el-button--white el-button--modal"
        @click="handleCloseDialog"
        >Hủy</el-button
      >
      <el-button
        :loading="loading"
        class="el-button--purple el-button--modal"
        @click="createTeam"
        >Thêm mới</el-button
      >
    </span>
  </el-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from 'vue-property-decorator';
import { Form } from 'element-ui';

import MeasureUnitRepository from '@/repositories/MeasureRepository';
import { MeasureUnitDTO } from '@/constants/app.interface';
import { Maps, Rule } from '@/constants/app.type';
import { max255Char } from '@/constants/account.constant';
@Component<MeasureUnitDialog>({
  name: 'MeasureUnitDialog',
})
export default class MeasureUnitDialog extends Vue {
  @Prop(Function) public reloadData!: Function;
  @PropSync('visibleDialog', { type: Boolean, required: true })
  public syncMeasureUnitDialog!: boolean;

  private loading: boolean = false;
  private dateFormat: string = 'dd/MM/yyyy';
  private tempCreateUnit: MeasureUnitDTO = {
    type: '',
    present: '',
    index: 1,
  };

  private rules: Maps<Rule[]> = {
    type: [
      { validator: this.sanitizeInput, trigger: ['change', 'blur'] },
      max255Char,
    ],
  };

  private sanitizeInput(
    rule: any,
    value: any,
    callback: (message?: string) => any,
  ): (message?: string) => any {
    const isEmpty = (value: string) => !value.trim().length;
    if (value.length === 0) {
      return callback('Vui lòng nhập tên đơn vị');
    }
    if (isEmpty(value)) {
      return callback('Tên đơn vị không được chỉ chứa dấu cách');
    }
    return callback();
  }

  private createTeam() {
    this.loading = true;
    (this.$refs.tempCreateUnit as Form).validate(
      async (isValid: boolean, invalidatedFields: object) => {
        if (isValid) {
          try {
            await MeasureUnitRepository.post(this.tempCreateUnit).then(
              (res) => {
              },
            );
            this.clearForm();
            this.loading = false;
            this.reloadData();
            this.syncMeasureUnitDialog = false;
          } catch (error) {
            this.loading = false;
          }
        }
        if (invalidatedFields) {
          setTimeout(() => {
            this.loading = false;
          }, 300);
        }
      },
    );
  }

  private handleCloseDialog() {
    (this.$refs.tempCreateUnit as Form).clearValidate();
    this.syncMeasureUnitDialog = false;
  }

  private clearForm(): void {
    this.tempCreateUnit.type = '';
    this.tempCreateUnit.present = '';
    this.tempCreateUnit.index = 1;
  }
}
</script>
<style lang="scss" scoped></style>
