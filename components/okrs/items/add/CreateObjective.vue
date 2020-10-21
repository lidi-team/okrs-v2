<template>
  <div>
    <el-form ref="tempObjective" :model="tempObjective" :rules="rules" class="create-objective" label-position="top">
      <el-form-item prop="title" class="custom-label" label-width="120px">
        <el-input v-model="tempObjective.title" type="textarea" placeholder="Nhập mục tiêu" :autosize="sizeConfig"></el-input>
      </el-form-item>
      <el-form-item prop="parentId" label="Mục tiêu cấp trên" class="custom-label" label-width="120px">
        <el-select
          v-model="tempObjective.parentId"
          filterable
          no-match-text="Không tìm thấy kết quả"
          placeholder="Chọn mục tiêu cấp trên"
          :loading="loadingObjective"
        >
          <el-option v-for="objective in listObjectiveParent" :key="objective.id" :label="objective.name" :value="objective.id" />
        </el-select>
      </el-form-item>
    </el-form>
    <div class="okrs-button-action">
      <el-button class="el-button--white el-button--modal" @click="closeObjectiveForm">Hủy</el-button>
      <el-button class="el-button--purple el-button--modal" @click="nextStepTwo">Tiếp theo</el-button>
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
import ObjectiveRepository from '@/repositories/ObjectiveRepository';

@Component<CreateObjective>({
  name: 'CreateObjective',
  computed: {
    ...mapGetters({
      cycleCurrent: GetterState.CYCLE_CURRENT,
    }),
  },
  async mounted() {
    const { data } = await ObjectiveRepository.getObjectivesParent(this.ObjectiveId);
    this.listObjectiveParent = data.objectives;
    this.loadingObjective = false;
  },
})
export default class CreateObjective extends Vue {
  @Prop({ type: Number, default: 0 }) public ObjectiveId!: Number;
  @PropSync('active', Number) private syncActive!: number;

  private rules: Maps<Rule[]> = {
    title: [{ type: 'string', required: true, message: 'Vui lòng nhập mục tiêu', trigger: 'blur' }, max255Char],
    cycleId: [{ type: 'number', required: true, message: 'Vui lòng chọn chy kỳ', trigger: 'blur' }],
    parentObjectiveId: [{ type: 'number', required: true, message: 'Vui lòng chọn OKRs cấp trên', trigger: 'blur' }],
  };

  private loadingObjective: boolean = true;

  public tempObjective: any = {
    title: '',
    parentId: null,
    cycle: this.$store.state.cycle.cycleCurrent.id,
  };

  private listObjectiveParent: any[] = [];
  private sizeConfig = { minRows: 2, maxRows: 2 };
  private listDataParams: ParamsQuery = {
    page: 1,
    limit: 10,
  };

  private nextStepTwo(): void {
    (this.$refs.tempObjective as Form).validate((isValid: boolean, invalidatedFields: object) => {
      if (isValid) {
        console.log('submit', this.tempObjective);
        this.$store.commit(MutationState.SET_OBJECTIVE, this.tempObjective);
        this.syncActive++;
      }
    });
  }

  public closeObjectiveForm() {
    (this.$refs.tempObjective as Form).clearValidate();
    this.tempObjective.title = '';
    this.$store.commit(MutationState.SET_OBJECTIVE, null);
    this.tempObjective.parentObjectiveId = null;
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
