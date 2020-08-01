<template>
  <fragment>
    <div class="item-okrs">
      <div class="item-okrs__header">
        <p>{{ textHeader }}</p>
        <el-row>
          <el-col :span="12">Mục tiêu</el-col>
          <el-col :span="12">
            <el-row>
              <el-col :span="12">Kết quả then chốt</el-col>
              <el-col :span="12">Tiến độ</el-col>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-row>
              <el-col :span="12">Thay đổi</el-col>
              <el-col :span="12"></el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
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
.list-okrs {
  color: $neutral-primary-4;
}
</style>
