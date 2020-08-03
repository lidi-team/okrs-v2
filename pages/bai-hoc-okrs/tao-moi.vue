<template>
  <fragment>
    <base-editor-markdown />
  </fragment>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component<CreateLesson>({
  name: 'CreateLesson',
  middleware: 'employeesPage',
})
export default class CreateLesson extends Vue {}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
.manage-employee {
}
</style>
