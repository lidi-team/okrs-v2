<template>
  <div class="okrs-detail">
    <el-page-header title="Quay lại" @back="goBack" />
    <div class="okrs-detail--top-action">
      <span class="okrs-detail--top-action__title">Chi tiết mục tiêu</span>
    </div>
    <div class="okrs-detail__content">
      <div class="okrs-detail__content--overview">
        <span>{{ objective.title.toUpperCase() }}</span>
        <el-progress
          type="line"
          :percentage="objective.progress"
          :text-inside="true"
          :stroke-width="26"
        />
      </div>
      <div class="okrs-detail__content--align">
        <span class="created">Được tạo bởi:</span>
        <span class="username">{{ objective.user.name }}</span>
        <span v-if="objective.parentObjective" class="alignedWith"
          >OKR cấp trên:</span
        >
        <nuxt-link
          :to="objective.parentObjective
              ? `/OKRs/chi-tiet/${objective.parentObjective.id}`
              : '#'
          "
          class="parentOkrs"
        >
          {{
            objective.parentObjective ? objective.parentObjective.name : ''
          }}
        </nuxt-link>
        <span class="alignedBy">Được liên kết với:</span>
        <div
          v-if="objective.alignmentObjectives.length"
          class="list-aligned-okrs"
        >
          <p
            v-for="item in objective.alignmentObjectives"
            :key="item.id"
            class="alignedOkrs"
          >
            <nuxt-link :to="`/OKRs/chi-tiet/${item.id}`">{{ item.name }}</nuxt-link
            >
          </p>
        </div>
        <p v-else class="alignedOkrs">Không có</p>
      </div>
      <div class="okrs-detail__content--detail">
        <div class="okrs-detail__content--detail__header">
          <span class="content">Kết quả then chốt</span>
          <span class="target">Mục tiêu</span>
          <span class="start">Giá trị ban đầu</span>
          <span class="obtained">Giá trị đạt được</span>
          <span class="progress-title">Tiến độ</span>
          <span class="plan">Link kế hoạch</span>
          <span class="result">Link kết quả</span>
        </div>
        <template v-for="keyresult in objective.keyResults">
          <detail-okrs
            :key="`key-result-${keyresult.id}`"
            :key-result="keyresult"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import OkrsRepository from '@/repositories/OkrsRepository';
import DetailOkrs from '@/components/okrs/detail/DetailOkrs.vue';

@Component<OkrsDetailPage>({
  name: 'OkrsDetailPage',
  head() {
    return {
      title: 'Chi tiết OKRs',
    };
  },
  components: { DetailOkrs },
  async asyncData({ params }) {
    try {
      const { data } = await OkrsRepository.getDetailOkrsById(+params.id);
      console.log('data', data);
      return {
        objective: Object.freeze(data),
      };
    } catch (error) {
      console.log(error);
    }
  },
})
export default class OkrsDetailPage extends Vue {
  private goBack() {
    this.$router.go(-1)
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
.okrs-detail {
  padding: $unit-12 $unit-10 0 $unit-8;
  &--top-action {
    display: flex;
    place-content: center space-between;
    &__title {
      font-size: $unit-7;
    }
  }
  &__content {
    &--overview {
      display: flex;
      place-content: center flex-start;
      margin-top: $unit-7;
      @include box-okrs-detail;
    }
    &--align {
      @include box-okrs-detail;
      margin-top: $unit-5;
      display: grid;
      row-gap: $unit-5;
      grid-template-rows: auto;
      grid-template-columns: 1.5fr 3.5fr 1.5fr 3.5fr;
      grid-template-areas:
        'createdBy username alignedWith parentOkrs'
        'alignedBy alignedOkrs . .';
      .created {
        grid-area: createdBy;
      }
      .username,
      .parentOkrs,
      .alignedOkrs {
        color: $neutral-primary-2;
        font-size: 0.875rem;
      }
      .username {
        grid-area: username;
        color: $neutral-primary-2;
      }
      .alignedWith {
        grid-area: alignedWith;
      }
      .parentOkrs {
        @include truncate-oneline();
        color: $blue-primary-1;
        grid-area: parentOkrs;
      }
      .alignedBy {
        grid-area: alignedBy;
      }
      .list-aligned-okrs {
        display: flex;
        flex-direction: column;
        .alignedOkrs {
          @include truncate-oneline();
          grid-area: alignedOkrs;
          color: $blue-primary-1;
        }
      }
    }
    &--detail {
      @include box-okrs-detail;
      margin-top: $unit-5;
      &__header {
        display: grid;
        grid-template-rows: auto;
        padding-bottom: $unit-4;
        grid-template-columns: 4fr 1fr 1fr 1fr 1fr 1fr 1fr;
        grid-template-areas: 'content target start obtained progress-title plan result';
        .content {
          grid-area: content;
        }
        .target {
          grid-area: target;
        }
        .start {
          grid-area: start;
        }
        .obtained {
          grid-area: obtained;
        }
        .progress-title {
          grid-area: progress-title;
        }
        .plan {
          grid-area: plan;
        }
        .result {
          grid-area: result;
        }
        .content,
        .target,
        .start,
        .obtained,
        .progress-title,
        .plan,
        .result {
          border-bottom: 1px solid $neutral-primary-0;
          padding-bottom: $unit-3;
        }
      }
    }
  }

  .el-progress {
    width: 25vw;
    margin-left: auto;
    .el-progress-bar {
      &__outer {
        border-radius: $border-radius-medium;
        background-color: $purple-primary-1;
      }
      &__inner {
        border-radius: $border-radius-medium;
        background-color: $purple-primary-4;
      }
    }
  }
}
</style>
