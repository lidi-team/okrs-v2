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
          :loading="loading"
        >
          <el-option v-for="objective in listObjectiveParent" :key="objective.id" :label="objective.name" :value="objective.id" />
        </el-select>
      </el-form-item>
      <el-form-item prop="weight" label="Trọng số" class="custom-label" label-width="120px">
        <el-slider v-model="tempObjective.weight" :step="1" show-stops :min="1" :max="5"></el-slider>
      </el-form-item>
    </el-form>
    <div class="okrs-button-action">
      <el-button class="el-button--white el-button--modal" @click="handleCloseDialog">Hủy</el-button>
      <el-button class="el-button--purple el-button--modal" @click="nextStepTwo">Tiếp theo</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Form } from 'element-ui';
import { mapGetters } from 'vuex';
import { Component, Vue, PropSync, Watch, Prop } from 'vue-property-decorator';

import { max255Char } from '@/constants/account.constant';
import { confirmWarningConfig } from '@/constants/app.constant';
import { ObjectiveDTO } from '@/constants/DTO/okrs';
import { ParamsQuery } from '@/constants/DTO/common';
import { Maps, Rule } from '@/constants/app.type';
import { DispatchAction, MutationState, GetterState } from '@/constants/app.vuex';

import CycleRepository from '@/repositories/CycleRepository';
import OkrsRepository from '@/repositories/OkrsRepository';
import ObjectiveRepository from '@/repositories/ObjectiveRepository';
import ProjectRepository from '@/repositories/ProjectRepository';

@Component<CreateObjective>({
  name: 'CreateObjective',
  computed: {
    ...mapGetters({
      cycleCurrent: GetterState.CYCLE_CURRENT,
      objectiveParent: GetterState.OKRS_OBJECTIVE_PARENT,
      isDialog: GetterState.OKRS_IS_DIALOG_OKRS,
    }),
  },
  mounted() {
    this.loading = true;
    this.getData();
    this.loading = false;
  },
})
export default class CreateObjective extends Vue {
  @PropSync('active', Number) private syncActive!: number;

  @Watch('isDialog')
  private changeDialog(value) {
    if (value === true) {
      this.getData();
    }
  }

  private loading: Boolean = false;

  private async getData() {
    const { title, parentId, weight, projectId } = this.$store.state.okrs.objective;
    this.tempObjective = {
      title,
      parentId,
      weight,
    };
    const { data } = await ObjectiveRepository.getObjectivesProject(3, projectId);
    this.listObjectiveParent = data || [];
  }

  private rules: Maps<Rule[]> = {
    title: [{ type: 'string', required: true, message: 'Vui lòng nhập mục tiêu', trigger: 'blur' }, max255Char],
    parentObjectiveId: [{ type: 'number', required: true, message: 'Vui lòng chọn OKRs cấp trên', trigger: 'blur' }],
  };

  public tempObjective: any = {
    title: '',
    parentId: 1,
    weight: 1,
  };

  private listObjectiveParent: Array<any> = [];

  private sizeConfig = { minRows: 2, maxRows: 2 };
  private listDataParams: ParamsQuery = {
    page: 1,
    limit: 10,
  };

  private nextStepTwo(): void {
    (this.$refs.tempObjective as Form).validate((isValid: boolean, invalidatedFields: object) => {
      if (isValid) {
        this.$store.commit(MutationState.SET_OBJECTIVE, this.tempObjective);
        this.syncActive++;
      }
    });
  }

  private handleCloseDialog() {
    this.$confirm('Bạn có chắc chắn muốn thoát, hệ thống sẽ không lưu lại các giá trị cũ?', { ...confirmWarningConfig })
      .then(() => {
        this.$store.dispatch(DispatchAction.CLOSE_DIALOG_OKRS);
      })
      .catch((err) => console.log(err));
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
