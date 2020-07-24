<template>
  <admin-slot class="admin">
    <template #top>
      <el-row type="flex" justify="space-between">
        <el-col :span="10">
          <div class="admin-top__left">
            <el-autocomplete
              v-model="textSearch"
              :fetch-suggestions="querySearchAsync"
              :placeholder="textSearchPlaceHolder"
              @select="handleSelect"
            ></el-autocomplete>
          </div>
        </el-col>
        <el-col :span="10">
          <div class="admin-top__right">
            <el-button class="el-button--purple el-button--small el-button--invite" icon="el-icon-plus">Thêm mới</el-button>
          </div>
        </el-col>
      </el-row>
    </template>
    <template #tab>
      <el-tabs v-model="currentTab" @tabs-click="changeTab(currentTab)">
        <el-tab-pane v-for="tab in tabs" :key="tab.date" :label="tab" :name="tab" :lazy="true"></el-tab-pane>
      </el-tabs>
    </template>
    <template #table>
      <component :is="currentTabComponent" :tab-data="tableData" />
      <div v-if="tableData.length > 0">
        <base-pagination :total="100" page.sync="5" limit.sync="20" @pagination="handlePagination($event)" />
      </div>
    </template>
  </admin-slot>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { AdminTabsVn, AdminTabsEn } from '@/constants/app.enum';

@Component<ManageSettingPage>({ name: 'ManageSettingPage', layout: 'Authenticated' })
export default class ManageSettingPage extends Vue {
  private tabs: string[] = [...Object.values(AdminTabsVn)];
  private textSearchPlaceHolder = 'Tìm kiếm something';
  private textSearch: string = '';
  private currentTab: string = AdminTabsVn.CycleOKR;
  private timeout!: null;
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

  private changeTab(currentTab: string) {
    if (currentTab === AdminTabsVn.CycleOKR) {
      this.$router.push(`?tab=${AdminTabsEn.CycleOKR}`);
    } else if (currentTab === AdminTabsVn.Department) {
      this.$router.push(`?tab=${AdminTabsEn.Department}`);
    } else if (currentTab === AdminTabsVn.JobPosition) {
      this.$router.push(`?tab=${AdminTabsEn.JobPosition}`);
    } else if (currentTab === AdminTabsVn.EvaluationCriterial) {
      this.$router.push(`?tab=${AdminTabsEn.EvaluationCriterial}`);
    } else {
      this.$router.push(`?tab=${AdminTabsEn.MeasureUnit}`);
    }
  }

  private querySearchAsync(queryString, cb) {
    const tableData = this.tableData;
    const results = queryString ? tableData.filter(this.createFilter(queryString)) : tableData;

    // clearTimeout(this.timeout);
    // this.timeout = setTimeout(() => {
    //   cb(results);
    // }, 3000 * Math.random());
  }

  private createFilter(queryString) {
    return (link) => {
      return link.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
    };
  }

  private currentTabComponent() {
    // if (this.$route.query.tab === AdminTabsEn.CycleOKR) {
    //   this.currentTab = AdminTabsVn.CycleOKR;
    //   return EmployeeDeactive;
    // } else if (this.$route.query.tab === 'pending') {
    //   this.currentTab = UserStatus.Pending;
    //   return EmployeePending;
    // } else {
    //   this.currentTab = UserStatus.Active;
    //   return EmployeeActive;
    // }
  }

  private handleSelect(item) {
    console.log(item);
  }
}
</script>
<style lang="ts" scoped></style>
