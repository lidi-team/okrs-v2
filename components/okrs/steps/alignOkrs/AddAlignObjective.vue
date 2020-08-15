<template>
  <div :class="['okrs-align', displayForm ? '' : 'confirm-button']">
    <div v-if="displayForm === false" class="okrs-align__confirm">
      <el-button class="el-button el-button--white el-button--medium" @click="createOkrs(true)">Bỏ qua liên kết</el-button>
      <el-button class="el-button el-button--purple el-button--medium" :loading="loading" @click="displayForm = !displayForm">
        Liên kết mục tiêu
      </el-button>
    </div>
    <div v-else>
      <div class="okrs-align__content">
        <div class="okrs-align__content--item">
          <template v-for="item in itemsAlignOkrs">
            <component :is="item" :key="getKeyUpComponent(item)" />
          </template>
        </div>
        <el-button class="el-button el-button--white el-button--small okrs-align__content--button" @click="addNewAlignOkrs">
          <icon-add-krs />
          <span>Thêm Okrs liên kết chéo</span>
        </el-button>
      </div>
      <div class="okrs-align__action">
        <el-button class="el-button--white el-button--modal" @click="closeAlignOkrsForm">Hủy</el-button>
        <el-button class="el-button--purple el-button--modal" :loading="loading" @click="createOkrs">Tạo OKRs</el-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Form } from 'element-ui';
import { Component, Vue, PropSync } from 'vue-property-decorator';
import InputAlignOkrs from './InputAlignKrs.vue';
import IconAddKrs from '@/assets/images/okrs/add-krs.svg';
import CycleRepository from '@/repositories/CycleRepository';
import OkrsRepository from '@/repositories/OkrsRepository';
import { DispatchAction, MutationState } from '@/constants/app.enum';
import { confirmWarningConfig } from '@/constants/app.constant';

let componenKey: number = 0;

@Component<AddAlignObjeciveStep>({
  name: 'AddAlignObjeciveStep',
  components: {
    IconAddKrs,
  },
})
export default class AddAlignObjeciveStep extends Vue {
  @PropSync('active', Number) private syncActive!: number;
  @PropSync('visibleDialog', Boolean) private syncVisibleDialog!: boolean;

  private displayForm: boolean = false;
  private loading: boolean = false;
  private itemsAlignOkrs: any[] = [InputAlignOkrs];

  private addNewAlignOkrs() {
    this.itemsAlignOkrs.push(InputAlignOkrs);
  }

  private createOkrs(isAlignOkrs: boolean = false) {
    if (isAlignOkrs) {
      this.$confirm('Bạn có muốn hủy liên kết và tạo OKRs', { ...confirmWarningConfig }).then(() => {
        this.syncActive = 0;
        this.syncVisibleDialog = false;
      });
    }
    this.syncActive = 0;
    this.syncVisibleDialog = false;
  }

  private closeAlignOkrsForm() {
    this.$confirm('Bạn có muốn hủy liên kết và tạo OKRs', { ...confirmWarningConfig }).then(() => {
      this.syncActive = 0;
      this.syncVisibleDialog = false;
    });
  }

  private getKeyUpComponent(component) {
    return `${component.name}-${componenKey++}`;
  }
}
</script>
<style lang="scss">
@import '@/assets/scss/main.scss';
.okrs-align {
  padding: 0 $unit-18 0 $unit-14;
  &__confirm {
    padding: $unit-16;
    background-color: $neutral-primary-0;
    display: flex;
    place-content: center;
  }
  &__content {
    display: flex;
    flex-direction: row;
    place-content: center flex-start;
    .el-select {
      width: 100%;
    }
    &--item {
      width: 65%;
      display: flex;
      flex-direction: column;
    }
    &--button {
      margin-left: $unit-10;
      height: $unit-10;
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
  }
  &__action {
    @include okrs-button-action;
    width: 800px;
    margin-left: -$unit-14;
  }
}
.confirm-button {
  padding: 0 $unit-6 0 $unit-6;
  margin-bottom: $unit-8;
}
</style>
