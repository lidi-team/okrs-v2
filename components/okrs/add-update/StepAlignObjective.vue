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
        <el-button
          class="el-button el-button--white el-button--small okrs-align__content--button"
          @click="addNewAlignOkrs"
        >
          <span>Thêm Okrs liên kết chéo</span>
        </el-button>
      </div>
      <div class="okrs-align__action">
        <el-button
          class="el-button--white el-button--modal"
          @click="backToStepTwo"
          >Quay lại</el-button
        >
        <el-button
          class="el-button--purple el-button--modal"
          :loading="loading"
          @click="createOkrs(false)"
          >Bỏ qua và {{ isCreate ? 'tạo OKRs' : 'cập nhật OKRs' }}</el-button
        >
        <el-button
          class="el-button--purple el-button--modal"
          :loading="loading"
          @click="createOkrs(true)"
        >
          {{ isCreate ? 'Tạo OKRs' : 'Cập nhật OKRs' }}
        </el-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Form } from 'element-ui';
import { mapGetters } from 'vuex';
import { Component, Vue, PropSync, Prop } from 'vue-property-decorator';

import CycleRepository from '@/repositories/CycleRepository';
import OkrsRepository from '@/repositories/OkrsRepository';

import {
  DispatchAction,
  MutationState,
  GetterState,
} from '@/constants/app.vuex';
import {
  confirmWarningConfig,
  notificationConfig,
} from '@/constants/app.constant';
import AlignObjective from '@/components/okrs/add-update/AlignObjective.vue';

@Component<CreateAlignObjective>({
  name: 'CreateAlignObjective',
  components: {
    AlignObjective,
  },
  computed: {
    ...mapGetters({
      isCreate: GetterState.OKRS_IS_CREATE,
    }),
  },
  mounted() {
    const data = this.$store.state.okrs.objective.alignmentObjectives;
    if (!data) {
      this.itemsAlignOkrs = [{ objectiveId: null }];
    } else {
      this.itemsAlignOkrs = data.map((item) => {
        return {
          objectiveId: item.id,
        };
      });
    }
  },
})
export default class CreateAlignObjective extends Vue {
  @PropSync('active', Number) private syncActive!: number;

  private loading: boolean = false;
  private itemsAlignOkrs: any[] = [{ objectiveId: null }];

  private addNewAlignOkrs() {
    this.itemsAlignOkrs.push({ objectiveId: null });
  }

  private async createOkrs(hasAlignObjective: boolean) {
    if (hasAlignObjective === true) {
      try {
        let validForm: number = 0;
        const alignObjectives: any[] = [];
        (this.$refs.alignForm as any).forEach((form) => {
          (form.$refs.alignOkrs as Form).validate(
            (isValid: boolean, invalidatedFields: object) => {
              if (isValid) {
                validForm++;
              }
            },
          );
          alignObjectives.push(form.syncAlignOkrs.objectiveId);
        });
        if (validForm === alignObjectives.length) {
          this.$store.commit(MutationState.SET_OBJECTIVE, {
            alignmentObjectives: alignObjectives,
          });
          const data = this.$store.state.okrs.objective;
          await OkrsRepository.createOrUpdateOkrs(data).then((res) => {
            this.$store.dispatch(DispatchAction.CLOSE_DIALOG_OKRS);
            this.$store.commit(MutationState.OKRS_SET_FLAG);
            this.syncActive = 0;
            this.$notify.success({
              ...notificationConfig,
              message: 'Tạo OKRs thành công',
            });
          });
        } else {
          setTimeout(() => {
            this.loading = false;
          }, 300);
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        const data = this.$store.state.okrs.objective;
        await OkrsRepository.createOrUpdateOkrs(data).then((res) => {
          this.$store.dispatch(DispatchAction.CLOSE_DIALOG_OKRS);
          this.$store.commit(MutationState.OKRS_SET_FLAG);
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
  }
}
.confirm-button {
  padding: 0 $unit-6 0 $unit-6;
  margin-bottom: $unit-8;
}
</style>
