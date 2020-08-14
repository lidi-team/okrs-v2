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
    </el-form>
    <div v-loading="formLoading">
      <template v-for="(item, index) in krFormItems">
        <component
          :is="item"
          :key="item.name + index"
          ref="krsForm"
          :index-kr-form="index + 1"
          :temporary-key-result="temporaryOkrs.keyResults[index]"
          @deleteKr="deleteKrForm($event)"
        />
      </template>
    </div>
    <el-button class="el-button el-button--white el-button--small update-okrs__button" @click="addNewKRs">
      <icon-add-krs />
      <span>Thêm OKRs</span>
    </el-button>
    <span slot="footer">
      <el-button class="el-button--white el-button--modal" @click="handleCloseDialog">Hủy</el-button>
      <el-button class="el-button--purple el-button--modal" :loading="loading" @click="updateOkrs">Cập nhật</el-button>
    </span>
  </el-dialog>
</template>
<script lang="ts">
import { Component, Vue, Prop, PropSync } from 'vue-property-decorator';
import { Form, Notification } from 'element-ui';
import IconAddKrs from '@/assets/images/okrs/add-krs.svg';
import { Maps, Rule } from '@/constants/app.type';
import OkrsRepository from '@/repositories/OkrsRepository';
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
    console.log(this.krFormItems);
  },
})
export default class UpdateOkrsDialog extends Vue {
  @Prop(Function) public reloadData!: Function;
  @PropSync('visibleDialog', { type: Boolean, required: true }) public syncUpdateDialog!: boolean;
  @Prop({ type: Object, required: true }) public temporaryOkrs!: any;

  private tempObjective: any = {
    id: JSON.parse(JSON.stringify(this.temporaryOkrs.id)),
    title: JSON.parse(JSON.stringify(this.temporaryOkrs.title)),
  };

  private loading: boolean = false;
  private formLoading: boolean = false;
  private krFormItems: any[] = [];

  private rules: Maps<Rule[]> = {
    title: [{ type: 'string', required: true, message: 'Vùi lòng nhập tên mục tiêu', trigger: 'blur' }],
  };

  private handleCloseDialog() {
    this.tempObjective.title = JSON.parse(JSON.stringify(this.temporaryOkrs.title));
    (this.$refs.updateOkrsForm as Form).clearValidate();
    const numberForms = (this.$refs.krsForm as any).length;
    const form = this.$refs.krsForm;
    for (let i = 0; i < numberForms; i++) {
      if (!form[i].keyResult.id) {
        form[i].$el.remove();
      }
      (form[i].$refs.keyResult as Form).clearValidate();
      this.syncUpdateDialog = false;
    }
  }

  private addNewKRs() {
    this.formLoading = true;
    this.krFormItems.push(KrsForm);
    setTimeout(() => {
      this.formLoading = false;
    }, 500);
  }

  private deleteKrForm(indexForm: number) {
    console.log(indexForm);
    this.formLoading = true;
    this.krFormItems.splice(indexForm - 1, 1);
    setTimeout(() => {
      this.formLoading = false;
    }, 500);
  }

  private updateOkrs() {
    const payload: any = {};
    const krs: any[] = [];

    this.loading = true;
    (this.$refs.updateOkrsForm as Form).validate(async (isValid: boolean) => {
      if (isValid) {
        let validForm: number = 0;
        (this.$refs.krsForm as any).forEach((form) => {
          (form.$refs.keyResult as Form).validate((isValid: boolean, invalidatedFields: object) => {
            if (isValid) {
              validForm++;
            }
          });
          krs.push(Object.freeze(form.keyResult));
        });
        if (validForm === krs.length) {
          payload.objective = this.tempObjective;
          payload.keyResult = krs;
          try {
            await OkrsRepository.createOrUpdateOkrs(payload).then(async (res) => {
              this.handleCloseDialog();
              await this.reloadData();
              Notification.success({
                ...notificationConfig,
                message: 'Cập nhật OKRs thành công',
              });
              this.loading = false;
            });
          } catch (error) {
            this.loading = false;
          }
        } else {
          setTimeout(() => {
            this.loading = false;
          }, 300);
          this.$message.error('Vui lòng nhập đúng các trường yêu cầu');
        }
      } else {
        setTimeout(() => {
          this.loading = false;
        }, 300);
      }
    });
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
