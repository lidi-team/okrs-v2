<template>
  <div class="learn-lessons">
    <h1 class="learn-lessons__title">Học OKRs</h1>
    <div class="learn-lessons__content">
      <lesson-content :post="post" />
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import LessonRepository from '@/repositories/LessonRepository';
@Component<LearnLesson>({
  name: 'LearnLesson',
  watchQuery: ['baiviet'],
  async asyncData({ query }) {
    try {
      const response = await LessonRepository.getPost(String(query.baiviet));
      return {
        post: response.data.data,
      };
    } catch (error) {}
  },
})
export default class LearnLesson extends Vue {}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
.learn-lessons {
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
