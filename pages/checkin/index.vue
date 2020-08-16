<template>
  <div class="checkins">
    <el-select v-model="idCycle" no-match-text="Không tìm thấy chu kỳ" filterable placeholder="Chọn chu kỳ" @change="handleSelectCycle(idCycle)">
      <el-option v-for="item in options" :key="item.id" :label="item.label" :value="item.id" />
    </el-select>
    <el-tabs v-if="user.isLeader" v-model="currentTab" @tab-click="handleClick(currentTab)">
      <el-tab-pane v-for="tab in tabs" :key="tab" :label="tab" :name="tab"></el-tab-pane>
      <div class="checkins__content">
        <component :is="currentTabComponent" :get-list="getList" :loading="loading" :table-data="tableData" />
        <base-pagination
          v-if="$route.query.tab === 'request-checkin'"
          class="checkins__pagination"
          :total="meta.totalItems"
          :page.sync="paramsCheckin.page"
          :limit.sync="paramsCheckin.limit"
          @pagination="handlePagination"
        />
      </div>
    </el-tabs>
    <el-tabs v-else v-model="currentTab" @tab-click="handleClick(currentTab)">
      <el-tab-pane v-for="tab in tabs.slice(0, 1)" :key="tab" :label="tab" :name="tab"></el-tab-pane>
      <div class="checkins__content">
        <component :is="currentTabComponent" :get-list="getList" :loading="loading" :table-data="tableData" />
      </div>
    </el-tabs>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import { TabCheckins, GetterState } from '@/constants/app.enum';
import RequestCheckin from '@/components/checkin/RequestCheckin.vue';
import MyOkrsCheckin from '@/components/checkin/MyOkrsCheckin.vue';
import CycleRepository from '@/repositories/CycleRepository';
import CheckinRepository from '@/repositories/CheckinRepository';
import { SelectOptionDTO } from '@/constants/app.interface';
import { pageLimit } from '@/constants/app.constant';
@Component<CheckinPage>({
  name: 'CheckinPage',
  created() {
    this.getAllCycles();
    this.getList();
  },
  computed: {
    ...mapGetters({
      user: GetterState.USER,
    }),
  },
})
export default class CheckinPage extends Vue {
  private tableData: any[] = [];
  private tabs: string[] = [...Object.values(TabCheckins)];
  private loading: boolean = false;
  private options: SelectOptionDTO[] = [];
  private idCycle: number = this.$store.state.cycle.cycle.id;
  private meta: any = {};

  private currentTab: string = this.$route.query.tab === 'request-checkin' ? TabCheckins.CheckinResquest : TabCheckins.MyOkrs;
  private paramsCheckin = {
    page: this.$route.query.page ? Number(this.$route.query.page) : 1,
    cycleId: this.$route.query.cycleId ? this.$route.query.cycleId : this.$store.state.cycle.cycle.id,
    limit: pageLimit,
  };

  private get currentTabComponent() {
    if (this.$route.query.tab === 'request-checkin') {
      return RequestCheckin;
    } else {
      return MyOkrsCheckin;
    }
  }

  private handleSelectCycle(idCycle) {
    this.paramsCheckin.page = 1;
    const tab = this.$route.query.tab === undefined ? 'MyOkrs' : this.$route.query.tab;
    this.paramsCheckin.cycleId = idCycle;
    this.$router.push(`?tab=${tab}&cycleId=${idCycle}`);
  }

  @Watch('$route.query')
  private async getList() {
    this.loading = true;
    if (this.currentTab === TabCheckins.MyOkrs) {
      try {
        const paramsCheckin = {
          cycleId: this.$route.query.cycleId ? this.$route.query.cycleId : this.$store.state.cycle.cycle.id,
        };
        const { data } = await CheckinRepository.get(paramsCheckin);
        this.tableData = data.data;
        this.loading = false;
      } catch (error) {
        this.loading = false;
      }
    } else {
      try {
        const { data } = await CheckinRepository.getRequest(this.paramsCheckin);
        this.tableData = data.data.items;
        this.meta = data.data.meta;
        this.loading = false;
      } catch (error) {
        this.loading = false;
      }
    }
  }

  private handlePagination(pagination: any) {
    this.$route.query.cycleId === undefined
      ? this.$router.push(`?tab=request-checkin&page=${pagination.page}`)
      : this.$router.push(`?tab=request-checkin&cycleId=${this.$route.query.cycleId}&page=${pagination.page}`);
  }

  private async getAllCycles() {
    // Get 2 years(8 cycles OKRs) ago until now
    const { data } = await CycleRepository.get({ page: 1, limit: 8 });
    this.options = data.data.items.map((item) => {
      return {
        id: item.id,
        label: item.name,
        value: item.name,
      };
    });
    this.idCycle = this.$store.state.cycle.cycle.id;
  }

  private handleClick(currentTab: string) {
    this.paramsCheckin.page = 1;
    this.$router.push(`?tab=${currentTab === TabCheckins.MyOkrs ? 'myOKRs' : 'request-checkin'}`);
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
.checkins {
  margin-top: $unit-8;
  &__content {
    background-color: $white;
    padding: $unit-8;
  }
  &__pagination {
    margin-top: $unit-8;
  }
}
</style>
