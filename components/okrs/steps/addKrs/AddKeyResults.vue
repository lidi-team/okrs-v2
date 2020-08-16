<template>
  <div class="add-krs-step">
    <p class="add-krs-step__objective">{{ objectiveTitle }}</p>
    <div v-loading="formLoading">
      <krs-form
        v-for="(item, index) in krFormItems"
        :key="index"
        ref="krsForm"
        :index-kr-form="index"
        :key-result.sync="item"
        @deleteKr="deleteKrForm($event)"
      />
    </div>
    <el-button class="el-button el-button--white el-button--small add-krs-step__button" @click="addNewKRs">
      <icon-add-krs />
      <span>Thêm OKRs</span>
    </el-button>
    <div class="add-krs-step__attention">
      <p class="add-krs-step__attention--title">Lưu ý:</p>
      <div v-for="(attention, i) in attentionsText" :key="attention[i]" class="add-krs-step__attention--content">
        <icon-attention />
        <span>{{ attention }}</span>
      </div>
    </div>
    <div class="add-krs-step__action">
      <el-button class="el-button--white el-button--modal" @click="backToStepOne">Quay lại</el-button>
      <el-button v-if="!isRootObjective" class="el-button--purple el-button--modal" :loading="loading" @click="nextStepThree">Tiếp theo</el-button>
      <el-button v-else class="el-button--purple el-button--modal" :loading="loading" @click="createRootOkrs">Tạo OKRs</el-button>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from 'vue-property-decorator';
import { Form, Notification } from 'element-ui';
import IconAttention from '@/assets/images/okrs/attention.svg';
import IconAddKrs from '@/assets/images/okrs/add-krs.svg';
import { KeyResultDTO } from '@/constants/app.interface';
import { MutationState, DispatchAction } from '@/constants/app.enum';
import { confirmWarningConfig, notificationConfig } from '@/constants/app.constant';
import OkrsRepository from '@/repositories/OkrsRepository';

@Component<CreateObjectiveStep>({
  name: 'CreateObjectiveStep',
  components: {
    IconAttention,
    IconAddKrs,
  },
  created() {
    this.objectiveTitle = this.$store.state.okrs.objective.title;
    this.krFormItems = this.$store.state.okrs.keyResults.length !== 0 ? this.$store.state.okrs.keyResults.map((item) => ({ ...item })) : [];
  },
})
export default class CreateObjectiveStep extends Vue {
  @Prop(Function) public reloadData!: Function;
  @Prop({ type: Boolean, default: false }) private isRootObjective!: boolean;
  @PropSync('active', Number) private syncActive!: number;
  @PropSync('visibleDialog', Boolean) private syncVisibleDialog!: boolean;

  private formLoading: boolean = false;
  private loading: boolean = false;
  private objectiveTitle: string = '';
  private krFormItems: any[] = [];
  private attentionsText: string[] = ['Ít nhất phải có 2 kết quả then chốt', 'Không quá 5 kết quả then chốt cho 1 mục tiêu'];

  private addNewKRs() {
    this.formLoading = true;
    this.krFormItems.push({
      startValue: 0,
      targetValue: 100,
      content: 'Xin vui lòng nhập kết quả then chốt',
      linkPlans: '',
      linkResults: '',
      measureUnitId: 1,
    });
    setTimeout(() => {
      this.formLoading = false;
    }, 500);
  }

  private closeKrsForm() {
    this.$confirm('Bạn có chắc chắn muốn thoát quá trình này không?', {
      ...confirmWarningConfig,
    }).then(() => {
      // (this.$refs.krsComponent as TreeKrComponent).clearObjectiveForm();
      this.$store.commit(MutationState.SET_OBJECTIVE, null);
      this.syncActive = 0;
      this.syncVisibleDialog = false;
    });
  }

  private async createRootOkrs() {
    const payload: any = {};
    const krs: any[] = [];
    let validForm: number = 0;

    this.loading = true;
    (this.$refs.krsForm as any).forEach((form) => {
      (form.$refs.keyResult as Form).validate((isValid: boolean, invalidatedFields: object) => {
        if (isValid) {
          validForm++;
        }
      });
      krs.push(Object.freeze(form.syncTempKr));
    });
    if (validForm === krs.length) {
      payload.objective = this.$store.state.okrs.objective;
      // Set this is root objective
      payload.objective.isRootObjective = true;
      payload.keyResult = krs;
      try {
        await OkrsRepository.createOrUpdateOkrs(payload).then(async (res) => {
          this.loading = false;
          this.syncVisibleDialog = false;
          this.krFormItems = [];
          this.$store.dispatch(DispatchAction.CLEAR_OKRS);
          await this.reloadData();
          Notification.success({
            ...notificationConfig,
            message: 'Cập nhật OKRs thành công',
          });
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
  }

  private backToStepOne() {
    this.$store.commit(MutationState.CLEAR_KRS);
    (this.$refs.krsForm as any).forEach((form) => {
      this.$store.commit(MutationState.SET_KR, form.syncTempKr);
    });
    this.syncActive--;
  }

  private nextStepThree() {
    // let flagValidForms: number = 0;
    this.loading = true;
    // Check all tree validate
    // this.krFormItems.forEach((krsTree) => {
    //   ((this.$refs.krsComponent as TreeKrComponent).$refs.tempKeyResult as Form).validate((isValid: boolean, invalidatedFields: object) => {
    //     if (isValid) {
    //       flagValidForms++;
    //     }
    //     if (invalidatedFields) {
    //       setTimeout(() => {
    //         this.loading = false;
    //       }, 300);
    //     }
    //   });
    // });
    // if (flagValidForms === this.krFormItems.length) {
    // commit all krs to vuex
    // Commit the okrs staffs
    this.$store.dispatch(DispatchAction.STAFF_OKRS);
    if (this.syncActive++ > 2) this.syncActive = 0;
    this.loading = false;
  }

  private deleteKrForm(indexForm: number) {
    this.formLoading = true;
    this.krFormItems.splice(indexForm, 1);
    setTimeout(() => {
      this.formLoading = false;
    }, 300);
  }
}
</script>
<style lang="scss">
@import '@/assets/scss/main.scss';
.add-krs-step {
  padding: 0 $unit-5;
  &__objective {
    padding-bottom: $unit-3;
    color: $neutral-primary-4;
    font-weight: $font-weight-medium;
  }
  &__button {
    margin: $unit-4 0 $unit-4 0;
    &:hover {
      span {
        svg {
          path {
            fill: $white;
          }
        }
      }
    }
    span {
      display: flex;
      place-items: center;
      span {
        padding-left: $unit-1;
      }
    }
  }
  &__attention {
    font-size: $unit-3;
    color: $neutral-primary-4;
    padding-bottom: $unit-4;
    &--title {
      font-weight: $font-weight-medium;
    }
    &--content {
      display: flex;
      place-content: center flex-start;
      span {
        padding-left: $unit-3;
        &:first-child {
          padding-bottom: $unit-2;
        }
      }
    }
  }
  &__action {
    @include okrs-button-action;
    width: 800px;
    margin-left: -$unit-5;
    padding-right: $unit-5;
  }
}
</style>
