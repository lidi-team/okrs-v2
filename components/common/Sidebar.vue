<template>
  <el-row class="sidebar" type="flex" justify="start" align="center">
    <nuxt-link to="#" class="sidebar__link">
      <div class="sidebar__link__tab">
        <Dashboard class="sidebar__link__tab__icon" />
        <span>Dashboard</span>
      </div>
    </nuxt-link>
    <nuxt-link to="#" class="sidebar__link">
      <div class="sidebar__link__tab">
        <Checkin class="sidebar__link__tab__icon" />
        <span>Check-in</span>
      </div>
    </nuxt-link>
    <nuxt-link to="#" class="sidebar__link">
      <div class="sidebar__link__tab">
        <OKRs class="sidebar__link__tab__icon" />
        <span>OKRs</span>
      </div>
    </nuxt-link>
    <nuxt-link to="#" class="sidebar__link">
      <div class="sidebar__link__tab">
        <CFRs class="sidebar__link__tab__icon" />
        <span>CFRs</span>
      </div>
    </nuxt-link>
    <nuxt-link to="#" class="sidebar__link">
      <div v-if="userRole === 'ADMIN'" class="sidebar__link__tab">
        <Setting class="sidebar__link__tab__icon" />
        <span>Cài đặt công ty</span>
      </div>
    </nuxt-link>

    <!-- Start Role Permission action -->

    <div v-if="userRole === 'HR'" class="sidebar__link__tab">
      <human-resources class="sidebar__link__tab__icon" />
      <span>Quản lý nhân sự</span>
    </div>
    <!-- End Role Permission action -->
  </el-row>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { SidebarTabs } from '@/constants/app.enum';
import Dashboard from '@/assets/images/common/dashboard.svg';
import CFRs from '@/assets/images/common/cfrs.svg';
import Checkin from '@/assets/images/common/checkin.svg';
import OKRs from '@/assets/images/common/okrs.svg';
import Setting from '@/assets/images/common/setting.svg';
import HumanResources from '@/assets/images/common/nhan-su.svg';
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
})
export default class SideBar extends Vue {
  private userRole = 'ADMIN';
  private currentTab = SidebarTabs.Dashboar;
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
.sidebar {
  flex-direction: column;
  height: 100%;
  font-size: $unit-6;
  color: $purple-primary-2;
  box-shadow: $box-shadow-default;
  background-color: $white;
  &__link {
    width: 60%;
    align-self: center;
    color: $purple-primary-2;
    margin-top: $unit-8;
    padding: $unit-4;
    transition: all 0.2s ease-in-out;
    &:hover {
      transform: scale(1.005);
      box-shadow: $box-shadow-default;
      border-radius: $border-radius-large;
      background-color: $purple-primary-2;
      color: $purple-primary-4;
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
      span {
        font-size: $unit-5;
      }
    }
  }
}
</style>
