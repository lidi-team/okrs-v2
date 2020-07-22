<template>
  <div class="manage-employee">
    <h1 class="manage-employee__title">Quản lý nhân sự</h1>
    <el-tabs v-model="currentTab" @tab-click="handleClick(currentTab)">
      <el-tab-pane v-for="tab in tabs" :key="tab" :label="tab" :name="tab"></el-tab-pane>
      <div class="manage-employee__content">
        <head-employee :text="paramsUser.text" @name="paramsUser.text = $event" @search="handleSearch($event)" />
        <component :is="currentTabComponent" :loading="loading" :table-data="tableData" />
        <base-pagination
          class="manage-employee__pagination"
          :total="meta.totalItems"
          :page.sync="meta.currentPage"
          :limit.sync="meta.itemsPerPage"
          @pagination="handlePagination($event)"
        />
      </div>
    </el-tabs>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import EmployeePending from '@/components/manage/employee/EmployeePending.vue';
import EmployeeActive from '@/components/manage/employee/EmployeeActive.vue';
import EmployeeDeactive from '@/components/manage/employee/EmployeeDeactive.vue';
import { UserStatus } from '@/constants/app.enum';
import { ParamsUser } from '@/constants/app.interface';
import UserRepository from '@/repositories/UserRepository';

@Component<ManageEmployee>({
  name: 'ManageEmployee',
  watchQuery: ['tab', 'text', 'page'],
  async asyncData({ query }) {
    const paramsUser: ParamsUser = {
      status: query.tab === 'deactive' ? -1 : query.tab === 'pending' ? 0 : 1,
      text: query.text ? String(query.text) : '',
      page: query.page ? Number(query.page) : 1,
      limit: 10,
    };
    try {
      const { data } = await UserRepository.get(paramsUser);
      return {
        tableData: data.data.items,
        meta: data.data.meta,
        paramsUser: {
          status: query.tab === 'deactive' ? -1 : query.tab === 'pending' ? 0 : 1,
          text: query.text ? String(query.text) : '',
          page: query.page ? Number(query.page) : 1,
          limit: 10,
        },
        currentTab: query.tab === 'deactive' ? UserStatus.Inactive : query.tab === 'pending' ? UserStatus.Pending : UserStatus.Active,
      };
    } catch (error) {
      this.$notify({
        title: 'Status',
        message: 'Có lỗi xảy ra',
        type: 'error',
        duration: 1000,
      });
    }
  },
})
export default class ManageEmployee extends Vue {
  private tableData: Array<object> = [];
  private paramsUser: ParamsUser = {
    status: 1,
    text: '',
    page: 1,
    limit: 20,
  };

  private meta: object = {};

  private loading: boolean = false;

  private handleSearch(textSearch: string) {
    const tab = this.$route.query.tab === undefined ? 'active' : this.$route.query.tab;
    this.$router.push(`?tab=${tab}&text=${textSearch}`);
  }

  private handlePagination(pagination: any) {
    const tab = this.$route.query.tab === undefined ? 'active' : this.$route.query.tab;
    this.$route.query.text === undefined
      ? this.$router.push(`?tab=${tab}&page=${pagination.page}`)
      : this.$router.push(`?tab=${tab}&text=${this.$route.query.text}&page=${pagination.page}`);
  }

  private currentTab: any = null;
  private tabs: string[] = [...Object.values(UserStatus)];
  private handleClick(currentTab: string) {
    this.paramsUser.text = '';
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

<style lang="scss">
@import '@/assets/scss/main.scss';
$bg-gray-employee: #e5e5e5;
.manage-employee {
  padding: $unit-10 $unit-8;
  background-color: $bg-gray-employee;
  .el-tabs__nav-wrap::after {
    background-color: $neutral-primary-0;
  }
  .el-tabs__item.is-active {
    color: $purple-primary-4;
  }
  .el-tabs__active-bar {
    background-color: $purple-primary-3;
  }
  .el-tabs__item:hover {
    color: $purple-primary-4;
  }
  .el-tabs__item {
    color: $neutral-primary-2;
  }
  &__title {
    font-size: $text-2xl;
    padding-bottom: $unit-10;
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
