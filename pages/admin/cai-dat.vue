<template>
  <fragment>
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
              <el-button class="el-button--purple el-button--small el-button--invite" icon="el-icon-plus" @click="addNew(currentTab)">
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
            <component :is="currentTabComponent" :table-data="tableData" />
            <!--  :loading="loading" :total="total" :limit="limit" :page="page" -->
          </div>
        </el-tabs>
      </template>
    </admin-slot>
    <!-- <cycle-okrs-dialog :cycle-visible-dialog="cycleVisibleDialog" /> -->
    <el-dialog
      v-if="topChange.buttonName === 'chu kỳ'"
      title="Thêm mới chu kỳ"
      :visible.sync="cycleVisibleDialog"
      width="30%"
      placement="center"
      :before-close="handleCloseDialog"
      class="dialog-cycle-okrs"
    >
      <el-row>
        <el-col :span="24">
          <el-form ref="temCreateCycle" :model="temCreateCycle" :rules="cycleRulesForm">
            <el-form-item label="Tên chu kỳ" prop="name" class="custom-label" label-width="120px">
              <el-input v-model="temCreateCycle.name" placeholder="Nhập tên chu kỳ" />
            </el-form-item>
            <el-form-item label="Ngày bắt đầu" prop="startDate" class="custom-label" label-width="120px">
              <el-date-picker
                v-model="temCreateCycle.startDate"
                type="date"
                placeholder="Chọn ngày bắt đầu"
                :format="dateFormat"
                :value-format="dateFormat"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="Ngày kết thúc" prop="endDate" class="custom-label" label-width="120px">
              <el-date-picker
                v-model="temCreateCycle.endDate"
                type="date"
                placeholder="Chọn ngày kết thúc"
                :format="dateFormat"
                :value-format="dateFormat"
              ></el-date-picker>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <span slot="footer">
        <el-button class="el-button--white el-button--modal" @click="handleCloseDialog">Hủy</el-button>
        <el-button class="el-button--purple el-button--modal" :loading="loading" @click="createCycleOkrs">Thêm mới</el-button>
      </span>
    </el-dialog>
  </fragment>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Context } from '@nuxt/types';
import { Notification, Form } from 'element-ui';
import { CycleDTO } from '@/constants/app.interface';
import ManageCycleOkrs from '@/components/admin/CycleOkrs.vue';
import ManageEvaluationCriteria from '@/components/admin/EvaluationCriteria.vue';
import ManageJobPosition from '@/components/admin/JobPosition.vue';
import ManageMeasureUnit from '@/components/admin/MeasureUnit.vue';
import ManageDepartment from '@/components/admin/Department.vue';
import { AdminTabsVn, AdminTabsEn } from '@/constants/app.enum';
import CycleRepository from '@/repositories/CycleRepository';
import { Maps, Rule } from '@/constants/app.type';
import { compareTwoDate, formatDateToYYYY } from '@/utils/dateParser';

@Component<SettingCompanyPage>({
  name: 'SettingCompanyPage',
  watchQuery: ['tab'],
  async asyncData({ query }: Context) {
    if (query.tab === AdminTabsEn.CycleOKR || query.tab === undefined) {
      try {
        const { data } = await CycleRepository.get();
        const tableData = Object.freeze(data.data);
        return {
          tableData,
        };
      } catch (error) {
        Notification({
          title: 'Status',
          message: 'Có lỗi xảy ra bất ngờ 🥳',
          type: 'error',
          duration: 2000,
        });
      }
    }
  },
})
export default class SettingCompanyPage extends Vue {
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

  private tabs: string[] = [...Object.values(AdminTabsVn)];
  private textSearch: string = '';

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

  private addNew(currentTab: string) {
    console.log(currentTab);
    if (currentTab === AdminTabsVn.CycleOKR) {
      this.cycleVisibleDialog = true;
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

  private loading: boolean = false;
  private cycleVisibleDialog: boolean = false;
  private dateFormat: string = 'dd/MM/yyyy';
  private temCreateCycle: CycleDTO = {
    name: '',
    startDate: null,
    endDate: null,
  };

  private cycleRulesForm: Maps<Rule[]> = {
    name: [
      { type: 'string', required: true, message: 'Vui lòng nhập tên chu kỳ', trigger: 'blur' },
      { min: 3, message: 'Tên chu kỳ chứa ít nhất 3 ký tự' },
    ],
    startDate: [{ required: true, message: 'Vui lòng chọn ngày bắt đầu', trigger: 'blur' }],
    endDate: [
      { required: true, message: 'Vui lòng chọn ngày kết thúc', trigger: 'blur' },
      { validator: this.validateEndDate, trigger: ['blur', 'change'] },
    ],
  };

  private validateEndDate(rule: any, value: any, callback: (message?: string) => any): (message?: string) => any {
    if (compareTwoDate(value, this.temCreateCycle.startDate) === 1) {
      return callback('Ngày kết thúc phải lớn hơn ngày bắt đầu');
    }
    return callback();
  }

  private createCycleOkrs() {
    (this.$refs.temCreateCycle as Form).validate(async (isValid) => {
      this.loading = true;
      try {
        const tempCycle: CycleDTO = {
          name: this.temCreateCycle.name,
          startDate: formatDateToYYYY(this.temCreateCycle.startDate),
          endDate: formatDateToYYYY(this.temCreateCycle.endDate),
        };
        await CycleRepository.post(tempCycle).then((res) => {
          this.$notify({
            title: 'Status',
            message: `Tạo mới thành công chu kỳ ${res.data.data.name}`,
            type: 'success',
            duration: 1000,
          });
        });
        this.loading = false;
        this.cycleVisibleDialog = false;
      } catch (error) {
        this.$notify({
          title: 'Lỗi',
          message: `Lỗi ${error.message}`,
          type: 'error',
          duration: 1000,
        });
        this.loading = false;
      }
    });
  }

  private handleCloseDialog() {
    (this.$refs.temCreateCycle as Form).clearValidate();
    this.cycleVisibleDialog = false;
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
