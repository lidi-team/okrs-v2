<template>
  <account-login>
    <el-row>
      <el-col :span="12">
        <el-checkbox v-model="rememberPassword" class="login__form__checkbox">Ghi nhớ mật khẩu</el-checkbox>
      </el-col>
      <el-col :span="12">
        <nuxt-link class="login__form__link__password" to="#">Quên mật khẩu</nuxt-link>
      </el-col>
    </el-row>
    <el-button class="el-button el-button--purple el-button--large" @click="handleSubmit">Đăng nhập</el-button>
  </account-login>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
@Component<LoginPage>({
  name: 'LoginPage',
})
export default class LoginPage extends Vue {
  private rememberPassword: boolean = false;
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
</style>
