<template>
  <el-dialog
    title="Liên kết mục tiêu"
    :visible.sync="syncAlignDialog"
    width="30%"
    placement="center"
    :before-close="handleCloseDialog"
    class="align-okrs-dialog"
  >
    <el-row>
      <el-col :span="24">
        <el-form ref="tempAlignOkrs" :model="tempAlignOkrs" :rules="rules">
          <el-form-item label="Tên mục tiêu" prop="content" class="custom-label" label-width="120px">
            <el-input v-model="tempAlignOkrs.content" placeholder="Nhập tên mục tiêu" />
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <span slot="footer">
      <el-button class="el-button--white el-button--modal" @click="handleCloseDialog">Hủy</el-button>
      <el-button :loading="loading" class="el-button--purple el-button--modal" @click="updateAlignOkrs">Cập nhật</el-button>
    </span>
  </el-dialog>
</template>
<script lang="ts">
import { Component, Vue, Prop, PropSync } from 'vue-property-decorator';
import { Form } from 'element-ui';
import { Maps, Rule } from '@/constants/app.type';
@Component<AlignOkrsDialog>({ name: 'AlignOkrsDialog' })
export default class AlignOkrsDialog extends Vue {
  @Prop(Function) public reloadData!: Function;
  @PropSync('visibleDialog', { type: Boolean, required: true }) public syncAlignDialog!: boolean;

  private tempAlignOkrs: any = {};

  private rules: Maps<Rule[]> = {};

  private handleCloseDialog() {
    (this.$refs.tempAlignOkrs as Form).clearValidate();
    this.syncAlignDialog = false;
  }

  private updateAlignOkrs() {
    console.log('update align okrs');
  }
}
</script>
<style lang="scss" scoped></style>
