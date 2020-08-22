<template>
  <lesson-content :post="post" />
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import LessonRepository from '@/repositories/LessonRepository';
@Component<LessonDetail>({
  name: 'LessonDetail',
  head() {
    return {
      title: 'Chi tiết bài học OKRs',
    };
  },
  watchQuery: ['page'],
  async asyncData({ params }) {
    try {
      const response = await LessonRepository.getPost(params.slug);
      return {
        post: response.data.data,
      };
    } catch (error) {}
  },
})
export default class LessonDetail extends Vue {}
</script>
