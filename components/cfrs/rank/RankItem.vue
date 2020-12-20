<template>
  <div class="rank-item">
    <div class="rank-item__left">
      <div :class="['rank-item__left__index', topRanking(index)]">
        <span>{{ index + 1 }}</span>
      </div>
      <el-avatar :size="40">
        <img
          :src="rankData.avatarUrl ? rankData.avatarUrl : rankData.gravatarURL"
          alt="avatar"
        />
      </el-avatar>
      <div class="rank-item__left__info">
        <p class="rank-item__left__info--fullname">
          {{ rankData.user_fullName }}
        </p>
        <p class="rank-item__left__info--department">
          phòng ban: {{ rankData.department }}
        </p>
      </div>
    </div>
    <div class="rank-item__right">
      {{ rankData.sum }}
      <icon-star-dashboard />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import IconStarDashboard from '@/assets/images/dashboard/star-dashboard.svg';

@Component<RankItem>({
  name: 'RankItem',
  components: {
    IconStarDashboard,
  },
})
export default class RankItem extends Vue {
  @Prop() readonly index!: number;
  @Prop() readonly rankData!: any;

  private topRanking(index: number): String {
    return index === 1
      ? 'top1'
      : index === 2
      ? 'top2'
      : index === 3
      ? 'top3'
      : 'topdown';
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/scss/main.scss';

.rank-item {
  display: flex;
  flex-direction: row;
  padding: $unit-2 0;
  @include box-shadow;
  justify-content: space-between;

  &__left {
    display: flex;
    flex-direction: row;
    place-content: center;

    &__index {
      color: $white;
      font-weight: $font-weight-bold;
      display: block;
      @include size($unit-10, $unit-10);
      border-radius: 50%;
      text-align: center;
      padding-top: 0.15rem;

      span {
        font-size: $unit-6;
      }
    }

    .el-avatar {
      align-self: center;
      margin: 0 $unit-2 0 $unit-6;
    }

    &__info {
      align-self: center;

      &--fullname {
        font-weight: $font-weight-medium;
      }

      &--department {
        color: $neutral-primary-2;
        font-size: $unit-3;
      }
    }

    .top1 {
      background-color: $yello-primary-1;
    }

    .top2 {
      background-color: $blue-primary-3;
    }

    .top3 {
      background-color: $orange-primary-1;
    }

    .topdown {
      background-color: $purple-primary-3;
    }
  }

  &__right {
    display: flex;
    flex-direction: row;
    align-items: center;
    font-weight: $font-weight-medium;
    font-size: $unit-5;
  }
}
</style>
