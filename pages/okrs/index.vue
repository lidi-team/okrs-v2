<template>
  <div class="okrs-page">
    <el-row class="okrs-page__top" type="flex" justify="space-between">
      <el-col :xs="24" :sm="24" :md="12" :lg="12" class="okrs-page__top--searching">
        <base-top-search-cycle :cycle-id.sync="cycleId" :text-search.sync="textSearch" :text-search-placeholder="textSearchPlaceholder" />
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
    <div v-loading="loadingForm">
      <item-okrs
        v-for="(item, index) in itemOKRsData"
        :key="item.textHeader"
        :index-item="index"
        :text-header="item.textHeader"
        :table-data="item.tableData"
        :reload-data="getDashBoardOkrs"
      />
    </div>
    <create-okrs-dialog
      v-if="visibleCreateOkrsDialog"
      :is-company-okrs="isCompanyOkrs"
      :visible-dialog.sync="visibleCreateOkrsDialog"
      :reload-data="getDashBoardOkrs"
    />
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import OkrsRepository from '@/repositories/OkrsRepository';
import { MutationState } from '@/constants/app.enum';
import CycleRepository from '@/repositories/CycleRepository';
@Component<OKRsPage>({
  name: 'OKRsPage',
  created() {
    this.getDashBoardOkrs();
  },
  async destroyed() {
    const { data } = await CycleRepository.getCurrentCycle();
    this.$store.commit(MutationState.SET_CURRENT_CYCLE, data.data);
  },
  middleware: ['measureUnit'],
})
export default class OKRsPage extends Vue {
  private textSearchPlaceholder: string = 'Tìm kiếm OKRs của';
  private textSearch: string = '';
  private cycleId: number = this.$store.state.cycle.cycle.id;
  private loadingForm: boolean = false;
  private visibleCreateOkrsDialog = false;
  private isCompanyOkrs: boolean = false;

  @Watch('cycleId')
  private changeCycleData(cycleId: number) {
    this.$store.commit(MutationState.SET_CURRENT_CYCLE, { id: cycleId });
    this.getDashBoardOkrs();
  }

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
    this.loadingForm = true;
    try {
      const { data } = await OkrsRepository.getOkrsDashboard(this.$store.state.cycle.cycle.id);
      this.itemOKRsData[0].tableData = Object.freeze(data.data.root);
      this.itemOKRsData[1].tableData = Object.freeze(data.data.team);
      this.itemOKRsData[2].tableData = Object.freeze(data.data.personal);
      setTimeout(() => {
        this.loadingForm = false;
      }, 500);
    } catch (error) {
      setTimeout(() => {
        this.loadingForm = false;
      }, 500);
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
