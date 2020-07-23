<template>
  <el-row class="register__form">
    <div class="register__form__title">
      <span>Yêu cầu tham gia Develop Creative Design</span>
    </div>
    <el-form
      ref="registerForm"
      :model="registerForm"
      :rules="rules"
      :status-icon="true"
      label-width="150px"
      label-position="top"
      @submit.native.prevent="handleRegisterForm"
    >
      <el-form-item prop="email" label="Email">
        <el-input v-model="registerForm.email" class="reset-password-form__input__new-password" placeholder="Nhập email"></el-input>
      </el-form-item>
      <el-form-item prop="password" label="Mật khẩu">
        <el-input v-model="registerForm.password" class="reset-password-form__input__match-password" placeholder="Nhập mật khẩu"></el-input>
      </el-form-item>
      <el-form-item prop="fullName" label="Họ và Tên">
        <el-input v-model="registerForm.fullName" class="reset-password-form__input__match-password" placeholder="Nhập họ tên"></el-input>
      </el-form-item>
      <el-form-item prop="jobPositionId" label="Vị trí">
        <el-select v-model="registerForm.jobPositionId" placeholder="Chọn vị trí">
          <el-option label="Zone one" value="shanghai"></el-option>
          <el-option label="Zone two" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="department" label="Phòng ban">
        <el-select v-model="registerForm.department" placeholder="Chọn phòng ban">
          <el-option label="Zone one" value="shanghai"></el-option>
          <el-option label="Zone two" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-button :loading="loading" class="el-button el-button--purple el-button--large" @click="handleLogin">Gửi yêu cầu</el-button>
    </el-form>
  </el-row>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { RegisterDTO } from '../../constants/app.interface';
import { Maps, Rule } from '../../constants/app.type';
@Component<RegisterComponent>({ name: 'RegisterComponent' })
export default class RegisterComponent extends Vue {
  private loading: boolean = false;
  private rememberPassword: boolean = false;
  private capsTooltip = false;
  public loginForm: RegisterDTO = {
    email: '',
    password: '',
    fullName: '',
    gender: true,
    teamId: null,
    jobPositionId: null,
  };

  public rules: Maps<Rule[]> = {
    email: [
      { required: true, message: 'Vui lòng nhập địa chỉ email', trigger: 'blur' },
      { type: 'email', message: 'Vui lòng nhập đúng địa chỉ email', trigger: 'blur' },
    ],
    password: [{ required: true, message: 'Vui lòng nhập mật khẩu' }],
    fullName: [{ required: true, message: 'Vui lòng nhập họ tên' }],
  };
}
</script>
<style lang="scss" scoped></style>
