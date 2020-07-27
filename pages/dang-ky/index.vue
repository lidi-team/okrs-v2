<template>
  <el-row class="register-page" type="flex" justify="center" align="center">
    <el-col :span="8" class="register-page__image">
      <img src="@/assets/images/account/tiny-register.png" alt="register image" />
    </el-col>
    <el-col :span="7">
      <account-register :token="token" />
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Notification } from 'element-ui';
import AuthRepository from '@/repositories/AuthRepository';

@Component<LoginPage>({
  name: 'LoginPage',
  middleware: 'isGuest',
  layout: 'empty',
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
          title: 'Trạng thái',
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
export default class LoginPage extends Vue {}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
.register-page {
  padding-top: $unit-12;
  align-content: center;
  &__image {
    align-self: center;
  }
}
</style>
