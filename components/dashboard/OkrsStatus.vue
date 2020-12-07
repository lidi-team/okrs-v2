<template>
  <div class="okrs-status">
    <div class="okrs-status__top">
      <span class="okrs-status__title">Tiến độ tuần này</span>
      <div class="okrs-status__right">
        <span class="okrs-status__title">Thay đổi</span>
        <div class="okrs-status__des">(so với tuần trước)</div>
      </div>
    </div>
    <div class="okrs-status__content">
      <div
        v-for="(item, index) in dataProgress"
        :key="item.name"
        class="okrs-status__item item"
      >
        <div class="item__left">
          <span
            :style="`border-color: ${customColors(index)}`"
            class="item__circle"
            >{{ item.value }}</span
          >
          <span class="item__okrs">{{ item.name }}</span>
        </div>
        <div class="item__right">
          <span
            class="item__change"
            :style="`color: ${customColorsChanging(item.changing)}`"
            >{{ item.changing }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
@Component<OkrsStatus>({
  name: 'OkrsStatus',
})
export default class OkrsStatus extends Vue {
  @Prop(Array) readonly dataProgress;

  private customColors(index: number) {
    if (index === 0) {
      return '#50B83C';
    } else if (index === 1) {
      return '#47C1BF';
    } else if (index === 2) {
      return '#EEC200';
    } else {
      return '#919EAB';
    }
  }

  private customColorsChanging(change: number) {
    if (change > 0) {
      return '#27ae60';
    } else {
      return '#eb5757';
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
.okrs-status {
  height: 100%;
  &__top {
    height: 4rem;
    @include breakpoint-down(desktop) {
      height: 20%;
    }
    padding: 0 $unit-4;
    border-bottom: 1px solid #dfe3e8;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  &__right {
    text-align: right;
  }
  &__title {
    font-size: $text-base;
    color: $neutral-primary-4;
    font-style: normal;
    font-weight: 600;
    line-height: $unit-6;
  }
  &__des {
    font-size: $text-sm;
    color: $neutral-primary-4;
    font-style: normal;
    font-weight: normal;
    line-height: $unit-5;
  }
  .item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: $unit-5;
    padding-left: $unit-3;
    padding-right: $unit-5;
    &__circle {
      border: 4px solid;
      background: $white;
      border-radius: 50%;
      -moz-border-radius: 50%;
      -webkit-border-radius: 50%;
      color: $neutral-primary-4;
      display: inline-block;
      font-size: $text-sm;
      font-style: normal;
      font-weight: normal;
      line-height: 50px;
      margin-right: 5px;
      text-align: center;
      width: 55px;
    }
    &__okrs {
      font-style: normal;
      font-weight: 600;
      font-size: $text-sm;
      line-height: $unit-5;
    }
    &__change {
      font-size: $text-sm;
      color: $neutral-primary-4;
      font-style: normal;
      font-weight: normal;
      line-height: $unit-5;
    }
  }
}
</style>
