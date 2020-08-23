<template>
  <el-dialog title="Thêm mới phòng ban" :visible.sync="syncTeamDialog" width="30%" placement="center" :before-close="handleCloseDialog">
    <el-row>
      <el-col :span="24">
        <el-form ref="tempCreateDepartment" :model="tempCreateDepartment" :rules="rules">
          <el-form-item label="Tên phòng ban" prop="name" class="custom-label" label-width="120px">
            <el-input v-model="tempCreateDepartment.name" placeholder="Nhập tên phòng ban" />
          </el-form-item>
          <el-form-item label="Mô tả" prop="description" label-width="120px">
            <el-input v-model="tempCreateDepartment.description" type="textarea" :autosize="autoSizeConfig" placeholder="Nhập mô tả" />
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <span slot="footer">
      <el-button class="el-button--white el-button--modal" @click="handleCloseDialog">Hủy</el-button>
      <el-button :loading="loading" class="el-button--purple el-button--modal" @click="createTeam">Thêm mới</el-button>
    </span>
  </el-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from 'vue-property-decorator';
import { Form } from 'element-ui';

import { notificationConfig } from '@/constants/app.constant';
import TeamRepository from '@/repositories/TeamRepository';
import { TeamDTO } from '@/constants/app.interface';
import { Maps, Rule } from '@/constants/app.type';
import { max255Char } from '@/components/account/account.constant';
@Component<TeamDialog>({
  name: 'TeamDialog',
})
export default class TeamDialog extends Vue {
  @Prop(Function) public reloadData!: Function;
  @PropSync('visibleDialog', { type: Boolean, required: true }) public syncTeamDialog!: boolean;

  private autoSizeConfig = { minRows: 2, maxRows: 4 };
  private loading: boolean = false;
  private dateFormat: string = 'dd/MM/yyyy';
  private tempCreateDepartment: TeamDTO = {
    name: '',
    description: '',
  };

  private rules: Maps<Rule[]> = {
    name: [{ validator: this.sanitizeInput, trigger: ['change', 'blur'] }],
    description: [max255Char],
  };

  private sanitizeInput(rule: any, value: any, callback: (message?: string) => any): (message?: string) => any {
    const isEmpty = (value: string) => !value.trim().length;
    if (value.length === 0) {
      return callback('Vui lòng nhập tên phòng ban');
    }
    if (isEmpty(value)) {
      return callback('Tên phòng ban không được chỉ chứa dấu cách');
    }
    return callback();
  }

  private createTeam() {
    this.loading = true;
    (this.$refs.tempCreateDepartment as Form).validate(async (isValid: boolean, invalidatedFields: object) => {
      if (isValid) {
        try {
          await TeamRepository.post(this.tempCreateDepartment).then((res) => {
            this.$notify.success({
              ...notificationConfig,
              message: 'Tạo phòng ban mới thành công',
            });
          });
          this.loading = false;
          this.clearForm();
          this.reloadData();
          this.syncTeamDialog = false;
        } catch (error) {
          this.loading = false;
        }
      }
      if (invalidatedFields) {
        setTimeout(() => {
          this.loading = false;
        }, 300);
      }
    });
  }

  private handleCloseDialog() {
    (this.$refs.tempCreateDepartment as Form).clearValidate();
    this.syncTeamDialog = false;
  }

  private clearForm(): void {
    this.tempCreateDepartment.name = '';
    this.tempCreateDepartment.description = '';
  }
}
</script>
<style lang="scss" scoped></style>
