<template>
  <fragment>
    <div class="item-okrs">
      <p class="item-okrs__header">{{ textHeader }}</p>
      <el-row class="item-okrs__sub-header">
        <el-col :xs="24" :sm="24" :md="8" :lg="8" class="item-okrs__sub-header--objective">Mục tiêu</el-col>
        <el-col :xs="24" :sm="24" :md="8" :lg="8">
          <el-row>
            <el-col :xs="24" :sm="24" :md="12" :lg="12">Kết quả then chốt</el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12">Tiến độ</el-col>
          </el-row>
        </el-col>
        <el-col :xs="24" :sm="24" :md="8" :lg="8">
          <el-row>
            <el-col :xs="24" :sm="24" :md="12" :lg="12">Thay đổi</el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12"></el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-table :data="tableData" class="item-okrs__content">
        <el-table-column type="expand">
          <template v-slot="{ row }">
            <el-col :xs="24" :sm="24" :md="8" :lg="8" class="">{{ row.title }}</el-col>
            <el-col :xs="24" :sm="24" :md="8" :lg="8">
              <el-row>
                <el-col :xs="24" :sm="24" :md="12" :lg="12">{{ row.keyResults.length }} kết quả</el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="12">{{ row.progress }}</el-col>
              </el-row>
            </el-col>
            <el-col :xs="24" :sm="24" :md="8" :lg="8">
              <el-row>
                <el-col :xs="24" :sm="24" :md="12" :lg="12">{{ (row.keyResults.valueObtained / row.keyResults.targetValue ) }}</el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="12">:::</el-col>
              </el-row>
            </el-col>
          </template>
        </el-table-column>
        <el-table-column label="Mục tiêu">
          <template v-slot="{ row }">
            <p>{{ row.title }}</p>
          </template>
        </el-table-column>
        <el-table-column label="Kết quả then chốt">
          <template v-slot="{ row }">
            <span>{{ row.keyResults.length }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Tiến độ">
          <template v-slot="{ row }">
            <span>{{ row.progress }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Thay đổi">
          <template v-slot="{ row }">
            <span>{{  (row.keyResults.valueObtained / row.keyResults.targetValue ) }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </fragment>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
@Component<OKRsItem>({
  name: 'OKRsItem',
  mounted() {
    console.log(this.tableData);
  },
})
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
