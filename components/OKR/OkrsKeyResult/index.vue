<template>
  <el-dialog
    :title="isCreate ? 'Tạo OKRs' : 'Cập nhật OKRs'"
    :visible.sync="isDialogOKRs"
    width="800px"
    placement="center"
    :before-close="handleCloseDialog"
    class="company-okrs"
  >
    <el-steps :active="active" finish-status="success" :align-center="true">
      <el-step title="Mục tiêu"></el-step>
      <el-step title="Các kết quả then chốt"></el-step>
      <el-step title="Liên kết mục tiêu"></el-step>
    </el-steps>
    <step-objective v-if="active === 0" :active.sync="active" />
    <step-key-result v-if="active === 1" :active.sync="active" />
    <step-align-objective v-if="active === 2" :active.sync="active" />
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import {
  DispatchAction,
  GetterState,
} from '@/constants/app.vuex';
import { confirmWarningConfig } from '@/constants/app.constant';
import StepObjective from '@/components/okrs/add-update/StepObjective.vue';
import StepKeyResult from '@/components/okrs/add-update/StepKeyResult.vue';
import StepAlignObjective from '@/components/okrs/add-update/StepAlignObjective.vue';

@Component<AddOkrs>({
  name: 'AddOkrs',
  components: {
    StepObjective,
    StepKeyResult,
    StepAlignObjective,
  },
  computed: {
    ...mapGetters({
      isDialogOKRs: GetterState.OKRS_IS_DIALOG_OKRS,
      isCreate: GetterState.OKRS_IS_CREATE,
    }),
  },
})
export default class AddOkrs extends Vue {
  private active: Number = 0;

  private handleCloseDialog() {
    this.$confirm(
      'Bạn có chắc chắn muốn thoát, hệ thống sẽ không lưu lại các giá trị cũ?',
      { ...confirmWarningConfig },
    )
      .then(() => {
        this.$store.dispatch(DispatchAction.CLOSE_DIALOG_OKRS);
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
