<template>
  <div v-loading="loading" class="lesson-content">
    <el-page-header title="Bài Học OKRs" @back="goBack" />
    <h1 class="lesson-content__title">{{ post.title }}</h1>
    <div class="lesson-content__des">
      <div>
        <img
          alt="avatar-logo"
          class="lesson-content__avatar"
          src="https://avatars3.githubusercontent.com/u/23659823?s=460&u=cbb3ca39bc2e9969614339f47ff3743f688f1a11&v=4"
          width="48"
          height="48"
        />
      </div>
      <div class="lesson-content__author">
        <span class="lesson-content__name">Capi Creative</span>
        <div class="lesson-content__muted">
          <span style="color: #757575;">{{ new Date(post.createdAt) | dateFormat('DD/MM/YYYY') }}</span
          ><img
            src="https://ci5.googleusercontent.com/proxy/BWQxaNTf44teTKkE9ppQVJU1-ezz0siU-vkhe332KMMVV_AFWxcaYWMZT_Sk3HPOcIJ5FoB1GsbsW35FXrLA8KomJ2MAlcwUeZzQ67Fe4IH1aQS-wQ=s0-d-e1-ft#https://cdn-images-1.medium.com/proxy/1*dMba6LR4dsoQTHzQ5T7oaA.png"
            alt="Member only content"
            width="12"
            height="12"
            class="lesson-content__star"
          /><reading-time :content="post.content" />
        </div>
      </div>
    </div>
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
  private goBack() {
    this.$router.push('/hoc-okrs');
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
.lesson-content {
  background-color: $white;
  padding: $unit-4 $unit-6;
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: $unit-8 auto;
  max-width: 762px;
  width: 100%;
  min-width: 0;
  &__des {
    align-items: center;
    display: flex;
  }
  &__avatar {
    display: block;
    width: 48px;
    height: 48px;
    border-radius: 50%;
  }
  &__author {
    width: 100%;
    display: block;
    margin-left: 12px;
  }
  &__name {
    flex: 1;
    color: rgba(41, 41, 41, 1);
    font-weight: $font-weight-light;
    max-height: 20px;
    font-size: $text-base;
  }

  &__muted {
    font-size: $text-sm;
    color: #757575;
  }
  &__star {
    width: auto;
    display: inline-block;
    margin-left: 10px;
    margin-right: 10px;
  }
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
      font-style: normal;
      color: $black-light;
      font-weight: $font-family-base;
      line-height: 48px;
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
