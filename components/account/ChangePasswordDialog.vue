<template>
  <!-- update user password dialog -->
  <el-dialog :before-close="handleCloseDialog" :visible.sync="dialogVisible" :center="true" width="30%" class="change-password" title="Đổi mật khẩu">
    <el-form
      ref="changePasswordForm"
      class="change-password__form"
      :model="changePasswordForm"
      :rules="rules"
      :status-icon="true"
      :hide-required-asterisk="false"
      label-width="150px"
      label-position="top"
      @submit.native.prevent="handlechangePasswordForm"
    >
      <div class="change-password__form__input">
        <el-form-item prop="oldPassword" label="Mật khẩu cũ">
          <el-input
            v-model="changePasswordForm.oldPassword"
            type="password"
            class="change-password__form__input__old-password"
            placeholder="Nhập mật khẩu cũ"
          ></el-input>
        </el-form-item>
        <el-form-item prop="newPassword" label="Mật khẩu mới">
          <el-input
            v-model="changePasswordForm.newPassword"
            type="password"
            class="change-password__form__input__new-password"
            placeholder="Nhập mật khẩu"
          ></el-input>
        </el-form-item>
        <el-form-item prop="matchPassword" label="Nhập lại mật khẩu mới">
          <el-input
            v-model="changePasswordForm.matchPassword"
            type="password"
            class="change-password__form__input__match-password"
            placeholder="Nhập mật khẩu"
          ></el-input>
        </el-form-item>
      </div>
      <el-row class="change-password__form__action" type="flex" justify="space-between">
        <el-col :span="24">
          <el-button class="el-button el-button--white el-button--medium" @click="handleCloseDialog">Hủy</el-button>
        </el-col>
        <el-col :span="24">
          <el-button :loading="loading" class="el-button el-button--purple el-button--medium" @click="handlechangePasswordForm(changePasswordForm)"
            >Đổi mật khẩu</el-button
          >
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>
  <!-- End update user password dialog -->
</template>
<script lang="ts">
import { Component, Vue, Prop, PropSync } from 'vue-property-decorator';
import { Maps, Rule } from '@/constants/app.type';
import { ChangePasswordDTO } from '@/constants/app.interface';
@Component<ChangePasswordDialog>({
  name: 'ChangePasswordDialog',
  updated() {
    console.log('Updated' + this.dialogVisible);
  },
})
export default class ChangePasswordDialog extends Vue {
  @Prop({ type: Boolean, required: true, default: false }) dialogVisible!: boolean;
  private loading: boolean = false;
  private changePasswordForm: ChangePasswordDTO = {
    oldPassword: '',
    newPassword: '',
    matchPassword: '',
  };

  private rules: Maps<Rule[]> = {
    oldPassword: [{ required: true, message: 'Vui lòng nhập mật khẩu cũ', trigger: 'blur' }],
    newPassword: [
      { required: true, message: 'Vui lòng nhập mật khẩu mới', trigger: 'blur' },
      { validator: this.validatePassword, trigger: ['blur', 'change'] },
    ],
    matchPassword: [
      { required: true, message: 'Vui lòng nhập lại mật khẩu' },
      { validator: this.validateMatchPassword, trigger: ['blur', 'change'] },
    ],
  };

  private validatePassword(rule: any, value: any, callback: (message?: string) => any): (message?: string) => any {
    const valid: boolean = /^(?=.*\d)[0-9a-zA-Z]{8,}$/.test(value);
    if (!valid) {
      return callback('Mật khẩu chứ ít nhất 8 ký tự và 1 chữ số');
    }
    return callback();
  }

  private validateMatchPassword(rule: any, value: any, callback: (message?: string) => any): (message?: string) => any {
    if (value !== this.changePasswordForm.newPassword) {
      return callback('Không trùng với mật khẩu mới');
    }
    return callback();
  }

  private handlechangePasswordForm(changePasswordForm: ChangePasswordDTO): void {}
  private handleCloseDialog() {
    this.dialogVisible = false;
  }
}
</script>
<style lang="scss" scoped>
.change-password {
}
</style>
