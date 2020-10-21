<template>
  <div>
    <div>
      <el-button class="el-button el-button--small el-button--purple" icon="el-icon-plus" @click="createOkrs('personal')">Tạo OKRs cá nhân</el-button>
      <el-button class="el-button el-button--purple el-button--small" icon="el-icon-plus" @click="createOkrs('company')">Tạo OKRs công ty</el-button>
    </div>
    <el-dialog :title="title" :visible.sync="isShowDialog" width="800px" placement="center" :before-close="handleCloseDialog" class="company-okrs">
      <el-steps :active="active" finish-status="success" :align-center="true">
        <el-step title="Mục tiêu"></el-step>
        <el-step title="Các kết quả then chốt"></el-step>
        <el-step title="Liên kết mục tiêu"></el-step>
      </el-steps>
      <create-objective v-if="active === 0" :active.sync="active" />
      <!-- <step-add-key-results
        v-if="active === 1"
        :active.sync="active"
        :visible-dialog.sync="syncCreateOkrsDialog"
        :is-company-okrs="isCompanyOkrs"
        :reload-data="reloadData"
      />
      <step-add-align-objective
        v-if="active === 2 && !isCompanyOkrs"
        :active.sync="active"
        :visible-dialog.sync="syncCreateOkrsDialog"
        :reload-data="reloadData"
      /> -->
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { DispatchAction } from '@/constants/app.vuex';
import { confirmWarningConfig } from '@/constants/app.constant';
import CreateObjective from '@/components/okrs/items/add/CreateObjective.vue';

@Component<AddOkrs>({
  name: 'AddOkrs',
  components: {
    CreateObjective,
  },
})
export default class AddOkrs extends Vue {
  private title: String = 'Thêm mới mục tiêu...';
  private isShowDialog: Boolean = false;
  private active: Number = 0;

  private createOkrs(type: String) {
    this.isShowDialog = true;
    this.title = type === 'personal' ? 'Thêm mới mục tiêu cá nhân' : 'Thêm mới mục tiêu công ty';
  }

  private handleCloseDialog() {
    this.$confirm('Bạn có chắc chắn muốn thoát, hệ thống sẽ không lưu lại các giá trị cũ?', { ...confirmWarningConfig })
      .then(() => {
        this.$store.dispatch(DispatchAction.CLEAR_OKRS);
        this.isShowDialog = false;
        this.active = 0;
      })
      .catch((err) => console.log(err));
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
.el-steps {
  padding-bottom: $unit-8;
}
.company-okrs {
  .el-step {
    &__head {
      width: unset;
      .el-step__line {
        top: $unit-4;
        background-color: $purple-primary-4;
        border-color: $purple-primary-4;
      }
      .el-step__icon {
        @include size($unit-8, $unit-8);
        background-color: $purple-primary-4;
      }
    }
    &__main {
      .el-step__title {
        color: $purple-primary-5 !important;
      }
    }
    .is-process {
      color: $white;
    }
    .is-success {
      border-color: $white;
    }
    .el-icon-check {
      color: $white;
    }
  }
  .el-dialog__body {
    padding: 10px 0;
  }
}
</style>
