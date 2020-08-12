<template>
  <div class="add-krs-step">
    <p class="add-krs-step__objective">{{ objectiveTitle }}</p>
    <template v-for="item in itemsKrs">
      <component :is="item" :key="getKeyUpComponent(item)" ref="krsComponent" />
    </template>
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
      <el-button class="el-button--white el-button--modal" @click="closeKrsForm">Hủy</el-button>
      <el-button class="el-button--purple el-button--modal" :loading="loading" @click="nextStepThree">Tiếp theo</el-button>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, PropSync } from 'vue-property-decorator';
import { Form } from 'element-ui';
import TreeKrComponent from './TreeKrComponent.vue';
import IconAttention from '@/assets/images/okrs/attention.svg';
import IconAddKrs from '@/assets/images/okrs/add-krs.svg';
import { KeyResultDTO } from '@/constants/app.interface';
import { MutationState, DispatchAction } from '@/constants/app.enum';
import { confirmWarningConfig } from '@/constants/app.constant';

let componenKey = 0;

@Component<CreateObjectiveStep>({
  name: 'CreateObjectiveStep',
  components: {
    IconAttention,
    IconAddKrs,
  },
  created() {
    this.objectiveTitle = this.$store.state.okrs.objective.title;
  },
})
export default class CreateObjectiveStep extends Vue {
  @PropSync('active', Number) private syncActive!: number;
  @PropSync('visibleDialog', Boolean) private syncVisibleDialog!: boolean;

  private loading: boolean = false;
  private objectiveTitle: string = '';
  private itemsKrs: any[] = [TreeKrComponent];
  private attentionsText: string[] = ['Ít nhất phải có 2 kết quả then chốt', 'Không quá 5 kết quả then chốt cho 1 mục tiêu'];

  private addNewKRs() {
    this.itemsKrs.push(TreeKrComponent);
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

  private nextStepThree() {
    // let flagValidForms: number = 0;
    this.loading = true;
    // Check all tree validate
    // this.itemsKrs.forEach((krsTree) => {
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
    // if (flagValidForms === this.itemsKrs.length) {
    // commit all krs to vuex
    // Commit the okrs staffs
    this.$store.dispatch(DispatchAction.STAFF_OKRS);
    if (this.syncActive++ > 2) this.syncActive = 0;
    this.loading = false;
  }

  private getKeyUpComponent(component) {
    return `${component.name}-${componenKey++}`;
  }
}
</script>
<style lang="scss">
@import '@/assets/scss/main.scss';
.add-krs-step {
  padding: 0 $unit-5;
  &__objective {
    color: $neutral-primary-4;
    font-weight: $font-weight-medium;
  }
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
