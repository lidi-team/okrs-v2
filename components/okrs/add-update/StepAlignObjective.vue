<template>
  <div class="okrs-align">
    <div class="okrs-align__content">
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
      class="el-button el-button--white el-button--small okrs-align__button"
      @click="addNewAlignOkrs"
    >
      <span>Thêm OKRs liên kết chéo</span>
    </el-button>
    <div class="okrs-align__action">
      <el-button
        class="el-button--white el-button--modal"
        @click="backToStepTwo"
        >Quay lại</el-button
      >
      <el-button
        class="el-button--purple el-button--modal"
        :loading="loading"
        @click="createOkrs(isCreate)"
      >
        {{ isCreate ? 'Tạo OKRs' : 'Cập nhật OKRs' }}
      </el-button>
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
    const alignmentObjectives = this.$store.state.okrs.objective
      .alignmentObjectives;
    if (!alignmentObjectives) {
      this.itemsAlignOkrs = [];
    } else {
      this.itemsAlignOkrs = alignmentObjectives.map((item) => {
        return {
          id: item.id,
        };
      });
    }
  },
})
export default class CreateAlignObjective extends Vue {
  @PropSync('active', Number) private syncActive!: number;

  private loading: boolean = false;
  private itemsAlignOkrs: any[] = [];

  private addNewAlignOkrs() {
    this.itemsAlignOkrs.push({ id: null });
  }

  private async createOkrs(isCreate: Boolean) {
    this.loading = true;
    const data = this.$store.state.okrs.objective;
    let alignObjectives: Number[] = [];
    if (this.itemsAlignOkrs.length !== 0) {
      alignObjectives = this.itemsAlignOkrs.map((item) => item.id);
    }
    this.$store.commit(MutationState.SET_OBJECTIVE, {
      alignmentObjectives: alignObjectives,
    });
    console.log('push', this.$store.state.okrs.objective)
    await OkrsRepository.createOrUpdateOkrs(
      this.$store.state.okrs.objective)
      .then((res) => {
      this.$store.dispatch(DispatchAction.CLOSE_DIALOG_OKRS);
      this.$store.commit(MutationState.OKRS_SET_FLAG);
      this.syncActive = 0;
      });
    this.loading = false;
  }

  private deleteAlignOkrs(indexForm: number) {
    this.itemsAlignOkrs.splice(indexForm, 1);
  }

  private backToStepTwo() {
    this.syncActive--;
  }
}
</script>

<style lang="scss" scoped>
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
    .el-select {
      width: 100%;
    }
  }
  &__button {
    margin-bottom: $unit-5;
    width: calc(100% - 28px);
  }
}
.okrs-align__action {
  display: flex;
  align-content: center;
  justify-content: flex-end;
  place-content: center flex-end;
  padding: 10px 1.25rem 0 1.25rem;
  border-top: 1px solid #dfe3e8;
}
.confirm-button {
  padding: 0 $unit-6 0 $unit-6;
  margin-bottom: $unit-8;
}
</style>
