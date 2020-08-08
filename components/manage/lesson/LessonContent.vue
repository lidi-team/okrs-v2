<template>
  <div v-loading="loading" class="lesson-content">
    <h1 class="lesson-content__title">{{ post.title }}</h1>
    <div class="lesson-content__article md-contents markdown-body">
      <div v-html="$md.render(post.content)"></div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import LessonRepository from '@/repositories/LessonRepository';
@Component<LessonContent>({
  name: 'LessonContent',
})
export default class LessonContent extends Vue {
  @Prop(Object) readonly post;

  private loading: boolean = false;
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
.lesson-content {
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: $unit-8 auto;
  max-width: 680px;
  width: 100%;
  min-width: 0;
}
</style>
