<template>
  <div class="dashboard">
    <el-select
      class="-mb-4"
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
    <el-row :gutter="20">
      <el-col :span="12">
        <div class="box-wrap">
          <h2 class="-title-2 -border-header">Tình trạng cập nhật tiến độ</h2>
          <dashboard-checkin-chart :checkin-chart="checkinChart" />
        </div>
      </el-col>
      <el-col :span="12">hello</el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <div class="box-wrap">
          <h2 class="-title-2 -border-header">Top sao trong kỳ</h2>
          <div v-loading="loadingCurrentRanking">
            <p v-if="!currentRanking.length" class="history__col__empty">
              Không có dữ liệu
            </p>
            <rank-item
              v-for="(item, index) in currentRanking"
              :key="item.id"
              :index="index"
              :rankData="item"
            ></rank-item>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="box-wrap">
          <h2 class="-title-2 -border-header">Top sao công ty</h2>
          <div v-loading="loadingCurrentRanking">
            <p v-if="!accumulatedRanking.length" class="history__col__empty">
              Không có dữ liệu
            </p>
            <rank-item
              v-for="(item, index) in accumulatedRanking"
              :key="item.id"
              v-else
              :index="index"
              :rankData="item"
            ></rank-item>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import CycleRepository from '@/repositories/CycleRepository';
import { GetterState, MutationState } from '@/constants/app.vuex';
import DashboardCheckinChart from '@/components/Dashboard/DashboardCheckinChart.vue';
import CheckinRepository from '@/repositories/CheckinRepository';
import CfrsRepository from '@/repositories/CfrsRepository';
import RankItem from '@/components/cfrs/rank/RankItem.vue';

@Component<HomePage>({
  head() {
    return {
      title: 'Trang chủ',
    };
  },
  components: {
    DashboardCheckinChart,
    RankItem,
  },
  async created() {
    if (!this.$route.query.cycleId) {
      this.$router.push(`?cycleId=${this.$store.state.cycle.cycleCurrent}`);
    }
  },
  async mounted() {
    this.currentCycleId =
      this.$route.query.cycleId || this.$store.state.cycle.cycleCurrent;
    this.$store.commit(MutationState.SET_CURRENT_CYCLE, this.currentCycleId);
    await this.getCycles();
    await this.getCheckinChart();
    await this.getListDataRanking();
  },
})
export default class HomePage extends Vue {
  private loading: boolean = false;
  private cycles: any[] = [];
  private currentCycleId: string = '';
  private checkinChart: any[] = [];
  private accumulatedRanking: any = [];
  private currentRanking: any = [];
  private loadingCurrentRanking: boolean = false;

  @Watch('$route.query')
  private async getData() {}

  private async getCycles() {
    this.loading = true;
    const { data } = await CycleRepository.getListMetadata();
    this.cycles = data || [];
    this.loading = false;
  }

  private async getCheckinChart() {
    this.loading = true;
    const { data } = await CheckinRepository.getDashboard({
      cycleId: this.currentCycleId,
    });
    this.checkinChart = data;
    this.loading = false;
  }

  private async getListDataRanking() {
    this.loadingCurrentRanking = true;
    try {
      const [accumulatedRanking, currentRanking] = await Promise.all([
        CfrsRepository.getRankingCfrs(0),
        CfrsRepository.getRankingCfrs(this.$store.state.cycle.cycleCurrent),
      ]);
      if (!!accumulatedRanking && !!accumulatedRanking.data) {
        this.accumulatedRanking = this.getTop6Rank(accumulatedRanking.data);
        this.loadingCurrentRanking = false;
      }
      if (!!currentRanking && !!currentRanking.data) {
        this.currentRanking = this.getTop6Rank(currentRanking.data);
        this.loadingCurrentRanking = false;
      }
    } catch (error) {
      this.loadingCurrentRanking = false;
    }
  }

  @Watch('cycleId')
  private async getRankingOnCycle(cycleId: number) {
    this.loadingCurrentRanking = true;
    try {
      await CfrsRepository.getRankingCfrs(cycleId).then((res) => {
        this.currentRanking = this.getTop6Rank(res.data);
        this.loadingCurrentRanking = false;
      });
    } catch (error) {
      this.loadingCurrentRanking = false;
    }
  }

  private getTop6Rank(data: Object[]) {
    return data.slice(0, 5);
  }

  private handleSelectCycle(cycleId: number) {
    this.$router.push(`?cycleId=${cycleId}`);
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
</style>
