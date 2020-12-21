<template>
  <div class="manage-project">
    <div class="-display-flex -justify-content-between">
      <h1 class="-title-1">
        {{
          user.roles.includes('ROLE_ADMIN') ? 'Quản lý dự án' : 'Dự án của tôi'
        }}
      </h1>
      <div class="-display-flex">
        <head-project
          :text.sync="paramsProject.text"
          @name="paramsProject.text = $event"
          @search="handleSearch($event)"
        />
        <el-button
          v-if="user.roles.includes('ROLE_ADMIN')"
          class="el-button--purple el-button--invite -ml-2"
          icon="el-icon-plus"
          @click="addNew"
        >
          Thêm dự án
        </el-button>
      </div>
    </div>
    <component
      :is="tabComponent"
      :table-data="tableData"
      :get-list-project="getListProjects"
      :managers="managers"
      :original-projects="originalProjects"
    />
    <project-dialog
      :visible-dialog.sync="visibleDialog"
      :reload-data="getListProjects"
      :managers="managers"
      :original-projects="originalProjects"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { ProjectStatus } from '@/constants/app.enum';
import { ParamsProject } from '@/constants/DTO/common';
import { pageLimit } from '@/constants/app.constant';
import CommonPagination from '@/components/Commons/CommonPagination.vue';
import ProjectRepository from '@/repositories/ProjectRepository';
import HeadProject from '@/components/manage/project/HeadProject.vue';
import ProjectAll from '@/components/manage/project/ProjectAll.vue';
import ProjectDialog from '@/components/admin/dialog/NewProjectDialog.vue';
import { mapGetters } from 'vuex';
import { GetterState } from '@/constants/app.vuex';

@Component<ManageProjectPage>({
  name: 'ManageProjectPage',
  components: {
    ProjectDialog,
    CommonPagination,
    HeadProject,
  },
  async created() {
    await this.getListProjects();
    await this.getDataCommon();
  },
  computed: {
    ...mapGetters({
      user: GetterState.USER,
    }),
  },
  head() {
    return {
      title: 'Quản lý dự án',
    };
  },
})
export default class ManageProjectPage extends Vue {
  private tableData: Array<object> = [];
  private managers: Array<any> = [];
  private originalProjects: Array<object> = [];
  private meta: object = {};
  private indexPage: number = this.$route.query.page
    ? Number(this.$route.query.page)
    : 1;
  private visibleDialog: boolean = false;
  private textPm: string = '';
  private sortWith: string = 'id';

  private paramsProject: ParamsProject = {
    page: this.indexPage,
    limit: pageLimit,
    sortWith: this.sortWith,
    type: '',
    text: '',
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

  private async getDataCommon() {
    try {
      const [managers, originalProjects] = await Promise.all([
        ProjectRepository.getManagers({ text: this.textPm }),
        ProjectRepository.getOriginalProjects(),
      ]);
      this.managers = managers.data;
      this.originalProjects = originalProjects.data;
    } catch (e) {
      console.log(e);
    }
  }

  private handleSearch(textSearch: string) {
    this.paramsProject.page = 1;
    const tab =
      this.$route.query.tab === undefined
        ? ProjectStatus.All
        : this.$route.query.tab;
    this.$router.push(`?tab=${tab}&text=${textSearch}`);
  }

  private handlePagination(pagination: any) {
    const tab =
      this.$route.query.tab === undefined
        ? ProjectStatus.All
        : this.$route.query.tab;
    this.$route.query.text === undefined
      ? this.$router.push(`?tab=${tab}&page=${pagination.page}`)
      : this.$router.push(
          `?tab=${tab}&text=${this.$route.query.text}&page=${pagination.page}`,
        );
  }

  private get tabComponent() {
    return ProjectAll;
  }

  private addNew() {
    console.log('pressed');
    this.visibleDialog = true;
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';

.manage-project {
  height: 100%;

  &__content {
    background-color: $white;
    padding: $unit-8;
  }

  &__pagination {
    margin-top: $unit-8;
    display: flex;
    justify-content: center;
  }
}
</style>
