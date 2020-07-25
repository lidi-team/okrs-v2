<template>
  <div class="header">
    <div class="header__logo">
      <nuxt-link to="/"><img src="~/assets/images/common/logo.png" alt="logo" /></nuxt-link>
    </div>
    <div class="header__info side-right">
      <div class="side-right__list">
        <el-dropdown class="side-right__item" trigger="click">
          <i class="el-icon-message-solid"></i>
          <div v-show="show" class="item__dot"></div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <span>Bạn có thông báo</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown class="side-right__item item" trigger="click">
          <div class="item__wrapper">
            <img src="https://avatars3.githubusercontent.com/u/23659823?s=40&v=4" alt="avatar" class="item__avatar" />
            <div class="item__info info">
              <span class="info__name">Đỗ Quang Hiệp<i class="el-icon-caret-bottom" /></span><span class="info__role">Admin</span>
            </div>
          </div>
          <el-dropdown-menu slot="dropdown">
            <nuxt-link to="/thong-tin-tai-khoan">
              <el-dropdown-item><fa icon="user-circle" class="item__icon" /><span>Thông tin tài khoản</span></el-dropdown-item>
            </nuxt-link>
            <nuxt-link to="/quan-ly/nhan-su">
              <el-dropdown-item><fa icon="user-friends" class="item__icon" /><span>Quản lý nhân sự</span></el-dropdown-item>
            </nuxt-link>
            <nuxt-link to="/doi-mat-khau">
              <el-dropdown-item>
                <svg class="item__icon" width="14" height="14" viewBox="0 0 14 14" fill="#637381" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M4.80751 5.10075C7.41584 4.58409 9.74918 6.09242 10.5408 8.33409H17.4992C18.4158 8.33409 19.1658 9.08409 19.1658 10.0008C19.1658 10.9174 18.4158 11.6674 17.4992 11.6674V13.3341C17.4992 14.2508 16.7492 15.0008 15.8325 15.0008C14.9158 15.0008 14.1658 14.2508 14.1658 13.3341V11.6674H10.5408C9.85751 13.6091 8.00751 15.0008 5.83251 15.0008C2.71584 15.0008 0.265843 12.1424 0.949177 8.91742C1.34918 7.00909 2.89918 5.48409 4.80751 5.10075ZM4.16583 10.0008C4.16583 10.9174 4.91583 11.6674 5.8325 11.6674C6.74917 11.6674 7.49917 10.9174 7.49917 10.0008C7.49917 9.08411 6.74917 8.33411 5.8325 8.33411C4.91583 8.33411 4.16583 9.08411 4.16583 10.0008Z"
                    fill="#637381"
                  /></svg
                ><span>Đổi mật khẩu</span>
              </el-dropdown-item>
            </nuxt-link>
            <el-dropdown-item divided><fa icon="power-off" class="item__icon" /><span>Đăng xuất</span></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
@Component<Navbar>({
  name: 'Navbar',
})
export default class Navbar extends Vue {
  private dialogVisible: boolean = false;
  private changePasswordDialogVisible: boolean = false;
  private show: boolean = true;

  private displayDialogChangePassword(): void {
    console.log(this.changePasswordDialogVisible);
    this.changePasswordDialogVisible = true;
    console.log(this.changePasswordDialogVisible);
  }

  private handleClose(done) {
    this.$confirm('Are you sure to close this dialog?')
      .then((_) => {
        done();
      })
      .catch((_) => {});
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
.header {
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 99;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  padding: 0 $unit-10 0 $unit-5;
  background-color: $purple-primary-5;

  @include breakpoint-down(phone) {
    padding: 0 $unit-4;
  }
}

.side-right {
  &__list {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__item {
    .el-icon-message-solid {
      cursor: pointer;
      color: $white;
    }
  }
}
.item {
  margin: 0 $unit-4;
  height: 100%;
  vertical-align: text-bottom;
  cursor: pointer;
  position: relative;

  &__dot {
    background-color: $red-primary-1;
    width: $unit-2;
    height: $unit-2;
    border-radius: $border-radius-large;
    position: absolute;
    bottom: 80%;
    left: 65%;
  }

  &__icon {
    display: inline-block;
    width: $unit-6;
    margin-right: $unit-3;
    color: $neutral-primary-2;
  }

  &__wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    .el-icon-caret-bottom {
      cursor: pointer;
      font-size: $text-xs;
    }
  }

  &__info {
    span {
      display: block;
      color: $white;
      margin-left: $unit-1;
    }
  }

  &__avatar {
    cursor: pointer;
    width: $unit-8;
    height: $unit-8;
    border-radius: $border-radius-large;
  }
}

.info {
  &__name {
    font-size: $text-xs;
    font-weight: $font-weight-base;
  }
  &__role {
    font-size: $text-xs;
    font-weight: $font-weight-light;
  }
}
.el-dropdown-menu__item {
  font-size: $text-sm;
}

.el-dropdown-menu__item:focus,
.el-dropdown-menu__item:not(.is-disabled):hover {
  background-color: $purple-primary-0;
  color: $neutral-primary-3;
}

.nuxt-link-exact-active {
  .el-dropdown-menu__item {
    background-color: $purple-primary-0;
  }
}
</style>
