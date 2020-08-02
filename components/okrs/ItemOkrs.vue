<template>
  <fragment>
    <div class="item-okrs">
      <p class="item-okrs__header">{{ textHeader }}</p>
      <el-row class="item-okrs__sub-header">
        <el-col :span="8" class="item-okrs__sub-header--objective">Mục tiêu</el-col>
        <el-col :span="8">
          <el-row>
            <el-col :span="12">Kết quả then chốt</el-col>
            <el-col :span="12">Tiến độ</el-col>
          </el-row>
        </el-col>
        <el-col :span="8">
          <el-row>
            <el-col :span="12">Thay đổi</el-col>
            <el-col :span="12"></el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-table :data="tableData" class="item-okrs__content">
        <el-table-column type="expand">
          <template v-slot="{ keyResults }">
            <p>Content: {{ keyResults.content }}</p>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </fragment>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
@Component<OKRsItem>({ name: 'OKRsItem' })
export default class OKRsItem extends Vue {
  @Prop(String) private textHeader!: string;
  @Prop(Array) public tableData!: Object[];
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
.item-okrs {
  background: $white;
  color: $neutral-primary-4;
  margin-top: $unit-5;
  // width: 80%;
  filter: drop-shadow(0px 0px 0px rgba(63, 63, 68, 0.05)), drop-shadow(0px 1px 3px rgba(63, 63, 68, 0.15));
  &__header {
    font-size: $text-2xl;
    padding: $unit-5 0 $unit-5 $unit-5;
    box-shadow: inset 0px -1px 0px #dfe3e8;
    border-radius: $border-radius-base $border-radius-base 0px 0px;
  }
  &__sub-header {
    padding-top: $unit-6;
    font-size: $text-base;
    &--objective {
      padding-left: $unit-10;
    }
  }
}
</style>
