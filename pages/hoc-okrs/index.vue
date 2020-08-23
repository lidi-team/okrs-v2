<template>
  <div class="learn-lessons">
    <h1 class="learn-lessons__title">Học OKRs</h1>
    <div class="learn-lessons__list">
      <lesson-list :posts="posts" :meta="meta" />
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import LessonRepository from '@/repositories/LessonRepository';
import { pageLimit } from '@/constants/app.constant';
@Component<LearnLesson>({
  name: 'LearnLesson',
  head() {
    return {
      title: 'Danh sách bài học OKRs',
    };
  },
  watchQuery: ['page'],
  async asyncData({ query }) {
    try {
      const params = {
        limit: pageLimit,
        page: query.page ? query.page : 1,
      };
      const response = await LessonRepository.get(params);
      return {
        posts: response.data.data.items,
        meta: response.data.data.meta,
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
  &__title {
    font-size: $text-2xl;
    padding-bottom: $unit-10;
  }
}
</style>
