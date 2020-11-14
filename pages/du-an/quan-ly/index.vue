<template>
  <div class="manage-project">
    <div class="manage-project__title">
      <h1 class="manage-project__title--text">Quản lý dự án</h1>
    </div>
    <el-tabs v-model="currentTab" @tab-click="handleClick(currentTab)">
      <el-tab-pane v-for="tab in tabs" :key="tab" :label="convertLabel(tab)" :name="tab"></el-tab-pane>
      <head-project :text.sync="paramsProject.text" @name="paramsProject.text = $event" @search="handleSearch($event)" />
      <component :is="currentTabComponent" :table-data="tableData" />
      <common-pagination
        class="manage-project__pagination"
        :total="meta.totalItems"
        :page.sync="paramsProject.page"
        :limit.sync="paramsProject.limit"
        @pagination="handlePagination($event)"
      />
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { ProjectStatus } from '@/constants/app.enum';
import { ParamsProject } from '@/constants/DTO/common';
import { pageLimit } from '@/constants/app.constant';

import CommonPagination from '@/components/common/Pagination.vue';
import ProjectRepository from '@/repositories/ProjectRepository';
import HeadProject from '@/components/manage/project/HeadProject.vue';
import ProjectAll from '@/components/manage/project/ProjectAll.vue';

@Component<ManageProject>({
  name: 'ManageProject',
  // middleware: 'employeesPage',
  components: {
    CommonPagination,
    HeadProject,
  },
  async created() {
    await this.getListProjects();
    // await this.getDataCommons();
  },
  head() {
    return {
      title: 'Quản lý dự án',
    };
  },
})
export default class ManageProject extends Vue {
  private tableData: Array<object> = [];
  private tabs: string[] = [...Object.values(ProjectStatus)];
  private currentTab: ProjectStatus = this.$route.query.tab === ProjectStatus.Active ? ProjectStatus.Active : ProjectStatus.All;
  private meta: object = {};
  private indexPage: number = this.$route.query.page ? Number(this.$route.query.page) : 1;

  private paramsProject: ParamsProject = {
    page: this.indexPage,
    limit: pageLimit,
    sortWith: 'id',
    type: '',
  };

  @Watch('$route.query')
  private async getListProjects() {
    try {
      const { data } = await ProjectRepository.get(this.paramsProject);
      this.tableData = data.data;
      this.meta = data.meta;
    } catch (error) {
      console.log(error);
    }
  }

  private handleClick(currentTab: string) {
    this.paramsProject.text = '';
    this.paramsProject.page = 1;
    // this.paramsUser.status = currentTab === UserStatus.Active ? 1 : currentTab === UserStatus.Pending ? 0 : -1;
    // this.$router.push(`?tab=${currentTab === UserStatus.Active ? 'active' : currentTab === UserStatus.Pending ? 'pending' : 'deactive'}`);
    // this.paramsUser.status = currentTab === UserStatus.Active ? 1 : currentTab === UserStatus.Pending ? 0 : -1;
    this.$router.push(`?tab=${currentTab === ProjectStatus.All ? ProjectStatus.All : ProjectStatus.Active}`);
  }

  private convertLabel(tab: ProjectStatus) {
    switch (tab) {
      case ProjectStatus.All:
        return 'Tất cả';
      case ProjectStatus.Active:
        return 'Đang hoạt động';
      default:
        return 'Đã đóng';
    }
  }

  private handleSearch(textSearch: string) {
    this.paramsProject.page = 1;
    const tab = this.$route.query.tab === undefined ? ProjectStatus.All : this.$route.query.tab;
    this.$router.push(`?tab=${tab}&text=${textSearch}`);
  }

  private handlePagination(pagination: any) {
    const tab = this.$route.query.tab === undefined ? ProjectStatus.All : this.$route.query.tab;
    this.$route.query.text === undefined
      ? this.$router.push(`?tab=${tab}&page=${pagination.page}`)
      : this.$router.push(`?tab=${tab}&text=${this.$route.query.text}&page=${pagination.page}`);
  }

  private get currentTabComponent() {
    return ProjectAll;
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';

.manage-project {
  height: 100%;

  &__title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    &--text {
      font-size: $text-2xl;
    }
  }

  &__content {
    background-color: $white;
    padding: $unit-8;
  }

  &__pagination {
    margin-top: $unit-8;
  }
}
</style>
