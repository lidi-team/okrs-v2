<template>
  <el-row class="login-page" type="flex" justify="center" align="center">
    <el-col :span="8">
      <img src="@/assets/images/account/tiny-forgot-password.png" alt="login image" />
    </el-col>
    <el-col :span="8">
      <account-forgot-password />
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
@Component<ForgotPasswordPage>({
  name: 'ForgotPasswordPage',
  layout: 'empty',
  middleware: 'isGuest',
})
export default class ForgotPasswordPage extends Vue {}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
.login-page {
  padding-top: calc(100vh * (3 / 24));
  .el-col {
    &:nth-child(2) {
      padding-top: $unit-12;
    }
  }
}
</style>
