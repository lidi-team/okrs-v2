<template>
  <div>
    <div class="-display-flex -justify-content-between">
      <h1 class="-title-1">Quản lý nhân sự</h1>
      <div class="-display-flex">
        <employees-header
          :text.sync="paramsUser.text"
          @name="paramsUser.text = $event"
          @search="handleSearch($event)"
        />
        <el-button
          class="el-button--purple el-button--modal el-button--invite -ml-2"
          icon="el-icon-plus"
          @click="handleAddUsers"
        >
          Thêm nhân viên
        </el-button>
      </div>
    </div>
    <el-tabs v-model="currentTab" @tab-click="handleClick(currentTab)">
      <el-tab-pane
        v-for="tab in tabs"
        :key="tab"
        :label="tab"
        :name="tab"
      ></el-tab-pane>
      <div>
        <employees-active
          :get-list-users="getListUsers"
          :teams="teams"
          :roles="roles"
          :jobs="jobs"
          :table-data="tableData"
        />
        <div class="-display-flex -justify-content-center">
          <common-pagination
            :total="meta.totalItems"
            :page.sync="paramsUser.page"
            :limit.sync="paramsUser.limit"
            @pagination="handlePagination($event)"
          />
        </div>
      </div>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { UserStatus } from '@/constants/app.enum';
import { ParamsUser } from '@/constants/DTO/common';
import EmployeeRepository from '@/repositories/EmployeeRepository';
import TeamRepository from '@/repositories/TeamRepository';
import { pageLimit } from '@/constants/app.constant';
import CommonPagination from '@/components/Common/CommonPagination.vue';
import EmployeesActive from '@/components/Employees/EmployeesActive.vue';
import EmployeesHeader from '@/components/Employees/EmployeesHeader.vue';

@Component<ManageEmployeePage>({
  middleware: 'employeesPage',
  components: {
    CommonPagination,
    EmployeesActive,
    EmployeesHeader,
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
export default class ManageEmployeePage extends Vue {
  private tableData: Array<object> = [];
  private teams: Array<object> = [];
  private jobs: Array<object> = [];
  private roles: Array<object> = [];
  private linkInvite: string = '';
  private meta: object = {};
  private indexPage: number = this.$route.query.page
    ? Number(this.$route.query.page)
    : 1;
  private paramsUser: ParamsUser = {
    page: this.indexPage,
    limit: pageLimit,
    sortWith: 'id',
  };

  private tabs: string[] = [...Object.values(UserStatus)];
  private currentTab: UserStatus =
    this.$route.query.tab === 'all' ? UserStatus.All : UserStatus.Staff;

  @Watch('$route.query')
  private async getListUsers() {
    try {
      const { data } = await EmployeeRepository.get(
        this.paramsUser,
        this.currentTab,
      );
      this.tableData = data.data;
      this.meta = data.meta;
    } catch (error) {
      console.log(error);
    }
  }

  private async getDataCommons() {
    try {
      const [teams] = await Promise.all([TeamRepository.getMetaData()]);
      console.log(teams);

      this.teams = teams.data;
      this.jobs = [];
      this.roles = [];
      this.linkInvite = 'link.data.data.url';
    } catch (error) {}
  }

  private handleSearch(textSearch: string) {
    this.paramsUser.page = 1;
    const tab =
      this.$route.query.tab === undefined ? 'staff' : this.$route.query.tab;
    this.$router.push(`?tab=${tab}&text=${textSearch}`);
  }

  private handlePagination(pagination: any) {
    const tab =
      this.$route.query.tab === undefined ? 'staff' : this.$route.query.tab;
    this.$route.query.text === undefined
      ? this.$router.push(`?tab=${tab}&page=${pagination.page}`)
      : this.$router.push(
          `?tab=${tab}&text=${this.$route.query.text}&page=${pagination.page}`,
        );
  }

  private handleClick(currentTab: string) {
    this.paramsUser.text = '';
    this.paramsUser.page = 1;
    this.$router.push(
      `?tab=${
        currentTab === UserStatus.All ? UserStatus.All : UserStatus.Staff
      }`,
    );
  }

  private handleAddUsers() {
    this.$router.push('nhan-su/them');
  }
}
</script>
