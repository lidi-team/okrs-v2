<template>
  <el-row class="change-password-page" type="flex" justify="center" align="center">
    <el-col :span="8" class="change-password-page__image">
      <img src="@/assets/images/account/tiny-change-password.png" alt="login image" />
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
@import '@/assets/scss/main.scss';
.change-password-page {
  padding-top: calc(100vh * (2 / 24));
  &__image {
    align-self: center;
    margin-right: $unit-6;
    margin-left: -$unit-40;
  }
}
</style>
