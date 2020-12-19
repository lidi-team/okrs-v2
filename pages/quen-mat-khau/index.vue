<template>
<div class="-display-flex -justify-content-center -align-items-center -h-100vh">
    <div class="-align-items-center">
      <img src="@/assets/images/account/tiny-forgot-password.png" alt="login image" />
    </div>
    <div class="-align-items-center">
      <account-forgot-password class="box-wrap"/>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import AccountForgotPassword from '@/components/account/ForgotPassword.vue';
@Component<ForgotPasswordPage>({
  name: 'ForgotPasswordPage',
  layout: 'empty',
  middleware: 'isGuest',
  components: {
    AccountForgotPassword,
  },
  head() {
    return {
      title: 'Quên mật khẩu',
    };
  },
})
export default class ForgotPasswordPage extends Vue {}
</script>
