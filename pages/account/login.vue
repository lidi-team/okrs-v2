<template>
  <div>
    <span class="flex-auto text-3xl">Đăng nhập hoặc đăng ký</span>
    <el-form ref="loginForm" :model="loginForm" :rules="rules" status-icon label-width="120px">
      <el-form-item label="Tên đăng nhập">
        <el-input v-model="loginForm.email" placeholder="Tên đăng nhập hoặc email"></el-input>
      </el-form-item>
      <el-form-item label="Mật khẩu">
        <el-input v-model="loginForm.password" show-password placeholder="Nhật mật khẩu"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { Form as ElForm } from 'element-ui';
import { LoginDTO, FormRules } from '@/constants/app.interface';
@Component<Login>({
  name: 'Login',
  // data() {
  //   const validatePassword = (rule?, value?, callback?): void => {
  //     const refs = this.$refs.loginForm as ElForm;
  //     if (value === '') {
  //       callback(new Error('Vui lòng nhập mật khẩu'));
  //     }
  //     if (/^(?=.*\d)[0-9a-zA-Z]{8,}$/.test(value)) {
  //       callback(new Error('Mật khẩu chứa ít nhất 8 ký tự và chứa 1 số'));
  //     }
  //     refs.validateField('password');
  //     callback();
  //   };

  //   return {
  //     loginForm: {
  //       email: '',
  //       password: '',
  //     } as LoginDTO,
  //     rules: {
  //       email: [
  //         { required: true, message: 'Please input email address', trigger: 'blur' } as FormRules,
  //         { type: 'email', message: 'Please input correct email address', trigger: ['blur', 'change'] } as FormRules,
  //       ],
  //       password: [{ validator: validatePassword(), trigger: 'blur' } as FormRules],
  //     },
  //   };
  // },
})
export default class Login extends Vue {
  private readonly loginForm: LoginDTO = {
    email: '',
    password: '',
  };

  private validatePassword(rule?, value?, callback?): void {
    const refs = this.$refs.loginForm as ElForm;
    if (this.loginForm.password === '') {
      callback(new Error('Vui lòng nhập mật khẩu'));
    }
    if (/^(?=.*\d)[0-9a-zA-Z]{8,}$/.test(value)) {
      callback(new Error('Mật khẩu chứa ít nhất 8 ký tự và chứa 1 số'));
    }
    refs.validateField('password');
    callback();
  }

  private readonly rules: Object = {
    email: [
      { required: true, message: 'Please input email address', trigger: 'blur' } as FormRules,
      { type: 'email', message: 'Please input correct email address', trigger: ['blur', 'change'] } as FormRules,
    ],
    password: [{ validator: this.validatePassword(), trigger: 'blur' } as FormRules],
  };
}
</script>
