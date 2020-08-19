<template>
  <el-row v-if="currentTabComponent === 'history'" class="top-search-cycle">
    <el-col :xs="8" :sm="8" :md="8" :lg="8">
      <el-select v-model="cycleId" filterable disabled placeholder="Nhập chu kỳ" no-match-text="Không tìm thấy chu kỳ" @change="handleSelectCycle()">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </el-col>
    <el-col :xs="12" :sm="12" :md="12" :lg="12">
      <el-autocomplete
        v-model="syncTextSearch"
        disabled
        :fetch-suggestions="querySearch"
        :placeholder="textSearchPlaceholder"
        @select="handleSearchSelect"
      ></el-autocomplete>
    </el-col>
  </el-row>
</template>
<script lang="ts">
import { Component, Vue, Prop, PropSync } from 'vue-property-decorator';
import CycleRepository from '@/repositories/CycleRepository';
import { SelectOptionDTO } from '@/constants/app.interface';
import { MutationState } from '@/constants/app.enum';
@Component<NavbarCrfs>({
  name: 'NavbarCrfs',
  created() {
    this.getAllCycles();
  },
})
export default class NavbarCrfs extends Vue {
  @Prop({ required: true, type: String }) private textSearchPlaceholder!: string;
  @Prop({ required: true, type: String }) private currentTabComponent!: string;
  @PropSync('textSearch', { required: true, type: String }) private syncTextSearch!: string;
  private options: SelectOptionDTO[] = [];
  private cycleId: String = 'Summer 2020';
  private querySearch() {
    console.log('Query Search');
  }

  private handleSelectCycle() {
    this.$store.commit(MutationState.SET_TEMP_CYCLE, this.cycleId);
  }

  private handleSearchSelect(item) {
    console.log('Search ' + item);
  }

  private async getAllCycles() {
    // Get 2 years(8 cycles OKRs) ago until now
    if (this.$store.state.cycle.cycles.length) {
      this.options = this.$store.state.cycle.cycles;
      const cycleId = this.options.find((item) => item.label === this.cycleId);
      this.$store.commit(MutationState.SET_TEMP_CYCLE, cycleId);
    } else {
      try {
        const { data } = await CycleRepository.get({ page: 1, limit: 8 });
        this.options = data.data.items.map((item) => {
          return {
            id: item.id,
            label: item.name,
            value: item.id,
          };
        });
        this.$store.commit(MutationState.SET_ALL_CYCLES, this.options);
        const cycleId = this.options.find((item) => item.label === this.cycleId);
        this.$store.commit(MutationState.SET_TEMP_CYCLE, cycleId);
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
