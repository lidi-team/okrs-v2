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
@Component<OkrsLayout>({
  name: 'OkrsLayout',
})
export default class OkrsLayout extends Vue {}
</script>
<style lang="scss" scoped>
.authenticated-screen {
  height: 93vh;
}
</style>
