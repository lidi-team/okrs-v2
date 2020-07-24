<template>
  <el-row class="change-password-page" type="flex" justify="center" align="center">
    <el-col :span="8" class="login-page__image">
      <img src="@/assets/images/account/tiny-login.png" alt="login image" />
    </el-col>
    <el-col :span="7">
      <account-change-password />
    </el-col>
  </el-row>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
@Component<ChangePasswordPage>({ name: 'ChangePasswordPage' })
export default class ChangePasswordPage extends Vue {}
</script>
<style lang="scss" scoped>
.change-password-page {
  padding-top: calc(100vh * (3 / 24));
  &__image {
    align-self: center;
  }
}
</style>
