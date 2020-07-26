<template>
  <el-row class="reset-password-page" type="flex" justify="center" align="center">
    <el-col :span="8">
      <img src="@/assets/images/account/tiny-reset-password.png" alt="reset password image" />
    </el-col>
    <el-col :span="8">
      <account-reset-password :token="token" />
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Notification } from 'element-ui';
import AuthRepository from '@/repositories/AuthRepository';
@Component<ResetPasswordPage>({
  name: 'ResetPasswordPage',
  middleware: 'isGuest',
  watchQuery: ['token'],
  async asyncData({ query, redirect }) {
    if (query.token) {
      try {
        await AuthRepository.verifyLinkInvite(query.token);
        return {
          token: query.token,
        };
      } catch (error) {
        Notification({
          title: 'Status',
          message: 'Token không chính xác. Vui lòng kiểm tra lại',
          type: 'error',
          duration: 2000,
        });
        redirect('/dang-nhap');
      }
    } else {
      redirect('/dang-nhap');
    }
  },
})
export default class ResetPasswordPage extends Vue {}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
.reset-password-page {
  padding-top: calc(100vh * (3 / 24));
}
</style>
