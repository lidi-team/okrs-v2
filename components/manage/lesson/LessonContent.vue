<template>
  <div v-loading="loading" class="lesson-content">
    <h1 class="lesson-content__title">{{ post.title }}</h1>
    <div class="lesson-content__article md-contents markdown-body">
      <div v-html="$md.render(post.content)"></div>
    </div>
    <div class="lesson-content__paginate paginate">
      <div class="paginate__link paginate__link--left">
        <div class="paginate__title">Bài trước</div>
        <nuxt-link v-if="post.preLesson !== null" :to="`${post.preLesson.slug}`" class="paginate__slug">{{ post.preLesson.title }}</nuxt-link>
      </div>
      <div class="paginate__link paginate__link--right">
        <div class="paginate__title">Bài sau</div>
        <nuxt-link v-if="post.nextLesson !== null" :to="`${post.nextLesson.slug}`" class="paginate__slug">{{ post.nextLesson.title }}</nuxt-link>
      </div>
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
  max-width: 762px;
  width: 100%;
  min-width: 0;
  &__paginate {
    margin-top: $unit-4;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    @include breakpoint-down(phone) {
      flex-direction: column;
    }
  }
  .paginate {
    &__link {
      max-width: 350px;
      &--right {
        text-align: right;
        @include breakpoint-down(phone) {
          margin-top: $unit-4;
          text-align: left;
        }
      }
    }
    &__title {
      font-size: $unit-4;
      color: $black-light;
    }
    &__slug {
      font-size: $unit-6;
      color: $purple-primary-4;
      &:hover {
        color: $purple-primary-3;
      }
    }
  }
}
</style>
