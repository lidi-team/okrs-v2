<template>
  <fragment>
    <base-navbar />
    <el-row type="flex" class="authenticated-screen">
      <el-col :span="3" class="authenticated-screen__sidebard">
        <base-sidebar />
      </el-col>
      <el-col :span="21" class="authenticated-screen__app">
        <nuxt />
      </el-col>
    </el-row>
  </fragment>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
@Component<Layout>({
  name: 'Layout',
  middleware: 'isAuthenticated',
})
export default class Layout extends Vue {}
</script>

<style lang="scss">
@import '@/assets/scss/main.scss';
.authenticated-screen {
  height: 93vh;
  &__app {
    background: $neutral-primary-0;
    min-height: calc(100vh - 60px);
  }
}
</style>
