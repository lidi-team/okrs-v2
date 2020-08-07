<template>
  <fragment>
    <el-form ref="tempObjective" :model="tempObjective" :rules="rules" class="create-objective" label-position="top">
      <el-form-item prop="title" class="custom-label" label-width="120px">
        <el-input v-model="tempObjective.title" type="textarea" placeholder="Nhập mục tiêu" :autosize="autoSizeConfig"></el-input>
      </el-form-item>
      <div class="create-objective__select">
        <el-form-item label="Chu kỳ" prop="cycle" class="custom-label" label-width="120px">
          <el-select v-model="tempObjective.cycleId" filterable no-match-text="Không tìm thấy chu kỳ" placeholder="Chọn chu kỳ">
            <el-option v-for="cycle in listCycles" :key="cycle.name" :label="cycle.name" :value="cycle.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="OKRs cấp trên" prop="parentObjective" class="custom-label" label-width="120px">
          <el-select v-model="tempObjective.parentObjectiveId" filterable no-match-text="Không tìm thấy kết quả" placeholder="Chọn OKRs cấp trên">
            <el-option v-for="itemOKRs in leaderOKRs" :key="itemOKRs.value" :label="itemOKRs.label" :value="itemOKRs.value" />
          </el-select>
        </el-form-item>
      </div>
    </el-form>
    <div class="okrs-button-action">
      <el-button class="el-button--white el-button--modal" @click="closeObjectiveForm">Hủy</el-button>
      <el-button class="el-button--purple el-button--modal" :loading="loading" @click="nextStep">Tiếp theo</el-button>
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
@Component<CreateObjectiveStep>({
  name: 'CreateObjectiveStep',
  created() {
    this.getListData();
    this.getLeaderOKrs();
  },
})
export default class CreateObjectiveStep extends Vue {
  @PropSync('active', Number) private syncActive!: number;
  @PropSync('visibleDialog', Boolean) private syncVisibleDialog!: boolean;

  private loading: boolean = false;

  public tempObjective: ObjectiveDTO = {
    title: '',
    parentObjectiveId: null,
    cycleId: null,
  };

  private leaderOKRs: any[] = [];
  private listCycles: any[] = [];
  private autoSizeConfig = { minRows: 3, maxRows: 4 };
  private listDataParams: ParamsQuery = {
    page: 1,
    limit: 10,
  };

  private nextStep(): void {
    this.loading = true;
    (this.$refs.tempObjective as Form).validate((isValid: boolean, invalidatedFields: object) => {
      if (isValid) {
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
      this.tempObjective.parentObjectiveId = this.$store.state.okrs.currentLeader.id;
    } catch (error) {}
  }

  @Watch('tempObjective.cycleId', { deep: true, immediate: true })
  private async getLeaderOKrs() {
    try {
      const { data } = await OkrRepository.getLeaderOkrs(this.tempObjective.cycleId as number);
      Object.freeze(data.data).forEach((item) => {
        this.leaderOKRs.push(item);
      });
    } catch (error) {}
  }

  private rules: Maps<Rule[]> = {
    title: [{ type: 'string', required: true, message: 'Vui lòng nhập mục tiêu', trigger: 'blur' }],
    parentObjective: [{ type: 'string', required: true, message: 'Vui lòng chọn OKRs cấp trên', trigger: 'blur' }],
    cycle: [{ type: 'string', required: true, message: 'Vui lòng chọn chu kỳ', trigger: 'blur' }],
  };

  public closeObjectiveForm() {
    (this.$refs.tempObjective as Form).clearValidate();
    this.tempObjective.title = '';
    this.tempObjective.parentObjectiveId = null;
    this.tempObjective.cycleId = null;
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
    place-content: space-between;
  }
  .el-form-item__label {
    padding: 0;
  }
}
.okrs-button-action {
  @include okrs-button-action;
}
</style>
