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
          <dashboard-checkin-chart />
        </div>
      </el-col>
      <el-col :span="12">hello</el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import CycleRepository from '@/repositories/CycleRepository';
import { GetterState, MutationState } from '@/constants/app.vuex';
import DashboardCheckinChart from '@/components/Dashboard/DashboardCheckinChart.vue';
import CheckinRepository from '@/repositories/CheckinRepository'

@Component<HomePage>({
  head() {
    return {
      title: 'Trang chủ',
    };
  },
  components: {
    DashboardCheckinChart
  },
  async created() {
    if (!this.$route.query.cycleId) {
      this.$router.push(`?cycleId=${this.$store.state.cycle.cycleCurrent}`);
    }
  },
  async mounted() {
    this.currentCycleId = this.$route.query.cycleId || this.$store.state.cycle.cycleCurrent;
    this.$store.commit(MutationState.SET_CURRENT_CYCLE, this.currentCycleId);
    await this.getCycles();
  },
})
export default class HomePage extends Vue {
  private loading: boolean = false;
  private cycles: any[] = [];
  private currentCycleId: string = '';
  private checkinChart: any[] = []

  @Watch('$route.query')
  private async getData() {
  }

  private async getCycles() {
    this.loading = true
    const { data } = await CycleRepository.getListMetadata();
    this.cycles = data || [];
    this.loading = false
  }

  private async getCheckinChart() {
    this.loading = true
    const { data } = await CheckinRepository.getDashboard({ cycleId: this.currentCycleId })
    console.log(data, 'kkkkk')
  }

  private handleSelectCycle(cycleId: number) {
    this.$router.push(`?cycleId=${cycleId}`);
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';

</style>
