<template>
  <el-row type="flex" justify="center">
    <div class="login__form">
      <span class="login__form__title">Đăng nhập hoặc đăng ký</span>
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="rules"
        :status-icon="false"
        :hide-required-asterisk="false"
        label-width="150px"
        label-position="top"
        @submit.native.prevent="handleSubmit"
      >
        <el-form-item prop="email" label="Tên đăng nhập">
          <el-input v-model="loginForm.email" class="login__form__email" placeholder="Tên đăng nhập hoặc email"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="Mật khẩu">
          <el-input v-model="loginForm.password" class="login__form__password" show-password placeholder="Nhật mật khẩu"></el-input>
        </el-form-item>
        <slot></slot>
      </el-form>
    </div>
  </el-row>
</template>

<script lang="ts">
import { Component, Vue, Provide, Prop } from 'nuxt-property-decorator';
import { Form as LoginForm } from 'element-ui';
import { LoginDTO } from '@/constants/app.interface';
import { Maps, Rule } from '@/constants/app.type';
@Component<AccountLogin>({
  name: 'Login',
})
export default class AccountLogin extends Vue {
  @Provide() public loginForm: LoginDTO = {
    email: '',
    password: '',
  };

  @Provide() public rules = {
    email: [
      { required: true, message: 'Vui lòng nhập địa chỉ email', trigger: 'blur' },
      { type: 'email', message: 'Vui lòng nhập đúng địa chỉ email', trigger: 'blur' },
    ],
    password: [{ required: true, message: 'Vui lòng nhập địa chỉ email' }],
  } as Maps<Rule[]>;

  public handleSubmit(): void {
    const theForm = this.$refs.theForm as LoginForm;
    theForm.validate((valid) => {
      if (valid) {
        this.$emit('submit', this.loginForm);
      } else {
        return false;
      }
    });
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/main.scss';
.login__form {
  &__title {
    border: 10px;
    padding: $unit-10;
    font-size: $text-3xl;
    color: $neutral-primary-4;
  }

  .el-form-item {
    &__label {
      color: $neutral-primary-4;
    }
    .el-input__inner {
      &::placeholder {
        color: $neutral-primary-1;
      }
    }
  }
}
</style>
