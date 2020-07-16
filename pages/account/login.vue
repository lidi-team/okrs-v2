<template>
  <div class="container p-20 m-40 rounded shadow">
    <span class="flex-auto text-3xl">Đăng nhập hoặc đăng ký</span>
    <el-form ref="loginForm" :model="loginForm" :rules="rules" status-icon label-width="120px" label-position="top">
      <el-form-item prop="email" label="Tên đăng nhập">
        <el-input v-model="loginForm.email" placeholder="Tên đăng nhập hoặc email"></el-input>
      </el-form-item>
      <el-form-item prop="password" label="Mật khẩu">
        <el-input v-model="loginForm.password" show-password placeholder="Nhật mật khẩu"></el-input>
      </el-form-item>
    </el-form>
    <el-button type="primary">Hello</el-button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { Form as CustomForm } from 'element-ui';
import { LoginDTO, FormRules } from '@/constants/app.interface';
@Component<Login>({
  name: 'Login',
})
export default class Login extends Vue {
  public loginForm: LoginDTO = {
    email: '',
    password: '',
  };

  public validatePassword(rule?, value?, callback?): void {
    const refs = this.$refs.loginForm as CustomForm;
    if (value === '') {
      callback(new Error('Vui lòng nhập mật khẩu'));
    } else if (/^(?=.*\d)[0-9a-zA-Z]{8,}$/.test(value)) {
      console.log(value);
      callback(new Error('Mật khẩu chứa ít nhất 8 ký tự và chứa 1 số'));
    } else {
      // refs.validateField('password', (err) => {
      //   console.log(err);
      // });
      callback();
    }
    // callback();
  }

  public rules: Object = {
    email: [
      { required: true, message: 'Vui lòng nhập địa chỉ email', trigger: 'blur' } as FormRules,
      { type: 'email', message: 'Vui lòng nhập đúng địa chỉ email', trigger: 'blur' } as FormRules,
    ],
    password: [{ validator: this.validatePassword, trigger: 'blur' } as FormRules],
  };
}
</script>
