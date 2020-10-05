<template>
  <div class="manage-employee">
    <h1 class="manage-employee__title">Quản lý nhân sự</h1>
    <el-tabs v-model="currentTab" @tab-click="handleClick(currentTab)">
      <el-tab-pane v-for="tab in tabs" :key="tab" :label="tab" :name="tab"></el-tab-pane>
      <div class="manage-employee__content">
        <head-employee :link-invite="linkInvite" :text.sync="paramsUser.text" @name="paramsUser.text = $event" @search="handleSearch($event)" />
        <component :is="currentTabComponent" :get-list-users="getListUsers" :teams="teams" :roles="roles" :jobs="jobs" :table-data="tableData" />
        <common-pagination
          class="manage-employee__pagination"
          :total="meta.totalItems"
          :page.sync="paramsUser.page"
          :limit.sync="paramsUser.limit"
          @pagination="handlePagination($event)"
        />
      </div>
    </el-tabs>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import EmployeePending from '@/components/manage/employee/EmployeePending.vue';
import EmployeeActive from '@/components/manage/employee/EmployeeActive.vue';
import EmployeeDeactive from '@/components/manage/employee/EmployeeDeactive.vue';
import { UserStatus } from '@/constants/app.enum';
import { ParamsUser } from '@/constants/app.interface';
import EmployeeRepository from '@/repositories/EmployeeRepository';
import AuthRepository from '@/repositories/AuthRepository';
import TeamRepository from '@/repositories/TeamRepository';
import JobRepository from '@/repositories/JobRepository';
import RoleRepository from '@/repositories/RoleRepository';
import { pageLimit } from '@/constants/app.constant';
// components
import CommonPagination from '@/components/common/Pagination.vue';
@Component<ManageEmployee>({
  name: 'ManageEmployee',
  middleware: 'employeesPage',
  components: {
    CommonPagination,
  },
  async created() {
    await this.getListUsers();
    await this.getDataCommons();
  },
  head() {
    return {
      title: 'Quản lý nhân sự',
    };
  },
})
export default class ManageEmployee extends Vue {
  private tableData: Array<object> = [];
  private teams: Array<object> = [];
  private jobs: Array<object> = [];
  private roles: Array<object> = [];
  private linkInvite: string = '';
  private meta: object = {};
  private paramsUser: ParamsUser = {
    status: this.$route.query.tab === 'deactive' ? -1 : this.$route.query.tab === 'pending' ? 0 : 1,
    text: this.$route.query.text ? String(this.$route.query.text) : '',
    page: this.$route.query.page ? Number(this.$route.query.page) : 1,
    limit: pageLimit,
  };

  private currentTab: string =
    this.$route.query.tab === 'deactive' ? UserStatus.Inactive : this.$route.query.tab === 'pending' ? UserStatus.Pending : UserStatus.Active;

  @Watch('$route.query')
  private async getListUsers() {
    this.paramsUser = {
      status: this.$route.query.tab === 'deactive' ? -1 : this.$route.query.tab === 'pending' ? 0 : 1,
      text: this.$route.query.text ? String(this.$route.query.text) : '',
      page: this.$route.query.page ? Number(this.$route.query.page) : 1,
      limit: pageLimit,
    };
    this.currentTab =
      this.$route.query.tab === 'deactive' ? UserStatus.Inactive : this.$route.query.tab === 'pending' ? UserStatus.Pending : UserStatus.Active;
    try {
      const { data } = await EmployeeRepository.get(this.paramsUser);
      this.tableData = data.data.items;
      this.meta = data.data.meta;
    } catch (error) {}
  }

  private async getDataCommons() {
    try {
      const [teams, jobs, roles, link] = await Promise.all([
        TeamRepository.getMetaData(),
        JobRepository.getMetaData(),
        RoleRepository.get(),
        AuthRepository.generateLinkInivte(),
      ]);
      this.teams = teams.data.data;
      this.jobs = jobs.data.data;
      this.roles = roles.data.data;
      this.linkInvite = link.data.data.url;
    } catch (error) {}
  }

  private handleSearch(textSearch: string) {
    this.paramsUser.page = 1;
    const tab = this.$route.query.tab === undefined ? 'active' : this.$route.query.tab;
    this.$router.push(`?tab=${tab}&text=${textSearch}`);
  }

  private handlePagination(pagination: any) {
    const tab = this.$route.query.tab === undefined ? 'active' : this.$route.query.tab;
    this.$route.query.text === undefined
      ? this.$router.push(`?tab=${tab}&page=${pagination.page}`)
      : this.$router.push(`?tab=${tab}&text=${this.$route.query.text}&page=${pagination.page}`);
  }

  private tabs: string[] = [...Object.values(UserStatus)];

  private handleClick(currentTab: string) {
    this.paramsUser.text = '';
    this.paramsUser.page = 1;
    this.paramsUser.status = currentTab === UserStatus.Active ? 1 : currentTab === UserStatus.Pending ? 0 : -1;
    this.$router.push(`?tab=${currentTab === UserStatus.Active ? 'active' : currentTab === UserStatus.Pending ? 'pending' : 'deactive'}`);
  }

  private get currentTabComponent() {
    if (this.$route.query.tab === 'deactive') {
      return EmployeeDeactive;
    } else if (this.$route.query.tab === 'pending') {
      return EmployeePending;
    } else {
      return EmployeeActive;
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
.manage-employee {
  height: 100%;
  &__title {
    font-size: $text-2xl;
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
