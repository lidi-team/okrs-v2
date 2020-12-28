<template>
  <div
    class="-display-flex -justify-content-center -align-items-center -h-100vh"
  >
    <div class="-align-items-center">
      <img src="@/assets/images/account/tiny-login.png" alt="login image" />
    </div>
    <div class="-align-items-center">
      <account-login />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import AccountLogin from '@/components/Account/AccountLogin.vue';
@Component<LoginPage>({
  components: {
    AccountLogin,
  },
  head() {
    return {
      title: 'Đăng nhập',
    };
  },
  middleware: 'isGuest',
  layout: 'empty',
})
export default class LoginPage extends Vue {}
</script>
