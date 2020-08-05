<template>
  <el-dialog
    title="Thêm mới mục tiêu"
    :visible.sync="syncCreateOkrsDialog"
    width="600px"
    placement="center"
    :before-close="handleCloseDialog"
    class="create-okrs-dialog"
  >
    <el-steps :active="active" finish-status="success">
      <el-step title="Mục tiêu"> </el-step>
      <el-step title="Các kết quả then chốt"></el-step>
      <el-step title="Kết nối"></el-step>
    </el-steps>
    <step-create-objective v-show="active === 0" ref="objective" />
    <step-add-key-results v-show="active === 1" />
    <step-add-align-objective v-show="active === 2" />
    <span v-if="active !== 3" slot="footer" class="dcreate-okrs-dialog__footer">
      <el-button class="el-button--white el-button--modal" @click="handleCloseDialog">Hủy</el-button>
      <el-button class="el-button--purple el-button--modal" @click="next">Tiếp theo</el-button>
    </span>
  </el-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from 'vue-property-decorator';
import CreateObjectiveStep from '../steps/CreateObjective.vue';
@Component<CreateOkrDialog>({
  name: 'CreateOkrDialog',
  mounted() {
    console.log(this.$children);
  },
})
export default class CreateOkrDialog extends Vue {
  @Prop(Function) public reloadData!: Function;
  @PropSync('visibleDialog', { type: Boolean, required: true, default: false }) public syncCreateOkrsDialog!: boolean;

  private active: number = 0;

  private next() {
    if (this.active++ > 2) this.active = 0;
  }

  private handleCloseDialog() {
    (this.$refs.objective as CreateObjectiveStep).clearObjectiveForm();
    this.active = 0;
    this.syncCreateOkrsDialog = false;
  }
}
</script>
<style lang="scss" scoped></style>
