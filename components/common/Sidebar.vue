<template>
  <div class="wrap-sidebar">
    <el-row
      v-if="user"
      class="sidebar"
      type="flex"
      justify="start"
      align="center"
    >
      <nuxt-link
        to="/"
        :class="['sidebar__link', { 'nuxt-link-exact-active': isHome }]"
      >
        <div class="sidebar__link__tab">
          <Dashboard class="sidebar__link__tab__icon" />
          <span class="hidden-tablet">Trang chủ</span>
        </div>
      </nuxt-link>
      <nuxt-link
        to="/checkin"
        :class="[
          'sidebar__link',
          { 'nuxt-link-exact-active': isCheckinActive },
        ]"
      >
        <div class="sidebar__link__tab">
          <Checkin class="sidebar__link__tab__icon" />
          <span class="hidden-tablet">Cập nhật</span>
          <span class="hidden-tablet">Tiến độ</span>
        </div>
      </nuxt-link>
      <nuxt-link
        to="/okrs"
        :class="['sidebar__link', { 'nuxt-link-exact-active': isOkrsActive }]"
      >
        <div class="sidebar__link__tab">
          <OKRs class="sidebar__link__tab__icon" />
          <span class="hidden-tablet">OKRs</span>
        </div>
      </nuxt-link>
      <nuxt-link
        to="/CFRs"
        :class="['sidebar__link', { 'nuxt-link-exact-active': isCfrsActive }]"
      >
        <div class="sidebar__link__tab">
          <CFRs class="sidebar__link__tab__icon" />
          <p class="hidden-tablet">Ghi nhận &</p>
          <p class="hidden-tablet">Phản hồi</p>
        </div>
      </nuxt-link>
      <nuxt-link
        v-if="
          user.roles.includes('ROLE_DIRECTOR') ||
          user.roles.includes('ROLE_ADMIN')
        "
        to="/admin/cai-dat"
        :class="[
          'sidebar__link',
          { 'nuxt-link-exact-active': isSettingCompanyActive },
        ]"
      >
        <div class="sidebar__link__tab">
          <Setting class="sidebar__link__tab__icon" />
          <p class="hidden-tablet">Cài đặt</p>
          <p class="hidden-tablet">công ty</p>
        </div>
      </nuxt-link>
      <nuxt-link
        v-if="
          user.projects.length ||
          user.roles.includes('ROLE_DIRECTOR') ||
          user.roles.includes('ROLE_ADMIN')
        "
        to="/du-an"
        :class="[
          'sidebar__link',
          { 'nuxt-link-exact-active': isSettingProjectActive },
        ]"
      >
        <div class="sidebar__link__tab">
          <project-manage class="sidebar__link__tab__icon" />
          <p class="hidden-tablet">Quản lý</p>
          <p class="hidden-tablet">dự án</p>
        </div>
      </nuxt-link>
      <nuxt-link
        v-if="
          user.roles.includes('ROLE_DIRECTOR') ||
          user.roles.includes('ROLE_ADMIN') ||
          user.roles.includes('ROLE_ADMIN_HR')
        "
        to="/nhan-su"
        :class="['sidebar__link', { 'nuxt-link-exact-active': isHRsActive }]"
      >
        <div class="sidebar__link__tab">
          <human-resources class="sidebar__link__tab__icon" />
          <span>Quản lý nhân sự</span>
        </div>
      </nuxt-link>
      <!-- End Role Permission action -->
    </el-row>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import Dashboard from '@/assets/images/common/sidebar/dashboard.svg';
import CFRs from '@/assets/images/common/sidebar/cfrs.svg';
import Checkin from '@/assets/images/common/sidebar/checkin.svg';
import OKRs from '@/assets/images/common/sidebar/okrs.svg';
import Setting from '@/assets/images/common/sidebar/setting.svg';
import HumanResources from '@/assets/images/common/sidebar/nhan-su.svg';
import ProjectManage from '@/assets/images/common/sidebar/project.svg';
import { GetterState } from '@/constants/app.vuex';

@Component<SideBar>({
  name: 'SideBar',
  components: {
    Dashboard,
    CFRs,
    Checkin,
    OKRs,
    Setting,
    HumanResources,
    ProjectManage,
  },
  computed: {
    ...mapGetters({
      user: GetterState.USER,
      cycleCurrent: GetterState.CYCLE_CURRENT,
    }),
  },
})
export default class SideBar extends Vue {
  private get isHome() {
    if (
      this.$route.path === '/' ||
      (this.$route.path === '/' && this.$route.query.cycleId)
    ) {
      return true;
    }
  }

  private get isCfrsActive() {
    return !!this.$route.path.startsWith('/CFRs');
  }

  private get isCheckinActive() {
    return !!this.$route.path.startsWith('/checkin');
  }

  private get isOkrsActive() {
    return !!this.$route.path.startsWith(
      `/okrs?cycleId=${this.$store.state.cycle.cycleCurrent}`,
    );
  }

  private get isSettingCompanyActive() {
    return !!this.$route.path.startsWith('/admin/cai-dat');
  }

  private get isSettingProjectActive() {
    return !!this.$route.path.startsWith('/du-an');
  }

  private get isHRsActive() {
    return !!this.$route.path.startsWith('/nhan-su');
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/main.scss';

.wrap-sidebar {
  height: 100%;
  -webkit-transition: all 0.5s;
  transition: all 0.5s;
  position: relative;
  z-index: 99;
  width: 160px;
  background-color: $white;
  border-right: 1px $purple-primary-7 solid;
  @include breakpoint-down(tablet) {
    width: 60px;
  }

  .btn-group {
    position: absolute;
    left: 100%;
    top: 0;
    -webkit-transform: translateX(10px);
    transform: translateX(10px);
  }

  .sidebar {
    flex-direction: column;
    height: 100%;
    overflow: auto;
    font-size: $unit-6;
    color: $purple-primary-2;
    box-shadow: $box-shadow-default;

    .nuxt-link-exact-active {
      @include sidebar-hover;
    }

    &__link {
      width: 65%;
      align-self: center;
      color: $purple-primary-2;
      padding: 0.75rem 0.5rem 0.35rem 0.5rem;
      transition: all 0.2s ease-in-out;
      margin: $unit-6 0 0 0;
      @include breakpoint-down(tablet) {
        margin-top: $unit-8;
        padding: 0;
      }

      &:hover {
        @include sidebar-hover;
      }

      &__tab {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;

        span,
        p {
          font-size: $unit-4;
        }

        &__icon {
          @include size($unit-10, $unit-10);
        }
      }
    }
  }
}

.hide-nav {
  margin-left: -160px;
  @include breakpoint-down(tablet) {
    margin-left: -60px;
  }
}

.hidden-tablet {
  @include breakpoint-down(tablet) {
    display: none;
  }
}
</style>
