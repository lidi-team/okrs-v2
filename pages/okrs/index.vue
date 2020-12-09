<template>
  <div class="okrs-page">
    <el-select
      v-model="currentCycleId"
      no-match-text="Không tìm thấy chu kỳ"
      filterable
      placeholder="Chọn chu kỳ"
      @change="handleSelectCycle(currentCycleId)"
    >
      <el-option
        v-for="cycle in cycles"
        :key="cycle.id"
        :label="`Chu kỳ: ${cycle.name}`"
        :value="String(cycle.id)"
      />
    </el-select>
    <div>
      <item-okrs
        v-for="item in projects"
        :key="item.id"
        :loading="loading"
        :project-id="item.id"
        :type-objective="2"
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
      <detail-keyresult
        v-if="visibleDetailKrs"
        :list-krs="listKrs"
        :visible-detail-krs.sync="visibleDetailKrs"
      />
    </transition>
  </div>
</template>
<script lang="ts">
import { mapGetters } from 'vuex';
import { Component, Vue, Watch } from 'vue-property-decorator';
import {
  MutationState,
  DispatchAction,
  GetterState,
} from '@/constants/app.vuex';

import ItemOkrs from '@/components/okrs/ItemOkrs.vue';
import DetailKeyresult from '@/components/okrs/dialog/DetailKeyresult.vue';
import AddOkrs from '@/components/okrs/add-update/index.vue';

import OkrsRepository from '@/repositories/OkrsRepository';
import CycleRepository from '@/repositories/CycleRepository';

@Component<OKRsPage>({
  name: 'OKRsPage',
  components: {
    ItemOkrs,
    DetailKeyresult,
    AddOkrs,
  },
  head() {
    return {
      title: 'OKRs',
    };
  },
  computed: {
    ...mapGetters({
      flag: GetterState.OKRS_FLAG,
    }),
  },
  created() {
    if (!this.$route.query.cycleId) {
      this.$router.push(`?cycleId=${this.$store.state.cycle.cycleCurrent.id}`);
      this.currentCycleId = this.$store.state.cycle.cycleCurrent.id;
    }
  },
  async mounted() {
    this.currentCycleId = this.$route.query.cycleId;
    await this.getDashBoardOkrs();
    await this.getCycles();
  },
})
export default class OKRsPage extends Vue {
  private loading: boolean = false;
  private isCompanyOkrs: boolean = false;
  private visibleCreateOkrsDialog = false;
  private listKrs: any[] = [];
  private cycles: any[] = [];
  private visibleDetailKrs: boolean = false;
  private currentCycleId: string = '';

  private openDrawer(keyResults: any) {
    this.listKrs = keyResults;
    this.visibleDetailKrs = true;
  }
  private projects: any[] = [];

  @Watch('$route.query')
  private async changeDialog(value) {
    await this.getDashBoardOkrs();
  }

  private async getCycles() {
    const { data } = await CycleRepository.getListMetadata();
    this.cycles = data || [];
  }

  private async getDashBoardOkrs() {
    try {
      const { data } = await OkrsRepository.getListOkrsByCycleId(
        this.$route.query.cycleId
          ? Number(this.$route.query.cycleId)
          : Number(this.$store.state.cycle.cycleCurrent.id),
      );
      this.projects = Object.freeze(data);
      this.loading = false;
    } catch (error) {
      setTimeout(() => {
        this.loading = false;
      }, 500);
    }
  }

  private handleSelectCycle(cycleId) {
    this.$router.push(`?cycleId=${cycleId}`);
  }
}
</script>
<style lang="scss">
@import '@/assets/scss/main.scss';
.okrs-page {
  width: 100%;
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
