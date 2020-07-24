<template>
  <el-dialog class="change-password" title="Đổi mật khẩu" :visible.sync="centerDialogVisible" width="30%" center>
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
            v-model="chagePasswordForm.matchPassword"
            type="password"
            class="change-password__form__input__match-password"
            placeholder="Nhập mật khẩu"
          ></el-input>
        </el-form-item>
      </div>
      <el-row class="change-password__form__action" type="flex" justify="space-between">
        <el-col :span="24">
          <el-button el-button el-button--white el-button--medium @click="centerDialogVisible = false">Hủy</el-button>
        </el-col>
        <el-col :span="24">
          <el-button :loading="loading" class="el-button el-button--purple el-button--medium" @click="centerDialogVisible = false">
            Đổi mật khẩu
          </el-button>
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Maps, Rule } from '@/constants/app.type';
import { ChangePasswordDTO } from '@/constants/app.interface';
@Component<ChangePasswordDialog>({ name: 'ChangePasswordDialog' })
export default class ChangePasswordDialog extends Vue {
  @Prop({ default: false, required: true }) public centerDialogVisible!: boolean;
  private loading: boolean = false;
  private chagePasswordForm: ChangePasswordDTO = {
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
    if (value !== this.chagePasswordForm.newPassword) {
      return callback('Không trùng với mật khẩu mới');
    }
    return callback();
  }

  private handlechangePasswordForm(): void {}
}
</script>
<style lang="scss" scoped></style>
