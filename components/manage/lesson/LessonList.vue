<template>
  <div class="list-lesson">
    <div v-for="post in posts" :key="post.id" class="list-lesson__item item">
      <nuxt-link :to="`/hoc-okrs/${post.slug}`">
        <h1 class="item__title">{{ post.title }}</h1>
      </nuxt-link>
      <div class="item__textMuted">
        {{ new Date(post.createdAt) | dateFormat('DD/MM/YYYY') }} -
        <reading-time :content="post.content" />
      </div>
    </div>
    <base-pagination
      class="list-lesson__pagination"
      :total="meta.totalItems"
      :page.sync="paramsLesson.page"
      :limit.sync="paramsLesson.limit"
      @pagination="handlePagination"
    />
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { pageLimit } from '@/constants/app.constant';
@Component<LessonList>({
  name: 'LessonList',
})
export default class LessonList extends Vue {
  @Prop(Array) readonly posts!: Array<object>;
  @Prop(Object) readonly meta!: Object;
  private paramsLesson = {
    page: this.$route.query.page ? Number(this.$route.query.page) : 1,
    limit: pageLimit,
  };

  private handlePagination() {
    this.$router.push(`?page=${this.paramsLesson.page}`);
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
.list-lesson {
  &__pagination {
    margin-top: $unit-8;
    text-align: center;
  }
}

.item {
  border-bottom: 1px solid $neutral-primary-1;
  padding: $unit-2;
  &__title {
    font-size: $unit-6;
    font-weight: bold;
    color: $purple-primary-4;
    &:hover {
      color: $purple-primary-3;
    }
  }
  &__textMuted {
    color: $neutral-primary-1;
    font-size: $unit-4;
  }
}
</style>
