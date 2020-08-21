<template>
  <div class="okrs-status">
    <div class="okrs-status__top">
      <span>Tiến độ tuần này</span>
      <div>
        <span>Thay đổi</span>
        <div>(so với tuần trước)</div>
      </div>
    </div>
    <div class="okrs-status__content">
      <div v-for="item in dataProgress" :key="item.name" class="okrs-status__item item">
        <div class="item__left">
          <span class="item__circle">{{ item.value }}</span>
          <span class="item__okrs">{{ item.name }}</span>
        </div>
        <div class="item__right">
          <span class="item__change">{{ item.changing }}</span>
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
  @Prop(Boolean) readonly loadingAdmin!: boolean;
}
</script>
<style lang="scss">
@import '@/assets/scss/main.scss';
.okrs-status {
  background-color: $white;
  padding: $unit-8;
  border-radius: $unit-1;
  box-shadow: $box-shadow-default;
  &__top {
    padding: 0 0 $unit-2;
    border-bottom: 1px solid #dfe3e8;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: $unit-5;
    &__circle {
      border: 4px solid;
      background: $white;
      border-radius: 50%;
      -moz-border-radius: 50%;
      -webkit-border-radius: 50%;
      color: $neutral-primary-4;
      display: inline-block;
      font-weight: bold;
      line-height: 50px;
      margin-right: 5px;
      text-align: center;
      width: 55px;
    }
  }
}
</style>
