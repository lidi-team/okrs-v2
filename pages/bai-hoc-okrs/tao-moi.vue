<template>
  <div>
    <common-editor-markdown :length="length" />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import LessonRepository from '@/repositories/LessonRepository';
// components
import CommonEditorMarkdown from '@/components/common/EditorMarkdown.vue';
@Component<CreateLesson>({
  name: 'CreateLesson',
  components: {
    CommonEditorMarkdown,
  },
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
