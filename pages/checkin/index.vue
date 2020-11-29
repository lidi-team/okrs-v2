<template>
  <div class="checkins">
    <el-select
      v-model="currentCycleId"
      no-match-text="Không tìm thấy chu kỳ"
      filterable
      placeholder="Chọn chu kỳ"
      @change="handleSelectCycle(currentCycleId)"
    >
      <el-option v-for="cycle in cycles" :key="cycle.id" :label="cycle.name" :value="cycle.id" />
    </el-select>

    <el-tabs v-model="currentTab" @tab-click="handleClick(currentTab)">
      <el-tab-pane v-for="tab in tabs" :key="tab" :label="tab" :name="tab"></el-tab-pane>
      <component :is="currentTabComponent" :current-cycle-id="currentCycleId" :table-data="tableData" />
      <!-- <common-pagination
        v-if="$route.query.tab === 'request-checkin' || $route.query.tab === 'inferior'"
        class="checkins__pagination"
        :total="meta.totalItems"
        :page.sync="paramsCheckin.page"
        :limit.sync="paramsCheckin.limit"
        @pagination="handlePagination"
      />-->
    </el-tabs>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

import Inferior from '@/components/checkin/Inferior.vue';
import RequestCheckin from '@/components/checkin/RequestCheckin.vue';
import MyCheckin from '@/components/checkin/MyCheckin.vue';
import CheckinCompany from '@/components/checkin/CheckinCompany.vue';

import { notificationConfig, pageLimit } from '@/constants/app.constant';
import { TAB_CHECKIN, ROUTER_CHECKIN } from '@/components/checkin/constants.enum';
import { SelectOptionDTO } from '@/constants/app.interface';
import { GetterState, MutationState } from '@/constants/app.vuex';

import CycleRepository from '@/repositories/CycleRepository';
import CheckinRepository from '@/repositories/CheckinRepository';
import CommonPagination from '@/components/common/Pagination.vue';
@Component<CheckinPage>({
  name: 'CheckinPage',
  components: {
    CommonPagination,
  },
  head() {
    return {
      title: 'Check-in',
    };
  },
  created() {
    this.getCycles();
  },
})
export default class CheckinPage extends Vue {
  private tableData: any[] = [];
  private tabs: string[] = [...Object.values(TAB_CHECKIN)];
  private cycles: any[] = [];
  private currentCycleId: number = this.$route.query.cycleId ? Number(this.$route.query.cycleId) : this.$store.state.cycle.cycleCurrent.id;
  private currentTab: string =
    this.$route.query.tab === ROUTER_CHECKIN.MyOkrs
      ? TAB_CHECKIN.MyOkrs
      : this.$route.query.tab === ROUTER_CHECKIN.CheckinResquest
      ? TAB_CHECKIN.CheckinResquest
      : this.$route.query.tab === ROUTER_CHECKIN.CheckinCompany
      ? TAB_CHECKIN.CheckinCompany
      : TAB_CHECKIN.Inferior;

  private paramsCheckin = {
    page: this.$route.query.page ? Number(this.$route.query.page) : 1,
    cycleId: this.$route.query.cycleId ? Number(this.$route.query.cycleId) : this.$store.state.cycle.cycleCurrent.id,
    limit: pageLimit,
  };

  private get currentTabComponent() {
    switch (this.$route.query.tab) {
      case ROUTER_CHECKIN.MyOkrs:
        return MyCheckin;
      case ROUTER_CHECKIN.CheckinResquest:
        return RequestCheckin;
      case ROUTER_CHECKIN.CheckinCompany:
        return CheckinCompany;
      default:
        return Inferior;
    }
  }
  private handleSelectCycle(cycleId) {
    this.paramsCheckin.page = 1;
    const tab = this.$route.query.tab === undefined ? ROUTER_CHECKIN.MyOkrs : this.$route.query.tab;
    this.paramsCheckin.cycleId = cycleId;
    this.$router.push(`?tab=${tab}&cycleId=${cycleId}`);
  }
  private async getCycles() {
    const { data } = await CycleRepository.getListMetadata();
    this.cycles = data || [];
  }
  private handleClick(currentTab: string) {
    this.paramsCheckin.page = 1;
    this.$router.push(
      `?tab=${
        currentTab === TAB_CHECKIN.MyOkrs
          ? ROUTER_CHECKIN.MyOkrs
          : currentTab === TAB_CHECKIN.CheckinResquest
          ? ROUTER_CHECKIN.CheckinResquest
          : currentTab === TAB_CHECKIN.CheckinCompany
          ? ROUTER_CHECKIN.CheckinCompany
          : ROUTER_CHECKIN.Inferior
      }`,
    );
  }
}
</script>
