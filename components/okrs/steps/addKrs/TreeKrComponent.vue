<template>
  <el-tree :data="data" :props="defaultProps" :render-content="renderKrsContent" @node-click="handleNodeClick">
    <el-form ref="tempKeyResults" :model="tempKeyResults" :rules="rules" class="create-objective" label-position="top">
      <el-form-item prop="title" class="custom-label" label-width="120px">
        <el-input v-model="tempKeyResults.title" type="textarea" placeholder="Nhập mục tiêu" :autosize="autoSizeConfig"></el-input>
      </el-form-item>
      <div class="create-objective__select">
        <el-form-item label="Chu kỳ" prop="cycle" class="custom-label" label-width="120px">
          <el-select v-model="tempKeyResults.cycle" filterable no-match-text="Không tìm thấy chu kỳ" placeholder="Chọn chu kỳ">
            <el-option v-for="cycle in listCycles" :key="cycle.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="OKRs cấp trên" prop="parentObjective" class="custom-label" label-width="120px">
          <el-select v-model="tempKeyResults.parentObjective" filterable no-match-text="Không tìm thấy kết quả" placeholder="Chọn OKRs cấp trên">
            <el-option v-for="itemOKRs in leaderOKRs" :key="itemOKRs.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </div>
    </el-form>
  </el-tree>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Form } from 'element-ui';
import { KeyResultDTO } from '@/constants/app.interface';
import { Maps, Rule } from '@/constants/app.type';
@Component<TreeKrComponent>({ name: 'TreeKrComponent' })
export default class TreeKrComponent extends Vue {
  public tempKeyResult: KeyResultDTO = {
    content: '',
    startValue: null,
    targetvalue: null,
    measureUnitId: 1,
    linkPlans: null,
    linkResults: null,
  };

  private rules: Maps<Rule[]> = {
    title: [{ type: 'string', required: true, message: 'Vui lòng nhập mục tiêu', trigger: 'blur' }],
    parentObjective: [{ type: 'string', required: true, message: 'Vui lòng chọn OKRs cấp trên', trigger: 'blur' }],
    cycle: [{ type: 'string', required: true, message: 'Vui lòng chọn chu kỳ', trigger: 'blur' }],
  };

  private renderKrsContent(h: Vue.CreateElement, { node, data, store }): Vue.VNode {
    return h(TreeKrComponent);
  }

  public clearObjectiveForm() {
    (this.$refs.tempKeyResults as Form).clearValidate();
    this.tempKeyResult.content = '';
    this.tempKeyResult.startValue = 0;
    this.tempKeyResult.targetvalue = 1;
    this.tempKeyResult.linkPlans = null;
    this.tempKeyResult.linkResults = null;
    this.tempKeyResult.objectiveId = null;
    this.tempKeyResult.measureUnitId = 1;
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
  .el-form-item__label {
    padding: 0;
  }
}
</style>
