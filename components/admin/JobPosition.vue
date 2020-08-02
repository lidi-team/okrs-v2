<template>
  <fragment>
    <el-table v-loading="loading" :data="tableData" empty-text="Không có dữ liệu" class="job-admin">
      <el-table-column prop="name" label="Tên vị trí"></el-table-column>
      <el-table-column prop="description" label="Mô tả"></el-table-column>
      <el-table-column label="Ngày cập nhật">
        <template v-slot="{ row }">
          <span>{{ new Date(row.updatedAt) | dateFormat('DD/MM/YYYY') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Thao tác" align="center">
        <template v-slot="{ row }">
          <el-tooltip class="job-admin__icon" content="Sửa" placement="top">
            <i class="el-icon-edit" @click="handleOpenDialogUpdate(row)"></i>
          </el-tooltip>
          <el-tooltip class="job-admin__icon" content="Xóa" placement="top">
            <i class="el-icon-delete" @click="deleteRow(row)"></i>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <base-pagination class="pagination-bottom" :total="total" :page.sync="syncPage" :limit.sync="syncLimit" @pagination="handlePagination($event)" />
    <el-dialog
      title="Cập nhật vị trí công việc"
      :visible.sync="dialogUpdateVisible"
      width="30%"
      placement="center"
      :before-close="handleCloseDialog"
      class="job-admin-dialog"
    >
      <el-row>
        <el-col :span="24">
          <el-form ref="tempUpdateJob" :model="tempUpdateJob" :hide-required-asterisk="false" :status-icon="true" :rules="rules">
            <el-form-item label="Tên vị trí" prop="name" class="custom-label" label-width="120px">
              <el-input v-model="tempUpdateJob.name" placeholder="Nhập tên vị trí" @keyup.enter.native="handleUpdate(tempUpdateJob)" />
            </el-form-item>
            <el-form-item label="Mô tả" prop="description" label-width="120px">
              <el-input
                v-model="tempUpdateJob.description"
                type="textarea"
                :autosize="autoSizeConfig"
                placeholder="Nhập mô tả"
                @keyup.enter.native="handleUpdate(tempUpdateJob)"
              />
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
import { Component, Vue, Prop, PropSync } from 'vue-property-decorator';
import { Form, Notification } from 'element-ui';

import { notificationConfig } from '../../constants/app.constant';
import { Maps, Rule } from '@/constants/app.type';
import { JobPositionDTO } from '@/constants/app.interface';
import JobRepository from '@/repositories/JobRepository';
import { AdminTabsEn } from '@/constants/app.enum';

@Component<ManageJobPosition>({ name: 'ManageJobPosition' })
export default class ManageJobPosition extends Vue {
  @Prop(Array) public tableData!: Object[];
  @Prop(Boolean) public loading!: boolean;
  @Prop(Function) public reloadData!: Function;
  @Prop({ type: Number, required: true }) public total!: number;
  @PropSync('page', { type: Number, required: true }) public syncPage!: number;
  @PropSync('limit', { type: Number, required: true }) public syncLimit!: number;

  private autoSizeConfig = { minRows: 2, maxRows: 4 };
  private dateFormat: string = 'dd/MM/yyyy';
  private dialogUpdateVisible: boolean = false;
  private tempUpdateJob: JobPositionDTO = {
    name: '',
    description: '',
    updatedAt: null,
  };

  private rules: Maps<Rule[]> = {
    name: [{ validator: this.sanitizeInput, trigger: 'change' }],
    description: [{ type: 'string', max: 255, message: 'Mô tả vị trí không được quá 255 ký tự' }],
  };

  private sanitizeInput(rule: any, value: any, callback: (message?: string) => any): (message?: string) => any {
    const isEmpty = (value: string) => !value.trim().length;
    if (value.length === 0) {
      return callback('Vui lòng nhập tên vị trí');
    }
    if (isEmpty(value)) {
      return callback('Tên vị trí không được chỉ chứa dấu cách');
    }
    return callback();
  }

  private handleOpenDialogUpdate(row: JobPositionDTO): void {
    this.tempUpdateJob = {
      id: row.id,
      name: row.name,
      description: row.description,
    };
    this.dialogUpdateVisible = true;
  }

  private handleUpdate(): void {
    (this.$refs.tempUpdateJob as Form).validate((isValid: boolean, invalidatedFields: object) => {
      if (isValid) {
        this.$confirm(`Bạn có chắc chắn muốn cập nhật vị trí này không?`, {
          confirmButtonText: 'Đồng ý',
          cancelButtonText: 'Hủy bỏ',
          type: 'warning',
        }).then(async () => {
          try {
            await JobRepository.update(this.tempUpdateJob).then((res) => {
              Notification.success({
                ...notificationConfig,
                message: 'Cập nhật vị trí thành công',
              });
            });
            this.reloadData();
            this.dialogUpdateVisible = false;
          } catch (error) {}
        });
      }
    });
  }

  private deleteRow(row: JobPositionDTO): void {
    this.$confirm(`Bạn có chắc chắn muốn xóa vị trí ${row.name}?`, {
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy bỏ',
      type: 'warning',
    }).then(async () => {
      try {
        await JobRepository.delete(row.id).then((res) => {
          Notification.success({
            ...notificationConfig,
            message: 'Xóa vị trí thành công',
          });
        });
        this.reloadData();
      } catch (error) {}
    });
  }

  private handlePagination(pagination: any) {
    this.$router.push(`?tab=${AdminTabsEn.JobPosition}&page=${pagination.page}`);
  }

  private handleCloseDialog(): void {
    (this.$refs.tempUpdateJob as Form).clearValidate();
    this.dialogUpdateVisible = false;
  }
}
</script>
<style lang="scss">
@import '@/assets/scss/main.scss';
.job-admin {
  width: 100%;
}
.pagination-bottom {
  margin-top: 2rem;
}
</style>
