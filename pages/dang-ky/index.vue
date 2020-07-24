<template>
  <el-row class="register-page" type="flex" justify="center" align="center">
    <el-col :span="8" class="register-page__image">
      <img src="@/assets/images/account/tiny-register.png" alt="register image" />
    </el-col>
    <el-col :span="7">
      <account-register />
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
@Component<LoginPage>({
  name: 'LoginPage',
  // middleware: 'isGuest',
  layout: 'empty',
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
