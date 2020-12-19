<template>
  <div v-loading="loadingTab" class="feedback">
    <el-row :gutter="30">
      <el-col
        v-if="listWaitingFeedback.inferior"
        v-loading="loadingInferior"
        :md="12"
        :lg="12"
      >
        <div class="box-wrap">
          <div class="-border-header">
            <p class="-title-2">{{ displayHeader('inferior') }}</p>
          </div>
          <p
            v-if="!listWaitingFeedback.inferior.checkins.items.length"
            class="none-cfr"
          >
            Không có dữ liệu để phản hồi
          </p>
          <div
            v-for="item in listWaitingFeedback.inferior.checkins.items"
            v-else
            :key="item.id"
            class="cfr"
          >
            <div
              class="cfr__left"
              @click="
                viewDetailCheckin(item, listWaitingFeedback.inferior.type)
              "
            >
              <el-avatar :size="30">
                <img
                  :src="
                    item.objective.user.avatarUrl
                      ? item.objective.user.avatarUrl
                      : item.objective.user.gravatarUrl
                  "
                  alt="avatar"
                />
              </el-avatar>
              <div class="cfr__left__content">
                <p class="cfr__left__content--title">
                  {{ item.objective.title }}
                </p>
                <div class="-display-flex -justify-content-between">
                  <p class="cfr__left__content--description">
                    {{ item.objective.user.fullName }}
                  </p>
                  <p>
                    {{ new Date(item.checkinAt) | dateFormat('DD/MM/YYYY') }}
                  </p>
                </div>
              </div>
            </div>
            <div class="cfr__right">
              <el-button
                class="el-button el-button--purple el-button-medium"
                @click="
                  showDialogCreatingFeedback(
                    item,
                    listWaitingFeedback.inferior.type,
                    false,
                  )
                "
                >Tạo phản hồi
              </el-button>
            </div>
          </div>
          <common-pagination
            v-if="listWaitingFeedback.inferior.checkins.items.length"
            class="feedback__col__pagination"
            :total="totalItems"
            :page.sync="paramsContext.page"
            :limit.sync="paramsContext.limit"
            @pagination="handlePagination($event)"
          />
        </div>
      </el-col>
      <el-col v-if="listWaitingFeedback.superior" :md="12" :lg="12">
        <div class="box-wrap">
          <div class="-border-header">
            <p class="-title-2">{{ displayHeader('superior') }}</p>
          </div>
          <p
            v-if="!listWaitingFeedback.superior.checkins.items.length"
            class="none-cfr"
          >
            Không có dữ liệu để phản hồi
          </p>
          <div
            v-for="item in listWaitingFeedback.superior.checkins.items"
            v-else
            :key="item.id"
            class="cfr"
          >
            <div
              class="cfr__left"
              @click="
                viewDetailCheckin(item, listWaitingFeedback.superior.type)
              "
            >
              <el-avatar :size="30">
                <img
                  :src="
                    item.objective.user.avatarUrl
                      ? item.objective.user.avatarUrl
                      : item.objective.user.gravatarUrl
                  "
                  alt="avatar"
                />
              </el-avatar>
              <div class="cfr__left__content">
                <p class="cfr__left__content--title">
                  {{ item.objective.title }}
                </p>
                <div class="-display-flex -justify-content-between">
                  <p class="cfr__left__content--description">
                    {{ item.reviewer.fullName }}
                  </p>
                  <p>
                    {{ new Date(item.checkinAt) | dateFormat('DD/MM/YYYY') }}
                  </p>
                </div>
              </div>
            </div>
            <div class="cfr__right">
              <el-button
                class="el-button el-button--purple el-button-medium"
                @click="
                  showDialogCreatingFeedback(
                    item,
                    listWaitingFeedback.superior.type,
                    true,
                  )
                "
                >Tạo phản hồi
              </el-button>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <cfrs-create-feedback
      v-if="visibleCreateDialog"
      :visible-dialog.sync="visibleCreateDialog"
      :data-feedback="dataFeedback"
      :reload-data="reloadData"
    />
    <cfrs-detail-feedback
      v-if="visibleDetailDialog"
      :visible-dialog.sync="visibleDetailDialog"
      :detail-checkin-info="detailCheckinInfo"
      @openFeedbackDialog="openFeedbackDialog($event)"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import CfrsRepository from '@/repositories/CfrsRepository';
import { EvaluationCriteriaEnum } from '@/constants/app.enum';
import { ParamsQuery } from '@/constants/DTO/common';
import CommonPagination from '@/components/common/Pagination.vue';
import CfrsCreateFeedback from '@/components/cfrs/feedback/CreateFeedback.vue';
import CfrsDetailFeedback from '@/components/cfrs/feedback/DetailFeedback.vue';

@Component<Feedback>({
  name: 'Feedback',
  components: {
    CommonPagination,
    CfrsCreateFeedback,
    CfrsDetailFeedback,
  },
  async created() {
    await this.getlistWaitingFeedbacks();
  },
  beforeMount() {
    this.loadingTab = true;
    setTimeout(() => {
      this.loadingTab = false;
    }, 500);
  },
})
export default class Feedback extends Vue {
  private loadingTab: boolean = false;
  private loadingInferior: boolean = false;
  private detailCheckinInfo: any = null;
  private totalItems: number = 1;

  private paramsContext: ParamsQuery = {
    page: 1,
    limit: 10,
  };

  private listWaitingFeedback: any = {
    superior: {
      checkins: {
        items: [],
        meta: {},
      },
    },
    inferior: {
      checkins: {
        items: [],
        meta: {},
      },
    },
  };

  private dataFeedback: any = {
    checkinAt: null,
    objective: {
      title: '',
      user: {
        fullName: '',
      },
    },
  };

  private visibleCreateDialog: boolean = false;
  private visibleDetailDialog: boolean = false;

  @Watch('$route.query.page', { immediate: false })
  private async changeListWaitingFeedbacks(page: string) {
    this.loadingInferior = true;
    try {
      this.paramsContext.page = +page;
      const data = await CfrsRepository.getListWaitingFeedback(
        this.paramsContext,
      );
      this.listWaitingFeedback.inferior = Object.freeze(data.data.inferior);
      setTimeout(() => {
        this.loadingInferior = false;
      }, 300);
    } catch (error) {
      setTimeout(() => {
        this.loadingInferior = false;
      }, 300);
    }
  }

  private handlePagination(pagination: any) {
    this.$router.push(`?tab=feedback&page=${pagination.page}`);
  }

  private async reloadData() {
    this.loadingTab = true;
    await this.getlistWaitingFeedbacks();
    setTimeout(() => {
      this.loadingTab = false;
    }, 500);
  }

  private async getlistWaitingFeedbacks() {
    try {
      const data = await CfrsRepository.getListWaitingFeedback(
        this.paramsContext,
      );
      this.listWaitingFeedback.inferior = Object.freeze(data.data.inferior);
      this.listWaitingFeedback.superior = Object.freeze(data.data.superior);
      this.totalItems = Object.freeze(
        data.data.inferior.checkins.meta.totalItems,
      );
    } catch (error) {}
  }

  private showDialogCreatingFeedback(
    itemCheckin: any,
    type: EvaluationCriteriaEnum,
    isSuperior: boolean,
  ): void {
    this.dataFeedback = itemCheckin;
    this.dataFeedback.type = type;
    if (isSuperior) {
      this.dataFeedback.user = this.listWaitingFeedback.superior.user;
    }
    this.dataFeedback.isSuperior = isSuperior;
    this.visibleCreateDialog = true;
  }

  private openFeedbackDialog(detailCheckinInfo: any) {
    this.dataFeedback = detailCheckinInfo;
    setTimeout(() => {
      this.visibleCreateDialog = true;
    }, 300);
  }

  private viewDetailCheckin(
    itemCheckin: any,
    type: EvaluationCriteriaEnum,
  ): void {
    this.detailCheckinInfo = itemCheckin;
    this.detailCheckinInfo.type = type;
    this.visibleDetailDialog = true;
  }

  private displayHeader(type: string, superior?: any) {
    if (type === 'inferior') {
      // Feedback cho Team member
      if (
        this.$store.state.auth.user.roles.includes('ROLE_PM') &&
        !this.$store.state.auth.user.roles.includes('ROLE_ADMIN')
      ) {
        return 'Phản hồi cho cấp dưới';
      }
      // // Feedback cho Team Leader
      if (this.$store.state.auth.user.roles.includes('ROLE_ADMIN')) {
        return 'Phản hồi cho quản lý dự án';
      }
    } else {
      // Feedback cho Team Leader
      if (
        !this.$store.state.auth.user.roles.includes('ROLE_PM') &&
        !this.$store.state.auth.user.roles.includes('ROLE_ADMIN')
      ) {
        return 'Phản hồi cho quản lý dự án';
      }
      // Feedback cho Admin
      if (
        this.$store.state.auth.user.roles.includes('ROLE_PM') &&
        !this.$store.state.auth.user.roles.includes('ROLE_ADMIN')
      ) {
        return 'Phản hồi cho cấp trên';
      }
      // Feedback cho bạn -- admin
      if (this.$store.state.auth.user.roles.includes('ROLE_ADMIN')) {
        return 'Phản hồi cho tôi';
      }
    }
  }

  private notHaveSuperiorData(value: any): boolean {
    return !Object.keys(value).length || !value.checkins.length;
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/main.scss';

.feedback {
  color: $neutral-primary-4;
  @include drop-shadow;
  border-radius: $border-radius-base;

  &__col {
    background-color: $white;
    padding: $unit-4 0 0;
    border-radius: $border-radius-base;

    &__header {
      font-size: $text-2xl;
      padding: 0 0 $unit-4 $unit-4;
      @include box-shadow;
      border-radius: $border-radius-base $border-radius-base 0px 0px;
    }

    &__empty {
      text-align: center;
      padding: $unit-3;
    }

    &__pagination {
      padding: $unit-4 0;
      display: flex;
      place-content: center;
    }
  }
}

.none-cfr {
  text-align: center;
  padding: $unit-3 $unit-4 $unit-3 $unit-4;
  @include box-shadow;
}

.cfr {
  display: flex;
  flex-direction: row;
  padding: $unit-2 0;
  @include box-shadow;
  justify-content: space-between;

  &__left {
    display: flex;
    flex: 1;
    flex-direction: row;
    cursor: pointer;

    &__content {
      flex: 1;
      margin: 0 $unit-4;

      &--title {
        font-weight: bold;
        font-size: $unit-4;
        @include truncate-oneline;
      }

      &--description {
        font-size: 0.875rem;
        color: $neutral-primary-3;
        line-height: 23px;
        padding-right: 10px;
      }
    }

    .el-avatar {
      align-self: center;
    }
  }

  &__right {
    align-self: center;
  }
}
</style>
