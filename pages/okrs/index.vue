<template>
  <div class="okrs-page">
    <div class="-display-flex -justify-content-between">
      <h1 class="-title-1">OKRs</h1>
      <el-select
        class="-mb-3 el-input--title"
        v-model="currentCycleId"
        no-match-text="Không tìm thấy chu kỳ"
        filterable
        placeholder="Chọn chu kỳ"
        loading-text="Đang tải chu kỳ"
        @change="handleSelectCycle(currentCycleId)"
      >
        <el-option
          v-for="cycle in cycles"
          :key="cycle.id"
          :label="`Chu kỳ: ${cycle.name}`"
          :value="String(cycle.id)"
        />
      </el-select>
    </div>
    <el-button
      v-if="roles.includes('ROLE_DIRECTOR')"
      class="el-button--purple el-button--modal el-button--invite -ml-2"
      icon="el-icon-plus"
      @click="handleAddRootOKRs"
    >
      Tạo OKR công ty
    </el-button>
    <item-okrs
      :loading="loading"
      title="OKRs công ty"
      :remove="true"
      :objectives="okrsCompany"
      :reload-data="getDashBoardOkrs"
      @openDrawer="openDrawer($event)"
      :is-director="roles.includes('ROLE_DIRECTOR')"
      is-company-okr
    />
    <p v-if="!projects">Bạn đang không tham gia dự án nào</p>
    <div v-else>
      <item-okrs
        v-for="item in projects"
        :key="item.id"
        :loading="loading"
        :project-id="item.id"
        :title="item.name"
        :objectives="item.objectives"
        :is-manage="item.pm"
        :reload-data="getDashBoardOkrs"
        :remove="item.remove"
        @openDrawer="openDrawer($event)"
      />
    </div>
    <transition name="el-zoom-in-center">
      <add-okrs />
    </transition>
    <transition name="el-zoom-in-center">
      <root-okrs-dialog
        :is-visible.sync="isVisibleDialog"
        :reload-data="getDashBoardOkrs"
      />
    </transition>
    <transition name="el-zoom-in-center">
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
import { MutationState, GetterState } from '@/constants/app.vuex';
import OkrsRepository from '@/repositories/OkrsRepository';
import CycleRepository from '@/repositories/CycleRepository';
import AddOkrs from '@/components/OKRs/OkrsKeyResult/index.vue';
import ItemOkrs from '@/components/OKRs/OkrsItems/index.vue';
import DetailKeyresult from '@/components/OKRs/OkrsDialog/OkrsDialogCompany.vue';
import RootOkrsDialog from '@/components/OKRs/OkrsDialog/OkrsDialogCompany.vue';

@Component<OKRsPage>({
  name: 'OKRsPage',
  components: {
    ItemOkrs,
    DetailKeyresult,
    AddOkrs,
    RootOkrsDialog,
  },
  head() {
    return {
      title: 'OKRs',
    };
  },
  computed: {
    ...mapGetters({
      flag: GetterState.OKRS_FLAG,
      roles: GetterState.USER_ROLES,
    }),
  },
  created() {
    if (!this.$route.query.cycleId) {
      return this.$router.push(
        `?cycleId=${this.$store.state.cycle.cycleCurrent}`,
      );
    }
  },
  async mounted() {
    this.currentCycleId =
      this.$route.query.cycleId || String(this.$store.state.cycle.cycleCurrent);
    this.$store.commit(MutationState.SET_CURRENT_CYCLE, this.currentCycleId);
    await this.getDashBoardOkrs();
    await this.getCycles();
  },
})
export default class OKRsPage extends Vue {
  private loading: boolean = false;
  private isCompanyOkrs: boolean = false;
  private visibleCreateOkrsDialog: boolean = false;
  private listKrs: any[] = [];
  private cycles: any[] = [];
  private visibleDetailKrs: boolean = false;
  private currentCycleId: any = '';
  private projects: any[] = [];
  private isVisibleDialog: boolean = false;
  private okrsCompany: any[] = [];

  private openDrawer(keyResults: any) {
    this.listKrs = keyResults;
    this.visibleDetailKrs = true;
  }

  @Watch('$route.query')
  private async changeDialog() {
    await this.getDashBoardOkrs();
  }
  @Watch('flag')
  private async changeReload() {
    await this.getDashBoardOkrs();
  }

  @Watch('loading')
  private async changeLoading(value: any) {
    if (value === true) {
      this.currentCycleId = 'Đang tải...';
    } else {
      this.currentCycleId =
        this.$route.query.cycleId ||
        String(this.$store.state.cycle.cycleCurrent);
    }
  }

  private async getCycles() {
    this.loading = true;
    const { data } = await CycleRepository.getListMetadata();
    this.cycles = data || [];
    this.loading = false;
  }

  private async getDashBoardOkrs() {
    this.loading = true;
    const { data } = await OkrsRepository.getListOkrsByCycleId(
      this.$route.query.cycleId
        ? this.$route.query.cycleId
        : this.$store.state.cycle.cycleCurrent,
    );
    this.projects = Object.freeze(data);
    const res = await OkrsRepository.getObjectiveCompany({
      cycleId: this.$route.query.cycleId
        ? this.$route.query.cycleId
        : this.$store.state.cycle.cycleCurrent,
    });
    this.okrsCompany = res.data;
    this.loading = false;
  }

  private handleSelectCycle(cycleId) {
    this.$store.commit(MutationState.SET_CURRENT_CYCLE, cycleId);
    this.$router.push(`?cycleId=${cycleId}`);
  }

  private handleAddRootOKRs() {
    this.isVisibleDialog = true;
  }
}
</script>

<style lang="scss" scoped>
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
  .btn-create-objective-company {
    margin-top: 1rem;
    width: 100%;
  }
}
.create-okr-dropdown {
  color: $neutral-primary-4;
}
</style>
