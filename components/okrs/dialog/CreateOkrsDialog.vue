<template>
  <el-dialog
    title="Thêm mới mục tiêu"
    :visible.sync="syncOkrsDialog"
    width="30%"
    placement="center"
    :before-close="handleCloseDialog"
    class="dialog-okrs"
  >
    <el-steps :active="active" finish-status="success">
      <el-step title="Step 1"></el-step>
      <el-step title="Step 2"></el-step>
      <el-step title="Step 3"></el-step>
    </el-steps>
  </el-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from 'vue-property-decorator';
@Component<CreateOkrDialog>({ name: 'CreateOkrDialog' })
export default class CreateOkrDialog extends Vue {
  @Prop(Function) public reloadData!: Function;
  @PropSync('visibleDialog', { type: Boolean, required: true }) public syncCycleDialog!: boolean;
}
</script>
<style lang="scss" scoped></style>
