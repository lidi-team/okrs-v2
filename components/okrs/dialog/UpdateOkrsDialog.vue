<template>
  <el-dialog
    title="Cập nhật OKRs"
    :visible.sync="syncUpdateDialog"
    width="800px"
    placement="center"
    :before-close="handleCloseDialog"
    class="update-okrs"
  >
    <el-form ref="updateOkrsForm" :rules="rules">
      <el-form-item label="Mục tiêu" prop="title" class="custom-label" label-width="80px">
        <el-input v-model="tempObjective.title" placeholder="Nhập tên OKRs" />
      </el-form-item>
      <template v-for="kr in temporaryOkrs.keyResults">
        <krs-form :key="kr.id" ref="krsForm" :temporary-key-result="kr" />
      </template>
    </el-form>
    <span slot="footer">
      <el-button class="el-button--white el-button--modal" @click="handleCloseDialog">Hủy</el-button>
      <el-button class="el-button--purple el-button--modal" @click="updateOkrs">Cập nhật</el-button>
    </span>
  </el-dialog>
</template>
<script lang="ts">
import { Component, Vue, Prop, PropSync } from 'vue-property-decorator';
import { Form, Notification } from 'element-ui';
import { Maps, Rule } from '@/constants/app.type';
import OkrRepository from '@/repositories/OkrsRepository';
import { notificationConfig } from '@/constants/app.constant';
@Component<UpdateOkrsDialog>({
  name: 'UpdateOkrsDialog',
})
export default class UpdateOkrsDialog extends Vue {
  @Prop(Function) public reloadData!: Function;
  @PropSync('visibleDialog', { type: Boolean, required: true }) public syncUpdateDialog!: boolean;
  @Prop({ type: Object, required: true }) public temporaryOkrs!: any;

  private tempObjective = {
    id: this.temporaryOkrs.id,
    title: this.temporaryOkrs.title,
  };

  private rules: Maps<Rule[]> = {
    title: [{ type: 'string', required: true, message: 'Vùi lòng nhập tên mục tiêu', trigger: 'blur' }],
  };

  private handleCloseDialog() {
    (this.$refs.updateOkrsForm as Form).clearValidate();
    this.syncUpdateDialog = false;
  }

  private updateOkrs() {
    const payload: any = null;
    const krs: any[] = [];
    (this.$refs.krsForm as any).forEach((form) => {
      krs.push(Object.freeze(form.keyResult));
    });
    payload.objective = this.tempObjective;
    console.log(this.tempObjective);
    payload.keyResult = krs;
    console.log(krs);
    // await OkrRepository.createOrUpdateOkrs(payload).then((res) => {
    //   Notification.success({
    //     ...notificationConfig,
    //     message: 'Đổi mật khẩu thành công',
    //   });
    // });
  }
}
</script>
<style lang="scss">
@import '@/assets/scss/main.scss';

.update-okrs {
  .el-form-item__label {
    color: $neutral-primary-4;
    font-weight: $font-weight-medium;
  }
  .el-dialog__body {
    padding: $unit-5 $unit-5;
  }
}
</style>
