<template>
  <div class="cfrs">
    <div class="cfrs-page">
      <el-row class="cfrs-page__top" type="flex" justify="space-between">
        <el-col :xs="24" :sm="24" :md="12" :lg="12" class="okrs-page__top--searching">
          <base-top-search-cycle :text-cycle.sync="textCycle" :text-search.sync="textSearch" :text-search-placeholder="textSearchPlaceholder" />
        </el-col>
        <el-col :xs="24" :sm="24" :md="8" :lg="8" class="okrs-page__top--button">
          <el-button class="el-button el-button--purple el-button-medium">Thêm Recongnition</el-button>
        </el-col>
      </el-row>
    </div>

    <el-tabs v-model="currentTab" @tab-click="handleClick(currentTab)">
      <el-tab-pane v-for="tab in tabs" :key="tab" :label="tab" :name="tab" />
      <component :is="currentTabComponent" />
      <base-pagination
        class="manage-employee__pagination"
        :total="meta.totalItems"
        :page.sync="params.page"
        :limit.sync="params.limit"
        @pagination="handlePagination($event)"
      />
    </el-tabs>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { TabCFR } from '@/constants/app.enum';
import { ParamsCFR } from '@/constants/app.interface';
import { pageLimit } from '@/constants/app.constant';
import Feedback from '@/components/cfrs/feedback/index.vue';
import History from '@/components/cfrs/history/index.vue';
import Rank from '@/components/cfrs/rank/index.vue';
import OkrsRepository from '@/repositories/OkrsRepository';
@Component<CFRs>({
  name: 'CFRs',
  middleware: 'employeesPage',
})
export default class CFRs extends Vue {
  private textSearchPlaceholder: string = 'Tìm kiếm từ khóa';
  private textSearch: string = '';
  private textCycle: string = '';
  private loading: boolean = false;
  private params: ParamsCFR = {
    status: this.$route.query.tab === 'feedback' ? -1 : this.$route.query.tab === 'history' ? 0 : 1,
    text: this.$route.query.text ? String(this.$route.query.text) : '',
    page: this.$route.query.page ? Number(this.$route.query.page) : 1,
    limit: pageLimit,
  };

  private currentTab: string =
    this.$route.query.tab === 'feedback' ? TabCFR.Feedback : this.$route.query.tab === 'history' ? TabCFR.History : TabCFR.Rank;

  private meta: object = {};
  private handlePagination(pagination: any) {
    const tab = this.$route.query.tab === undefined ? 'active' : this.$route.query.tab;
    this.$route.query.text === undefined
      ? this.$router.push(`?tab=${tab}&page=${pagination.page}`)
      : this.$router.push(`?tab=${tab}&text=${this.$route.query.text}&page=${pagination.page}`);
  }

  private tabs: string[] = [...Object.values(TabCFR)];
  private handleClick(currentTab: string) {
    this.params.text = '';
    this.params.page = 1;
    this.params.status = currentTab === TabCFR.Feedback ? 1 : currentTab === TabCFR.History ? 0 : -1;
    this.$router.push(`?tab=${currentTab === TabCFR.Feedback ? 'feedback' : currentTab === TabCFR.History ? 'history' : 'rank'}`);
  }

  private get currentTabComponent() {
    return this.$route.query.tab === 'feedback' ? Feedback : this.$route.query.tab === 'history' ? History : Rank;
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/main.scss';
.cfrs {
  padding-right: $unit-4;
}
.cfrs-page {
  &__top {
    @include breakpoint-down(phone) {
      flex-direction: column;
    }
    &--searching {
      padding: $unit-7 0 $unit-4 0;
    }
    &--button {
      display: flex;
      margin: $unit-7 0 $unit-4 0;
      justify-content: flex-end;
      @include breakpoint-down(phone) {
        justify-content: center;
      }
    }
  }
  .el-table__empty-block {
    width: 100% !important;
  }
}
</style>
