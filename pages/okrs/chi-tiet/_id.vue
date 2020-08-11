<template>
  <div class="okrs-detail">
    <el-page-header title="Okrs Dashboard" @back="goToOkrsDashboard" />
    <div class="okrs-detail--top-action">
      <span class="okrs-detail--top-action__title">Chi tiết mục tiêu</span>
      <div class="okrs-detail--top-action__button">
        <el-button class="el-button el-button--white el-button--medium" @click="deleteOkrs">Xóa</el-button>
        <el-button class="el-button el-button--purple el-button--medium" @click="updateOkrs">Cập nhật</el-button>
      </div>
    </div>
    <div class="okrs-detail__content">
      <div class="okrs-detail__content--overview">
        <span>{{ objective.title.toUpperCase() }}</span>
        <el-progress type="line" :percentage="objective.progress" :text-inside="true" :stroke-width="26" />
      </div>
      <div class="okrs-detail__content--align">
        <span class="created">Được tạo bởi</span>
        <span class="username">{{ objective.user.fullName }}</span>
        <span class="alignedWith">Liên kết tới</span>
        <nuxt-link :to="`/OKRs/chi-tiet/${objective.parentObjective.id}`" class="parentOkrs">{{ objective.parentObjective.title }}</nuxt-link>
        <span class="alignedBy">Được liên kết với</span>
        <div class="list-aligned-okrs">
          <p v-for="item in objective.alignmentObjectives" :key="item.id" class="alignedOkrs">
            <nuxt-link :to="`/OKRs/chi-tiet/${item.id}`">{{ item.title }}</nuxt-link>
          </p>
        </div>
      </div>
      <div class="okrs-detail__content--detail">
        <span class="content">Kết quả then chốt</span>
        <span class="target">Mục tiêu</span>
        <span class="start">Giá trị ban đầu</span>
        <span class="obtained">Giá trị đạt được</span>
        <span class="progress">Tiến độ</span>
        <span class="plan">Link kế hoạch</span>
        <span class="result">Link kết quả</span>
        <div v-for="kr in objective.keyResults" :key="kr.id" class="list-krs">
          <span class="kr-content">{{ kr.content }}</span>
          <span class="kr-target">{{ kr.targetValue }}</span>
          <span class="kr-start">{{ kr.startValue }}</span>
          <span class="kr-obtained">{{ kr.valueObtained }}</span>
          <span class="kr-progress">{{ kr.progress }}</span>
          <span class="kr-plan">{{ kr.linkPlans }}</span>
          <span class="kr-result">{{ kr.linkResults }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
@Component<OkrsDetailPage>({ name: 'OkrsDetailPage' })
export default class OkrsDetailPage extends Vue {
  private objective: Object = {
    title: 'TỔNG DOANH THU NĂM 2019 ĐẠT 10,000,000 USD',
    progress: 20,
    parentObjective: {
      id: 3,
      title: 'Lorem Ipsum OKRs lorem ipsum OKRs 3',
    },
    keyResults: [
      {
        id: 2,
        startValue: 0,
        valueObtained: 0,
        targetValue: 0,
        progress: 12,
        content: 'Tìm kiếm được 10 khách hàng đầu tiên',
        linkPlans: 'https://www.facebook.com/',
        linkResults: 'https://www.facebook.com/',
      },
      // {
      //   id: 1,
      //   startValue: 0,
      //   valueObtained: 0,
      //   targetValue: 0,
      //   progress: 12,
      //   content: 'Nắm được 70% kiến thức môn kiểm toán doanh nghiệp',
      //   linkPlans: 'https://www.facebook.com/',
      //   linkResults: 'https://www.facebook.com/',
      // },
    ],
    alignmentObjectives: [
      {
        id: 4,
        title: 'Lorem Ipsum OKRs lorem ipsum OKRs 4',
      },
      {
        id: 5,
        title: 'Lorem Ipsum OKRs lorem ipsum OKRs 5',
      },
    ],
    user: {
      id: 1,
      fullName: 'Trần Quang Nhật',
    },
  };

  private goToOkrsDashboard() {
    this.$router.push('/OKRs');
  }
}
</script>
<style lang="scss">
@import '@/assets/scss/main.scss';
.okrs-detail {
  padding: $unit-12 $unit-10 0 $unit-8;
  &--top-action {
    display: flex;
    place-content: center space-between;
    &__title {
      font-size: $unit-7;
    }
    &__button {
      font-size: $unit-4;
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
      .username {
        grid-area: username;
        color: $neutral-primary-2;
      }
      .alignedWith {
        grid-area: alignedWith;
      }
      .parentOkrs {
        grid-area: parentOkrs;
      }
      .alignedBy {
        grid-area: alignedBy;
      }
      .list-aligned-okrs {
        display: flex;
        flex-direction: column;
        .alignedOkrs {
          grid-area: alignedOkrs;
          a {
            color: $blue-primary-1;
          }
        }
      }
    }
    &--detail {
      @include box-okrs-detail;
      display: grid;
      margin-top: $unit-5;
      grid-template-rows: auto;
      grid-template-columns: 4fr 1fr 1fr 1fr 1fr 1fr 1fr;
      grid-template-areas:
        'content target start obtained progress plan result'
        'kr-content kr-target kr-start kr-obtained kr-progress kr-plan kr-result';
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
      .progress {
        grid-area: progress;
      }
      .plan {
        grid-area: plan;
      }
      .result {
        grid-area: result;
      }
      .list-krs {
        display: flex;
        flex-direction: column;
        color: $neutral-primary-2;
        .kr-content {
          grid-area: kr-content;
        }
        .kr-target {
          grid-area: kr-target;
        }
        .kr-start {
          grid-area: kr-start;
        }
        .kr-obtained {
          grid-area: kr-obtained;
        }
        .kr-progress {
          grid-area: kr-progress;
        }
        .kr-plan {
          grid-area: kr-plan;
        }
        .kr-result {
          grid-area: kr-result;
        }
      }
    }
  }
  .el-page-header__title {
    color: $neutral-primary-2;
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
