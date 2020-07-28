<template>
  <div>
    <admin-slot class="admin">
      <template #top>
        <el-row type="flex" justify="space-between" class="admin__top">
          <el-col :span="16">
            <div class="admin__top__left">
              <el-autocomplete
                v-model="textSearch"
                class="admin__top__left--input"
                prefix-icon="el-icon-search"
                :placeholder="topChange.textPlaceholder"
              ></el-autocomplete>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="admin__top__right">
              <el-button class="el-button--purple el-button--small el-button--invite" icon="el-icon-plus" @click="addNew">
                Thêm mới {{ topChange.buttonName }}
              </el-button>
            </div>
          </el-col>
        </el-row>
      </template>
      <template #tab>
        <el-tabs v-model="currentTab" class="admin__tab" @tab-click="switchTabs(currentTab)">
          <el-tab-pane v-for="tab in tabs" :key="tab" :label="tab" :name="tab" :lazy="true" />
          <div class="admin__tab__table">
            <component :is="currentTabComponent" :table-data="tableData" :loading="loading" />
            <!--  :loading="loading" :total="total" :limit="limit" :page="page" -->
          </div>
        </el-tabs>
      </template>
    </admin-slot>
    <cycle-okrs-dialog v-if="topChange.tab === 1" :cycle-visible-dialog.sync="cycleVisibleDialog" />
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Context } from '@nuxt/types';
import { Notification } from 'element-ui';
import ManageCycleOkrs from '@/components/admin/CycleOkrs.vue';
import ManageEvaluationCriteria from '@/components/admin/EvaluationCriteria.vue';
import ManageJobPosition from '@/components/admin/JobPosition.vue';
import ManageMeasureUnit from '@/components/admin/MeasureUnit.vue';
import ManageDepartment from '@/components/admin/Department.vue';
import { AdminTabsVn, AdminTabsEn } from '@/constants/app.enum';
import CycleRepository from '@/repositories/CycleRepository';

@Component<SettingCompanyPage>({
  name: 'SettingCompanyPage',
  created() {
    this.getListData();
  },
})
export default class SettingCompanyPage extends Vue {
  private tableData: any[] = [];
  private loading: boolean = false;
  private cycleVisibleDialog: boolean = false;
  private tabs: string[] = [...Object.values(AdminTabsVn)];
  private textSearch: string = '';

  private currentTab: string =
    this.$route.query.tab === AdminTabsEn.MeasureUnit
      ? AdminTabsVn.MeasureUnit
      : this.$route.query.tab === AdminTabsEn.EvaluationCriterial
      ? AdminTabsVn.EvaluationCriterial
      : this.$route.query.tab === AdminTabsEn.JobPosition
      ? AdminTabsVn.JobPosition
      : this.$route.query.tab === AdminTabsEn.Department
      ? AdminTabsVn.Department
      : AdminTabsVn.CycleOKR;

  private switchTabs(currentTab: string) {
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
          : AdminTabsEn.MeasureUnit
      }`,
    );
  }

  private addNew() {
    if (this.topChange.tab === 1) {
      this.cycleVisibleDialog = true;
    }
  }

  @Watch('$route.query')
  private async getListData() {
    this.loading = true;
    if (this.$route.query.tab === AdminTabsEn.CycleOKR || this.$route.query.tab === undefined) {
      try {
        let { data } = await CycleRepository.get();
        data = Object.freeze(data.data);
        this.tableData = data;
        this.loading = false;
      } catch (error) {
        Notification({
          title: 'Status',
          message: error.message,
          type: 'error',
          duration: 2000,
        });
        this.loading = false;
      }
    }
  }

  private get currentTabComponent() {
    if (this.$route.query.tab === undefined || this.$route.query.tab === AdminTabsEn.CycleOKR) {
      return ManageCycleOkrs;
    } else if (this.$route.query.tab === AdminTabsEn.Department) {
      return ManageDepartment;
    } else if (this.$route.query.tab === AdminTabsEn.JobPosition) {
      return ManageJobPosition;
    } else if (this.$route.query.tab === AdminTabsEn.EvaluationCriterial) {
      return ManageEvaluationCriteria;
    } else {
      return ManageMeasureUnit;
    }
  }

  private get topChange() {
    if (this.$route.query.tab === undefined || this.$route.query.tab === AdminTabsEn.CycleOKR) {
      return {
        buttonName: 'chu kỳ',
        textPlaceholder: 'Tìm kiếm chu kỳ',
        tab: 1,
      };
    } else if (this.$route.query.tab === AdminTabsEn.Department) {
      return {
        buttonName: 'phòng ban',
        textPlaceholder: 'Tìm kiếm phòng ban',
        tab: 2,
      };
    } else if (this.$route.query.tab === AdminTabsEn.JobPosition) {
      return {
        buttonName: 'vị trí công việc',
        textPlaceholder: 'Tìm kiếm vị trí công việc',
        tab: 3,
      };
    } else if (this.$route.query.tab === AdminTabsEn.EvaluationCriterial) {
      return {
        buttonName: 'tiêu chí đánh giá',
        textPlaceholder: 'Tìm kiếm tiêu chí đánh giá',
        tab: 4,
      };
    } else {
      return {
        buttonName: 'đơn vị đo lường',
        textPlaceholder: 'Tìm kiếm đơn vị đo lường',
        tab: 5,
      };
    }
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
