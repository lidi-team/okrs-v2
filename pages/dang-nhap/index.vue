<template>
  <el-row class="login-page" type="flex" justify="center" align="center">
    <el-col :span="8">
      <img src="@/assets/images/account/tiny-login.png" alt="login image" />
    </el-col>
    <el-col :span="8">
      <account-login :loading="loading" class="account-login" @submit="handleSubmit" />
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { LoginDTO } from '@/constants/app.interface';
@Component<LoginPage>({
  name: 'LoginPage',
})
export default class LoginPage extends Vue {
  private loading: boolean = false;

  public handleSubmit({ email, password }: LoginDTO): void {
    this.loading = true;
    setTimeout(() => {
      try {
        if (email && password) {
          alert(email + '  ' + password);
        } else {
          this.$message.warning('A dau xanh no');
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
  padding-top: $unit-12;
}
</style>
