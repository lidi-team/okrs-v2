<template>
  <el-row class="login-page" type="flex" justify="center" align="center">
    <el-col :span="8">
      <img src="@/assets/images/account/tiny-forgot-password.png" alt="login image" />
    </el-col>
    <el-col :span="8">
      <account-forgot-password :loading="loading" class="account-forgot-password" @submit="handleSubmit" />
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { ForgotPasswordDTO } from '@/constants/app.type';
@Component<ForgotPasswordPage>({
  name: 'ForgotPasswordPage',
})
export default class ForgotPasswordPage extends Vue {
  private loading: boolean = false;

  public handleSubmit({ email }: ForgotPasswordDTO): void {
    this.loading = true;
    setTimeout(() => {
      try {
        if (email) {
          alert(email);
        } else {
          this.$message.warning('Xãy ra lỗi ở quên password');
        }
      } catch (error) {
        this.$message.warning(error.message);
      }
      this.loading = false;
    }, 300);
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
.login-page {
  .el-col {
    &:nth-child(2) {
      padding-top: $unit-12;
    }
  }
}
</style>
