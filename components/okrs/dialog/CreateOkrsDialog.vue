<template>
  <el-dialog
    title="Thêm mới mục tiêu"
    :visible.sync="syncCreateOkrsDialog"
    width="30%"
    placement="center"
    :before-close="handleCloseDialog"
    class="create-okrs-dialog"
  >
    <el-steps :active="active" finish-status="success">
      <el-step title="Mục tiêu"> </el-step>
      <el-step title="Các kết quả then chốt"></el-step>
      <el-step title="Kết nối"></el-step>
    </el-steps>
    <el-form
      v-if="active === 0"
      ref="tempObjective"
      :model="tempObjective"
      :rules="objectiveRules"
      class="dcreate-okrs-dialog__objective"
      label-position="top"
    >
      <el-form-item label="Tên mục tiêu" prop="title" class="custom-label" label-width="120px">
        <el-input v-model="tempObjective.title" type="textarea" placeholder="Nhập mục tiêu" :autosize="autoSizeConfig"> </el-input>
      </el-form-item>
      <div class="dcreate-okrs-dialog__objective--select">
        <el-form-item label="OKRs cấp trên" prop="parentObjective" class="custom-label" label-width="120px">
          <el-select v-model="tempObjective.parentObjective" placeholder="Chọn OKRs cấp trên">
            <el-option v-for="itemOKRs in leaderOKRs" :key="itemOKRs.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="Chu kỳ" prop="cycle" class="custom-label" label-width="120px">
          <el-select v-model="tempObjective.cycle" placeholder="Chọn chu kỳ">
            <el-option v-for="cycle in listCycles" :key="cycle.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </div>
    </el-form>
    <span v-if="active !== 3" slot="footer" class="dcreate-okrs-dialog__footer">
      <el-button class="el-button--white el-button--modal" @click="handleCloseDialog">Hủy</el-button>
      <el-button class="el-button--purple el-button--modal" :loading="loading" @click="next">Tiếp theo</el-button>
    </span>
  </el-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from 'vue-property-decorator';
import { Maps, Rule } from '@/constants/app.type';
import CycleRepository from '@/repositories/CycleRepository';
import { ParamsQuery } from '@/constants/app.interface';
import OkrRepository from '@/repositories/OkrsRepository';
@Component<CreateOkrDialog>({
  name: 'CreateOkrDialog',
  created() {
    // this.getListData();
  },
})
export default class CreateOkrDialog extends Vue {
  @Prop(Function) public reloadData!: Function;
  @PropSync('visibleDialog', { type: Boolean, required: true, default: false }) public syncCreateOkrsDialog!: boolean;

  private leaderOKRs: any[] = [];
  private listCycles: any[] = [];
  private textObjective: string = '';
  private active: number = 0;
  private autoSizeConfig = { minRows: 4, maxRows: 4 };
  private tempObjective = {
    title: '',
    parentObjective: '',
    cycle: '',
  };

  private listDataParams: ParamsQuery = {
    page: 1,
    limit: 10,
  };

  private next() {
    if (this.active++ > 2) this.active = 0;
  }

  // private async getListData() {
  //   try {
  //     const [leaderOkrs, cycles] = await Promise.all([CycleRepository.get(this.listDataParams), OkrRepository.getLeaderOkrs(this.listDataParams)]);
  //     this.leaderOKRs = leaderOkrs.data.data;
  //     this.listCycles = cycles.data.data;
  //   } catch (error) {}
  // }

  private handleCloseDialog() {
    this.active = 0;
    this.syncCreateOkrsDialog = false;
  }

  private objectiveRules: Maps<Rule[]> = {
    title: [{ type: 'string', required: true, message: 'Vui lòng nhập mục tiêu', trigger: 'blur' }],
    parentObjective: [{ type: 'string', required: true, message: 'Vui lòng chọn OKRs cấp trên', trigger: 'blur' }],
    cycle: [{ type: 'string', required: true, message: 'Vui lòng chọn chu kỳ', trigger: 'blur' }],
  };
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
.create-okrs-dialog {
  &__objective {
    &--select {
      display: flex;
    }
  }
}
</style>
