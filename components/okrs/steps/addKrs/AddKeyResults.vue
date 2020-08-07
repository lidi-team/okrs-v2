<template>
  <div class="add-krs-step">
    <p class="add-krs-step__objective">Tổng doanh thu năm 2020 đạt 10,000,000 USD</p>
    <component :is="item" v-for="item in itemsKrs" ref="krRefs" :key="item.name"></component>
    <el-button class="el-button el-button--white el-button--small add-krs-step__button" @click="addNewKRs">
      <icon-add-krs />
      <span>Thêm OKRs</span>
    </el-button>
    <div class="add-krs-step__attention">
      <p class="add-krs-step__attention--title">Lưu ý:</p>
      <div v-for="(attention, i) in attentionsText" :key="attention[i]" class="add-krs-step__attention--content">
        <icon-attention /> <span>{{ attention }}</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Form, Tree } from 'element-ui';
import { Component, Vue } from 'vue-property-decorator';
import { mapState } from 'vuex';
import TreeKrComponent from './TreeKrComponent.vue';
import { KeyResultDTO, ParamsQuery } from '@/constants/app.interface';
import { Maps, Rule } from '@/constants/app.type';
import CycleRepository from '@/repositories/CycleRepository';
import OkrRepository from '@/repositories/OkrsRepository';
import IconAttention from '@/assets/images/okrs/attention.svg';
import IconAddKrs from '@/assets/images/okrs/add-krs.svg';
@Component<CreateObjectiveStep>({
  name: 'CreateObjectiveStep',
  components: {
    IconAttention,
    IconAddKrs,
  },
  updated() {
    // this.getListData();
    this.objectiveTitle = this.$store.state.okrs.objective.title;
  },
})
export default class CreateObjectiveStep extends Vue {
  private objectiveTitle: string = '';
  private itemsKrs: TreeKrComponent[] = [];
  private attentionsText: string[] = ['Ít nhất phải có 2 kết quả then chốt', 'Không quá 5 kết quả then chốt cho 1 mục tiêu'];

  private addNewKRs() {
    const newKrs = new TreeKrComponent();
    this.itemsKrs.push(newKrs);
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
