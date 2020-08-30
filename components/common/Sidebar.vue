<template>
  <div :class="['wrap-sidebar', { 'hide-nav': isHide }]">
    <div class="btn-group">
      <div class="switch-btn" @click="isHide = !isHide"></div>
    </div>
    <el-row v-if="user" class="sidebar" type="flex" justify="start" align="center">
      <nuxt-link
        :style="`${isHide ? 'margin-top: $unit-8;padding: 0;' : null}`"
        to="/"
        :class="['sidebar__link', { 'nuxt-link-exact-active': isHome }]"
      >
        <div class="sidebar__link__tab">
          <Dashboard class="sidebar__link__tab__icon" />
          <span :class="`${isHide ? 'hidden-tablet' : null}`">Dashboard</span>
        </div>
      </nuxt-link>
      <nuxt-link
        :style="`${isHide ? 'margin-top: $unit-8;padding: 0;' : null}`"
        to="/checkin"
        :class="['sidebar__link', { 'nuxt-link-exact-active': isCheckinActive }]"
      >
        <div class="sidebar__link__tab">
          <Checkin class="sidebar__link__tab__icon" />
          <span :class="`${isHide ? 'hidden-tablet' : null}`">Check-in</span>
        </div>
      </nuxt-link>
      <nuxt-link
        :style="`${isHide ? 'margin-top: $unit-8;padding: 0;' : null}`"
        to="/OKRs"
        :class="['sidebar__link', { 'nuxt-link-exact-active': isOkrsActive }]"
      >
        <div class="sidebar__link__tab">
          <OKRs class="sidebar__link__tab__icon" />
          <span :class="`${isHide ? 'hidden-tablet' : null}`">OKRs</span>
        </div>
      </nuxt-link>
      <nuxt-link
        :style="`${isHide ? 'margin-top: $unit-8;padding: 0;' : null}`"
        to="/CFRs"
        :class="['sidebar__link', { 'nuxt-link-exact-active': isCfrsActive }]"
      >
        <div class="sidebar__link__tab">
          <CFRs class="sidebar__link__tab__icon" />
          <span :class="`${isHide ? 'hidden-tablet' : null}`">CFRs</span>
        </div>
      </nuxt-link>
      <!-- Start Role Permission action -->
      <nuxt-link
        v-if="user.role.name === 'ADMIN'"
        :style="`${isHide ? 'margin-top: $unit-8;padding: 0;' : null}`"
        to="/admin/cai-dat"
        :class="['sidebar__link', { 'nuxt-link-exact-active': isSettingCompanyActive }]"
      >
        <div class="sidebar__link__tab">
          <Setting class="sidebar__link__tab__icon" />
          <p :class="`${isHide ? 'hidden-tablet' : null}`">Cài đặt</p>
          <p :class="`${isHide ? 'hidden-tablet' : null}`">công ty</p>
        </div>
      </nuxt-link>
      <nuxt-link
        v-if="user.role.name === 'HR'"
        :style="`${isHide ? 'margin-top: $unit-8;padding: 0;' : null}`"
        to="/quan-ly/nhan-su"
        :class="['sidebar__link', { 'nuxt-link-exact-active': isHRsActive }]"
      >
        <div class="sidebar__link__tab">
          <human-resources class="sidebar__link__tab__icon" />
          <span :class="`${isHide ? 'hidden-tablet' : null}`">Quản lý nhân sự</span>
        </div>
      </nuxt-link>
      <!-- End Role Permission action -->
    </el-row>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import { RootState } from '@/store/auth';
import Dashboard from '@/assets/images/common/sidebar/dashboard.svg';
import CFRs from '@/assets/images/common/sidebar/cfrs.svg';
import Checkin from '@/assets/images/common/sidebar/checkin.svg';
import OKRs from '@/assets/images/common/sidebar/okrs.svg';
import Setting from '@/assets/images/common/sidebar/setting.svg';
import HumanResources from '@/assets/images/common/sidebar/nhan-su.svg';
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
  },
  computed: {
    ...mapGetters({
      user: GetterState.USER,
    }),
  },
})
export default class SideBar extends Vue {
  private isHide: boolean = false;
  private get isHome() {
    if (this.$route.path === '/' || (this.$route.path === '/' && this.$route.query.cycleId)) {
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
    return !!this.$route.path.startsWith('/OKRs');
  }

  private get isSettingCompanyActive() {
    return !!this.$route.path.startsWith('/admin/cai-dat');
  }

  private get isHRsActive() {
    return !!this.$route.path.startsWith('/quan-ly/nhan-su');
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
  .switch-btn {
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABIklEQVRYR2NkGGDAOMD2M4w6AB4CDTM3c/1jYM5kYPjPS8to+f+f4dOXb4LT+4usvoPsgTugdua2pYwMDFG0tBxh9v/FTenecagOmLF1OyMjowd9HMCwvSndy2vQOaCZkZGxhh4h8P8/Q31zhlcTSgiAOA0ztpr8+c/EQ0tHsDAxfmpI9zgHs2O0HBg8IZA28wyrFOML0z9/mdlomQYYGRl+Mr/gON3Q4PhntCAaXAVR3YxtSxgYGaJpGf9464KGqft5/jD9MKGHA75+5z+JURvSw2JsdgyecmBQhEDt9G2G/xkY+WnpGEaG/x+bM73OY1RGtTO2NTIyMtTR0nKY2Vir49oR3yIaFAXRX+bvGYyM/2naIsLZLKdH4hstiAZlCAAAVGZ+IcIkyAcAAAAASUVORK5CYII=);
    background-size: 16px;
    background-repeat: no-repeat;
    background-position: 50%;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    cursor: pointer;
    background-color: #f2f4f6;
    margin-top: 10px;
    display: block;
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
  width: 60px;
}
.hidden-tablet {
  -webkit-transition: all 0.5s;
  transition: all 0.5s;
  display: none;
}
</style>
