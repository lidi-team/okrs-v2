<template>
  <el-dialog
    title="Cập nhật OKRs"
    :visible.sync="syncUpdateDialog"
    width="800px"
    placement="center"
    :before-close="handleCloseDialog"
    class="update-okrs"
  >
    <el-form ref="updateOkrsForm" :model="tempObjective" :rules="rules">
      <el-form-item label="Mục tiêu" prop="title" class="custom-label" label-width="80px">
        <el-input v-model="tempObjective.title" placeholder="Nhập tên OKRs" />
      </el-form-item>
      <template v-for="(item, index) in krFormItems">
        <component :is="item" :key="item.name" ref="krsForm" :temporary-key-result="temporaryOkrs.keyResults[index]" />
      </template>
    </el-form>
    <el-button class="el-button el-button--white el-button--small update-okrs__button" @click="addNewKRs">
      <icon-add-krs />
      <span>Thêm OKRs</span>
    </el-button>
    <span slot="footer">
      <el-button class="el-button--white el-button--modal" @click="handleCloseDialog">Hủy</el-button>
      <el-button class="el-button--purple el-button--modal" @click="updateOkrs">Cập nhật</el-button>
    </span>
  </el-dialog>
</template>
<script lang="ts">
import { Component, Vue, Prop, PropSync, Watch } from 'vue-property-decorator';
import { Form, Notification } from 'element-ui';
import IconAddKrs from '@/assets/images/okrs/add-krs.svg';
import { Maps, Rule } from '@/constants/app.type';
import OkrRepository from '@/repositories/OkrsRepository';
import { notificationConfig } from '@/constants/app.constant';
import KrsForm from '@/components/okrs/KrsForm.vue';
@Component<UpdateOkrsDialog>({
  name: 'UpdateOkrsDialog',
  components: {
    IconAddKrs,
    KrsForm,
  },
  created() {
    const krDataLength = this.temporaryOkrs.keyResults.length;
    for (let i = 0; i < krDataLength; i++) {
      this.krFormItems.push(KrsForm);
    }
  },
})
export default class UpdateOkrsDialog extends Vue {
  @Prop(Function) public reloadData!: Function;
  @PropSync('visibleDialog', { type: Boolean, required: true }) public syncUpdateDialog!: boolean;
  @Prop({ type: Object, required: true }) public temporaryOkrs!: any;

  private tempObjective: Object = {
    id: JSON.parse(JSON.stringify(this.temporaryOkrs.id)),
    title: JSON.parse(JSON.stringify(this.temporaryOkrs.title)),
  };

  private krFormItems: any[] = [];

  private rules: Maps<Rule[]> = {
    title: [{ type: 'string', required: true, message: 'Vùi lòng nhập tên mục tiêu', trigger: 'blur' }],
  };

  private handleCloseDialog() {
    (this.$refs.updateOkrsForm as Form).clearValidate();
    this.syncUpdateDialog = false;
  }

  private addNewKRs() {
    this.krFormItems.push(KrsForm);
  }

  private async updateOkrs() {
    const payload: any = {};
    const krs: any[] = [];
    (this.$refs.krsForm as any).forEach((form) => {
      krs.push(Object.freeze(form.keyResult));
    });
    payload.objective = this.tempObjective;
    payload.keyResult = krs;
    await OkrRepository.createOrUpdateOkrs(payload).then(async (res) => {
      await this.handleCloseDialog();
      await this.reloadData();
      await Notification.success({
        ...notificationConfig,
        message: 'Cập nhật OKRs thành công',
      });
    });
    // window.location.reload(true);
  }
}
</script>
<style lang="scss">
@import '@/assets/scss/main.scss';

.update-okrs {
  &__button {
    margin: $unit-4 0 $unit-4 0;
    span {
      display: flex;
      place-items: center;
      &:hover {
        svg {
          path {
            fill: $white;
          }
        }
      }
      span {
        padding-left: $unit-1;
      }
    }
  }
  .el-form-item__label {
    color: $neutral-primary-4;
    font-weight: $font-weight-medium;
  }
  .el-dialog__body {
    padding: $unit-5 $unit-5;
  }
}
</style>
