<template>
  <el-form ref="tempObjective" :model="tempObjective" :rules="rules" class="create-objective" label-position="top">
    <el-form-item prop="title" class="custom-label" label-width="120px">
      <el-input v-model="tempObjective.title" type="textarea" placeholder="Nhập mục tiêu" :autosize="autoSizeConfig"></el-input>
    </el-form-item>
    <div class="create-objective__select">
      <el-form-item label="Chu kỳ" prop="cycle" class="custom-label" label-width="120px">
        <el-select v-model="tempObjective.cycle" filterable no-match-text="Không tìm thấy chu kỳ" placeholder="Chọn chu kỳ">
          <el-option v-for="cycle in listCycles" :key="cycle.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="OKRs cấp trên" prop="parentObjective" class="custom-label" label-width="120px">
        <el-select v-model="tempObjective.parentObjective" filterable no-match-text="Không tìm thấy kết quả" placeholder="Chọn OKRs cấp trên">
          <el-option v-for="itemOKRs in leaderOKRs" :key="itemOKRs.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
    </div>
  </el-form>
</template>
<script lang="ts">
import { Form } from 'element-ui';
import { Component, Vue, PropSync } from 'vue-property-decorator';
import { ObjectiveDTO, ParamsQuery } from '@/constants/app.interface';
import { Maps, Rule } from '@/constants/app.type';
import CycleRepository from '@/repositories/CycleRepository';
import OkrRepository from '@/repositories/OkrsRepository';
@Component<CreateObjectiveStep>({
  name: 'CreateObjectiveStep',
  created() {
    // this.getListData();
  },
})
export default class CreateObjectiveStep extends Vue {
  public tempObjective: ObjectiveDTO = {
    title: '',
    parentObjectiveId: null,
    cycleId: null,
  };

  private leaderOKRs: any[] = [];

  private listCycles: any[] = [];
  private autoSizeConfig = { minRows: 4, maxRows: 4 };
  private listDataParams: ParamsQuery = {
    page: 1,
    limit: 10,
  };

  // private async getListData() {
  //   try {
  //     const [leaderOkrs, cycles] = await Promise.all([CycleRepository.get(this.listDataParams), OkrRepository.getLeaderOkrs(this.listDataParams)]);
  //     this.leaderOKRs = leaderOkrs.data.data;
  //     this.listCycles = cycles.data.data;
  //   } catch (error) {}
  // }

  private rules: Maps<Rule[]> = {
    title: [{ type: 'string', required: true, message: 'Vui lòng nhập mục tiêu', trigger: 'blur' }],
    parentObjective: [{ type: 'string', required: true, message: 'Vui lòng chọn OKRs cấp trên', trigger: 'blur' }],
    cycle: [{ type: 'string', required: true, message: 'Vui lòng chọn chu kỳ', trigger: 'blur' }],
  };

  public clearObjectiveForm() {
    (this.$refs.tempObjective as Form).clearValidate();
    this.tempObjective.title = '';
    this.tempObjective.parentObjectiveId = null;
    this.tempObjective.cycleId = null;
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
.create-objective {
  margin-top: $unit-8;
  &__select {
    display: flex;
    place-content: space-between;
  }
}
</style>
