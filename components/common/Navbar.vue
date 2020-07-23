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
            <nuxt-link to="/">
              <el-dropdown-item><fa icon="user-circle" class="item__icon" />Thông tin tài khoản</el-dropdown-item>
            </nuxt-link>
            <nuxt-link to="/quan-ly/nhan-su">
              <el-dropdown-item><fa icon="user-friends" class="item__icon" />Quản lý nhân sự</el-dropdown-item>
            </nuxt-link>
            <el-dropdown-item divided><fa icon="power-off" class="item__icon" />Đăng xuất</el-dropdown-item>
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
  private show: boolean = true;
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
    width: $unit-4;
    margin-right: $unit-1;
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
