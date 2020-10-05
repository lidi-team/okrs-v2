<template>
  <div class="list-lesson">
    <table class="list-lesson__table" width="600">
      <tbody>
        <tr>
          <td>
            <h1 class="list-lesson__title table">
              Bài Học OKRs
            </h1>
            <table v-for="post in posts" :key="post.id" class="table__wrap-content">
              <tbody>
                <tr class="table__tr">
                  <td class="table__td--left xs-block xs-fillWidth xs-paddingBottom12" width="150">
                    <nuxt-link :to="`/hoc-okrs/${post.slug}`">
                      <div
                        class="xs-fillWidth table__image"
                        :style="`
                          background-image: url(${post.thumbnail});
                        `"
                      ></div>
                    </nuxt-link>
                  </td>
                  <td class="table__td--right xs-paddingLeft0 xs-block xs-fillWidth">
                    <nuxt-link :to="`/hoc-okrs/${post.slug}`">
                      <h1 class="table__title digestPostTitle">
                        {{ post.title }}
                      </h1>
                    </nuxt-link>
                    <div class="table__des">
                      {{ post.abstract }}
                    </div>
                    <div class="xs-marginTop10 table__author">
                      <span style="color: #757575;">{{ new Date(post.createdAt) | dateFormat('DD/MM/YYYY') }}</span
                      ><img
                        src="https://cdn-images-1.medium.com/proxy/1*dMba6LR4dsoQTHzQ5T7oaA.png"
                        alt="Member only content"
                        width="12"
                        height="12"
                        class="table__star"
                      /><reading-time :content="post.content" />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
    <common-pagination
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

import CommonPagination from '@/components/common/Pagination.vue';
@Component<LessonList>({
  name: 'LessonList',
  components: {
    CommonPagination,
  },
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
  &__table {
    border-spacing: 0;
    color: rgba(0, 0, 0, 0.9);
    letter-spacing: 0em;
    line-height: 1.4;
    margin-top: 0;
    margin-right: auto;
    margin-bottom: 0;
    margin-left: auto;
    padding-left: 24px;
    padding-right: 24px;
    width: 100%;
    max-width: 992px;
  }
  &__title {
    border-bottom: 1px dashed #333333;
    text-align: center;
    text-decoration: none;
    padding-bottom: $unit-4;
  }
}

.table {
  &__wrap-content {
    min-width: 100%;
    width: 100%;
    margin-top: 24px;
    margin-bottom: 36px;
    border-spacing: 0;
  }
  &__tr {
    vertical-align: top;
  }
  &__td {
    &--left {
      width: 150px;
    }
    &--right {
      padding-left: 20px;
    }
  }
  &__image {
    background-position: 50% 50%;
    width: 150px;
    max-height: 150px;
    height: 150px;
    border: 1px solid #f2f2f2;
    background-color: #f8f8f8;
    background-size: cover;
    background-repeat: no-repeat;
  }
  &__title {
    font-size: $unit-5;
    @include truncate-multiline-new(2);
    font-weight: bold;
    color: $purple-primary-4;
    &:hover {
      color: $purple-primary-3;
    }
  }
  &__des {
    line-height: 1.33;
    @include truncate-multiline-new(2);
    font-size: 15px;
    margin-top: 4px;
  }
  &__author {
    display: flex;
    align-items: center;
    font-size: $text-base;
    color: #757575;
    margin-top: 8px;
  }
  &__star {
    width: auto;
    display: inline-block;
    margin-left: 10px;
    margin-right: 10px;
  }
}

@media screen and (max-width: 762px) {
  .digestPostTitle {
    font-size: 17px;
    line-height: 1.3;
  }

  .xs-block {
    display: block;
  }

  .xs-paddingLeft0 {
    padding-left: 0;
  }

  .xs-paddingBottom12 {
    padding-bottom: 12px;
  }

  .xs-marginTop10 {
    margin-top: 10px;
  }

  .xs-fillWidth {
    width: 100%;
  }
}
</style>
