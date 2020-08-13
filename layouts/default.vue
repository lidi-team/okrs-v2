<template>
  <fragment>
    <base-navbar />
    <el-row type="flex" class="authenticated-screen">
      <el-col :span="3" class="authenticated-screen__sidebar">
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
$bg-gray-common: #e5e5e5;
.authenticated-screen {
  height: 92vh;
  &__sidebar {
    // position: fixed;
    // left: 0;
    // top: 0;
    // height: 100vh;
    // overflow: hidden;
  }
  &__app {
    // overflow-y: scroll;
    background-color: $bg-gray-common;
    min-height: calc(100vh - 60px);
  }
}
</style>
