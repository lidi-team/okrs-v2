<template>
  <div class="wrap-sidebar">
    <div v-if="user" class="sidebar" type="flex">
      <div></div>
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
          <span class="hidden-tablet">Cập nhật tiến độ</span>
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
          <p class="hidden-tablet">Ghi nhận & Phản hồi</p>
        </div>
      </nuxt-link>
      <nuxt-link
        v-if="user.roles.includes('ROLE_ADMIN')"
        to="/admin/cai-dat"
        :class="[
          'sidebar__link',
          { 'nuxt-link-exact-active': isSettingCompanyActive },
        ]"
      >
        <div class="sidebar__link__tab">
          <Setting class="sidebar__link__tab__icon" />
          <p class="hidden-tablet">Cài đặt công ty</p>
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
          <p class="hidden-tablet">
            {{
              user.roles.includes('ROLE_ADMIN')
                ? 'Quản lý dự án'
                : 'Dự án của tôi'
            }}
          </p>
        </div>
      </nuxt-link>
      <nuxt-link
        v-if="
          user.roles.includes('ROLE_DIRECTOR') ||
          user.roles.includes('ROLE_ADMIN') ||
          user.roles.includes('ROLE_HR')
        "
        to="/nhan-su"
        :class="['sidebar__link', { 'nuxt-link-exact-active': isHRsActive }]"
      >
        <div class="sidebar__link__tab">
          <human-resources class="sidebar__link__tab__icon" />
          <span>Quản lý nhân sự</span>
        </div>
      </nuxt-link>
    </div>
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
import HumanResources from '@/assets/images/common/sidebar/account.svg';
import ProjectManage from '@/assets/images/common/sidebar/project.svg';
import { GetterState } from '@/constants/app.vuex';

@Component<SideBar>({
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
    return !!this.$route.path.startsWith('/okrs');
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
  width: 130px;
  background-color: #6b062e;
  border-right: 1px $purple-primary-7 solid;

  .btn-group {
    position: absolute;
    left: 100%;
    top: 0;
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
      transform: scale(1.005);
      box-shadow: $box-shadow-default;
      border-radius: 10px;
      color: white;
      g {
        fill-opacity: 1;
      }
      path {
        fill-opacity: 1;
      }
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
        transform: scale(1.005);
        box-shadow: $box-shadow-default;
        border-radius: 10px;
        color: white;
        g {
          fill-opacity: 1;
        }
        path {
          fill-opacity: 1;
        }
      }

      &__tab {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;

        span,
        p {
          font-size: 13px;
          margin-top: 10px;
          width: 85px;
          text-transform: uppercase;
          font-weight: bold;
        }

        &__icon {
          @include size(50px, 50px);
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
