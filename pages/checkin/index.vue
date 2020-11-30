<template>
  <div class="checkins">
    <div class="-display-flex">
      <el-select
        class="-mr-1"
        v-model="paramsCheckin.cycleId"
        no-match-text="Không tìm thấy chu kỳ"
        filterable
        placeholder="Chọn chu kỳ"
        @change="handleSelectCycle(paramsCheckin.cycleId)"
      >
        <el-option v-for="cycle in cycles" :key="cycle.id" :label="`Chu kỳ: ${cycle.name}`" :value="String(cycle.id)" />
      </el-select>
      <el-select
        class="-ml-1"
        v-model="paramsCheckin.projectId"
        no-match-text="Không tìm thấy dự án"
        filterable
        placeholder="Chọn dự án"
        @change="handleSelectProject(paramsCheckin.projectId)"
      >
        <el-option v-for="project in projects" :key="project.id" :label="`Dự án: ${project.name}`" :value="String(project.id)" />
      </el-select>
    </div>

    <el-tabs v-model="currentTab" @tab-click="handleClick(currentTab)">
      <el-tab-pane v-for="tab in tabs" :key="tab" :label="tab" :name="tab"></el-tab-pane>
      <component :is="currentTabComponent" :table-data="tableData" />
    </el-tabs>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

import Inferior from '@/components/checkin/Inferior.vue';
import RequestCheckin from '@/components/checkin/RequestCheckin.vue';
import MyCheckin from '@/components/checkin/MyCheckin.vue';
import CheckinCompany from '@/components/checkin/CheckinCompany.vue';

import { notificationConfig, pageLimit } from '@/constants/app.constant';
import { TAB_CHECKIN, ROUTER_CHECKIN } from '@/components/checkin/constants.enum';
import { SelectOptionDTO } from '@/constants/app.interface';
import { GetterState, MutationState } from '@/constants/app.vuex';

import CycleRepository from '@/repositories/CycleRepository';
import CheckinRepository from '@/repositories/CheckinRepository';
import CommonPagination from '@/components/common/Pagination.vue';
import ProjectRepository from '../../repositories/ProjectRepository';
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
    this.getProjects();
  },
})
export default class CheckinPage extends Vue {
  private tableData: any[] = [];
  private tabs: string[] = [...Object.values(TAB_CHECKIN)];
  private cycles: any[] = [];
  private projects: any[] = [];
  private currentTab: string =
    this.$route.query.tab === ROUTER_CHECKIN.MyOkrs
      ? TAB_CHECKIN.MyOkrs
      : this.$route.query.tab === ROUTER_CHECKIN.CheckinResquest
      ? TAB_CHECKIN.CheckinResquest
      : this.$route.query.tab === ROUTER_CHECKIN.CheckinCompany
      ? TAB_CHECKIN.CheckinCompany
      : TAB_CHECKIN.Inferior;
  private paramsCheckin = {
    tab: this.$route.query.tab ? this.$route.query.tab : ROUTER_CHECKIN.MyOkrs,
    page: this.$route.query.page ? this.$route.query.page : 1,
    cycleId: this.$route.query.cycleId ? this.$route.query.cycleId : this.$store.state.cycle.cycleCurrent.id,
    limit: this.$route.query.limit ? this.$route.query.limit : 10,
    projectId: this.$route.query.projectId ? this.$route.query.projectId : '',
  };

  private get currentTabComponent() {
    switch (this.$route.query.tab) {
      case ROUTER_CHECKIN.MyOkrs:
        return MyCheckin;
      case ROUTER_CHECKIN.CheckinResquest:
        return RequestCheckin;
      case ROUTER_CHECKIN.CheckinCompany:
        return CheckinCompany;
      case ROUTER_CHECKIN.Inferior:
        return Inferior;
      default:
        return MyCheckin;
    }
  }

  private handleSelectCycle(cycleId) {
    this.$router.push(`?tab=${this.paramsCheckin.tab}&cycleId=${cycleId}&page=${this.paramsCheckin.page}&projectId=${this.paramsCheckin.projectId}`);
  }

  private handleSelectProject(projectId) {
    this.$router.push(`?tab=${this.paramsCheckin.tab}&cycleId=${this.paramsCheckin.cycleId}&page=${this.paramsCheckin.page}&projectId=${projectId}`);
  }

  private async getCycles() {
    const { data } = await CycleRepository.getListMetadata();
    this.cycles = data || [];
  }

  private async getProjects() {
    const { data } = await ProjectRepository.getListCurrent();
    this.projects =
      [
        {
          id: 0,
          name: 'Tất cả',
        },
        ...data,
      ] || [];
  }

  private handleClick(currentTab: string) {
    this.$router.push(
      `?tab=${
        currentTab === TAB_CHECKIN.MyOkrs
          ? ROUTER_CHECKIN.MyOkrs
          : currentTab === TAB_CHECKIN.CheckinResquest
          ? ROUTER_CHECKIN.CheckinResquest
          : currentTab === TAB_CHECKIN.CheckinCompany
          ? ROUTER_CHECKIN.CheckinCompany
          : ROUTER_CHECKIN.Inferior
      }&cycleId=${this.paramsCheckin.cycleId}&page=${this.paramsCheckin.page}&projectId=${this.paramsCheckin.projectId}`,
    );
  }
}
</script>
