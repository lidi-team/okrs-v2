<template>
  <div class="manage-employee">
    <div class="manage-employee__title">
      <h1 class="-title-1">Quản lý nhân sự</h1>
      <div class="-display-flex">
        <head-employee
          :text.sync="paramsUser.text"
          @name="paramsUser.text = $event"
          @search="handleSearch($event)"
        />
        <el-button
          class="el-button--purple el-button--modal el-button--invite -ml-2"
          icon="el-icon-plus"
          @click="handleAddUsers"
          >Thêm nhân viên</el-button
        >
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
        <component
          :is="currentTabComponent"
          :get-list-users="getListUsers"
          :teams="teams"
          :roles="roles"
          :jobs="jobs"
          :table-data="tableData"
        />
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
import EmployeeActive from '@/components/manage/employee/EmployeeActive.vue';
import { UserStatus } from '@/constants/app.enum';
import { ParamsUser } from '@/constants/DTO/common';
import EmployeeRepository from '@/repositories/EmployeeRepository';
import TeamRepository from '@/repositories/TeamRepository';
import { pageLimit } from '@/constants/app.constant';
import CommonPagination from '@/components/Commons/CommonPagination.vue';
import HeadEmployee from '@/components/manage/employee/HeadEmployee.vue';
@Component<ManageEmployee>({
  name: 'ManageEmployee',
  middleware: 'employeesPage',
  components: {
    CommonPagination,
    HeadEmployee,
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
      const [
        teams,
      ] = await Promise.all([
        TeamRepository.getMetaData(),
      ]);
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

  private get currentTabComponent() {
    return EmployeeActive;
  }

  private handleAddUsers() {
    this.$router.push('nhan-su/them');
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
.manage-employee {
  height: 100%;
  &__title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
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
