<template>
  <div class="manage-employee">
    <h1 class="manage-employee__title">Quản lý nhân sự</h1>
    <el-tabs v-model="currentTab" @tab-click="handleClick(currentTab)">
      <el-tab-pane v-for="tab in tabs" :key="tab" :label="tab" :name="tab"></el-tab-pane>
      <div class="manage-employee__content">
        <head-employee @search="handleSearch($event)" />
        <component :is="currentTabComponent" :table-data="tableData" />
        <base-pagination class="manage-employee__pagination" :total="100" page.sync="5" limit.sync="20" @pagination="handlePagination($event)" />
      </div>
    </el-tabs>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import EmployeePending from '@/components/manage/employee/EmployeePending.vue';
import EmployeeActive from '@/components/manage/employee/EmployeeActive.vue';
import EmployeeDeactive from '@/components/manage/employee/EmployeeDeactive.vue';
import { UserStatus } from '@/constants/app.enum';
@Component<ManageEmployee>({
  name: 'ManageEmployee',
})
export default class ManageEmployee extends Vue {
  private tableData: Array<Object> = [
    {
      date: '2016-05-03',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles',
    },
    {
      date: '2016-05-02',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles',
    },
    {
      date: '2016-05-04',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles',
    },
    {
      date: '2016-05-01',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles',
    },
  ];

  private search: string = '';

  private handleSearch(textSearch: string) {
    this.search = textSearch;
  }

  private handlePagination(pagination: object) {
    console.log(pagination);
  }

  private currentTab: string = UserStatus.Active;
  private tabs: string[] = [...Object.values(UserStatus)];
  private handleClick(currentTab: string) {
    this.$router.push(`?tab=${currentTab === UserStatus.Active ? 'active' : currentTab === UserStatus.Pending ? 'pending' : 'deactive'}`);
  }

  private get currentTabComponent() {
    if (this.$route.query.tab === 'deactive') {
      this.currentTab = UserStatus.Inactive;
      return EmployeeDeactive;
    } else if (this.$route.query.tab === 'pending') {
      this.currentTab = UserStatus.Pending;
      return EmployeePending;
    } else {
      this.currentTab = UserStatus.Active;
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
