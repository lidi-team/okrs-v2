<template>
  <div class="checkins">
    <div class="-display-flex -justify-content-between">
      <h1 class="-title-1">Cập nhật tiến độ</h1>
      <div class="-display-flex">
        <el-select
          class="-mr-1 el-input--title"
          v-model="paramsCheckin.cycleId"
          no-match-text="Không tìm thấy chu kỳ"
          filterable
          placeholder="Chọn chu kỳ"
          @change="handleSelectCycle(paramsCheckin.cycleId)"
        >
          <el-option
            v-for="cycle in cycles"
            :key="cycle.id"
            :label="`Chu kỳ: ${cycle.name}`"
            :value="String(cycle.id)"
          />
        </el-select>
        <el-select
          class="-ml-1 el-input--title"
          v-model="paramsCheckin.projectId"
          no-match-text="Không tìm thấy dự án"
          filterable
          placeholder="Chọn dự án"
          @change="handleSelectProject(paramsCheckin.projectId)"
        >
          <el-option
            v-for="project in projects"
            :key="project.id"
            :label="`Dự án: ${project.name}`"
            :value="String(project.id)"
          />
        </el-select>
      </div>
    </div>

    <el-tabs v-model="currentTab" @tab-click="handleClick(currentTab)">
      <el-tab-pane
        v-for="tab in tabs"
        :key="tab"
        :label="tab"
        :name="tab"
      ></el-tab-pane>
      <component :is="currentTabComponent" :table-data="tableData" />
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Inferior from '@/components/Checkins/CheckinInferior.vue';
import RequestCheckin from '@/components/Checkins/CheckinRequest.vue';
import MyCheckin from '@/components/Checkins/CheckinMyCheckin.vue';
import CycleRepository from '@/repositories/CycleRepository';
import CommonPagination from '@/components/Commons/CommonPagination.vue';
import ProjectRepository from '../../repositories/ProjectRepository';
import {
  TAB_CHECKIN,
  ROUTER_CHECKIN,
} from '@/components/Checkins/constants.enum';
import { ICheckinParams } from '@/constants/DTO/common';

@Component<CheckinPage>({
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
    this.$route.query.tab === ROUTER_CHECKIN.Inferior
      ? TAB_CHECKIN.Inferior
      : this.$route.query.tab === ROUTER_CHECKIN.CheckinResquest
      ? TAB_CHECKIN.CheckinResquest
      : TAB_CHECKIN.MyOkrs;
  private paramsCheckin: ICheckinParams = {
    tab: this.$route.query.tab ? this.$route.query.tab : ROUTER_CHECKIN.MyOkrs,
    page: this.$route.query.page ? this.$route.query.page : 1,
    cycleId: this.$route.query.cycleId
      ? this.$route.query.cycleId
      : String(this.$store.state.cycle.cycleCurrent),
    limit: this.$route.query.limit ? this.$route.query.limit : 10,
    projectId: this.$route.query.projectId
      ? this.$route.query.projectId
      : String(0),
  };

  private get currentTabComponent() {
    switch (this.$route.query.tab) {
      case ROUTER_CHECKIN.MyOkrs:
        return MyCheckin;
      case ROUTER_CHECKIN.CheckinResquest:
        return RequestCheckin;
      case ROUTER_CHECKIN.Inferior:
        return Inferior;
      default:
        return MyCheckin;
    }
  }

  private handleSelectCycle(cycleId) {
    this.$router.push(
      `?tab=${this.$route.query.tab}&cycleId=${cycleId}&page=1&projectId=${this.paramsCheckin.projectId}`,
    );
  }

  private handleSelectProject(projectId) {
    this.$router.push(
      `?tab=${this.$route.query.tab}&cycleId=${this.paramsCheckin.cycleId}&page=1&projectId=${projectId}`,
    );
  }

  private async getCycles() {
    const { data } = await CycleRepository.getListMetadata();
    this.cycles = data || [];
  }

  private handleClick(currentTab: string) {
    this.$router.push(
      `?tab=${
        currentTab === TAB_CHECKIN.MyOkrs
          ? ROUTER_CHECKIN.MyOkrs
          : currentTab === TAB_CHECKIN.CheckinResquest
          ? ROUTER_CHECKIN.CheckinResquest
          : ROUTER_CHECKIN.Inferior
      }&cycleId=${this.paramsCheckin.cycleId}&page=${
        this.paramsCheckin.page
      }&projectId=${this.paramsCheckin.projectId}`,
    );
  }

  private async getProjects() {
    const { data } = await ProjectRepository.getListCurrent();
    this.projects = [
      {
        id: 0,
        name: 'Tất cả',
      },
      ...data,
    ];
  }
}
</script>
