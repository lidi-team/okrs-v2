<template>
  <div class="cfr-status">
    <div class="cfr-status__top">
      <div>
        <span class="cfr-status__title">Tình trạng CFRs</span>
        <div class="cfr-status__des">(trong chu kì)</div>
      </div>
      <div class="cfr-status__right">
        <span class="cfr-status__title">Thay đổi</span>
        <div class="cfr-status__des">(so với tuần trước)</div>
      </div>
    </div>
    <div class="cfr-status__content">
      <div v-for="(item, index) in dataCfr" :key="item.name" class="cfr-status__item item">
        <div class="item__left">
          <span v-if="index === 0" style="background-color: #32c8ff; border-color: #32c8ff;" class="item__circle">F</span>
          <span v-else-if="index === 1" style="background-color: #ffc832; border-color: #ffc832;" class="item__circle">R</span>
          <span v-else style="background-color: #ff0064; border-color: #ff0064;" class="item__circle">U</span>
          <span class="item__cfr">{{ item.value }} {{ item.name }}</span>
        </div>
        <div class="item__right">
          <span class="item__change" :style="`color: ${customColors(item.changing)}`">{{ item.changing }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
@Component<CfrStatus>({
  name: 'CfrStatus',
})
export default class CfrStatus extends Vue {
  @Prop(Array) readonly dataCfr;
  @Prop(Boolean) readonly loadingAdmin!: boolean;
  private customColors(change: number) {
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
.cfr-status {
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
      border-radius: 50%;
      -moz-border-radius: 50%;
      -webkit-border-radius: 50%;
      color: $white;
      display: inline-block;
      font-size: $text-base;
      font-style: normal;
      font-weight: 600;
      line-height: 50px;
      margin-right: 5px;
      text-align: center;
      width: 55px;
    }
    &__cfr {
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
