<template>
  <div class="manage-lessons">
    <h1 class="manage-lessons__title">Quản lý bài học OKRs</h1>
    <div class="manage-lessons__content">
      <table-lesson />
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
@Component<ListLesson>({
  name: 'ListLesson',
  head() {
    return {
      title: 'Quản lý bài học OKRs',
    };
  },
})
export default class ListLesson extends Vue {}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
.manage-lessons {
  height: 100%;
  padding: $unit-10 $unit-8 0 $unit-10;
  &__title {
    font-size: $text-2xl;
    padding-bottom: $unit-10;
  }
  &__content {
    background-color: $white;
    padding: $unit-8;
  }
}
</style>
