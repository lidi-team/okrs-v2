<template>
  <span>{{ readingTime }} phút đọc</span>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
@Component<ReadingTime>({
  name: 'ReadingTime',
})
export default class ReadingTime extends Vue {
  @Prop(String) readonly content!: String;

  private get readingTime() {
    let minutes = 0;
    const contentString = JSON.stringify(this.content);
    const words = contentString.split(' ').length;
    const wordsPerMinute = 200;
    minutes = Math.ceil(words / wordsPerMinute);
    return minutes;
  }
}
</script>
