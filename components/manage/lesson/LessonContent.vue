<template>
  <h1>{{ post }}</h1>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import LessonRepository from '@/repositories/LessonRepository';
@Component<LessonContent>({
  name: 'LessonContent',
})
export default class LessonContent extends Vue {
  @Prop(Object) readonly post;
}
</script>
