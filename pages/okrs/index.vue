<template>
  <div class="okrs-page">
    <el-row class="okrs-page__top" type="flex" justify="space-between">
      <el-col :xs="24" :sm="24" :md="12" :lg="12" class="okrs-page__top--searching">
        <base-top-search-cycle :text-cycle.sync="textCycle" :text-search.sync="textSearch" :text-search-placeholder="textSearchPlaceholder" />
      </el-col>
      <el-col :xs="24" :sm="24" :md="8" :lg="8" class="okrs-page__top--button">
        <el-button v-if="isNotAdminButton()" class="el-button el-button--purple el-button-medium" icon="el-icon-plus" @click="addPersonalOkrs">
          Tạo OKRs
        </el-button>
        <el-dropdown v-else class="create-okr-dropdown" trigger="click" @command="handleCommand">
          <el-button class="el-button el-button--purple el-button-medium" icon="el-icon-plus">Tạo OKRs</el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="personal">Tạo OKRs cá nhân</el-dropdown-item>
            <el-dropdown-item command="company">Tạo OKRs công ty</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-row>
    <item-okrs
      v-for="item in itemOKRsData"
      :key="item.textHeader"
      :text-header="item.textHeader"
      :table-data="item.tableData"
      :loading="loading"
      :reload-data="getDashBoardOkrs"
    />
    <create-okrs-dialog
      v-if="visibleCreateOkrsDialog"
      :is-company-okrs="isCompanyOkrs"
      :visible-dialog.sync="visibleCreateOkrsDialog"
      :reload-data="getDashBoardOkrs"
    />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import OkrsRepository from '@/repositories/OkrsRepository';
@Component<OKRsPage>({
  name: 'OKRsPage',
  created() {
    this.getDashBoardOkrs();
  },
  middleware: ['measureUnit'],
})
export default class OKRsPage extends Vue {
  private textSearchPlaceholder: string = 'Tìm kiếm OKRs của';
  private textSearch: string = '';
  private textCycle: string = '';
  private loading: boolean = false;
  private visibleCreateOkrsDialog = false;
  private isCompanyOkrs: boolean = false;

  private handleCommand(command: string) {
    if (command === 'company') {
      this.visibleCreateOkrsDialog = true;
      this.isCompanyOkrs = true;
    } else {
      this.isCompanyOkrs = false;
      this.visibleCreateOkrsDialog = true;
    }
  }

  private addPersonalOkrs() {
    this.isCompanyOkrs = false;
    this.visibleCreateOkrsDialog = true;
  }

  private itemOKRsData: any[] = [
    { textHeader: 'OKRs toàn công ty', tableData: null },
    { textHeader: 'OKRs nhóm', tableData: null },
    { textHeader: 'OKRs cá nhân', tableData: null },
  ];

  private async getDashBoardOkrs() {
    this.loading = true;
    try {
      const currentCycleId: number = +this.$store.state.cycle.cycle.id;
      const { data } = await OkrsRepository.getOkrsDashboard(currentCycleId);
      this.itemOKRsData[0].tableData = Object.freeze(data.data.root);
      this.itemOKRsData[1].tableData = Object.freeze(data.data.team);
      this.itemOKRsData[2].tableData = Object.freeze(data.data.personal);
      this.loading = false;
    } catch (error) {
      this.loading = false;
    }
  }

  private isNotAdminButton(): boolean {
    return this.$store.state.auth.user.role.name !== 'ADMIN';
  }
}
</script>
<style lang="scss">
@import '@/assets/scss/main.scss';
.okrs-page {
  width: 85%;
  &__top {
    @include breakpoint-down(phone) {
      flex-direction: column;
    }
    &--searching {
      padding: $unit-7 0 $unit-4 0;
    }
    &--button {
      display: flex;
      margin: $unit-7 0 $unit-4 0;
      justify-content: flex-end;
      @include breakpoint-down(phone) {
        justify-content: center;
      }
    }
  }
  .el-table__empty-block {
    width: 100% !important;
  }
}
.create-okr-dropdown {
  color: $neutral-primary-4;
}
</style>
