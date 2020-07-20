<template>
  <el-row class="wrap-fpass-form" type="flex" justify="center">
    <div class="fpass__form">
      <div class="fpass__form__title">
        <span>Quên mật khẩu</span>
      </div>
      <el-form
        ref="forgotPasswordForm"
        :model="forgotPasswordForm"
        :rules="rules"
        :status-icon="true"
        :hide-required-asterisk="false"
        label-width="150px"
        label-position="top"
        @submit.native.prevent="handleForgotPasswordForm"
      >
        <el-form-item prop="email" label="Email liên kết">
          <el-input v-model="forgotPasswordForm.email" class="fpass__form__email" placeholder="Tên đăng nhập hoặc email"></el-input>
        </el-form-item>
        <el-row type="flex" justify="space-between" class="fpass__form__warning">
          <el-col :span="1">(*)</el-col>
          <el-col :span="23">
            <p>
              <strong>Quên mật khẩu ?</strong> Điền email liên kết với tài khoản của bạn. Chúng tôi sẽ gửi đến địa chỉ email đó một link liên kết giúp
              bạn đặt lại mật khẩu mới.
            </p>
          </el-col>
        </el-row>

        <el-row type="flex" justify="space-between">
          <el-col :span="12">
            <el-button class="el-button el-button--white el-button--medium" @click="returnLoginPage">Quay lại</el-button>
          </el-col>
          <el-col :span="12">
            <el-button
              :loading="loading"
              class="el-button el-button--purple el-button--medium"
              @click="handleForgotPasswordForm('forgotPasswordForm')"
              >Gửi</el-button
            >
          </el-col>
        </el-row>
      </el-form>
    </div>
  </el-row>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator';
import { Form as ForgotPasswordForm } from 'element-ui';
import { Maps, Rule, ForgotPasswordDTO } from '@/constants/app.type';
@Component<ForgotPassword>({
  name: 'Login',
})
export default class ForgotPassword extends Vue {
  @Prop({ default: false }) public loading!: boolean;
  public forgotPasswordForm: ForgotPasswordDTO = {
    email: '',
  };

  private returnLoginPage(): void {
    this.$router.push('/dang-nhap');
  }

  public handleForgotPasswordForm(formName: string): void {
    const fPassForm = this.$refs[formName] as ForgotPasswordForm;
    fPassForm.validate((isValid) => {
      if (isValid) {
        this.$emit('submit', this.forgotPasswordForm);
      } else {
        return false;
      }
    });
  }

  public rules: Maps<Rule[]> = {
    email: [
      { required: true, message: 'Vui lòng nhập địa chỉ email', trigger: 'blur' },
      { type: 'email', message: 'Vui lòng nhập đúng địa chỉ email', trigger: 'blur' },
    ],
  };
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
.wrap-fpass-form {
  .fpass__form {
    box-shadow: 0px 1px 3px rgba(63, 63, 68, 0.15), 0px 0px 0px rgba(63, 63, 68, 0.05);
    border-radius: $border-radius-base;
    padding: $unit-12;
    &__title {
      text-align: center;
      font-size: 1.75rem;
      color: $neutral-primary-4;
      padding-bottom: $unit-4;
    }
    &__warning {
      font-size: $unit-2;
    }
  }
  .el-col {
    font-size: 0.875rem;
    &:first-child {
      color: #f56c6c;
      padding-right: $unit-6;
    }
  }
  .el-button {
    margin-top: $unit-10;
  }
}
</style>
