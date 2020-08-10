<template>
  <fragment>
    <el-form ref="tempObjective" :model="tempObjective" :rules="rules" class="create-objective" label-position="top">
      <el-form-item prop="title" class="custom-label" label-width="120px">
        <el-input v-model="tempObjective.title" type="textarea" placeholder="Nhập mục tiêu" :autosize="autoSizeConfig"></el-input>
      </el-form-item>
      <div class="create-objective__select">
        <el-form-item label="Chu kỳ" class="custom-label" label-width="120px">
          <el-select v-model="tempObjective.cycleId" filterable no-match-text="Không tìm thấy chu kỳ" placeholder="Chọn chu kỳ">
            <el-option v-for="cycle in listCycles" :key="cycle.id" :label="cycle.name" :value="cycle.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="OKRs cấp trên" class="custom-label" label-width="120px">
          <el-select
            v-model="tempObjective.parentObjectiveId"
            filterable
            no-match-text="Không tìm thấy kết quả"
            :loading="loadingSelect"
            placeholder="Chọn OKRs cấp trên"
          >
            <el-option v-for="itemOKRs in leaderOKRs" :key="itemOKRs.id" :label="okrsLeaderFormat(itemOKRs)" :value="itemOKRs.id" />
          </el-select>
        </el-form-item>
      </div>
    </el-form>
    <div class="okrs-button-action">
      <el-button class="el-button--white el-button--modal" @click="closeObjectiveForm">Hủy</el-button>
      <el-button class="el-button--purple el-button--modal" :loading="loading" @click="nextStepTwo">Tiếp theo</el-button>
    </div>
  </fragment>
</template>
<script lang="ts">
import { Form } from 'element-ui';
import { Component, Vue, PropSync, Watch } from 'vue-property-decorator';
import { ObjectiveDTO, ParamsQuery } from '@/constants/app.interface';
import { Maps, Rule } from '@/constants/app.type';
import CycleRepository from '@/repositories/CycleRepository';
import OkrRepository from '@/repositories/OkrsRepository';
import { DispatchAction, MutationState } from '@/constants/app.enum';
@Component<CreateObjectiveStep>({
  name: 'CreateObjectiveStep',
  mounted() {
    this.getListData();
    this.getLeaderOKrs();
  },
})
export default class CreateObjectiveStep extends Vue {
  @PropSync('active', Number) private syncActive!: number;
  @PropSync('visibleDialog', Boolean) private syncVisibleDialog!: boolean;

  private loading: boolean = false;
  private loadingSelect: boolean = false;

  public tempObjective: ObjectiveDTO = {
    title: '',
    parentObjectiveId: null,
    cycleId: null,
  };

  private leaderOKRs: any[] = [];
  private listCycles: any[] = [];
  private autoSizeConfig = { minRows: 2, maxRows: 2 };
  private listDataParams: ParamsQuery = {
    page: 1,
    limit: 10,
  };

  private nextStepTwo(): void {
    this.loading = true;
    (this.$refs.tempObjective as Form).validate((isValid: boolean, invalidatedFields: object) => {
      if (isValid) {
        this.$store.commit(MutationState.SET_OBJECTIVE, this.tempObjective);
        if (this.syncActive++ > 2) this.syncActive = 0;
        this.loading = false;
      }
      if (invalidatedFields) {
        setTimeout(() => {
          this.loading = false;
        }, 300);
      }
    });
  }

  private async getListData() {
    try {
      const { data } = await CycleRepository.get(this.listDataParams);
      Object.freeze(data.data.items).forEach((item) => {
        this.listCycles.push(item);
      });
      this.tempObjective.cycleId = this.$store.state.cycle.cycle.id;
    } catch (error) {}
  }

  @Watch('tempObjective.cycleId', { deep: true, immediate: true })
  private async getLeaderOKrs() {
    this.loadingSelect = true;
    try {
      if (this.tempObjective.cycleId == null) {
        this.tempObjective.cycleId = this.$store.state.cycle.cycle.id;
      }
      const { data } = await OkrRepository.getLeaderOkrs(Number(this.tempObjective.cycleId), 1);
      if (this.leaderOKRs.length > 0) {
        this.leaderOKRs = [];
      }
      Object.freeze(data.data).forEach((item) => {
        this.leaderOKRs.push(item);
      });
      this.loadingSelect = false;
    } catch (error) {
      this.loadingSelect = false;
    }
  }

  private rules: Maps<Rule[]> = {
    title: [{ type: 'string', required: true, message: 'Vui lòng nhập mục tiêu', trigger: 'blur' }],
  };

  public closeObjectiveForm() {
    (this.$refs.tempObjective as Form).clearValidate();
    this.tempObjective.title = '';
    this.tempObjective.parentObjectiveId = null;
    this.tempObjective.cycleId = null;
    this.syncVisibleDialog = false;
  }

  private okrsLeaderFormat(item) {
    return `[${item.user.email}] ${item.title}`;
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
