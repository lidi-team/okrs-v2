<template>
  <div class="okrs-align">
    <div>
      <div class="okrs-align__content">
        <div class="okrs-align__content--item">
          <align-objective
            v-for="(item, index) in itemsAlignOkrs"
            :key="index"
            ref="alignForm"
            :index-align-form="index"
            :align-okrs.sync="item"
            @deleteAlignOkrs="deleteAlignOkrs($event)"
          />
        </div>
        <el-button class="el-button el-button--white el-button--small okrs-align__content--button" @click="addNewAlignOkrs">
          <span>Thêm Okrs liên kết chéo</span>
        </el-button>
      </div>
      <div class="okrs-align__action">
        <el-button class="el-button--white el-button--modal" @click="backToStepTwo">Quay lại</el-button>
        <el-button class="el-button--purple el-button--modal" :loading="loading" @click="createOkrs(false)">Bỏ qua và tạo OKRs</el-button>
        <el-button class="el-button--purple el-button--modal" :loading="loading" @click="createOkrs(true)">Tạo OKRs</el-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Form } from 'element-ui';
import { Component, Vue, PropSync, Prop } from 'vue-property-decorator';

import CycleRepository from '@/repositories/CycleRepository';
import OkrsRepository from '@/repositories/OkrsRepository';
import ObjectiveRepository from '@/repositories/ObjectiveRepository';

import { DispatchAction, MutationState } from '@/constants/app.vuex';
import { confirmWarningConfig, notificationConfig } from '@/constants/app.constant';
import AlignObjective from '@/components/okrs/items/add/AlignObjective.vue';

@Component<CreateAlignObjective>({
  name: 'CreateAlignObjective',
  components: {
    AlignObjective,
  },
  async created() {
    const { data } = await ObjectiveRepository.getAlignObjective(this.$store.state.cycle.cycleCurrent.id, this.$store.state.okrs.objective.projectId);
    this.$store.commit(MutationState.SET_LIST_OBJECTIVE_ALIGN, data);
  },
})
export default class CreateAlignObjective extends Vue {
  @PropSync('active', Number) private syncActive!: number;

  private loading: boolean = false;
  private itemsAlignOkrs: any[] = [{ objectiveId: null }];

  private addNewAlignOkrs() {
    this.itemsAlignOkrs.push({ objectiveId: null });
  }

  private async createOkrs(isAlignOkrs: boolean) {
    if (isAlignOkrs === true) {
      let validForm: number = 0;
      const alignObjectives: any[] = [];
      (this.$refs.alignForm as any).forEach((form) => {
        (form.$refs.alignOkrs as Form).validate((isValid: boolean, invalidatedFields: object) => {
          if (isValid) {
            validForm++;
          }
        });
        alignObjectives.push(form.syncAlignOkrs.objectiveId);
      });
      if (validForm === alignObjectives.length) {
        // add align OKRs ID
        // payload.objective.alignObjectivesId = alignObjectives;
        try {
          // await OkrsRepository.createOrUpdateOkrs(payload).then((res) => {
          //   this.$store.dispatch(DispatchAction.CLEAR_OKRS);
          //   this.syncActive = 0;
          //   this.$notify.success({
          //     ...notificationConfig,
          //     message: 'Tạo OKRs thành công',
          //   });
          // });
        } catch (error) {}
      } else {
        setTimeout(() => {
          this.loading = false;
        }, 300);
      }
    } else {
      try {
        const data = this.$store.state.okrs.objective;
        await OkrsRepository.createOrUpdateOkrs(data).then((res) => {
          this.$store.dispatch(DispatchAction.CLEAR_OKRS);
          this.syncActive = 0;
          this.$notify.success({
            ...notificationConfig,
            message: 'Tạo OKRs thành công',
          });
        });
      } catch (error) {
        this.loading = true;
      }
    }
  }

  private deleteAlignOkrs(indexForm: number) {
    this.itemsAlignOkrs.splice(indexForm, 1);
  }

  private backToStepTwo() {
    this.syncActive--;
  }
}
</script>
<style lang="scss">
@import '@/assets/scss/main.scss';
.okrs-align {
  padding: 0 $unit-6 0 $unit-14;
  &__confirm {
    padding: $unit-16;
    background-color: $neutral-primary-0;
    display: flex;
    place-content: center;
  }
  &__content {
    display: flex;
    flex-direction: row;
    place-content: center space-between;
    padding-bottom: $unit-8;
    .el-select {
      width: 100%;
    }
    &--item {
      width: 70%;
      display: flex;
      flex-direction: column;
    }
    &--button {
      margin-left: $unit-10;
      height: $unit-10;
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
