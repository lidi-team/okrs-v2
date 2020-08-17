<template>
  <div class="progress">
    <div class="progress__item">
      <el-row>
        <el-col :span="6" class="progress__header">OKR công ty:</el-col>
        <el-col :span="1">05/2020</el-col>
        <el-col :span="12">
          <el-progress :percentage="6" :color="customColors" :text-inside="true" :stroke-width="26" />
        </el-col>
        <el-col :span="1" class="progress__end-cycle">08/2020</el-col>
      </el-row>
    </div>
    <div class="progress__item">
      <el-row>
        <el-col :span="6" class="progress__header">OKR nhóm:</el-col>
        <el-col :span="1">05/2020</el-col>
        <el-col :span="12">
          <el-progress :percentage="15" :color="customColors" :text-inside="true" :stroke-width="26" />
        </el-col>
        <el-col :span="1" class="progress__end-cycle">08/2020</el-col>
      </el-row>
    </div>
    <div class="progress__item">
      <el-row>
        <el-col :span="6" class="progress__header">OKR cá nhân:</el-col>
        <el-col :span="1">05/2020</el-col>
        <el-col :span="12">
          <el-progress :percentage="30" :color="customColors" :text-inside="true" :stroke-width="26" />
        </el-col>
        <el-col :span="1" class="progress__end-cycle">08/2020</el-col>
      </el-row>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
@Component<ProgressBarComponent>({ name: 'ProgressBarComponent' })
export default class ProgressBarComponent extends Vue {
  private customColors(percentage: number) {
    if (percentage < 30) {
      return '#e3d0ff';
    } else if (percentage < 70) {
      return '#9c6ade';
    } else {
      return '#50248f';
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
.progress {
  padding: $unit-3 $unit-7;
  background: $white;
  border-radius: $unit-1;
  box-shadow: $box-shadow-default;
  &__item {
    padding: $unit-3 $unit-1;
    .el-progress-bar {
      &__outer {
        background-color: $purple-primary-1;
        border-radius: $border-radius-medium;
        .el-progress-bar__inner {
          border-radius: $border-radius-medium;
        }
      }
    }
  }
  &__header {
    font-weight: $font-weight-bold;
  }
  &__end-cycle {
    padding-left: $unit-2;
  }
}
</style>
