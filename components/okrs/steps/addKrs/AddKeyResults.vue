<template>
  <div class="add-krs-step">
    <p class="add-krs-step__objective">{{ objectiveTitle }}</p>
    <template v-for="item in itemsKrs">
      <component :is="item" :key="getKeyUpComponent(item)" />
      <!-- <component :is="item" :key="item" :data="data" /> -->
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
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import TreeKrComponent from './TreeKrComponent.vue';
import IconAttention from '@/assets/images/okrs/attention.svg';
import IconAddKrs from '@/assets/images/okrs/add-krs.svg';
import { KeyResultDTO } from '@/constants/app.interface';

let componenKey = 0;

@Component<CreateObjectiveStep>({
  name: 'CreateObjectiveStep',
  components: {
    IconAttention,
    IconAddKrs,
  },
  created() {
    this.objectiveTitle = this.$store.state.okrs.objective.title;
    // this.data = JSON.parse(JSON.stringify(nodeData));
  },
})
export default class CreateObjectiveStep extends Vue {
  private objectiveTitle: string = '';
  private itemsKrs: any[] = [TreeKrComponent];
  private attentionsText: string[] = ['Ít nhất phải có 2 kết quả then chốt', 'Không quá 5 kết quả then chốt cho 1 mục tiêu'];
  // private data: any = null;

  private addNewKRs() {
    this.itemsKrs.push(TreeKrComponent);
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
}
</style>
