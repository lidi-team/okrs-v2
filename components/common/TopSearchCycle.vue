<template>
  <el-row v-if="cycleId" class="top-search-cycle">
    <el-col :xs="8" :sm="8" :md="8" :lg="8">
      <el-select v-model.number="cycleId" filterable placeholder="Nhập chu kỳ" no-match-text="Không tìm thấy chu kỳ">
        <el-option v-for="cycle in listCycles" :key="cycle.id" :label="cycle.label" :value="cycle.id" />
      </el-select>
    </el-col>
    <el-col :xs="12" :sm="12" :md="12" :lg="12">
      <el-autocomplete
        v-model="textSearch"
        prefix-icon="el-icon-search"
        :fetch-suggestions="querySearch"
        :trigger-on-focus="false"
        placeholder="Tìm kiếm OKRs"
        @select="handleSearchSelect"
      ></el-autocomplete>
    </el-col>
  </el-row>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import CycleRepository from '@/repositories/CycleRepository';
import { MutationState } from '@/constants/app.enum';
import OkrsRepository from '@/repositories/OkrsRepository';
@Component<TopSearchCycle>({
  name: 'TopSearchCycle',
  async created() {
    await this.getListCycle();
  },
  mounted() {
    this.getAllCompanyOkrs();
  },
})
export default class TopSearchCycle extends Vue {
  private cycleId: number = this.$store.state.cycle.cycle.id;
  private allCompanyOkrs: any[] = [];
  private textSearch: string = '';
  private listCycles: any[] = [];

  @Watch('cycleId')
  private changeCycleData(cycleId: number) {
    this.$store.commit(MutationState.SET_CURRENT_CYCLE, { id: cycleId });
    this.$emit('changeCycleData');
  }

  private querySearch(textQuery: string, callback: any) {
    let results: any[] = [];
    if (textQuery) {
      results = this.allCompanyOkrs.filter((item) => {
        return item.value.toLowerCase().includes(textQuery.toLowerCase());
      });
    } else {
      results = this.allCompanyOkrs;
    }
    // call callback function to return suggestions
    callback(results);
  }

  private handleSearchSelect(item) {
    window.open(`${process.env.baseURL}/OKRs/chi-tiet/${item.id}`, '_blank');
    this.textSearch = '';
  }

  private async getAllCompanyOkrs() {
    try {
      const [rootOkrs, okrs] = await Promise.all([OkrsRepository.getListOkrs(this.cycleId, 1), OkrsRepository.getListOkrs(this.cycleId, 3)]);
      const result = [...Object.freeze(rootOkrs.data.data), ...Object.freeze(okrs.data.data)];
      if (result.length) {
        this.allCompanyOkrs = result.map((item) => {
          return {
            id: item.id,
            value: `[${item.user.email}] ${item.title}`,
          };
        });
      }
    } catch (error) {}
  }

  private async getListCycle() {
    // Get 2 years(8 cycles OKRs) ago until now
    if (this.$store.state.cycle.cycles.length) {
      this.listCycles = this.$store.state.cycle.cycles;
    } else {
      try {
        const { data } = await CycleRepository.get({ page: 1, limit: 8 });
        this.listCycles = data.data.items.map((item) => {
          return {
            id: item.id,
            label: item.name,
          };
        });
        this.$store.commit(MutationState.SET_ALL_CYCLES, this.listCycles);
      } catch (error) {}
    }
  }
}
</script>
<style lang="scss">
@import '@/assets/scss/main.scss';
.top-search-cycle {
  @include breakpoint-down(phone) {
    display: flex;
    justify-content: space-between;
  }
  .el-autocomplete {
    width: 100%;
  }
}
</style>
