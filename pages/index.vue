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
import DashboardRepository from '@/repositories/DashboardRepository';
import { GetterState, MutationState } from '@/constants/app.vuex';

@Component<HomePage>({
  head() {
    return {
      title: 'Dashboard',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Awesome tool OKRs',
        },
      ],
    };
  },
  async created() {
    if (!this.$route.query.cycleId) {
      this.$router.push(`?cycleId=${this.$store.state.cycle.cycleCurrent}`);
    }
    this.$store.commit(MutationState.SET_CURRENT_CYCLE, this.$route.query.cycleId);
    this.currentCycleId = this.$store.state.cycle.cycleCurrent;
  },
  async mounted() {
    this.currentCycleId = this.$route.query.cycleId;
    await this.getCycles();
  },
})
export default class HomePage extends Vue {
  private loading: boolean = false;
  private cycles: any[] = [];
  private currentCycleId: string = '';

  @Watch('$route.query')
  private async getData() {
  }

  private async getCycles() {
    this.loading = true
    const { data } = await CycleRepository.getListMetadata();
    this.cycles = data || [];
    this.loading = false
  }

  private handleSelectCycle(cycleId: number) {
    this.$router.push(`?cycleId=${cycleId}`);
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';

</style>
