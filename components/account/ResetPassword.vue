<template>
  <el-row class="reset-password-form" type="flex" justify="space-between">
    <div class="reset-password-form__title">
      <span>Đặt lại mật khẩu</span>
    </div>
    <el-form
      ref="resetPasswordForm"
      :model="resetPasswordForm"
      :rules="rules"
      :status-icon="true"
      :hide-required-asterisk="false"
      label-width="150px"
      label-position="top"
      @submit.native.prevent="handleResetPasswordForm"
    >
      <div class="reset-password-form__input">
        <el-form-item prop="newPassword" label="Mật khẩu mới">
          <el-input
            v-model="resetPasswordForm.newPassword"
            type="password"
            class="reset-password-form__input__new-password"
            placeholder="Nhập mật khẩu"
          ></el-input>
        </el-form-item>
        <el-form-item prop="matchPassword" label="Nhập lại mật khẩu mới">
          <el-input v-model="matchPassword" type="password" class="reset-password-form__input__match-password" placeholder="Nhập mật khẩu"></el-input>
        </el-form-item>
      </div>
      <el-row class="reset-password-form__action" type="flex" justify="space-between">
        <el-col :span="24">
          <el-button :loading="loading" class="el-button el-button--purple el-button--medium" @click="handleResetPasswordForm">
            Đổi mật khẩu
          </el-button>
        </el-col>
        <el-col :span="24">
          <nuxt-link to="/dang-nhap"><strong>Quay lại trang</strong> <span class="reset-password-form__action--login">Đăng nhập</span></nuxt-link>
        </el-col>
      </el-row>
    </el-form>
  </el-row>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Form } from 'element-ui';
import { ResetPasswordActionDTO } from '@/constants/app.interface';
import { Maps, Rule } from '@/constants/app.type';
@Component<ResetPassword>({
  name: 'ResetPassword',
})
export default class ResetPassword extends Vue {
  @Prop({ default: false }) public loading!: boolean;
  private matchPassword: string = '';

  watchQuery: string[] = ['token'];

  public resetPasswordForm: ResetPasswordActionDTO = {
    newPassword: '',
    token: '',
  };

  private rules: Maps<Rule[]> = {
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
    if (value !== this.resetPasswordForm.newPassword) {
      return callback('Không trùng với mật khẩu mới');
    }
    return callback();
  }

  private handleResetPasswordForm(): void {
    (this.$refs.resetPasswordForm as Form).validate((isValid) => {
      if (isValid) {
        this.resetPasswordForm.token = this.$route.query.token as string;
      }
    });
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/main.scss';
.reset-password-form {
  flex-direction: column;
  padding: $unit-12;
  box-shadow: $box-shadow-default;
  background-color: $white;
  @include breakpoint-down(phone) {
  }
  &__title {
    text-align: center;
    border: 10px;
    font-size: 1.75rem;
    color: $neutral-primary-4;
  }
  &__input {
    &__new-password {
    }
    &__match-password {
    }
  }
  &__action {
    margin-top: $unit-10;
    flex-direction: column;
    &--login {
      color: $blue-primary-2;
    }
  }
  .el-form-item {
    &:first-child {
      margin-top: $unit-4;
    }
    &__label {
      color: $neutral-primary-4;
      padding-bottom: $unit-1;
    }
    .el-input__inner {
      &::placeholder {
        color: $neutral-primary-1;
      }
    }
  }
  .el-row {
    .el-col:nth-child(2) {
      a {
        text-decoration: none;
        color: $neutral-primary-4;
      }
      text-align: center;
      &:nth-child(2) {
        padding-top: $unit-4;
        font-size: 0.875rem;
      }
    }
  }
}
.el-button {
  font-size: $unit-5;
  width: 100%;
}
</style>
