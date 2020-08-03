<template>
  <el-row class="top-search-cycle">
    <el-col :xs="8" :sm="8" :md="8" :lg="8">
      <el-select v-model="syncTextCycle" filterable placeholder="Nhập chu kỳ" no-match-text="Không tìm thấy chu kỳ">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" @change="handleSelectCycle(item)" />
      </el-select>
    </el-col>
    <el-col :xs="12" :sm="12" :md="12" :lg="12">
      <el-autocomplete
        v-model="syncTextSearch"
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
@Component<TopSearchCycle>({
  name: 'TopSearchCycle',
  created() {
    this.getAllCycles();
  },
})
export default class TopSearchCycle extends Vue {
  @PropSync('textCycle', { required: true, type: String }) private syncTextCycle!: string;
  @Prop({ required: true, type: String }) private textSearchPlaceholder!: string;
  @PropSync('textSearch', { required: true, type: String }) private syncTextSearch!: string;
  private options: SelectOptionDTO[] = [];

  private querySearch() {
    console.log('Query Search');
  }

  private handleSelectCycle(item) {
    console.log('Select ' + item);
  }

  private handleSearchSelect(item) {
    console.log('Search ' + item);
  }

  private async getAllCycles() {
    // Get 2 years(8 cycles OKRs) ago until now
    const { data } = await CycleRepository.get({ page: 1, limit: 8 });
    this.options = data.data.items.map((item) => {
      return {
        label: item.name,
        value: item.name,
      };
    });
    this.syncTextCycle = this.$store.state.cycle.cycle.name;
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
