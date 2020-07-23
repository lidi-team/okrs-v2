<template>
  <fragment>
    <base-navbar />
    <el-row type="flex" justify="space-between">
      <el-col :span="4">
        <base-sidebar />
      </el-col>
      <el-col :span="18">
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
<style lang="scss" scoped></style>
