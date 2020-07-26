<template>
  <admin-slot class="admin">
    <template #top>
      <el-row type="flex" justify="space-between" class="admin__top">
        <el-col :span="16">
          <div class="admin__top__left">
            <el-autocomplete
              v-model="textSearch"
              class="admin__top__left--input"
              prefix-icon="el-icon-search"
              :fetch-suggestions="querySearchAsync"
              :placeholder="topChange.textPlaceholder"
              @select="handleSelect"
            ></el-autocomplete>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="admin__top__right">
            <el-button class="el-button--purple el-button--small el-button--invite" icon="el-icon-plus"
              >Thêm mới {{ topChange.buttonName }}</el-button
            >
          </div>
        </el-col>
      </el-row>
    </template>
    <template #tab>
      <el-tabs v-model="currentTab" class="admin__tab" @tab-click="changeTabs(currentTab)">
        <el-tab-pane v-for="tab in tabs" :key="tab" :label="tab" :name="tab" :lazy="true" />
        <div class="admin__tab__table">
          <component :is="currentTabComponent" :table-data="tableData" />
          <!--  :loading="loading" :total="total" :limit="limit" :page="page" -->
        </div>
      </el-tabs>
    </template>
  </admin-slot>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ManageCycleOkrs from '@/components/admin/CycleOkrs.vue';
import ManageEvaluationCriteria from '@/components/admin/EvaluationCriteria.vue';
import ManageJobPosition from '@/components/admin/JobPosition.vue';
import ManageMeasureUnit from '@/components/admin/MeasureUnit.vue';
import ManageDepartment from '@/components/admin/Department.vue';
import { AdminTabsVn, AdminTabsEn } from '@/constants/app.enum';

@Component<SettingCompanyPage>({
  name: 'SettingCompanyPage',
  watchQuery: ['tab', 'text', 'page'],
  async asyncData({ query }) {},
})
export default class SettingCompanyPage extends Vue {
  private tabs: string[] = [...Object.values(AdminTabsVn)];
  private textSearch: string = '';
  private adminTopObject: any = {
    buttonName: '',
    textPlaceholder: '',
  };

  private currentTab: any = null;
  private timeout: number = 1000;

  public tableData: Object[] = [
    {
      id: 1,
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles',
    },
    {
      id: 1,
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles',
    },
    {
      id: 1,
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles',
    },
    {
      id: 1,
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles',
    },
  ];

  private changeTabs(currentTab: string) {
    this.$router.push(
      `?tab=${
        currentTab === AdminTabsVn.CycleOKR
          ? AdminTabsEn.CycleOKR
          : currentTab === AdminTabsVn.Department
          ? AdminTabsEn.Department
          : currentTab === AdminTabsVn.JobPosition
          ? AdminTabsEn.JobPosition
          : currentTab === AdminTabsVn.EvaluationCriterial
          ? AdminTabsEn.EvaluationCriterial
          : AdminTabsEn.JobPosition
      }`,
    );
  }

  private get currentTabComponent() {
    if (this.$route.query.tab === undefined || this.$route.query.tab === AdminTabsEn.CycleOKR) {
      return ManageCycleOkrs;
    } else if (this.$route.query.tab === AdminTabsEn.Department) {
      // this.currentTab = AdminTabsVn.Department;
      return ManageDepartment;
    } else if (this.$route.query.tab === AdminTabsEn.JobPosition) {
      // this.currentTab = AdminTabsVn.JobPosition;
      return ManageJobPosition;
    } else if (this.$route.query.tab === AdminTabsEn.EvaluationCriterial) {
      // this.currentTab = AdminTabsVn.EvaluationCriterial;
      return ManageEvaluationCriteria;
    } else {
      // this.currentTab = AdminTabsVn.MeasureUnit;
      return ManageMeasureUnit;
    }
  }

  private get topChange() {
    if (this.$route.query.tab === undefined || this.$route.query.tab === AdminTabsEn.CycleOKR) {
      return {
        buttonName: 'chu kỳ',
        textPlaceholder: 'Tìm kiếm chu kỳ',
      };
    } else if (this.$route.query.tab === AdminTabsEn.Department) {
      return {
        buttonName: 'phòng ban',
        textPlaceholder: 'Tìm kiếm phòng ban',
      };
    } else if (this.$route.query.tab === AdminTabsEn.JobPosition) {
      return {
        buttonName: 'vị trí công việc',
        textPlaceholder: 'Tìm kiếm vị trí công việc',
      };
    } else if (this.$route.query.tab === AdminTabsEn.EvaluationCriterial) {
      return {
        buttonName: 'tiêu chí đánh giá',
        textPlaceholder: 'Tìm kiếm tiêu chí đánh giá',
      };
    } else {
      return {
        buttonName: 'đơn vị đo lường',
        textPlaceholder: 'Tìm kiếm đơn vị đo lường',
      };
    }
  }

  private querySearchAsync(queryString, cb) {
    // const tableData = this.tableData;
    // const results = queryString ? tableData.filter(this.createFilter(queryString)) : tableData;
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

  private handleSelect() {
    console.log(this.textSearch);
  }
}
</script>
<style lang="ts" scoped></style>
<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
.admin {
  margin-left: $unit-9;
  &__top {
    margin: $unit-8 0 $unit-8 0;
    &__left {
      &--input {
        width: calc(100vw * 5 / 24);
      }
    }
    &__right {
      height: 100%;
    }
  }
  &__tab {
    margin: $unit-4 0 0 0;
    width: 80%;
    &__table {
    }
  }
  .el-button {
    height: 100%;
  }
}
</style>
