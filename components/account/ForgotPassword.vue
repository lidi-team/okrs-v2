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
          <el-col :span="1" class="fpass__form__warning--star">(*)</el-col>
          <el-col :span="23">
            <p>
              <strong>Quên mật khẩu ?</strong> Điền email liên kết với tài khoản của bạn. Chúng tôi sẽ gửi đến địa chỉ email đó một link liên kết giúp
              bạn đặt lại mật khẩu mới.
            </p>
          </el-col>
        </el-row>

        <el-row class="fpass__form__action" type="flex" justify="space-between">
          <el-col :span="24">
            <el-button :loading="loading" class="el-button el-button--purple el-button--medium" @click="handleForgotPasswordForm">
              Lấy lại mật khẩu
            </el-button>
          </el-col>
          <el-col :span="24">
            <nuxt-link to="/dang-nhap"><strong>Quay lại trang</strong> <span class="fpass__form__action--login">Đăng nhập</span></nuxt-link>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </el-row>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Form } from 'element-ui';
import { Maps, Rule } from '@/constants/app.type';
import AuthRepository from '@/repositories/AuthRepository';
import { MailResetPassDTO } from '@/constants/app.interface';
@Component<ForgotPassword>({
  name: 'Login',
})
export default class ForgotPassword extends Vue {
  private loading: boolean = false;
  private forgotPasswordForm: MailResetPassDTO = {
    email: '',
  };

  private handleForgotPasswordForm(): void {
    (this.$refs.forgotPasswordForm as Form).validate(async (isValid) => {
      if (isValid) {
        try {
          this.loading = true;
          await AuthRepository.sendMailToResetPassword(this.forgotPasswordForm);
          this.loading = false;
          this.$notify({
            title: 'Status',
            type: 'success',
            message: 'Đã gửi yêu cầu. Vui lòng kiểm tra email của bạn',
            duration: 1000,
          });
          this.$router.push('/dang-nhap');
        } catch (error) {
          this.loading = false;
          this.$notify({
            title: 'Status',
            type: 'error',
            message: 'Có lỗi xảy ra',
            duration: 1000,
          });
        }
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
    box-shadow: $box-shadow-default;
    border-radius: $border-radius-base;
    padding: $unit-12;
    background-color: $white;
    &__title {
      text-align: center;
      font-size: 1.75rem;
      color: $neutral-primary-4;
      padding-bottom: $unit-4;
    }
    &__warning {
      font-size: $unit-2;
      &--star {
        padding-right: $unit-6;
      }
    }
    &__action {
      flex-direction: column;
      &--login {
        color: $blue-primary-2;
      }
      .el-col {
        a {
          text-decoration: none;
          color: $neutral-primary-4;
        }
        text-align: center;
        &:nth-child(2) {
          padding-top: $unit-4;
        }
      }
    }
  }
  .el-row {
    .el-col {
      font-size: 0.875rem;
      &:first-child {
        color: #f56c6c;
      }
    }
  }
}
.el-button {
  margin-top: $unit-10;
  width: 100%;
}
</style>
