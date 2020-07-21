<template>
  <el-row class="reset-password-page" type="flex" justify="center" align="center">
    <el-col :span="8">
      <img src="@/assets/images/account/tiny-reset-password.png" alt="reset password image" />
    </el-col>
    <el-col :span="8">
      <account-reset-password :loading="loading" class="account-reset-password" @submit="handleSubmit" />
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { ResetPasswordDTO } from '@/constants/app.interface';
@Component<ResetPasswordPage>({
  name: 'ResetPasswordPage',
})
export default class ResetPasswordPage extends Vue {
  private loading: boolean = false;

  public handleSubmit({ email }: ResetPasswordDTO): void {
    this.loading = true;
    setTimeout(() => {
      try {
        if (email) {
          this.$message.success(email);
        } else {
          this.$message.error('Đã xảy ra lỗi');
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
.reset-password-page {
  padding-top: calc(100vh * (3 / 24));
}
</style>
