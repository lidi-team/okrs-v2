<template>
  <div>
    <p>{{ cycleCurrent }}</p>
    <el-form ref="tempObjective" :model="tempObjective" :rules="rules" class="create-objective" label-position="top">
      <el-form-item prop="title" class="custom-label" label-width="120px">
        <el-input v-model="tempObjective.title" type="textarea" placeholder="Nhập mục tiêu" :autosize="sizeConfig"></el-input>
      </el-form-item>
      <div v-loading="loadingSelect" class="create-objective__select">
        <el-form-item prop="parentObjectiveId" label="OKRs cấp trên" class="custom-label" label-width="120px">
          <el-select v-model="tempObjective.parentObjectiveId" filterable no-match-text="Không tìm thấy kết quả" placeholder="Chọn OKRs cấp trên">
            <el-option v-for="okrs in listOkrs" :key="okrs.id" :label="okrsLeaderFormat(okrs)" :value="okrs.id" />
          </el-select>
        </el-form-item>
      </div>
    </el-form>
    <div class="okrs-button-action">
      <el-button class="el-button--white el-button--modal" @click="closeObjectiveForm">Hủy</el-button>
      <el-button class="el-button--purple el-button--modal" :loading="loading" @click="nextStepTwo">Tiếp theo</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Form } from 'element-ui';
import { Component, Vue, PropSync, Watch, Prop } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import { ObjectiveDTO } from '@/constants/DTO/okrs';
import { ParamsQuery } from '@/constants/DTO/common';
import { Maps, Rule } from '@/constants/app.type';
import { DispatchAction, MutationState, GetterState } from '@/constants/app.vuex';
import { max255Char } from '@/components/account/account.constant';

import CycleRepository from '@/repositories/CycleRepository';
import OkrsRepository from '@/repositories/OkrsRepository';

@Component<CreateObjective>({
  name: 'CreateObjective',
  computed: {
    ...mapGetters({
      cycleCurrent: GetterState.CYCLE_CURRENT,
    }),
  },
  beforeDestroy() {
    this.$store.dispatch(DispatchAction.SET_MEASURE_UNITS);
  },
  mounted() {},
})
export default class CreateObjective extends Vue {
  @PropSync('active', Number) private syncActive!: number;
  @PropSync('visibleDialog', Boolean) private syncVisibleDialog!: boolean;

  private rules: Maps<Rule[]> = {
    title: [{ type: 'string', required: true, message: 'Vui lòng nhập mục tiêu', trigger: 'blur' }, max255Char],
    cycleId: [{ type: 'number', required: true, message: 'Vui lòng chọn chy kỳ', trigger: 'blur' }],
    parentObjectiveId: [{ type: 'number', required: true, message: 'Vui lòng chọn OKRs cấp trên', trigger: 'blur' }],
  };

  private loading: boolean = false;
  private loadingSelect: boolean = false;

  public tempObjective: ObjectiveDTO = {
    title: '',
    parentObjectiveId: 1,
    cycleId: this.$store.state.cycle.cycleCurrent.id,
    // title: !this.$store.state.okrs.objective ? '' : this.$store.state.okrs.objective.title,
    // parentObjectiveId: this.$store.state.okrs.objective ? this.$store.state.okrs.objective.parentObjectiveId : null,
    // cycleId: this.$store.state.okrs.objective ? this.$store.state.okrs.objective.cycleId : this.$store.state.cycle.cycle.id,
  };

  private listOkrs: any[] = [];
  private listCycles: any[] = [];
  private sizeConfig = { minRows: 2, maxRows: 2 };
  private listDataParams: ParamsQuery = {
    page: 1,
    limit: 10,
  };

  private nextStepTwo(): void {
    this.loading = true;
    (this.$refs.tempObjective as Form).validate((isValid: boolean, invalidatedFields: object) => {
      if (isValid) {
        this.$store.commit(MutationState.SET_OBJECTIVE, this.tempObjective);
        this.syncActive++;
        this.loading = false;
      }
      if (invalidatedFields) {
        setTimeout(() => {
          this.loading = false;
        }, 300);
      }
    });
  }

  public closeObjectiveForm() {
    (this.$refs.tempObjective as Form).clearValidate();
    this.tempObjective.title = '';
    this.$store.commit(MutationState.SET_OBJECTIVE, null);
    this.tempObjective.parentObjectiveId = null;
    this.syncVisibleDialog = false;
  }
}
</script>
<style lang="scss">
@import '@/assets/scss/main.scss';
.create-objective {
  padding: 0 $unit-5;
  &__select {
    display: flex;
    place-content: center flex-start;
    .el-form-item {
      &:nth-child(2) {
        padding-left: 3rem;
        width: 100%;
        .el-select {
          width: 100%;
        }
      }
    }
  }
  .el-form-item__label {
    padding: 0;
  }
}
.okrs-button-action {
  @include okrs-button-action;
}
</style>
