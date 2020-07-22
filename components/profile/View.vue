<template>
  <div class="container">
    <h2>Thông tin tài khoản của bạn</h2>
    <el-form ref="profileForm" class="profile" :status-icon="false" :hide-required-asterisk="false" label-width="150px" label-position="top">
      <el-row>
        <el-col :xs="24" :sm="6" :md="6" :lg="6" :xl="6" class="profile-left">
          <el-avatar :size="60" src="https://empty" @error="errorHandler">
            <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
          </el-avatar>
          <p class="profile-left__name">Nguyễn Phương Hồng Thủy</p>
          <p class="profile-left_role">ADMIN</p>
        </el-col>
        <el-col :xs="24" :sm="18" :md="18" :lg="18" :xl="18" class="profile-right">
          <div class="profile-common">
            <h3 class="profile-common__title">Thông tin chung</h3>
            <div class="profile-common__row">
              <el-form-item class="form" prop="email" label="Họ và tên">
                <el-input value="Pham Ngoc Hoa" class="form__input" placeholder="Nhập vào họ và tên"></el-input>
              </el-form-item>
              <el-form-item prop="password" label="Giới tính">
                <el-radio label="1">Option A</el-radio>
                <el-radio selected label="2">Option B</el-radio>
              </el-form-item>
            </div>
            <div class="profile-common__row">
              <el-form-item class="form" prop="email" label="Tên đăng nhập">
                <el-input value="Pham Ngoc Hoa" class="form__input" placeholder="Tên đăng nhập hoặc email"></el-input>
              </el-form-item>
              <el-form-item prop="password" label="Mật khẩu">
                <el-input value="thaycacacs" show-password placeholder="Nhật mật khẩu"></el-input>
              </el-form-item>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Provide } from 'nuxt-property-decorator';
@Component<ViewProfile>({
  name: 'ViewProfile',
})
export default class ViewProfile extends Vue {}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
.container {
  padding: $unit-12;
}
.profile-left {
  display: flex;
  align-items: center;
  flex-direction: column;
  text-align: center;
}
.profile-common {
  width: 100%;
  &__title {
    color: red;
  }
  &__row {
    display: flex;
    .el-form-item {
      width: 100%;
      &:first-child {
        margin-right: $unit-8;
      }
    }
  }
}
</style>
