<template>
  <el-row class="login-page" type="flex" justify="center" align="center">
    <el-col :span="8">
      <img src="@/assets/images/account/tiny-login.png" alt="login image" />
    </el-col>
    <el-col :span="8">
      <account-login />
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
@Component<LoginPage>({
  name: 'LoginPage',
})
export default class LoginPage extends Vue {}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
.login-page {
  padding-top: $unit-12;
}
</style>
