<template>
  <div class="dashboard">
    <div class="-display-flex -justify-content-between">
      <h1 class="-title-1">Trang chủ</h1>
      <el-select
        class="-mb-3 el-input--title"
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
    </div>
    <el-row :gutter="20">
      <el-col :span="16">
        <div class="box-wrap -mh-405">
          <h2 class="-title-2 -border-header">Tiến độ OKRs</h2>
          <el-row :gutter="20">
            <el-col :span="6"> OKRs Công ty </el-col>
            <el-col :span="18">
              <el-progress
                :percentage="+okrsDashboard.company | round"
                :color="+okrsDashboard.company | customColors"
                :text-inside="true"
                :stroke-width="26"
              />
            </el-col>
          </el-row>
          <div v-for="project in okrsDashboard.projects" :key="project.id">
            <el-row :gutter="20" class="-mt-3">
              <el-col :span="6"> OKRs {{ project.name }} </el-col>
              <el-col :span="9">
                <el-progress
                  :format="formatProject"
                  :percentage="+project.projectProgress | round"
                  :color="+project.projectProgress | customColors"
                  :text-inside="true"
                  :stroke-width="26"
                />
              </el-col>
              <el-col :span="9">
                <el-progress
                  :format="formatPersonal"
                  :percentage="+project.personalProgress | round"
                  :color="+project.personalProgress | customColors"
                  :text-inside="true"
                  :stroke-width="26"
                />
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="box-wrap">
          <h2 class="-title-2 -border-header">Tình trạng cập nhật tiến độ</h2>
          <dashboard-checkin-chart
            v-loading="loading"
            :loading="loading"
            :checkin-chart="checkinChart"
          />
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="8">
        <div class="box-wrap -mh-405">
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
      <el-col :span="8">
        <div class="box-wrap -mh-405">
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
      <el-col :span="8">
        <div
          class="box-wrap -mh-405 -display-flex -justify-content-center -align-items-center"
        >
          <img src="@/assets/images/dashboard/icon.png" alt="thayacac" />
        </div>
      </el-col>
    </el-row>
    <drill-down-list />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import CycleRepository from '@/repositories/CycleRepository';
import { MutationState } from '@/constants/app.vuex';
import DashboardCheckinChart from '@/components/Dashboard/DashboardCheckinChart.vue';
import CheckinRepository from '@/repositories/CheckinRepository';
import CfrsRepository from '@/repositories/CfrsRepository';
import RankItem from '@/components/CFRs/CFRsRank/CFRsRankItem.vue';
import DrillDownList from '@/components/DrillDown/DrillDownList.vue';
import OkrsRepository from '@/repositories/OkrsRepository';

@Component<HomePage>({
  head() {
    return {
      title: 'Trang chủ',
    };
  },
  components: {
    DashboardCheckinChart,
    RankItem,
    DrillDownList,
  },
  created() {
    if (!this.$route.query.cycleId) {
      this.$router.push(`?cycleId=${this.$store.state.cycle.cycleCurrent}`);
    }
  },
  async mounted() {
    this.currentCycleId =
      this.$route.query.cycleId || String(this.$store.state.cycle.cycleCurrent);
    this.$store.commit(MutationState.SET_CURRENT_CYCLE, this.currentCycleId);
    await this.getCycles();
    await this.getCheckinChart();
    await this.getListDataRanking();
    await this.getOkrsDashboard(this.currentCycleId);
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
  private okrsDashboard: any = {
    company: 0,
    projects: [],
  };

  @Watch('$route.query')
  private getData(query: any) {
    this.getRankingOnCycle(query.cycleId);
    this.getOkrsDashboard(query.cycleId);
  }

  private formatProject(percentage) {
    return `Dự án: ${percentage}%`;
  }

  private formatPersonal(percentage) {
    return `Cá nhân: ${percentage}%`;
  }

  private async getCycles() {
    const { data } = await CycleRepository.getListMetadata();
    this.cycles = data || [];
  }

  private async getCheckinChart() {
    this.loading = true;
    const { data } = await CheckinRepository.getDashboard({
      cycleId: this.currentCycleId,
    });
    this.checkinChart = data;
    this.loading = false;
  }

  private async getOkrsDashboard(cycleId: number) {
    const { data } = await OkrsRepository.getDashboard({ cycleId });
    if (data) {
      this.okrsDashboard = data;
    }
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
