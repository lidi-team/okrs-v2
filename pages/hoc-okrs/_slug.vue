<template>
  <lesson-content :post="post" :prev-route="prevRoute" />
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
  async asyncData({ params, redirect }) {
    try {
      const response = await LessonRepository.getPost(params.slug);
      return {
        post: response.data.data,
      };
    } catch (error) {
      if (error.response.status === 404) {
        return redirect('/404');
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.prevRoute = from;
    });
  },
})
export default class LessonDetail extends Vue {
  private prevRoute: any = null;
}
</script>
