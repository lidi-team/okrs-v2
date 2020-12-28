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
        <span>Thêm key result</span>
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
import { Component, Vue, PropSync } from 'vue-property-decorator';
import { Form } from 'element-ui';
import KeyResult from './OkrsManagementStepKeyResultItem.vue';
import IconAttention from '@/assets/images/okrs/attention.svg';
import { MutationState } from '@/constants/app.vuex';
import { confirmWarningConfig } from '@/constants/app.constant';
import ObjectiveRepository from '@/repositories/ObjectiveRepository';

@Component<CreateObjectiveStep>({
  name: 'CreateObjectiveStep',
  components: {
    IconAttention,
    KeyResult,
  },
  mounted() {
    const { title, keyResults } = this.$store.state.okrs.objective;
    this.objectiveTitle = title;
    this.keyResults = JSON.parse(JSON.stringify(keyResults));
  },
})
export default class CreateObjectiveStep extends Vue {
  @PropSync('active', Number) private syncActive!: number;
  @PropSync('visibleDialog', Boolean) private syncVisibleDialog!: boolean;

  private loading: boolean = false;
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
    this.loading = true;
    const krs: any[] = [];
    let validForm: number = 0;
    if (this.keyResults.length === 0) {
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
        this.loading = false;
      });
      if (validForm === krs.length) {
        this.$store.commit(MutationState.SET_KEY_RESULT, krs);
        const { data } = await ObjectiveRepository.getAlignObjective(
          this.$store.state.cycle.cycleCurrent,
          this.$store.state.okrs.objective.projectId,
        );
        this.$store.commit(MutationState.SET_LIST_OBJECTIVE_ALIGN, data);
        this.syncActive++;
      } else {
        this.$message.error('Có trường chưa hợp lệ, xin hãy kiểm tra!!!');
      }
    }
    this.loading = false;
  }

  private deleteKrForm(indexForm: number) {
    this.keyResults.splice(indexForm, 1);
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
.add-krs-step {
  padding: 0 $unit-5;
  &__objective {
    padding-bottom: $unit-3;
    color: $neutral-primary-4;
    font-weight: $font-weight-medium;
  }
  &__button {
    margin-bottom: $unit-5;
    width: calc(100% - 28px);
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
