<template>
  <div>
    <div class="add-krs-step">
      <key-result
        v-for="(item, index) in keyResults"
        :key="index"
        ref="krsForm"
        :index-kr-form="index"
        :key-result.sync="item"
        @deleteKr="deleteKrForm($event)"
      />
      <el-button
        class="el-button el-button--white el-button--small add-krs-step__button"
        @click="addNewKRs"
      >
        <span>Thêm KRs</span>
      </el-button>
      <div class="add-krs-step__attention">
        <p class="add-krs-step__attention--title">Lưu ý:</p>
        <div
          v-for="(attention, i) in attentionsText"
          :key="attention[i]"
          class="add-krs-step__attention--content"
        >
          <icon-attention />
          <span>{{ attention }}</span>
        </div>
      </div>
    </div>
    <div class="add-krs-step__action">
      <el-button
        class="el-button--white el-button--modal"
        @click="backToStepOne"
        >Quay lại</el-button
      >
      <el-button
        class="el-button--purple el-button--modal"
        :loading="loading"
        @click="nextStepThree"
        >Tiếp theo</el-button
      >
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from 'vue-property-decorator';
import { Form } from 'element-ui';
import KeyResult from './KeyResult.vue';
import IconAttention from '@/assets/images/okrs/attention.svg';
import { MutationState, DispatchAction } from '@/constants/app.vuex';
import {
  confirmWarningConfig,
  notificationConfig,
} from '@/constants/app.constant';
import OkrsRepository from '@/repositories/OkrsRepository';
import ObjectiveRepository from '@/repositories/ObjectiveRepository';
import { KeyResultDTO } from '@/constants/DTO/okrs';

@Component<CreateObjectiveStep>({
  name: 'CreateObjectiveStep',
  components: {
    IconAttention,
    KeyResult,
  },
  mounted() {
    console.log('dddd', this.$store.state.cycle.cycleCurrent.id);
    const { title, keyResults } = this.$store.state.okrs.objective;
    this.objectiveTitle = title;
    this.keyResults = JSON.parse(JSON.stringify(keyResults));
  },
})
export default class CreateObjectiveStep extends Vue {
  @PropSync('active', Number) private syncActive!: number;
  @PropSync('visibleDialog', Boolean) private syncVisibleDialog!: boolean;

  private loading: boolean = false;
  private objectiveTitle: string = '';
  public keyResults: any[] = [];
  private attentionsText: string[] = [
    'Nên có ít nhất phải có 2 kết quả then chốt',
    'Không nên quá 5 kết quả then chốt cho 1 mục tiêu',
  ];

  private addNewKRs() {
    this.keyResults.push({
      startValue: 0,
      targetedValue: 100,
      content: '',
      keyResultParentId: null,
      linkPlans: '',
      linkResults: '',
      measureUnitId: 1,
    });
  }

  private closeKrsForm() {
    this.$confirm('Bạn có chắc chắn muốn thoát quá trình này không?', {
      ...confirmWarningConfig,
    }).then(() => {
      this.$store.commit(MutationState.SET_OBJECTIVE, null);
      this.syncActive = 0;
      this.syncVisibleDialog = false;
    });
  }

  private backToStepOne() {
    if (this.keyResults.length !== 0) {
      const tempKrs: any[] = [];
      (this.$refs.krsForm as any).forEach((form) => {
        tempKrs.push(form.tempKeyResult);
      });
      this.$store.commit(MutationState.SET_KEY_RESULT, tempKrs);
    }
    this.syncActive--;
  }

  private async nextStepThree() {
    const krs: any[] = [];
    let validForm: number = 0;
    this.loading = true;
    if (this.keyResults.length === 0) {
      setTimeout(() => {
        this.loading = false;
      }, 300);
      this.$message.error('Cần có ít nhất 1 kết quả then chốt');
    } else {
      (this.$refs.krsForm as any).forEach((form) => {
        (form.$refs.keyResult as Form).validate(
          (isValid: boolean, invalidatedFields: object) => {
            if (isValid) {
              validForm++;
            }
          },
        );
        krs.push(Object.freeze(form.tempKeyResult));
      });
      if (validForm === krs.length) {
        this.$store.commit(MutationState.SET_KEY_RESULT, krs);
        const { data } = await ObjectiveRepository.getAlignObjective(
          3,
          this.$store.state.okrs.objective.projectId,
        );
        this.$store.commit(MutationState.SET_LIST_OBJECTIVE_ALIGN, data);
        this.syncActive++;
        this.loading = false;
      } else {
        setTimeout(() => {
          this.loading = false;
        }, 300);
        this.$message.error('Vui lòng nhập đúng các trường yêu cầu');
      }
    }
  }

  private deleteKrForm(indexForm: number) {
    this.keyResults.splice(indexForm, 1);
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
  }
}
</style>
