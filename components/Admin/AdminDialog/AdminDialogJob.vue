<template>
  <el-dialog
    title="Thêm mới vị trí công việc"
    :visible.sync="syncJobDialog"
    width="30%"
    placement="center"
    :before-close="handleCloseDialog"
  >
    <el-row>
      <el-col :span="24">
        <el-form ref="tempCreateJob" :model="tempCreateJob" :rules="rules">
          <el-form-item
            label="Tên vị trí"
            prop="name"
            class="custom-label"
            label-width="120px"
          >
            <el-input
              v-model="tempCreateJob.name"
              placeholder="Nhập tên vị trí"
            />
          </el-form-item>
          <el-form-item label="Mô tả" prop="description" label-width="120px">
            <el-input
              v-model="tempCreateJob.description"
              type="textarea"
              :autosize="autoSizeConfig"
              placeholder="Nhập mô tả"
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
        @click="createJob"
        >Thêm mới</el-button
      >
    </span>
  </el-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from 'vue-property-decorator';
import { Form } from 'element-ui';

import { TeamDTO } from '@/constants/app.interface';
import JobRepository from '@/repositories/JobRepository';
import { Maps, Rule } from '@/constants/app.type';
import { max255Char } from '@/constants/account.constant';
@Component<JobDialog>({
  name: 'JobDialog',
})
export default class JobDialog extends Vue {
  @Prop(Function) public reloadData!: Function;
  @PropSync('visibleDialog', { type: Boolean, required: true })
  public syncJobDialog!: boolean;

  private autoSizeConfig = { minRows: 2, maxRows: 4 };
  private loading: boolean = false;
  private dateFormat: string = 'dd/MM/yyyy';
  private tempCreateJob: TeamDTO = {
    name: '',
    description: '',
  };

  private rules: Maps<Rule[]> = {
    name: [
      { validator: this.sanitizeInput, trigger: ['change', 'blur'] },
      max255Char,
    ],
    description: [max255Char],
  };

  private sanitizeInput(
    rule: any,
    value: any,
    callback: (message?: string) => any,
  ): (message?: string) => any {
    const isEmpty = (value: string) => !value.trim().length;
    if (value.length === 0) {
      return callback('Vui lòng nhập tên vị trí');
    }
    if (isEmpty(value)) {
      return callback('Tên vị trí không được chỉ chứa dấu cách');
    }
    return callback();
  }

  private createJob() {
    this.loading = true;
    (this.$refs.tempCreateJob as Form).validate(
      async (isValid: boolean, invalidatedFields: object) => {
        if (isValid) {
          try {
            await JobRepository.post(this.tempCreateJob).then((res) => {
            });
            this.clearForm();
            this.loading = false;
            this.reloadData();
            this.syncJobDialog = false;
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
    (this.$refs.tempCreateJob as Form).clearValidate();
    this.syncJobDialog = false;
  }

  private clearForm(): void {
    this.tempCreateJob.name = '';
    this.tempCreateJob.description = '';
  }
}
</script>
<style lang="scss" scoped></style>
