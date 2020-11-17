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
      <div class="checkins__content">
        <component :is="currentTabComponent" :current-cycle-id="currentCycleId" :loading="loading" :table-data="tableData" />
        <!-- <common-pagination
          v-if="$route.query.tab === 'request-checkin' || $route.query.tab === 'inferior'"
          class="checkins__pagination"
          :total="meta.totalItems"
          :page.sync="paramsCheckin.page"
          :limit.sync="paramsCheckin.limit"
          @pagination="handlePagination"
        /> -->
      </div>
    </el-tabs>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

import Inferior from '@/components/checkin/Inferior.vue';
import RequestCheckin from '@/components/checkin/RequestCheckin.vue';
import MyOkrsCheckin from '@/components/checkin/MyOkrsCheckin.vue';
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
    // this.getList();
  },
  // computed: {
  //   ...mapGetters({
  //     user: GetterState.USER,
  //   }),
  // },
})
export default class CheckinPage extends Vue {
  private tableData: any[] = [];
  private tabs: string[] = [...Object.values(TAB_CHECKIN)];
  private loading: boolean = false;
  private cycles: any[] = [];
  private currentCycleId: number = this.$route.query.cycleId ? Number(this.$route.query.cycleId) : this.$store.state.cycle.cycleCurrent.id;
  // private meta: any = {};
  private currentTab: string =
    this.$route.query.tab === ROUTER_CHECKIN.MyOkrs
      ? TAB_CHECKIN.MyOkrs
      : this.$route.query.tab === ROUTER_CHECKIN.CheckinResquest
      ? TAB_CHECKIN.CheckinResquest
      : this.$route.query.tab === ROUTER_CHECKIN.CheckinCompany
      ? TAB_CHECKIN.CheckinCompany
      : TAB_CHECKIN.Inferior; // okrs-cap-duoi

  private paramsCheckin = {
    page: this.$route.query.page ? Number(this.$route.query.page) : 1,
    cycleId: this.$route.query.cycleId ? Number(this.$route.query.cycleId) : this.$store.state.cycle.cycleCurrent.id,
    limit: pageLimit,
  };

  private get currentTabComponent() {
    switch (this.$route.query.tab) {
      case ROUTER_CHECKIN.MyOkrs:
        return MyOkrsCheckin;
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
  // @Watch('$route.query')
  // private async getList() {
  //   this.loading = true;
  //   this.currentTab =
  //     this.$route.query.tab === 'request-checkin'
  //       ? TabCheckins.CheckinResquest
  //       : this.$route.query.tab === 'checkin-company'
  //       ? TabCheckins.CheckinCompany
  //       : this.$route.query.tab === 'inferior'
  //       ? TabCheckins.Inferior
  //       : TabCheckins.MyOkrs;
  // this.paramsCheckin = {
  //   page: this.$route.query.page ? Number(this.$route.query.page) : 1,
  //   cycleId: this.$route.query.cycleId ? Number(this.$route.query.cycleId) : this.$store.state.cycle.cycle.id,
  //   limit: pageLimit,
  // };
  //   if (this.currentTab === TabCheckins.MyOkrs) {
  //     try {
  //       const paramsCheckin = {
  //         cycleId: this.$route.query.cycleId ? Number(this.$route.query.cycleId) : this.$store.state.cycle.cycle.id,
  //       };
  //       const { data } = await CheckinRepository.get(paramsCheckin);
  //       this.tableData = data.data;
  //       this.loading = false;
  //     } catch (error) {
  //       if (error.response.data.statusCode === 470) {
  //         this.$notify.error({
  //           ...notificationConfig,
  //           message: 'Bạn không có quyền truy cập checkin này',
  //         });
  //       }
  //       this.loading = false;
  //     }
  //   } else if (this.currentTab === TabCheckins.CheckinResquest) {
  //     try {
  //       const { data } = await CheckinRepository.getRequest(this.paramsCheckin);
  //       this.tableData = data.data.items;
  //       this.meta = data.data.meta;
  //       this.loading = false;
  //     } catch (error) {
  //       if (error.response.data.statusCode === 470) {
  //         this.$notify.error({
  //           ...notificationConfig,
  //           message: 'Bạn không có quyền truy cập checkin này',
  //         });
  //       }
  //       this.$router.push('/checkin');
  //       this.loading = false;
  //     }
  //   } else if (this.currentTab === TabCheckins.Inferior) {
  //     try {
  //       const { data } = await CheckinRepository.getListInferior(this.paramsCheckin);
  //       this.tableData = data.data.items;
  //       this.meta = data.data.meta;
  //       this.loading = false;
  //     } catch (error) {
  //       if (error.response.data.statusCode === 470) {
  //         this.$notify.error({
  //           ...notificationConfig,
  //           message: 'Bạn không có quyền truy cập checkin này',
  //         });
  //       }
  //       this.$router.push('/checkin');
  //       this.loading = false;
  //     }
  //   } else {
  //     try {
  //       const paramsCheckin = {
  //         cycleId: this.$route.query.cycleId ? Number(this.$route.query.cycleId) : this.$store.state.cycle.cycle.id,
  //       };
  //       const { data } = await CheckinRepository.getOKRsCompany(paramsCheckin);
  //       this.tableData = data.data;
  //       this.loading = false;
  //     } catch (error) {
  //       if (error.response.data.statusCode === 470) {
  //         this.$notify.error({
  //           ...notificationConfig,
  //           message: 'Bạn không có quyền truy cập checkin này',
  //         });
  //       }
  //       this.$router.push('/checkin');
  //       this.loading = false;
  //     }
  //   }
  // }
  // private handlePagination(pagination: any) {
  //   this.$route.query.cycleId === undefined
  //     ? this.$router.push(`?tab=request-checkin&page=${pagination.page}`)
  //     : this.$router.push(`?tab=request-checkin&cycleId=${Number(this.$route.query.cycleId)}&page=${pagination.page}`);
  // }
  private async getCycles() {
    const { data } = await CycleRepository.getList();
    this.cycles = data || [];
    // if (this.$store.state.cycle.cycles.length) {
    //   this.cycles = this.$store.state.cycle.cycles;
    //   this.currentCycleId = this.$store.state.cycle.cycle.id;
    // } else {
    //   try {
    //     const { data } = await CycleRepository.getList();
    //     console.log(data);
    //     this.cycles = data.data.all.map((item) => {
    //       return {
    //         id: item.id,
    //         label: item.name,
    //       };
    //     });
    //     this.$store.commit(MutationState.SET_ALL_CYCLES, this.listCycles);
    //   } catch (error) {}
    // }
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
<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
.checkins {
  &__content {
    background-color: $white;
    padding: $unit-8;
  }
  &__pagination {
    margin-top: $unit-8;
  }
}
</style>
