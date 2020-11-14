<template>
  <div v-loading="loadingComponent" class="okrs-page" ref="okrs">
    <!-- <el-row class="okrs-page__top" type="flex" justify="space-between">
      <el-col :xs="24" :sm="24" :md="12" :lg="12" class="okrs-page__top--searching">
        <common-top-search-cycle @changeCycleData="changeCycleData($event)" />
      </el-col>
      <el-col :xs="24" :sm="24" :md="8" :lg="8" class="okrs-page__top--button">
        <el-button v-if="isNotAdminButton()" class="el-button el-button--purple el-button-medium" icon="el-icon-plus" @click="addPersonalOkrs"
          >Tạo OKRs</el-button
        >
        <el-popover v-else v-model="visible" placement="bottom" width="160">
          <div style="text-align: center;">
            <el-button class="okrs-page__item el-button el-button--white el-button--small" @click="handleCommand('personal')"
              >Tạo OKRs cá nhân</el-button
            >
            <el-button class="okrs-page__item el-button el-button--white el-button--small" @click="handleCommand('company')"
              >Tạo OKRs công ty</el-button
            >
          </div>
          <el-button slot="reference" class="el-button el-button--purple el-button-medium" icon="el-icon-plus">Tạo OKRs</el-button>
        </el-popover>
      </el-col>
    </el-row>-->
    <div v-loading="loadingForm">
      <item-okrs
        v-for="item in projects"
        :key="item.id"
        :project-id="item.id"
        :type-objective="2"
        name-objective="cá nhân"
        :title="item.name"
        :objectives="item.objectives"
        :is-manage="item.pm"
        :reload-data="getDashBoardOkrs"
        @openDrawer="openDrawer($event)"
      />
    </div>
    <transition name="el-fade-in">
      <add-okrs />
    </transition>
    <transition name="el-fade-in">
      <create-okrs-dialog
        v-if="visibleCreateOkrsDialog"
        :is-company-okrs="isCompanyOkrs"
        :visible-dialog.sync="visibleCreateOkrsDialog"
        :reload-data="getDashBoardOkrs"
      />
    </transition>
    <transition name="el-zoom-in-center">
      <detail-keyresult v-if="visibleDetailKrs" :list-krs="listKrs" :visible-detail-krs.sync="visibleDetailKrs" />
    </transition>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { MutationState, DispatchAction } from '@/constants/app.vuex';
import OkrsRepository from '@/repositories/OkrsRepository';
// components
import CommonTopSearchCycle from '@/components/common/TopSearchCycle.vue';
import ItemOkrs from '@/components/okrs/ItemOkrs.vue';
import DetailKeyresult from '@/components/okrs/dialog/DetailKeyresult.vue';
import AddOkrs from '@/components/okrs/items/add/index.vue';

@Component<OKRsPage>({
  name: 'OKRsPage',
  components: {
    CommonTopSearchCycle,
    ItemOkrs,
    DetailKeyresult,
    AddOkrs,
  },
  head() {
    return {
      title: 'OKRs',
    };
  },
  async created() {
    await this.getDashBoardOkrs();
  },
})
export default class OKRsPage extends Vue {
  private loadingForm: boolean = false;
  private isCompanyOkrs: boolean = false;
  private loadingComponent: boolean = false;
  private visibleCreateOkrsDialog = false;
  private visible: boolean = false;
  private listKrs: any[] = [];
  private visibleDetailKrs: boolean = false;

  private openDrawer(keyResults: any) {
    this.listKrs = keyResults;
    this.visibleDetailKrs = true;
  }

  private addPersonalOkrs() {
    this.isCompanyOkrs = false;
    this.visibleCreateOkrsDialog = true;
  }

  private projects: any[] = [];

  @Watch('$store.state.user.tempUser.id', { immediate: false })
  private async getDashboarUser(userId: number) {
    await this.getDashBoardOkrs(userId);
  }

  private async getDashBoardOkrs(
    userId: number = this.$store.state.user.tempUser ? this.$store.state.user.tempUser.id : this.$store.state.auth.user.id,
  ) {
    // this.loadingForm = true;
    try {
      // const cycleId = this.$store.state.cycle.cycleTemp ? this.$store.state.cycle.cycleTemp : this.$store.state.cycle.cycle.id;
      // const { data } = await OkrsRepository.getOkrsDashboard(cycleId, userId);
      const { data } = await OkrsRepository.getListOkrsByCycleId(3);
      console.log('hello', data);
      this.projects = Object.freeze(data);
      this.loadingForm = false;
      // if (this.$store.state.user.tempUser) {
      //   if (this.$store.state.user.tempUser.role.name === 'ADMIN') {
      //     this.itemOKRsData[1].tableData = null;
      //   } else {
      //     this.itemOKRsData[1].tableData = Object.freeze(data.data.team);
      //   }
      // } else if (this.$store.state.auth.user.role.name !== 'ADMIN') {
      //   this.itemOKRsData[1].tableData = Object.freeze(data.data.team);
      // }
      // this.itemOKRsData[2].tableData = Object.freeze(data.data.personal);
      // setTimeout(() => {
      //   this.loadingForm = false;
      // }, 500);
    } catch (error) {
      setTimeout(() => {
        this.loadingForm = false;
      }, 500);
    }
  }

  private async changeCycleData(userId: number) {
    await this.getDashBoardOkrs(userId);
  }
}
</script>
<style lang="scss">
@import '@/assets/scss/main.scss';
.okrs-page {
  width: 98%;
  &__top {
    @include breakpoint-down(phone) {
      flex-direction: column;
    }
    &--button {
      display: flex;
      justify-content: flex-end;
      @include breakpoint-down(phone) {
        justify-content: center;
      }
    }
  }
  &__item {
    &:first-child {
      padding: 1rem 1.6rem 1rem 1.6rem;
      border: unset;
      border-bottom-left-radius: unset;
      border-bottom-right-radius: unset;
      border-bottom: 1px solid $purple-primary-1;
      margin-top: 1px;
    }
    &:last-child {
      padding: 1rem 1.6rem 1rem 1.8rem;
      margin: 0;
      border: unset;
      border-top-left-radius: unset;
      border-top-right-radius: unset;
    }
  }
  .el-table__empty-block {
    width: 100% !important;
  }
}
.create-okr-dropdown {
  color: $neutral-primary-4;
}
</style>
