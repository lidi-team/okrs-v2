<template>
  <fragment>
    <base-editor-markdown :length="length" />
  </fragment>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import LessonRepository from '@/repositories/LessonRepository';
@Component<CreateLesson>({
  name: 'CreateLesson',
  head() {
    return {
      title: 'Tạo mới bài học OKRs',
    };
  },
  middleware: 'employeesPage',
  async asyncData() {
    try {
      const res = await LessonRepository.getMetaData();
      return {
        length: res.data.data.length,
      };
    } catch (error) {}
  },
})
export default class CreateLesson extends Vue {}
</script>
