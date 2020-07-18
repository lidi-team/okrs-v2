<template>
  <div class="form" justify="center">
    <h2 class="form__title">Đăng nhập hoặc đăng ký</h2>
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
      <el-form-item class="form" prop="email" label="Tên đăng nhập">
        <el-input v-model="loginForm.email" class="form__input" placeholder="Tên đăng nhập hoặc email"></el-input>
      </el-form-item>
      <el-form-item prop="password" label="Mật khẩu">
        <el-input v-model="loginForm.password" show-password placeholder="Nhật mật khẩu"></el-input>
      </el-form-item>
    </el-form>
    <el-button class="el-button--purple el-button--small">Hello</el-button>
    <el-button class="el-button--purple el-button--base">Hello</el-button>
    <el-button class="el-button--purple el-button--medium">Hello</el-button>
    <el-button class="el-button--purple el-button--large">Hello</el-button>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Provide } from 'nuxt-property-decorator';
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

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
.form {
  color: red;
  &__title {
    border: 10px;
    padding: $unit-10;
    font-size: $text-6xl;
  }
}
</style>
